import { Component } from '@angular/core';
import { GarantiasService } from './garantias.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { CalendarService } from 'src/app/services/calendar.service';
// import { Columns, Img, ITable, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Observable, from, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-garantias',
  templateUrl: './garantias.component.html',
  styleUrls: ['./garantias.component.scss']
})
export class GarantiasComponent {

  datosDB: any[] = [];
  garantia:any = {};

  submitted:boolean = false;
  garantia_dialog:boolean = false;
  entrada_a_garantia:boolean | undefined;
  tipo_garantia:string = '';

  rangeDates:any | undefined;


  constructor(private garantiasService: GarantiasService,
    protected user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService,
    private http: HttpClient
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
      this.getGarantias();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  garantiaModal(tipo_garantia:any){
    this.entrada_a_garantia = tipo_garantia;
    if(tipo_garantia){
      this.tipo_garantia = 'Ingresar'
    }else{
      this.tipo_garantia = 'Devolver';
    }

    this.submitted = false;
    this.garantia_dialog = true;
    this.garantia = {};
  }

  async getGarantias() {

    if(!this.rangeDates){
      const fechaActual = new Date();
      const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      this.rangeDates =  [fechaInicio,fechaFin]
     }

    if (!this.rangeDates || !this.rangeDates[1]) { return }

    let fecha1 = this.rangeDates[0].toISOString().split('T')[0];
    let fecha2 = this.rangeDates[1].toISOString().split('T')[0];
    console.log(this.rangeDates);
    console.log(fecha1);
    console.log(fecha2);

    let dataPost = {
      date_from: fecha1,
      date_to: fecha2
    }
    console.log(dataPost);

    const valid: any = await this.garantiasService.getGarantias(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
      if (valid.status == 200) {

        /*  this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); */
}
      else { this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

  async enviarGarantia() {


    this.submitted = true;

    if(!this.garantia.factura || !this.garantia.factura){return}

    let dataPost = {
      bill_number:this.garantia.factura,
      store_id:this.user.user.store_id,
      byUser:this.user.user.id,
      code:this.garantia.codigo_entrada
    }

    console.log(dataPost);
    

    const valid: any = await this.garantiasService.enviarGarantia(dataPost);
    console.log(valid);

    if (!valid.error) {
     
      if (valid.status == 201) {
        this.getGarantias();
        this.imprimirComprobante();
        this.garantia_dialog = true;
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async devolverGarantia() {

   
    this.submitted = true;

    if(!this.garantia.codigo_salida || !this.garantia.num_comprobante){return}

    let dataPost = {
      voucher_number:this.garantia.num_comprobante,
      store_id:this.user.user.store_id,
      byUser:this.user.user.id,
      code:this.garantia.codigo_salida
    }

    console.log(dataPost);
    

    const valid: any = await this.garantiasService.devolverGarantia(dataPost);
    console.log(valid);

    if (!valid.error) {
     
      if (valid.status == 201) {
        this.getGarantias();
        this.garantia_dialog = false;
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  // PDF

  getImageBase64(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap(blob => {
        return from(new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        }));
      })
    );
  }


  imagenBase64(){
    return new Promise(resolve => {
      this.getImageBase64('assets/images/tienda.png').subscribe({
        next: (answer: any) => {
          resolve(answer);
        },
        error: error => {
          resolve(error);
        }
      });
    });
  }

  async imprimirComprobante() {

    const image = await this.imagenBase64();

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const docDefinition:any = {
      pageSize: {
        width: 220,  // Aproximadamente 8.27 pulgadas, para A4 es 210mm
        height: 290   // Aproximadamente 11.69 pulgadas, para A4 es 297mm
      },
      content: [
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Comprobante de garantia:',
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.garantia.factura,
              fontSize: 10,
              alignment:'right',
              bold: true
            }
          ],
          margin: [0, 5, 0, 10],
          columnGap: 10
        },
        {
          image:image,  // Aquí va tu imagen en base64
          width: 25,
          height: 25,
          alignment:'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: this.user.user.store_name,
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 10],
          bold: true
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 190, y2: 0,  // Ajusta el ancho según el tamaño de la página o el diseño deseado
              lineWidth: 1
            }
          ]
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Fecha Entrega:',
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
              fontSize: 9,
            }
          ],
          margin: [0, 5, 0, 3],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Código:',
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.garantia.codigo_entrada.toUpperCase(),
              fontSize: 9,
            }
          ],
          margin: [0, 5, 0, 5],
          columnGap: 10
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 190, y2: 0,  // Ajusta el ancho según el tamaño de la página o el diseño deseado
              lineWidth: 1
            }
          ]
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Entregó:',
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.user.user.name,
              fontSize: 9,
            }
          ],
          margin: [0, 5, 0, 3],
          columnGap: 10
        },
        {
          text: "ENTREGAR ESTE COMPROBANTE AL MOMENTO DE RECLAMAR SU GARANTÍA.",
          fontSize: 9,
          alignment: 'center',
          margin: [0, 10, 0, 5],
          bold: true
        },
      ],
      pageMargins: [10, 15, 10, 5],

    }  

    this.garantia_dialog = false;
    pdfMake.createPdf(docDefinition).open();
  }





}

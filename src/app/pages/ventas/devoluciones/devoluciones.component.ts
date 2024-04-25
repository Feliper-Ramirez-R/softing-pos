import { Component } from '@angular/core';
import { DevolucionesService } from './devoluciones.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfMake from 'pdfmake/build/pdfmake';
import { CalendarService } from 'src/app/services/calendar.service';
import { HttpClient } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent {

  datosDB: any[] = [];
  devolucion: any = {};
  submitted: boolean = false;
  bono_dialog: boolean = false;
  rangeDates: any | undefined;

  constructor(private devolucionesService: DevolucionesService,
    protected user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService,
    private http: HttpClient
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
    this.getDevoluciones();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  bonoModal() {
    this.submitted = false;
    this.bono_dialog = true;
    this.devolucion = {};
  }


  async getDevoluciones() {

    if(!this.rangeDates){
      const fechaActual = new Date();
      const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      this.rangeDates =  [fechaInicio,fechaFin]
     }

    if (!this.rangeDates || !this.rangeDates[1]) { return }

    let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0];
    console.log(this.rangeDates);
    console.log(fecha1);
    console.log(fecha2);

    let dataPost = {
      date_from: fecha1,
      date_to: fecha2,
      store_id:this.user.user.store_id
    }
    console.log(dataPost);


    const valid: any = await this.devolucionesService.getDevoluciones(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
      if (valid.status == 200) {

        // this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }

  }


  async hacerDevolucion() {

    let fechaActual = new Date()
    let fecha2 = fechaActual.setMonth(fechaActual.getMonth() + 1)
    let fechaVencimiento = new Date(fecha2);

    this.submitted = true;

    if (!this.devolucion.bono || !this.devolucion.factura || !this.devolucion.codigo_entrada) { return }

    let dataPost = {
      bill_number: this.devolucion.factura,
      store_id: this.user.user.store_id,
      byUser: this.user.user.id,
      code: this.devolucion.codigo_entrada,
      amount: this.devolucion.cantidad,
      due_date: fechaVencimiento,
      type: this.devolucion.tipo_devolucion
    }

    console.log(dataPost);


    const valid: any = await this.devolucionesService.hacerDevolucion(dataPost);
    console.log(valid);

    if (!valid.error) {

      if (valid.status == 201) {
       await this.imprimirBono(valid.bonus_id);
        this.bono_dialog = false;
        this.getDevoluciones();
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }

  }


  /* pdf */

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

  async imprimirBono(bono:any) {

    let fechaActual = new Date()
    let fecha2 = fechaActual.setMonth(fechaActual.getMonth() + 1)
    let fechaVencimiento = new Date(fecha2).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" });

    const image = await this.imagenBase64();

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const docDefinition:any = {
      pageSize: {
        width: 220,  // Aproximadamente 8.27 pulgadas, para A4 es 210mm
        height: 300   // Aproximadamente 11.69 pulgadas, para A4 es 297mm
      },
      content: [

        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Bono: '+bono,
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text:'Fac: '+ this.devolucion.factura,
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
              fontSize: 10,
              bold: true
            }
          ],
          margin: [0, 5, 0, 10],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Fecha Vencimiento:',
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: fechaVencimiento,
              fontSize: 10,
              bold: true
            }
          ],
          margin: [0, 0, 0, 10],
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
          text:this.formatearMoneda("es-CO", "COP", 0, this.devolucion.bono),
          fontSize: 20,
          alignment: 'center',
          margin: [0, 10, 0, 10],
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
              text: 'Entregó:',
              fontSize: 10,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.user.user.name,
              fontSize: 10,
              bold: true
            }
          ],
          margin: [0, 10, 0, 10],
          columnGap: 10
        },
        {
          text:"NO SE ACEPTAN RECLAMOS O ENTREGAS DESPUÉS DE LA FECHA DE VENCIMIENTO, NI SIN ESTE DOCUMENTO.",
          fontSize: 10,
          alignment: 'center',
          margin: [0, 10, 0, 5],
          bold: true
        },

      ],
      pageMargins: [10, 15, 10, 5],

      
    }

    this.bono_dialog = false;
    pdfMake.createPdf(docDefinition).open();

  }

  formatearMoneda(locales: any, currency: any, fractionDigits: any, number: any) {
    var formatted = new Intl.NumberFormat(locales, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
  }

}

import { Component } from '@angular/core';
import { GarantiasService } from './garantias.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { CalendarService } from 'src/app/services/calendar.service';
import { Columns, Img, ITable, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

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
    private calendarService: CalendarService
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

  async imprimirComprobante() {

    PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();

    pdf.add(
      new Columns(["Comprobante: " + this.garantia.factura])
        .margin([0, 3, 0, 3])
        .fontSize(8)
        .end
    );

    pdf.add(pdf.ln(1));

    pdf.add(await new Img('assets/images/logoAE.jpeg').fit([100, 100]).alignment("center").build());

    pdf.pageMargins([10, 15, 10, 5]);
    pdf.pageSize({
      width: 220,
      height: 270,
    });

    pdf.add(pdf.ln(1));

   
    pdf.add(
      new Columns(["Fecha Entrega:", new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );


    pdf.add(
      new Columns(["Código:", this.garantia.codigo_entrada])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );

    pdf.add(pdf.ln(1));

    pdf.add({
      canvas: [{ type: 'line', x1: 10, y1: 0, x2: 190, y2: 0, lineWidth: 1 }]
    });


    pdf.add(pdf.ln(1));

    pdf.add(
      new Columns(["Entregó:", this.user.user.name])
        .margin([0, 3, 0, 3])
        .fontSize(8)
        .end
    );

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["ENTREGAR ESTE COMPROBANTE AL MOMENTO DE RECLAMAR SU GARANTÍA."]).alignment("left").fontSize(8).end
    );
    this.garantia_dialog = false;
    pdf.create().open();

  }





}

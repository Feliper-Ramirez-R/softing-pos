import { Component } from '@angular/core';
import { DevolucionesService } from './devoluciones.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
// import { Columns, Img, ITable, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CalendarService } from 'src/app/services/calendar.service';

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
    private calendarService: CalendarService
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

  async imprimirBono(bono:any) {

   /*  PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();


    pdf.add(
      new Columns(["Bono: " + bono, "Fac: " + this.devolucion.factura])
        .margin([0, 3, 0, 3])
        .fontSize(10)
        .end
    );

    pdf.add(pdf.ln(1));

    pdf.add(await new Img('assets/images/tienda.png').fit([25, 25]).alignment("center").build());

    pdf.add(
     new Txt(this.user.user.store_name)
       .alignment("center")
       .fontSize(10).end
   );

   pdf.add(pdf.ln(1));

    pdf.pageMargins([10, 15, 10, 5]);
    pdf.pageSize({
      width: 220,
      height: 300,
    });

    pdf.add(pdf.ln(1));

    let fechaActual = new Date()
    let fecha2 = fechaActual.setMonth(fechaActual.getMonth() + 1)
    let fechaVencimiento = new Date(fecha2).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" });


    pdf.add(
      new Columns(["Fecha Entrega:", new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );


    pdf.add(
      new Columns(["Fecha Vencimiento:", fechaVencimiento])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );

    pdf.add(pdf.ln(1));

    pdf.add({
      canvas: [{ type: 'line', x1: 10, y1: 0, x2: 190, y2: 0, lineWidth: 1 }]
    });


    pdf.add(
      new Columns([this.formatearMoneda("es-CO", "COP", 0, this.devolucion.bono)])
        .fontSize(20)
        .alignment("center")
        .margin([0, 3, 0, 3])
        .end
    );


    pdf.add({
      canvas: [{ type: 'line', x1: 10, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
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
      new Txt(["NO SE ACEPTAN RECLAMOS O ENTREGAS DESPUÉS DE LA FECHA DE VENCIMIENTO, O SIN ESTE DOCUMENTO."]).alignment("left").fontSize(8).end
    );
    this.bono_dialog = false;
    pdf.create().open(); */

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

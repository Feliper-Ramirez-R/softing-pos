import { Component } from '@angular/core';
import { HistoricoVentasService } from './historico-ventas.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

import { Columns, Img, ITable, PdfMakeWrapper, QR, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-historico-ventas',
  templateUrl: './historico-ventas.component.html',
  styleUrls: ['./historico-ventas.component.scss']
})
export class HistoricoVentasComponent {


  rangeDates: any | undefined;
  num_fac: string = '';

  datosDB: any[] = [];
  item: any = {};

  ver_factura_dialog: boolean = false

  constructor(private historicoService: HistoricoVentasService,
    private user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  verFacturaModal(item: any) {
    this.item = item;
    this.ver_factura_dialog = true;
  }


  async getHistoricoFecha() {

    this.num_fac = '';

    let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0];

    let dataPost = {
      date_from: fecha1,
      date_to: fecha2,
      bill_number: ''
    }

    console.log(dataPost);


    const valid: any = await this.historicoService.getHistorico(dataPost);
    console.log(valid);

    if (!valid.error) {

      this.datosDB = valid.data

      if (valid.status == 200) {

        await valid.data.forEach((a: any) => {
          a.fecha = new Date(a.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
          a.hora = new Date(a.created_at).toLocaleTimeString()
        })

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async getHistoricoFactura() {

    this.rangeDates = undefined;

    let dataPost = {
      date_from: '',
      date_to: '',
      bill_number: this.num_fac
    }

    console.log(dataPost);


    const valid: any = await this.historicoService.getHistorico(dataPost);
    console.log(valid);

    if (!valid.error) {

      this.datosDB = valid.data

      if (valid.status == 200) {

        await valid.data.forEach((a: any) => {
          a.fecha = new Date(a.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
          a.hora = new Date(a.created_at).toLocaleTimeString()
        })

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }





  async pdf() {


    PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();

    /*  pdf.add(
       new Table([
         [
           await new Img('assets/images/logo.png').width(90).height(90).build(),
         ],
       ]).alignment("center").end
     ); */

    pdf.add(
      [new QR(`Esa mierda deberia ir con este codigo QR y si si que putas de informacion le vamos a meter a este perro`).fit(100).alignment("center").end]
    );

    pdf.pageMargins([15, 5, 5, 5]);
    pdf.pageSize({
      width: 220,
      height: 550,
    });

    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt(["A Y E IMPORTACIONES"]).alignment("center").fontSize(8).end
    );
    pdf.add(
      new Txt(["Nit: ", "900435377-3"]).alignment("center").fontSize(8).end
    );
    pdf.add(
      new Txt(["Tel: ", "3115628545"]).alignment("center").fontSize(8).end
    );
    pdf.add(
      new Txt(["Fecha elaboración: ", this.item.fecha])
        .alignment("center")
        .fontSize(8).end
    );
    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt("Factura venta N°: " + this.item.id.toString().padStart(4, '0'))
        .alignment("center")
        .fontSize(10).end
    );

    pdf.add(pdf.ln(2));

    pdf.add(this.generarTabla());

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["Total a pagar: ", this.formatearMoneda("es-CO", "COP", 0, this.item.total)]).alignment("right").fontSize(8).margin([0, 5, 20, 5]).end
    );
    pdf.add(
      new Txt(["Forma de pago: ", this.item.type]).alignment("right").fontSize(8).margin([0, 0, 20, 5]).end
    );

    pdf.add(pdf.ln(1));
    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
    });

    pdf.add(
      new Txt(["Efectivo: ", this.formatearMoneda("es-CO", "COP", 0, this.item.cash)]).alignment("right").fontSize(8).margin([0, 5, 20, 5]).end
    );
    pdf.add(
      new Txt(["Cambio: ", this.formatearMoneda("es-CO", "COP", 0, this.item.change)]).alignment("right").fontSize(8).margin([0, 0, 20, 5]).end
    );

    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
    });

    pdf.add(pdf.ln(1));

    pdf.add(
      new Columns(["Cliente: ", this.item.customer_name])
        .fontSize(8)
        .end
    );
    pdf.add(
      new Columns(["Cédula: ", this.item.customer_dni])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );
    pdf.add(
      new Columns(["Teléfono: ", this.item.customer_phone])
        .fontSize(8)
        .end
    );

    pdf.add(
      new Columns(["Items:", this.datosDB.length])
        .fontSize(8)
        .end
    );
    pdf.add(
      new Columns(["Fecha Facturación:", new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );
    pdf.add(
      new Columns(["Hora Facturación:", this.item.hora])
        .fontSize(8)
        .end
    );

    pdf.add(
      new Columns(["Facturó:", this.item.byUser_name])
        .margin([0, 3, 0, 3])
        .fontSize(8)
        .end
    );


    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["NO SE ACEPTAN RECLAMOS DESPUÉS DE 30 DIAS DE HABER REALIZADO SU COMPRA. SIN ESTA FACTURA NO SE ACEPTAN CAMBIOS NI GARANTÍAS GRACIAS."]).alignment("left").fontSize(8).end
    );

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["Softing-post creado por Softing-dev"]).alignment("left").fontSize(8).margin([0, 0, 0, 5]).end
    );
    pdf.add(pdf.ln(1));
    pdf.add(await new Img('assets/images/logo.png').fit([30, 30]).alignment("center").build());


    this.ver_factura_dialog = false;
    pdf.create().open();

  }

  generarTabla(): ITable {
    [{}]
    return new Table([
      ['Código', ' Descripción ', 'Cant', 'valor'],

      ...this.extraerData(this.item.details)

    ]).alignment('center')
      .headerRows(1) // Indica que solo la primera fila es el encabezado
      .layout({
        hLineWidth: (i, node) => (i === 1 || i === node.table.body.length) ? 1 : 0,
        vLineWidth: (i) => 0,
        hLineColor: (i) => i === 1 ? 'black' : 'white', // Color de la línea del encabezado
      })
      .alignment('left')
      .widths([40, 50, 20, 40])
      .heights(rowIndex => { return rowIndex === 0 ? 15 : 10 })

      .fontSize(8)
      .end
  }





  extraerData(data: any) {
    return data.map((row: any) => [row.code, row.product_name.substring(0, 13), 1, this.formatearMoneda("es-CO", "COP", 0, row.subtotal)]);
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

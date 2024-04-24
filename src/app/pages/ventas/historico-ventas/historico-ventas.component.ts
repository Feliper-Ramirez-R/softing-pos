import { Component } from '@angular/core';
import { HistoricoVentasService } from './historico-ventas.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

// import { Columns, Img, ITable, PdfMakeWrapper, QR, Table, Txt } from 'pdfmake-wrapper';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CalendarService } from 'src/app/services/calendar.service';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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
    protected user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService,
    private http: HttpClient
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

  limpiar(){
    this.datosDB = [];
  }


  async getHistoricoFecha() {

    if (!this.rangeDates || !this.rangeDates[1]) { return }

    this.num_fac = '';

    let fecha1 =this.rangeDates[0].toISOString().split('T')[0];
    let fecha2 =this.rangeDates[1].toISOString().split('T')[0];

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

       /*  await valid.data.forEach((a: any) => {
          a.fecha = new Date(a.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
          a.hora = new Date(a.created_at).toLocaleTimeString()
        }) */

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

        /* await valid.data.forEach((a: any) => {
          a.fecha = new Date(a.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
          a.hora = new Date(a.created_at).toLocaleTimeString()
        }) */

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


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


   async pdf() {
  
    const image = await this.imagenBase64();
    
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const docDefinition:any = {
      pageSize: {
        width: 220,  // Aproximadamente 8.27 pulgadas, para A4 es 210mm
        height: 650   // Aproximadamente 11.69 pulgadas, para A4 es 297mm
      },
      content: [
        {
          image:image,  // Aquí va tu imagen en base64
          width: 25,
          height: 25,
          alignment:'center',
          margin: [0, 0, 0, 10]
        },

        {
          text: this.user.user.store_name,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 0, 0, 10],
          bold: true
        },
        {
          text: '(COPIA)',
          fontSize: 8,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: "AE IMPORTACIONES",
          fontSize: 8,
          alignment: 'center',
          // margin: [0, 0, 0, 10],
        },
        {
          text: "No responsable de IVA",
          fontSize: 8,
          alignment: 'center',
          // margin: [0, 0, 0, 10],
        },
        {
          text: "Fecha elaboración: "+ new Date(this.item.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
          fontSize: 8,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: "Recibo N°: " + this.item.id.toString().padStart(4, '0'),
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        {
          table: {
            headerRows: 1,
            widths: [40, 50, 20, 40],
            body: [
              [{ text: 'Código', style: 'header' }, { text: 'Descripción', style: 'header' }, { text: 'Cant', style: 'header' }, { text: 'Valor', style: 'header' }],
               ...this.extraerData(this.item.details)
            ]
            
          },
          layout: {
            hLineWidth: function (i:any, node:any) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i:any, node:any) {
              return 0;
            },
            hLineColor: function (i:any) {
              return i === 1 ? 'black' : '#FFFFFF';
            }
          }
        },
        {
          text: "Total a pagar: "+ this.formatearMoneda("es-CO", "COP", 0, this.item.total),
          fontSize: 8,
          alignment: 'right',
          margin: [0, 20, 0, 6],
        },
        {
          text: "Forma de pago: "+ this.item.type,
          fontSize: 8,
          alignment: 'right',
          margin: [0, 0, 0, 10],
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
          text: "Efectivo: "+ this.formatearMoneda("es-CO", "COP", 0, this.item.cash),
          fontSize: 8,
          alignment: 'right',
          margin: [0, 10, 0, 5],
        },
        {
          text: "Cambio: "+ this.formatearMoneda("es-CO", "COP", 0, this.item.change),
          fontSize: 8,
          alignment: 'right',
          margin: [0, 0, 0, 10]
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
              text: 'Cliente:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.item.customer_name,
              fontSize: 8,
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
              text: 'Cédula:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.item.customer_dni ? this.item.customer_dni : '' ,
              fontSize: 8,
            }
          ],
          margin: [0, 0, 0, 3],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Teléfono:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.item.customer_phone ? this.item.customer_phone : '',
              fontSize: 8,
            }
          ],
          margin: [0, 0, 0, 3],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Items:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.item.details.length,
              fontSize: 8,
            }
          ],
          margin: [0, 0, 0, 3],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Fecha reimpresión:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
              fontSize: 8,
            }
          ],
          margin: [0, 0, 0, 3],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Hora:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text:new Date(this.item.created_at).toLocaleTimeString(),
              fontSize: 8,
            }
          ],
          margin: [0, 0, 0, 3],
          columnGap: 10
        },
        {
          columns: [
            {
              // Columna izquierda
              width: 'auto',
              text: 'Vendedor:',
              fontSize: 9,
              bold: true
            },
            {
              // Columna derecha
              width: '*',
              text: this.item.byUser_name,
              fontSize: 8,
            }
          ],
          columnGap: 10
        },
        {
          text: "NO SE ACEPTAN RECLAMOS DESPUÉS DE 30 DIAS DE HABER REALIZADO SU COMPRA. SIN ESTE RECIBO NO SE ACEPTAN CAMBIOS NI GARANTÍAS GRACIAS.",
          fontSize: 9,
          margin: [0, 20, 0, 20],
          alignment: 'center',
          bold: true
        },
        {
          text: "Softing-post creado por Softing-dev.",
          fontSize: 8,
          margin: [0, 0, 0, 20],
          alignment: 'center'
        },
        {
          text: "No estoy obligado a facturar Art 1.6.1.4.3 del decreto 1625 del 2016.",
          fontSize: 8,
          margin: [0, 0, 0, 0],
          alignment: 'center'
        },
        
      ],
      pageMargins: [15, 15, 15, 0],
      styles: {
        header: {
          fontSize: 9,
          bold: true
        },
        body: {
          fontSize: 8
        },
      },
      defaultStyle: {
        alignment: 'left'
      },
    };

    // Para descargar el PDF generado
    pdfMake.createPdf(docDefinition).open();
  }

/*   async pdf() {


    PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();

    pdf.add(await new Img('assets/images/tienda.png').fit([25, 25]).alignment("center").build());

    pdf.add(
     new Txt(this.user.user.store_name)
       .alignment("center")
       .fontSize(10).end
   );

    pdf.pageMargins([15, 20, 5, 5]);
    pdf.pageSize({
      width: 220,
      height: 550,
    });

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt('(COPIA)')
        .alignment("center")
        .fontSize(8).end
    );

    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt(["AE IMPORTACIONES"]).alignment("center").fontSize(8).end
    );
  
    pdf.add(
      new Txt(["No responsable de IVA"]).alignment("center").fontSize(8).end
    );
    pdf.add(
      new Txt(["Fecha elaboración: ", this.item.fecha])
        .alignment("center")
        .fontSize(8).end
    );
    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt("Recibo N°: " + this.item.id.toString().padStart(4, '0'))
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
      new Columns(["Fecha:", new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );
    pdf.add(
      new Columns(["Hora:", this.item.hora])
        .fontSize(8)
        .end
    );

    pdf.add(
      new Columns(["Vendedor:", this.item.byUser_name])
        .margin([0, 3, 0, 3])
        .fontSize(8)
        .end
    );


    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["NO SE ACEPTAN RECLAMOS DESPUÉS DE 30 DIAS DE HABER REALIZADO SU COMPRA. SIN ESTE RECIBO NO SE ACEPTAN CAMBIOS NI GARANTÍAS GRACIAS."]).alignment("left").fontSize(8).end
    );

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["Softing-post creado por Softing-dev"]).alignment("left").fontSize(8).margin([0, 0, 0, 5]).end
    );

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt('No estoy obligado a facturar Art 1.6.1.4.3 del decreto 1625 del 2016.')
        .alignment("center")
        .fontSize(8).end
    );
   

    this.ver_factura_dialog = false;
    pdf.create().open();

  } */

 /*  generarTabla(): ITable {
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
  } */


  extraerData(data: any) {
    return data.map((row: any) => [ 
      { text: row.code, style: 'body' },
      { text: row.product_name.substring(0, 13), style: 'body' },
      { text: 1, style: 'body' },
      { text: this.formatearMoneda("es-CO", "COP", 0, row.subtotal), style: 'body' },
      ])
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

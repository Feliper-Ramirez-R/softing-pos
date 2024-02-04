import { Component } from '@angular/core';
import { VentasService } from './ventas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Columns, Img, ITable, PdfMakeWrapper, QR, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {

  fecha = new Date().toLocaleString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
  hora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hourCycle: 'h11' })

  datosDB: any[] = [];
  item: any = {};

  metodos_pago: any[] = [{ id: 1, name: 'Efectivo' }, { id: 2, name: 'Transferencia' },{ id: 3, name: 'Crédito' },{ id: 4, name: 'Saldo a favor' }];
  metodo_pago: any = {};

  empresas_credito: any[] = [{ id: 1, name: 'Sistecredito' }, { id: 2, name: 'Total crédito' }];

  stateOptions: any[] = [{ label: 'No', value: 'off' }, { label: 'Si', value: 'on' }];
  value_impri_fac: string | undefined;

  infoQR: string = '';

  // producto_actual: any = {};

  total: any = 0;
  facNumero: number | undefined
  contadorId: number = 1;
  facturarDialog: boolean = false;
  submitted: boolean = false;
  efectivo: any | undefined
  cambio: any | undefined

  constructor(private ventasService: VentasService,
    private user: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private calendarService: CalendarService
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
  }

  openFacturar() {
    this.metodo_pago = {};
    this.efectivo = undefined;
    this.cambio = undefined;
    this.value_impri_fac = undefined;
    this.facturarDialog = true;
    this.submitted = false;
  }

  operacionDevuelta() {
    this.efectivo ? this.cambio = this.efectivo - this.total : '';
  }


  editar(producto: any) {
    producto.descuento = true;
  }

  async editar2(producto: any) {
    if (producto.price < producto.price_min) {
      this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Precio de venta no permitido!', life: 5000 });
      return
    }
    producto.descuento = false;
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.price, 0);
  }

  confirm(event: Event, producto: any) {

    this.confirmationService.confirm({
      target: event.target!,
      message: 'Desea eliminar este item?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'si',

      accept: () => {
        this.eliminar(producto);
      },
      reject: () => {

      }
    });
  }

  async eliminar(producto: any) {
    this.datosDB = this.datosDB.filter((val: any) => val.prod !== producto.prod);
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.price, 0);
  }

  async leerProducto() {

    let dataPost = {
      code: this.item.codigo,
    }

    console.log(dataPost);


    const valid: any = await this.ventasService.leerProducto(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.contadorId++;
      if (valid.status == 200) {
        this.facNumero = valid.billNubmer + 1;
        let producto = this.datosDB.filter(val => val.code == this.item.codigo);
        console.log(producto);

        if (producto.length >= valid.data[0].stock) {
          this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'El item ' + this.item.codigo + ' no cuenta con inventario!', life: 5000 });
          return
        }
        valid.data[0].prod = this.contadorId;
        this.datosDB.push(valid.data[0]);
        this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.price, 0);
        // this.producto_actual = valid.data[0];
        this.item = {};

        await valid.data.forEach((elem: any) => {
          elem.descuento = false
        });
        console.log(this.datosDB);

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async enviarFactura() {


    this.submitted = true;

    if (!this.metodo_pago.id || !this.value_impri_fac || this.metodo_pago.name == 'Crédito' && !this.item.empresa_credito ) { return }

    let dataPost = {
      total: this.total,
      store_id: this.datosDB[0].store_id,
      byUser: this.user.user.id,
      list: this.datosDB,
      payment_way: this.metodo_pago.id,
      customer_name: this.item.nombre_cliente,
      customer_dni: String(this.item.cedula_cliente),
      customer_phone: String(this.item.telefono_cliente),
      change: this.cambio,
      cash: this.efectivo
    }

    console.log(dataPost);


    const valid: any = await this.ventasService.enviarFactura(dataPost);
    console.log(valid);

    if (!valid.error) {
      if (this.value_impri_fac == 'on') { await this.pdf() }
      if (valid.status == 201) {
        this.datosDB = [];
        this.facturarDialog = false;
        this.messageService.add({ severity: 'success', summary: 'success!', detail: valid.message, life: 5000 });
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

     pdf.add(await new Img('assets/images/logoAE.jpeg').fit([100, 100]).alignment("center").build());

    pdf.pageMargins([15, 20, 5, 5]);
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
      new Txt(["Fecha elaboración: ", this.fecha])
        .alignment("center")
        .fontSize(8).end
    );
    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt("Factura venta N°: " + this.facNumero?.toString().padStart(4, '0'))
        .alignment("center")
        .fontSize(10).end
    );

    pdf.add(pdf.ln(2));

    pdf.add(this.generarTabla());

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["Total a pagar: ", this.formatearMoneda("es-CO", "COP", 0, this.total)]).alignment("right").fontSize(8).margin([0, 5, 20, 5]).end
    );
    pdf.add(
      new Txt(["Forma de pago: ", this.metodo_pago.name]).alignment("right").fontSize(8).margin([0, 0, 20, 5]).end
    );

    pdf.add(pdf.ln(1));
    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
    });

    pdf.add(
      new Txt(["Efectivo: ", this.formatearMoneda("es-CO", "COP", 0, this.efectivo)]).alignment("right").fontSize(8).margin([0, 5, 20, 5]).end
    );
    pdf.add(
      new Txt(["Cambio: ", this.formatearMoneda("es-CO", "COP", 0, this.cambio)]).alignment("right").fontSize(8).margin([0, 0, 20, 5]).end
    );

    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
    });

    pdf.add(pdf.ln(1));

    pdf.add(
      new Columns(["Cliente: ", this.item.nombre_cliente])
        .fontSize(8)
        .end
    );
    pdf.add(
      new Columns(["Cédula: ", this.item.cedula_cliente])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );
    pdf.add(
      new Columns(["Teléfono: ", this.item.telefono_cliente])
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
      new Columns(["Hora Facturación:", this.hora])
        .fontSize(8)
        .end
    );

    pdf.add(
      new Columns(["Facturó:", this.user.user.name])
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

    pdf.create().open();

  }

  generarTabla(): ITable {
    [{}]
    return new Table([
      ['Código', ' Descripción ', 'Cant', 'valor'],

      ...this.extraerData(this.datosDB)

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
    return data.map((row: any) => [row.code, row.description.substring(0, 13), 1, this.formatearMoneda("es-CO", "COP", 0, row.price)]);
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

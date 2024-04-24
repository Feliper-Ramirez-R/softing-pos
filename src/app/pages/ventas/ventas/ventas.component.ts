import { Component } from '@angular/core';
import { VentasService } from './ventas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// import { Columns, Img, ITable, PdfMakeWrapper, QR, Table, Txt } from 'pdfmake-wrapper';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CalendarService } from 'src/app/services/calendar.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Observable, from, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  metodos_pago: any[] = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Transferencia' },
    { id: 3, name: 'Crédito' },
    { id: 4, name: 'Bono' },
    { id: 5, name: 'Multiple' }
  ];

  metodos_pago_multiple: any[] = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Transferencia' },
    { id: 3, name: 'Crédito' },
    { id: 4, name: 'Bono' },
    { id: 5, name: 'Otros' }
  ];
  metodo_pago: any = {};

  empresas_credito: any[] = [{ id: 1, name: 'Sistecredito' }, { id: 2, name: 'Total crédito' }];

  stateOptions: any[] = [{ label: 'No', value: 'off' }, { label: 'Si', value: 'on' }];
  value_impri_fac: string = 'on';

  infoQR: string = '';

  // producto_actual: any = {};

  total: any = 0;
  facNumero: number | undefined
  contadorId: number = 1;
  facturarDialog: boolean = false;
  submitted: boolean = false;
  efectivo: any = 0;
  cambio: any = 0;

  // miFormulario!: FormGroup;

  miFormulario = this.fb.group({
    // Inicializa el FormArray vacío
    multiple: this.fb.array([])
  });

  constructor(private ventasService: VentasService,
    protected user: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private calendarService: CalendarService,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }


  ngOnInit() {
   this.agregarFila();
    this.calendarService.calendarioEnEspanol();
  }

  // Adicionar multiple para otros metodos de pagos

  // Getter para obtener el FormArray del formulario
  get multipleFormArray() {
    return this.miFormulario.get('multiple') as FormArray;
  }

   // Método para agregar una nueva fila de inputs
   agregarFila() {
    const filaFormGroup = this.fb.group({
      metodo: '',
      valor: ''
      // Agrega aquí más inputs si es necesario
    });

    this.multipleFormArray.push(filaFormGroup);
  }

  eliminarFila(index: number) {
    this.multipleFormArray.removeAt(index);
  }

  /* interface MiObjeto {
    observation?: Partial<{
      multiple: unknown[];
    }>;
  }
 */

  openFacturar() {
    this.metodo_pago = {};
    this.efectivo = undefined;
    this.cambio = undefined;
    this.value_impri_fac = 'on';
    this.facturarDialog = true;
    this.submitted = false;
    this.miFormulario = this.fb.group({
      // Inicializa el FormArray vacío
      multiple: this.fb.array([])
    });
    this.agregarFila();
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
      message: 'Desea eliminar este ítem?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',

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

console.log(this.miFormulario.value);

    this.submitted = true;

    if (!this.metodo_pago.id ||
      !this.value_impri_fac ||
      this.metodo_pago.name == 'Crédito' && !this.item.empresa_credito ||
      this.metodo_pago.name == 'Saldo a favor' && !this.item.numero_bono ||
      this.metodo_pago.id == 5 && this.miFormulario.invalid
    ) { return }

    this.miFormulario.value.multiple?.forEach((element:any) =>{element.metodo = element.metodo.name})

    let dataPost = {
      total: this.total,
      store_id: this.datosDB[0].store_id,
      byUser: this.user.user.id,
      list: this.datosDB,
      payment_way: this.metodo_pago.id,
      customer_name:this.item.nombre_cliente ? this.item.nombre_cliente : '',
      customer_dni:this.item.cedula_cliente ? String(this.item.cedula_cliente) : '',
      customer_phone:this.item.telefono_cliente? String(this.item.telefono_cliente) : '',
      change:this.cambio ?  this.cambio : 0,
      cash:this.efectivo ? this.efectivo : 0,
      bonus_id: this.item.numero_bono,
      observation:this.miFormulario.value
    }

    console.log(dataPost);


    const valid: any = await this.ventasService.enviarFactura(dataPost);
    console.log(valid);

    if (!valid.error) {

      if (valid.status == 201) {
        this.facNumero = valid.billNumber;
        this.facturarDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        if (this.value_impri_fac == 'on') { await this.pdf() }
        //  setTimeout(function () { location.reload(); }, 2000);
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
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

    pdf.pageMargins([15, 15, 15, 0]);
    pdf.pageSize({
      width: 220,
      height: 950,
    });

    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt(["AE IMPORTACIONES"]).alignment("center").fontSize(8).end
    );
   
    pdf.add(
      new Txt(["No responsable de IVA"]).alignment("center").fontSize(8).end
    );
    pdf.add(
      new Txt(["Fecha elaboración: ", this.fecha])
        .alignment("center")
        .fontSize(8).end
    );
    pdf.add(pdf.ln(1));
    pdf.add(
      new Txt("Recibo N°: " + this.facNumero?.toString().padStart(4, '0'))
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
      new Txt(["Método de pago: ", this.metodo_pago.name]).alignment("right").fontSize(8).margin([0, 0, 20, 5]).end
    );

    pdf.add(pdf.ln(1));
    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
    });

    pdf.add(
      new Txt(["Efectivo: ", this.formatearMoneda("es-CO", "COP", 0, this.efectivo | 0)]).alignment("right").fontSize(8).margin([0, 5, 20, 5]).end
    );
    pdf.add(
      new Txt(["Cambio: ", this.formatearMoneda("es-CO", "COP", 0, this.cambio | 0)]).alignment("right").fontSize(8).margin([0, 0, 20, 5]).end
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
        .margin([0, 3, 0, 3])
        .end
    );
    pdf.add(
      new Columns(["Fecha :", new Date().toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" })])
        .fontSize(8)
        .end
    );
    pdf.add(
      new Columns(["Hora:", this.hora])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );

    pdf.add(
      new Columns(["Vendedor:", this.user.user.name])
        .fontSize(8)
        .end
    );


    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["RECUERDA QUE SON 8 DIAS PARA CAMBIOS Y 30 PARA GARANTÍAS. SIN ESTE RECIBO NO SE ACEPTAN CAMBIOS NI GARANTÍAS GRACIAS."]).alignment("left").fontSize(8).end
    );

    pdf.add(pdf.ln(1));

    pdf.add(
      new Txt(["Softing-pos creado por Softing-dev"]).alignment("left").fontSize(8).margin([0, 0, 0, 5]).end
    );
    pdf.add(pdf.ln(1));
    // pdf.add(await new Img('assets/images/logo.png').fit([30, 30]).alignment("center").build());

    pdf.add(
      new Txt('No estoy obligado a facturar Art 1.6.1.4.3 del decreto 1625 del 2016.')
        .alignment("center")
        .fontSize(8).end
    );

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
  } */


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
          text: "Fecha elaboración: "+ this.fecha,
          fontSize: 8,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: "Recibo N°: " + this.facNumero?.toString().padStart(4, '0'),
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
               ...this.extraerData(this.datosDB)
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
          text: "Total a pagar: "+ this.formatearMoneda("es-CO", "COP", 0, this.total),
          fontSize: 8,
          alignment: 'right',
          margin: [0, 20, 0, 6],
        },
        {
          text: "Forma de pago: "+ this.metodo_pago.name,
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
          text: "Efectivo: "+ this.formatearMoneda("es-CO", "COP", 0, this.efectivo | 0) ,
          fontSize: 8,
          alignment: 'right',
          margin: [0, 10, 0, 5],
        },
        {
          text: "Cambio: "+ this.formatearMoneda("es-CO", "COP", 0, this.cambio | 0),
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
              text: this.item.nombre_cliente,
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
              text: this.item.cedula_cliente,
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
              text: this.item.telefono_cliente,
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
              text: this.datosDB.length,
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
              text:new Date().toLocaleTimeString(),
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
              text: this.user.user.name,
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


  extraerData(data: any) {
    return data.map((row: any) => [ 
      { text: row.code, style: 'body' },
      { text: row.description.substring(0, 13), style: 'body' },
      { text: 1, style: 'body' },
      { text: this.formatearMoneda("es-CO", "COP", 0, row.price), style: 'body' },
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

import { Component } from '@angular/core';
import { VentasService } from './ventas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CalendarService } from 'src/app/services/calendar.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Observable, from, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DbPwaService } from 'src/app/services/db-pwa.service';

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
    private http: HttpClient,
    private db_pwa: DbPwaService
  ) { }


  async ngOnInit() {
    this.agregarFila();
    this.calendarService.calendarioEnEspanol();
    const items = await this.db_pwa.getNotes();
    this.datosDB = items;
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.subtotal, 0);
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
    producto.subtotal = producto.cantidad * producto.price
    console.log(producto);

    producto.descuento = false;
    await this.db_pwa.updateNote(producto.id, producto);
    this.datosDB = await this.db_pwa.getNotes();
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.subtotal, 0);
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

  confirmBorrarDatos(event: Event) {

    this.confirmationService.confirm({
      target: event.target!,
      message: 'Desea eliminar todos los items?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',

      accept: () => {
        this.eliminarTodo();
      },
      reject: () => {

      }
    });
  }

  async eliminar(producto: any) {
    await this.db_pwa.deleteNote(producto.id);
    this.datosDB = await this.db_pwa.getNotes();
    // this.datosDB = this.datosDB.filter((val: any) => val.prod !== producto.prod);
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.subtotal, 0);
  }

  async eliminarTodo() {
    await this.db_pwa.deleteAlls();
    this.datosDB = await this.db_pwa.getNotes();
    // this.datosDB = this.datosDB.filter((val: any) => val.prod !== producto.prod);
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.subtotal, 0);
  }


  async editarCantidad(producto: any) {
 
   /*  if (producto.cantidad > producto.stock) {
      this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'El item ' + producto.code + ' no cuenta con inventario!, puedes facturar ' + producto.stock + ' pares', life: 5000 }); return
    } */
    producto.subtotal = producto.cantidad * producto.price
    await this.db_pwa.updateNote(producto.id, producto);
    this.datosDB = await this.db_pwa.getNotes();
    producto.descuento = false;
    console.log(this.datosDB);

    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.subtotal, 0);

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
        valid.data[0].cantidad = 1;
        valid.data[0].subtotal = valid.data[0].price * valid.data[0].cantidad;
        valid.data[0].prod = this.contadorId;
        this.item = {};

        await valid.data.forEach((elem: any) => {
          elem.descuento = false
        });
        // si ya existe el item le va sumando la cantidad
        let itemRepetido = this.datosDB.filter((val: any) => val.id == valid.data[0].id);
        if (itemRepetido.length == 1) {
          itemRepetido[0].cantidad += 1;
          this.editarCantidad(itemRepetido[0])
          //  await this.db_pwa.updateNote(itemRepetido[0].id, itemRepetido)
        } else {
          this.db_pwa.addNote(valid.data[0]);
        }
        console.log(itemRepetido);

        const items = await this.db_pwa.getNotes();
        this.datosDB = items;
        this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.subtotal, 0);
        console.log(this.datosDB);

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async enviarFactura() {

    // console.log(this.miFormulario.value.multiple?[0]);return

    this.submitted = true;

    if (!this.metodo_pago.id ||
      !this.value_impri_fac ||
      this.metodo_pago.name == 'Crédito' && !this.item.empresa_credito ||
      this.metodo_pago.name == 'Saldo a favor' && !this.item.numero_bono ||
      this.metodo_pago.id == 5 && this.miFormulario.invalid
    ) { return }

    this.miFormulario.value.multiple?.forEach((element: any) => { element.metodo = element.metodo.name })

    let dataPost = {
      total: this.total,
      store_id: this.datosDB[0].store_id,
      byUser: this.user.user.id,
      list: this.datosDB,
      payment_way: this.metodo_pago.id,
      customer_name: this.item.nombre_cliente ? this.item.nombre_cliente : null,
      customer_dni: this.item.cedula_cliente ? String(this.item.cedula_cliente) : null,
      customer_phone: this.item.telefono_cliente ? String(this.item.telefono_cliente) : null,
      change: this.cambio ? this.cambio : 0,
      cash: this.efectivo ? this.efectivo : 0,
      bonus_id: this.item.numero_bono,
      observation: this.miFormulario.value
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


  imagenBase64() {
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
    const docDefinition: any = {
      pageSize: {
        width: 220,  // Aproximadamente 8.27 pulgadas, para A4 es 210mm
        height: 650   // Aproximadamente 11.69 pulgadas, para A4 es 297mm
      },
      content: [
        {
          image: image,  // Aquí va tu imagen en base64
          width: 25,
          height: 25,
          alignment: 'center',
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
          text: "Fecha elaboración: " + this.fecha,
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
            hLineWidth: function (i: any, node: any) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 0;
            },
            hLineColor: function (i: any) {
              return i === 1 ? 'black' : '#FFFFFF';
            }
          }
        },
        {
          text: "Total a pagar: " + this.formatearMoneda("es-CO", "COP", 0, this.total),
          fontSize: 8,
          alignment: 'right',
          margin: [0, 20, 0, 6],
        },
        {
          text: "Forma de pago: " + this.metodo_pago.name,
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
          text: "Efectivo: " + this.formatearMoneda("es-CO", "COP", 0, this.efectivo | 0),
          fontSize: 8,
          alignment: 'right',
          margin: [0, 10, 0, 5],
        },
        {
          text: "Cambio: " + this.formatearMoneda("es-CO", "COP", 0, this.cambio | 0),
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
              text: 'Fecha Facturación:',
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
              text: new Date().toLocaleTimeString(),
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
          text: "TIENES 8 DIAS PARA CAMBIOS Y 30 PARA GARANTÍA. SIN ESTE RECIBO NO SE ACEPTAN RECLAMOS GRACIAS.",
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
    this.eliminarTodo();
    // setTimeout(() => (location.reload()), 2000)
  }


  extraerData(data: any) {
    return data.map((row: any) => [
      { text: row.code, style: 'body' },
      { text: row.description.substring(0, 12), style: 'body' },
      { text: row.cantidad, style: 'body' },
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

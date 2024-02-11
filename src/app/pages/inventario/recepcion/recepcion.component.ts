import { Component } from '@angular/core';
import { RecepcionService } from './recepcion.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Columns, Img, PdfMakeWrapper} from 'pdfmake-wrapper';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss']
})
export class RecepcionComponent {

  elementType: any = 'img';
  value = '';
  format: any = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = true;
  fontOptions = '';
  // font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 20;
  background = '#ffffff';
  /*  margin = 10;
   marginTop = 10;
   marginBottom = 10;
   marginLeft = 10;
   marginRight = 10; */

  get values(): string[] {
    return this.value.split('\n');
  }


  datosDB: any[] = [];
  item: any = {};

  bodegas: any[] = [];
  bodega: any = {};

  // cantidad_codigos: number = 1;
  nombre_archivo_plano: string = '';

  datosExcel: any[] = [];

  imprimirDialog: boolean = false;
  inventarioDialog: boolean = false;
  vista_previa_archivo: boolean = false;
  submitted: boolean = false;

  constructor(private recepcionService: RecepcionService,
    protected user: AuthService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    this.getProductos();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  ingresarInventarioExcel(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('No se puede usar múltiples archivos');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* leer el workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* tomar la primera hoja */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* guardar los datos */
      this.datosExcel = <Array<any>>XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(this.datosExcel);
      this.nombre_archivo_plano = evt.target.files[0].name;
    };
    reader.readAsBinaryString(target.files[0]);
    this.vista_previa_archivo = true;
  }


  /* alertImprimir(item: any) {
    this.submitted = false;
    this.cantidad_codigos = 1;
    this.value = item.code;
    this.imprimirDialog = true;
  } */

  openRecibir(item: any) {
    this.bodega = {};
    this.submitted = false;
    this.item = { ...item };
    this.inventarioDialog = true;
    console.log(item);
  }

/*   async generarPdfEtiquetas() {

    this.submitted = true;

    if (this.cantidad_codigos == 0) { return }

    const pdf = new PdfMakeWrapper();

    // for (let tam = 0; tam <= this.cantidad_codigos - 1; tam++) {

    var imagenEanCodigo: any = document.getElementById('codigo')?.getElementsByTagName("img")[0].currentSrc;

    // pdf.add(new Columns([await new Img(imagenEanCodigo).build()]).columnGap(1).end);
    pdf.add(new Columns([await new Img(imagenEanCodigo).build(), await new Img(imagenEanCodigo).build()]).columnGap(1).end);

    // }

    pdf.pageBreakBefore(
      (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) => {
        return currentNode.headlineLevel === 1 && followingNodesOnPage?.length === 0;
      }
    );

    pdf.pageMargins([3, 3, 3, 3]);
    pdf.pageSize({
      width: 500,
      height: 150

    });
    this.imprimirDialog = false;
    pdf.create().open();

  } */


  async getProductos() {

    const valid: any = await this.recepcionService.getProductos();
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
      this.bodegas = valid.stores;

      if (valid.status == 200) {

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async ingresarInventario() {

    this.submitted = true;

    if (!this.item.cantidad) { return }

    let dataPost = {
      product_id: this.item.id,
      store_id: this.bodega.id,
      stock: this.item.cantidad,
      byUser: this.user.user.id
    }

    console.log(dataPost);


    const valid: any = await this.recepcionService.ingresarInventario(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;

      if (valid.status == 201) {
        this.inventarioDialog = false;
        this.getProductos();
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async enviarArchivo() {

    let dataPost = {
      data_file: this.datosExcel
    }

    console.log(dataPost);

    const valid: any = await this.recepcionService.enviarArchivo(dataPost);
    console.log(valid);

    if (!valid.error) {

      if (valid.status == 201) {
        this.vista_previa_archivo = false;
        this.getProductos();
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

}

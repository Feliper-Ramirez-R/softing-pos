import { Component } from '@angular/core';
import { RecepcionService } from './recepcion.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Columns, Img, PdfMakeWrapper, QR, Table, Txt } from 'pdfmake-wrapper';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss']
})
export class RecepcionComponent {

  elementType: any = 'img';
  value = 'fdgdfg';
  format: any = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 20;
  background = '#ffffff';
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;

  get values(): string[] {
    return this.value.split('\n');
  }
  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ];

  datosDB: any[] = [];
  item: any = {};

  bodegas: any[] = [];
  bodega: any = {};

  cantidad_codigos: number = 1;

  imprimirDialog: boolean = false;
  inventarioDialog: boolean = false;
  submitted: boolean = false;

  constructor(private recepcionService: RecepcionService,
    private user: AuthService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    this.getProductos();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  alertImprimir(item: any) {
    this.submitted = false;
    this.cantidad_codigos = 1;
    this.value = item.code;
    this.imprimirDialog = true;
  }

  openRecibir(item: any) {
    this.bodega = {};
    this.submitted = false;
    this.item = { ...item };
    this.inventarioDialog = true;
    console.log(item);
  }

  async generarPdfEtiquetas() {

    this.submitted = true;

    if (this.cantidad_codigos == 0) { return }

    const pdf = new PdfMakeWrapper();

    for (let tam = 0; tam <= this.cantidad_codigos - 1; tam++) {

      var imagenEanCodigo: any = document.getElementById('codigo')?.getElementsByTagName("img")[0].currentSrc;

      pdf.add(new Columns([await new Img(imagenEanCodigo).build()]).columnGap(1).end);

    }

    pdf.pageBreakBefore(
      (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) => {
        return currentNode.headlineLevel === 1 && followingNodesOnPage?.length === 0;
      }
    );

    pdf.pageMargins([8, 8, 8, 8]);
    pdf.pageSize({
      width: 250,
      height: 150

    });
    this.imprimirDialog = false;
    pdf.create().open();

  }


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

    if(!this.item.cantidad){return}

    let dataPost = {
        product_id:this.item.id,
        store_id:this.bodega.id,
        stock:this.item.cantidad,
        byUser:this.user.user.id
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

}

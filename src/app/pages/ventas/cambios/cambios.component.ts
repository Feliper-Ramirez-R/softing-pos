import { Component } from '@angular/core';
import { CambiosService } from './cambios.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Columns, Img, ITable, PdfMakeWrapper, QR, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

@Component({
  selector: 'app-cambios',
  templateUrl: './cambios.component.html',
  styleUrls: ['./cambios.component.scss']
})
export class CambiosComponent {

  datosDB: any[] = [];
  item:any = {};
  bono_a_favor:number | undefined

  submitted:boolean = false;
  cambio_dialog:boolean = false;
  bono_dialog:boolean = false;

  constructor(private cambiosService: CambiosService,
    protected user: AuthService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
   
     this.getCambios();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  abrirModal(){
    this.item = {};
    this.submitted = false;
    this.cambio_dialog = true;
  }

  bonoModal(){
    this.submitted = false;
    this.bono_dialog = true;
    this.bono_a_favor = undefined
  }

  async getCambios() {

    const valid: any = await this.cambiosService.getCambios();
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
     
      if (valid.status == 200) {

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async hacerCambio() {

    this.submitted = true;

    if(!this.item.codigo_entrada || !this.item.codigo_salida || !this.item.factura){return}

    let dataPost = {
      billNumber:this.item.factura,
      store_id:this.user.user.store_id,
      byUser:this.user.user.id,
      code_in:this.item.codigo_entrada,
      code_out:this.item.codigo_salida,
    }

    const valid: any = await this.cambiosService.hacerCambio(dataPost);
    console.log(valid);

    if (!valid.error) {
     
      if (valid.status == 201) {
        this.cambio_dialog = true;
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

  async imprimirBono(){

    PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();

    
     pdf.add(await new Img('assets/images/logoAE.jpeg').fit([100, 100]).alignment("center").build());

    pdf.pageMargins([15, 20, 5, 5]);
    pdf.pageSize({
      width: 220,
      height: 270,
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
      new Columns(["Fecha Vencimiento:",fechaVencimiento])
        .fontSize(8)
        .margin([0, 3, 0, 3])
        .end
    );

    pdf.add(pdf.ln(1));

    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
    });


    pdf.add(
      new Columns([this.formatearMoneda("es-CO", "COP", 0, this.bono_a_favor)])
        .fontSize(20)
        .alignment("center")
        .margin([0, 3, 0, 3])
        .end
    );


    pdf.add({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 190, y2: 0, lineWidth: 1 }],
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
      new Txt(["NO SE ACEPTAN RECLAMOS O ENTREGAS DESPUÉS DE LA FECHA DE VENCIMIENTO,NI SIN ESTE DOCUMENTO."]).alignment("left").fontSize(8).end
    );
    this.bono_dialog = false;
    pdf.create().open();
   
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

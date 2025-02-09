import { Component } from '@angular/core';
import { ReportesService } from './reportes.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
import { CalendarService } from 'src/app/services/calendar.service';
import * as FileSaver from 'file-saver';


// const EXCEL_TYPE =
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {

  rangeDates: any | undefined;

  cols: any[] = [];

  datosDB: any[] = [];
  item: any = {};

  almacenes: any[] = [];

  excelData: any[] = [];

  total: number = 0;
  exedentes: number = 0;

  submitted: boolean = false;
  cambio_dialog: boolean = false;

  pares_vendidos:number | undefined;

  columns_view = [
    {
        "header": "N° Recibo",
        "field": "numero_factura"
    },
    {
        "header": "N° Items",
        "field": "cant_items"
    },
    {
        "header": "Total",
        "field": "total"
    },
    {
        "header": "Almacén",
        "field": "store_name"
    },
    {
        "header": "Fecha",
        "field": "created_at"
    },
    {
        "header": "Método de pago",
        "field": "payment_way_name"
    }
];

  constructor(private reportesService: ReportesService,
    protected user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
    this.getAlmacenes();
    this.getReportes();
  }

  limpiar() {
    // this.cols = [];
    this.datosDB = [];
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  async getReportes() {

    if(!this.rangeDates){
      const fechaActual = new Date();
      const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      this.rangeDates =  [fechaInicio,fechaFin]
     }

    if (!this.rangeDates || !this.rangeDates[1]) { return }

    let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0]

    let dataPost = {
      date_from: fecha1,
      date_to: fecha2,
      store_id: this.item.almacen ? this.item.almacen.id : null
    }

    console.log(dataPost);


    const valid: any = await this.reportesService.getReportes('Ventas', dataPost);
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
      this.total = valid.total;
      this.exedentes = valid.total_exendentes;
      this.pares_vendidos = valid.total_cant;


      if (valid.status == 200) {

        await valid.data.forEach((a: any) => {
          a.created_at = new Date(a.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) + '-' + new Date(a.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hourCycle: 'h11' })
          a.total = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(a.total)
        })

         this.cols = valid.cols;
        this.datosDB = valid.data;
        this.excelData = valid.data;

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

  async getAlmacenes() {

    const valid: any = await this.reportesService.getAlmacenes();
    console.log(valid);

    if (!valid.error) {
      this.almacenes = valid.stores;
      if (valid.status == 200) {

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }



  // Excel


  exportToExcel() {

    let Heading: any[] = ['Recibo','N° Items','Total','Almacén','Fecha','Método de pago','Efectivo','Bono','Transferencia','Crédito','Otros'];
   /*  this.cols.forEach(element => {
      Heading.push(element.header)
    }); */

    console.log([Heading]);

    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [Heading]);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Información');
    let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0]
    XLSX.writeFile(wb, 'Reporte de ' + 'ventas' + ' de ' + fecha1 + ' a ' + fecha2 + '.xlsx');
  }

    /* async exportToExcel(): Promise<void> {
  
      this.exportAsExcelFile(this.excelData, 'Exportable');
    } */
  
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    json = this.excelData
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(
      data,
      fileName + 'Tiempos de operación' + 'xlsx'
    );
  }









}

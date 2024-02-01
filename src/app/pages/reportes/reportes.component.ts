import { Component } from '@angular/core';
import { ReportesService } from './reportes.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { CalendarService } from 'src/app/services/calendar.service';


const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {

  rangeDates: any | undefined;

  cols:any[] = [];

  datosDB: any[] = [];
  item:any = {};

  almacenes: any[] = [];

  excelData: any[] = [];

  submitted:boolean = false;
  cambio_dialog:boolean = false;

  constructor(private reportesService: ReportesService,
    protected user: AuthService,
    private messageService: MessageService,
    private calendarService:CalendarService
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
     this.getAlmacenes();
 }

 onGlobalFilter(table: any, event: Event) {
   table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
 }

 async getReportes() {

  if (!this.rangeDates || !this.rangeDates[1]){return}

      let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
      let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0]

  let dataPost = {
    data:{
      date_from:fecha1,
      date_to:fecha2,
      store_id:this.item.almacen ? this.item.almacen.id : null
    }
  }

  console.log(dataPost);
  

  const valid: any = await this.reportesService.getReportes(this.item.reporte.name,dataPost);
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








// excel

async exportAsXLSX(): Promise<void> {

  if(this.excelData.length == 0){return}

 let data= this.excelData

 this.exportAsExcelFile(data, 'Exportable');
}

public exportAsExcelFile(json: any[], excelFileName: string): void {
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
const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
FileSaver.saveAs(
  data,
  fileName + '-' + new Date().toLocaleString("es-ES", { day: "2-digit", month: "long", year: "numeric" }) + EXCEL_EXTENSION
);
}


}

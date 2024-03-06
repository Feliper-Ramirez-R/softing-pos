import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GastosService } from './gastos.service';
import { AuthService } from 'src/app/services/auth.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent {

  datosDB: any[] = [];
  item: any = {};

  itemEditDialog: boolean = false;
  submitted: boolean = false;
 
  rangeDates:any | undefined;


  constructor(private gastosService: GastosService,
    private user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService) { }


    ngOnInit() {
      this.calendarService.calendarioEnEspanol();
       this.getGastos();
    }
  
    onGlobalFilter(table: any, event: Event) {
      console.log(table, 'table', event, 'event');
  
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
  
    hideDialog() {
      this.itemEditDialog = false;
      this.submitted = false;
    }
  
    openNew() {
      this.item = {};
      this.submitted = false;
      this.itemEditDialog = true;
    }
  
  
    async saveItem() {
    
      this.submitted = true;
  
      if (!this.item.valor || !this.item.concepto ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }
  
      let dataPost = {
  
        type: 2,
        store_id:this.user.user.store_id ,
        amount: this.item.valor,
        observation: this.item.concepto
      }
      console.log(dataPost);
      const valid: any = await this.gastosService.saveItem(dataPost);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 201) {
          this.hideDialog();
          this.getGastos();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }
  
    async getGastos() {

      if(!this.rangeDates){
        const fechaActual = new Date();
        const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
        const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
        this.rangeDates =  [fechaInicio,fechaFin]
       }
  
      if (!this.rangeDates || !this.rangeDates[1]) { return }
  
      let fecha1 = this.rangeDates[0].toISOString().split('T')[0];
      let fecha2 = this.rangeDates[1].toISOString().split('T')[0];
      console.log(this.rangeDates);
      console.log(fecha1);
      console.log(fecha2);
  
      let dataPost = {
        date_from: fecha1,
        date_to: fecha2
      }
  
      const valid: any = await this.gastosService.getGastos(dataPost);
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

}

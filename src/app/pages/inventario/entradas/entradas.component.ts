import { Component } from '@angular/core';
import { EntradasService } from './entradas.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent {

  rangeDates: any | undefined;


  datosDB: any[] = [];
  item: any = {};

  bodegas: any[] = [];
  bodega: any = {};

  itemCreateDialog: boolean = false;
  aceptarDialog: boolean = false;
  submitted: boolean = false;

  constructor(private entradasService: EntradasService,
    private user: AuthService,
    private messageService: MessageService,
    private calendarService:CalendarService
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
    this.getEntradas();
  }

  /* openNew() {
    this.item = {};
    this.submitted = false;
    this.itemCreateDialog = true;
  } */

  openRecibir(item: any) {
    this.item = item;
    this.aceptarDialog = true;
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  async getEntradas() {

    const valid: any = await this.entradasService.getEntradas();
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

  async aceptarEntrada() {

    let dataPost = {
      byUser: this.user.user.id,
      movement_id: this.item.id
    }

    console.log(dataPost);


    const valid: any = await this.entradasService.aceptarEntrada(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;

      if (valid.status == 201) {
        this.aceptarDialog = false;
        this.getEntradas();
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

  async getEntradasRango() {


    if (!this.rangeDates || !this.rangeDates[1]) { return }

    let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0]
    console.log(this.rangeDates);
    console.log(fecha1);
    console.log(fecha2);


    let dataPost = {
      date_from: fecha1,
      date_to: fecha2
    }
    console.log(dataPost);


    const valid: any = await this.entradasService.getEntradasRango(dataPost);
    console.log(valid);


    if (!valid.error) {
      this.datosDB = valid.data;
      if (valid.status == 200) {

      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 });
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }

  }

}

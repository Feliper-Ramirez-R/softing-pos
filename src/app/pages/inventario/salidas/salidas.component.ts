import { Component } from '@angular/core';
import { SalidasService } from './salidas.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent {

  datosDB: any[] = [];
  item: any = {};

  bodegas: any[] = [];
  bodega: any = {};

  itemCreateDialog: boolean = false;
  submitted: boolean = false;

  rangeDates: any | undefined;

  constructor(private salidaService: SalidasService,
    private user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService
  ) { }


  ngOnInit() {
    this.calendarService.calendarioEnEspanol();
    this.getSalidas();
  }


  openNew() {
    this.item = {};
    this.bodega = {};
    this.submitted = false;
    this.itemCreateDialog = true;
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

    const valid: any = await this.salidaService.getEntradasRango(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
      if (valid.status == 200) {

        /*  this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); */
}
      else { this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }

  }

  async getSalidas() {

    const valid: any = await this.salidaService.getSalidas();
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

  async saveItem() {

    this.submitted = true;

    if (!this.bodega.id || !this.item.cantidad || !this.item.codigo) { return }

    let dataPost = {
      code: this.item.codigo,
      stock: this.item.cantidad,
      from_store_id: this.user.user.store_id,
      to_store_id: this.bodega.id,
      byUser: this.user.user.id
    }

    console.log(dataPost);


    const valid: any = await this.salidaService.saveItem(dataPost);
    console.log(valid);

    if (!valid.error) {
      // this.datosDB = valid.data;

      if (valid.status == 201) {
        this.itemCreateDialog = false;
        this.getSalidas();
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

}

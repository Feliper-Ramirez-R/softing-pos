import { Component } from '@angular/core';
import { CambiosService } from './cambios.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { CalendarService } from 'src/app/services/calendar.service';


@Component({
  selector: 'app-cambios',
  templateUrl: './cambios.component.html',
  styleUrls: ['./cambios.component.scss']
})
export class CambiosComponent {

  datosDB: any[] = [];
  item:any = {};

  submitted:boolean = false;
  cambio_dialog:boolean = false;

  rangeDates: any | undefined;
 

  constructor(private cambiosService: CambiosService,
    protected user: AuthService,
    private messageService: MessageService,
    private calendarService: CalendarService
  ) { }


  ngOnInit() {
   this.calendarService.calendarioEnEspanol();
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


  async getCambios() {

    if(!this.rangeDates){
      const fechaActual = new Date();
      const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
      this.rangeDates =  [fechaInicio,fechaFin]
     }

    if (!this.rangeDates || !this.rangeDates[1]) { return }

    let fecha1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    let fecha2 = new Date(this.rangeDates[1]).toISOString().split('T')[0]
    console.log(this.rangeDates);
    console.log(fecha1);
    console.log(fecha2);

    let dataPost = {
      date_from: fecha1,
      date_to: fecha2,
      store_id:this.user.user.store_id
    }
    console.log(dataPost);

    const valid: any = await this.cambiosService.getCambios(dataPost);
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
        this.cambio_dialog = false;
        this.getCambios()
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


}

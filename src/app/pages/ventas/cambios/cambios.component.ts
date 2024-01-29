import { Component } from '@angular/core';
import { CambiosService } from './cambios.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

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

  constructor(private cambiosService: CambiosService,
    private user: AuthService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    // this.getCambios();
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

    if(!this.item.codigo_entrada || !this.item.codigo_salida || !this.item.observacion){return}

    let dataPost = {
      store_id:this.item.store,
      code:this.item.codigo_entrada,
      code2:this.item.codigo_salida,
    }

    const valid: any = await this.cambiosService.hacerCambio(dataPost);
    console.log(valid);

    if (!valid.error) {
     
      if (valid.status == 200) {

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


}

import { Component } from '@angular/core';
import { AjustesService } from './ajustes.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss']
})
export class AjustesComponent {

  datosDB: any[] = [];
  item:any = {};

  almacenes: any[] = [];
  almacen:any = {};

  submitted:boolean = false;
  ajustar_dialog:boolean = false;

  tipo_ajuste:string = '';

  constructor(private ajusteService: AjustesService,
    private user: AuthService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    // this.getAjustes();
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  abrirModal(tipo:string){
    this.tipo_ajuste = tipo;
    this.ajustar_dialog = true;
  }

  async getAjustes() {

    const valid: any = await this.ajusteService.getAjustes();
    console.log(valid);

    if (!valid.error) {
      this.datosDB = valid.data;
      this.almacenes = valid.stores;
     
      if (valid.status == 200) {

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async ajustarInventario() {

    this.submitted = true;

    let dataPost = {
      store_id:this.item.store,
      code:this.item.code,
      movement_type:this.tipo_ajuste === 'Entrada'? 1 : 0
    }

    const valid: any = await this.ajusteService.ajustarInventario(dataPost);
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

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
    this.getAlmacenes();
    this.tipo_ajuste = tipo;
    this.ajustar_dialog = true;
    this.item = {};
    this.submitted = false;
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

    if(!this.item.almacen || !this.item.code || !this.item.cantidad || !this.item.observacion){return}

    let dataPost = {
      store_id:this.item.almacen.id,
      code:this.item.code,
      observation:this.item.observacion,
      type:this.tipo_ajuste === 'Entrada'? 3 : 4,
      byUser:this.user.user.id,
      stock:this.item.cantidad
    }

    console.log(dataPost);
    

    const valid: any = await this.ajusteService.ajustarInventario(dataPost);
    console.log(valid);

    if (!valid.error) {
     
      if (valid.status == 201) {
         this.ajustar_dialog = false;
         this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }


  async getAlmacenes() {
  
    const valid: any = await this.ajusteService.getAlmacenes();
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


}

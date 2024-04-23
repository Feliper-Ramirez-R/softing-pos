import { Component } from '@angular/core';
import { AlmacenesService } from './almacenes.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})



export class AlmacenesComponent {

  selectedItems: any[] = [];

  usuarios_almacen: any[] = [];

  datosDB: any[] = [];
  item: any = {};

  admins: any[] = [];
  admin: any = {};

  itemEditDialog: boolean = false;
  ingresar_usuario_Dialog: boolean = false;
  // itemDeleteDialog: boolean = false;
  submitted: boolean = false;
  crear: boolean = false;

  vista_modal_ingresar_usuarios:number | undefined;
  
  value: string = '';
  stateOptions: any[] = [{ label: 'Habilitado', value: 'on' }, { label: 'Inhabilitado', value: 'off' }];

  constructor(private almacenService: AlmacenesService,
    private user: AuthService,
    private messageService: MessageService) { }


    ngOnInit() {
      this.getAlmacenes();
    }
  
    onGlobalFilter(table: any, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onGlobalFilter2(table: any, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
  
    hideDialog() {
      this.itemEditDialog = false;
      this.submitted = false;
    }
    openEdit(item: any) {
      if(item.enabled == 1){this.value = 'on'}else{this.value = 'off'}
      this.admin = {id:item.admin_id,name:item.admin_name}
      console.log(this.admin);
      
      this.crear = false
      this.item = { ...item };
      this.itemEditDialog = true;
      console.log(item);
    }
  
   /*  deleteAlert(item: any) {
      this.itemDeleteDialog = true;
      this.item = { ...item };
    } */

    ingresarUsuarioAlert(item: any,num:number) {
      if(num == 1 || num==3){this.usuarios_almacen = item.users_store}
      this.vista_modal_ingresar_usuarios = num
      this.selectedItems = [];
      this.ingresar_usuario_Dialog = true;
      this.item = { ...item };
    }
  
    openNew() {
      this.crear = true;
      this.item = {};
      this.admin = {};
      this.submitted = false;
      this.itemEditDialog = true;
    }
  
  
/*     async deleteItem() {
      console.log(this.item);
  
      this.itemDeleteDialog = false;
  
      const valid: any = await this.almacenService.deleteItem(this.item.id);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 200) {
          this.item = {};
          this.getAlmacenes();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    } */
  
  
  
    async ingresarUsuarios() {
  
      if (this.selectedItems.length == 0 ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Selecciona por lo menos un usuario', life: 5000 }); return }
  
      var ids:any = [];
      await this.selectedItems.forEach((element:any)=>{
        ids.push(element.id)
      });

      let dataPost = {
  
        store_id: this.item.id,
        ids
      }
      console.log(dataPost);
      const valid: any = await this.almacenService.ingresarUsuarios(dataPost);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 201) {
          this.item = {};
          this.ingresar_usuario_Dialog = false;
          this.selectedItems = [];
          this.getAlmacenes();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }


    async eliminarUsuarios() {
  
      if (this.selectedItems.length == 0 ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Selecciona por lo menos un usuario', life: 5000 }); return }
  
      var ids:any = [];
      await this.selectedItems.forEach((element:any)=>{
        ids.push(element.id)
      });

      let dataPost = {
  
        store_id: this.item.id,
        ids
      }
      console.log(dataPost);
      const valid: any = await this.almacenService.eliminarUsuarios(dataPost);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 200) {
          this.item = {};
          this.ingresar_usuario_Dialog = false;
          this.selectedItems = [];
          this.getAlmacenes();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }


    async editItem() {
      this.submitted = true;
  
      if (!this.item.name || !this.item.code ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }
  
      let dataPost = {
  
        name: this.item.name,
        code: this.item.code,
        admin_id: this.admin ?  this.admin.id : null,
        enabled:this.value == 'off'?false:true
      }
      console.log(dataPost)
      const valid: any = await this.almacenService.editItem(dataPost, this.item.id);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 201) {
          this.item = {};
          this.itemEditDialog = false;
          this.getAlmacenes();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }
  
  
    async saveItem() {
    
      this.submitted = true;
  
      if (!this.item.name || !this.item.code ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }
  
      let dataPost = {
  
        name: this.item.name,
        code: this.item.code,
        admin_id: this.admin ?  this.admin.id : null,
        enabled: true
      }
      console.log(dataPost);
      const valid: any = await this.almacenService.saveItem(dataPost);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 201) {
          this.hideDialog();
          this.getAlmacenes();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }
  
    async getAlmacenes() {
  
      const valid: any = await this.almacenService.getAlmacenes();
      console.log(valid);
  
      if (!valid.error) {
        this.datosDB = valid.data;
        this.admins = valid.users;
        if (valid.status == 200) {
  
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }

}

import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ProductosService } from './productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {

  datosDB: any[] = [];
  item: any = {};

  itemEditDialog: boolean = false;
  itemDeleteDialog: boolean = false;
  submitted: boolean = false;
  crear: boolean = false;

  constructor(private productService: ProductosService,
    private user: AuthService,
    private messageService: MessageService) { }


    ngOnInit() {
      this.getProductos();
    }
  
    onGlobalFilter(table: any, event: Event) {
      console.log(table, 'table', event, 'event');
  
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
  
    hideDialog() {
      this.itemEditDialog = false;
      this.submitted = false;
    }
    openEdit(item: any) {
     
      this.crear = false
      this.item = { ...item };
      this.itemEditDialog = true;
      console.log(item);
    }
  
    deleteAlert(item: any) {
      this.itemDeleteDialog = true;
      this.item = { ...item };
    }
  
    openNew() {
      this.crear = true;
      this.item = {};
      this.submitted = false;
      this.itemEditDialog = true;
    }
  
  
    async deleteItem() {
      console.log(this.item);
  
      this.itemDeleteDialog = false;
  
      const valid: any = await this.productService.deleteItem(this.item.id);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 200) {
          this.item = {};
          this.getProductos();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }
  
  
  
    async editItem() {
      this.submitted = true;
  
      //validar email..... Utiliza el método test() para verificar si el email cumple con la expresión regular
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
      if (!this.item.name || this.item.name.length < 10 || !this.item.dni || !this.item.email) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }
  
      if (!regex.test(this.item.email)) {
        this.messageService.add({ severity: 'error', summary: 'Ups!', detail: `El email ${this.item.email} no es válido.`, life: 5000 }); return
      }
  
      let dataPost = {
  
        name: this.item.name,
        dni: String(this.item.dni),
        email: this.item.email,
      }
      console.log(dataPost)
      const valid: any = await this.productService.editItem(dataPost, this.item.id);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 201) {
          this.item = {};
          this.itemEditDialog = false;
          this.getProductos();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }
  
  
    async saveItem() {
      console.log(this.item, 'crear');
      this.submitted = true;
  
      // if (!this.item.name || this.item.name.length < 10 || !this.item.dni || !this.item.email ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }
  
  
      let dataPost = {
  
        name: "string",
        code: "string",
        description: "string",
        cost: 0,
        price: 0,
        brand_id: 0,
        model_id: 0,
        color_id: 0,
        size_id: 0,
        category_i: 0,
        provider_id: 0,
        url_file: "string",
        enabled: true
      }
      console.log(dataPost);
      const valid: any = await this.productService.saveItem(dataPost);
      console.log(valid);
  
      if (!valid.error) {
  
        if (valid.status == 201) {
          this.hideDialog();
          this.getProductos();
          this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
      } else {
        if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
        else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
      }
    }
  
    async getProductos() {
  
      const valid: any = await this.productService.getProductos();
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

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

  marcas: any[] = [];
  marca: any = {};

  categorias: any[] = [];
  categoria: any = {};

  colores: any[] = [];
  color: any = {};

  modelos: any[] = [];
  modelo: any = {};

  proveedores: any[] = [];
  proveedor: any = {};

/*   tallas: any[] = [];
  talla: any = {}; */

  unidades_medidas: any[] = [];
  unidad_medida: any = {};

  itemEditDialog: boolean = false;
  itemDeleteDialog: boolean = false;
 
  submitted: boolean = false;
  crear: boolean = false;


  


  constructor(private productService: ProductosService,
    private user: AuthService,
    private messageService: MessageService,
  ) { }


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
    this.marca = { id: item.brand_id, name: item.brand_name }
    this.categoria = { id: item.category_id, name: item.category_name }
    this.color = { id: item.color_id, name: item.color_name }
    this.modelo = { id: item.model_id, name: item.model_name }
    this.proveedor = { id: item.provider_id, name: item.provider_name }
    // this.talla = { id: item.size_id, name: item.size_name }
    this.unidad_medida = { id: item.unit_measurement_id, name: item.unit_measurement_name }
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
    this.marca = {};
    this.categoria = {};
    this.color = {};
    this.modelo = {};
    this.proveedor = {};
    // this.talla = {};
    this.unidad_medida = {};
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

    if (!this.item.name  || !this.item.description || !this.item.cost || !this.item.price || !this.marca.id  || !this.modelo.id
      || !this.color.id || !this.item.size_name || !this.categoria.id || !this.proveedor.id || !this.unidad_medida.id
   ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }

   if(this.item.price_min > this.item.price){this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'El precio mínimo no puede ser mayor al precio de venta', life: 5000 }); return}

    let dataPost = {

      name:this.item.name ,
      code: "",
      description:this.item.description ,
      cost:this.item.cost ,
      price:this.item.price ,
      brand_id:this.marca.brand_id ,
      model_id: this.modelo.model_id,
      color_id:this.color. color_id,
      size_id:this.item.size_name ,
      category_id:this.categoria.category_id ,
      provider_id:this.proveedor.provider_id ,
      unit_measurement_id:this.unidad_medida.unit_measurement_id,
      url_file: "",
      enabled: true,
      price_min:this.item.price_min
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

     if (!this.item.name  || !this.item.description || !this.item.cost || !this.item.price || !this.marca.id  || !this.modelo.id
         || !this.color.id || !this.item.size_name || !this.categoria.id || !this.proveedor.id || !this.unidad_medida.id
      ) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos', life: 5000 }); return }

      if(this.item.price_min > this.item.price){this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'El precio mínimo no puede ser mayor al precio de venta', life: 5000 }); return}

    let dataPost = {

      name:this.item.name ,
      code: "",
      description:this.item.description ,
      cost:this.item.cost ,
      price:this.item.price ,
      brand_id:this.marca.id ,
      model_id: this.modelo.id,
      color_id:this.color.id,
      size_id:this.item.size_name,
      category_id:this.categoria.id ,
      provider_id:this.proveedor.id ,
      unit_measurement_id:this.unidad_medida.id,
      url_file: "",
      enabled: true,
      price_min:this.item.price_min
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
      this.marcas = valid.brands;
      this.categorias = valid.categories;
      this.colores = valid.colors;
      this.modelos = valid.models;
      this.proveedores = valid.providers;
      // this.tallas = valid.sizes;
      this.unidades_medidas = valid.unitsMeasurements
      if (valid.status == 200) {

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

}

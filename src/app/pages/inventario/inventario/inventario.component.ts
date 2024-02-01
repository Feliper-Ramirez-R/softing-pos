import { Component } from '@angular/core';
import { InventarioService } from './inventario.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService, SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent {

  datosDB: any[] = [];
  item: any = {};

  bodegas: any[] = [];
  bodega_filtrada: SelectItemGroup[] = [];
  cantidad_producto: any[] = [];
  bodega_seleccionada: any = '';

  productoDialog: boolean = false;
  verInventarioDialog: boolean = false;
  submitted: boolean = false;

  constructor(private inventarioService: InventarioService,
    protected user: AuthService,
    private messageService: MessageService,
  ) { }


  ngOnInit() {
    this.getInventario();
  }

  openBuscarProducto() {
    this.item = {};
    this.submitted = false;
    this.productoDialog = true;
  }

  openVerProducto() {
    this.verInventarioDialog = true;

  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  filtrarBodega(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.bodegas.length; i++) {
      let bodega = this.bodegas[i];
      if (String(bodega.name).toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(bodega);
      }
    }
    this.bodega_filtrada = filtered
  }

  async getInventario() {
    this.bodega_seleccionada = '';
    let dataPost = {
      store_id: 0
    }

    console.log(dataPost);


    const valid: any = await this.inventarioService.getInventario(dataPost);
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


  async getInventarioProducto() {

    let dataPost = {
      code: this.item.cantProducto
    }

    console.log(dataPost); 


    const valid: any = await this.inventarioService.getInventarioProducto(dataPost);
    console.log(valid);

    if (!valid.error) {
      this.cantidad_producto = valid.data;

      if (valid.status == 200) {
        this.productoDialog = false;
        this.openVerProducto();
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

  async getInventarioBodega() {


    let dataPost = {
      store_id: this.bodega_seleccionada.id
    }

    console.log(dataPost);


    const valid: any = await this.inventarioService.getInventarioBodega(dataPost);
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

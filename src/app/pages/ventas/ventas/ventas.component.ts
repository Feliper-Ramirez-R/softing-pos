import { Component } from '@angular/core';
import { VentasService } from './ventas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {

  fecha = new Date().toLocaleString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
  hora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hourCycle: 'h11' })

  datosDB: any[] = [];
  item: any = {};

  producto_actual: any = {};

  total: number = 0;

  constructor(private ventasService: VentasService,
    private user: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }


  ngOnInit() {

  }

  editar(producto: any) {
    producto.descuento = true;
  }

  async editar2(producto: any) {
    if (producto.price < producto.price_min) {
      this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Precio de venta no permitido!', life: 5000 });
      return
    }
    producto.descuento = false;
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.price, 0);
  }

  confirm(event: Event, producto: any) {

    this.confirmationService.confirm({
      target: event.target!,
      message: 'Desea eliminar este item?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'si',

      accept: () => {
        this.eliminar(producto);
      },
      reject: () => {

      }
    });
  }

  async eliminar(producto: any) {
    this.datosDB = this.datosDB.filter((val: any) => val.code !== producto.code);
    this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.price, 0);
  }

  async leerProducto() {

    let dataPost = {
      code: this.item.codigo,
    }

    console.log(dataPost);


    const valid: any = await this.ventasService.leerProducto(dataPost);
    console.log(valid);

    if (!valid.error) {

      this.total = await this.datosDB.reduce((acumulador, actual) => acumulador + actual.price, 0);
      if (valid.status == 200) {

        let producto = this.datosDB.filter(val => val.code == this.item.codigo);
        console.log(producto);
        console.log(valid.data[0]);

        if (producto.length >= valid.data[0].stock) {
          this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'El item '+this.item.codigo+' no cuenta con inventario!', life: 5000 });
          return
        }

        this.datosDB.push(valid.data[0]);
        this.producto_actual = valid.data[0]
        this.item = {};


        await valid.data.forEach((elem: any) => {
          elem.descuento = false
        });

      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

}

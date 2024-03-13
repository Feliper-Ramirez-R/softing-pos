import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] | undefined;
    a: boolean = false
    constructor(public appMain: AppMainComponent,
                private user:AuthService) { }

    ngOnInit() {
        /* Super_admin */
        if(this.user.user.role_id == 1){
            this.model = [
                { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
                {
                    label: 'Administrador', icon: 'pi pi-fw pi-desktop', routerLink: ['/usuarios'],
                    items: [
                        { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/pages/usuarios'] },
                        { label: 'Roles', icon: 'pi pi-fw pi-sitemap', routerLink: ['/pages/roles'] },
                        { label: 'Almacenes', icon: 'pi pi-fw pi-th-large', routerLink: ['/pages/almacenes'] },
                        { label: 'Marcas', icon: 'pi pi-fw pi-star', routerLink: ['/pages/marcas'] },
                        { label: 'Referencias', icon: 'pi pi-fw pi-compass', routerLink: ['/pages/referencias'] },
                        { label: 'Categorías', icon: 'pi pi-fw pi-table', routerLink: ['/pages/categorias'] },
                        { label: 'Proveedores', icon: 'pi pi-fw pi-user-plus', routerLink: ['/pages/proveedores'] },
    
                    ]
                },
                {
                    label: 'Inventarios', icon: 'pi pi-fw pi-box', routerLink: ['/inventario'],
                    items: [
                        { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                        { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] },
                        {
                            label: 'Movimientos', icon: 'pi pi-fw pi-clone',
                            items: [
                                { label: 'Recepción', icon: 'pi pi-fw pi-check-square', routerLink: ['/pages/recepcion'] },
                                { label: 'Salidas', icon: 'pi pi-fw pi-arrow-circle-up', routerLink: ['/pages/salidas'] },
                                { label: 'Entradas', icon: 'pi pi-fw pi-arrow-circle-down', routerLink: ['/pages/entradas'] },
                                { label: 'Ajustes', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/ajustes'] },
                            ]
                        },
                    ]
                },
                {
                    label: 'Ventas', icon: 'pi pi-fw pi-dollar', routerLink: ['/inventario'],
                    items: [
                        /* { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                        { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] }, */
                        {
                            label: 'P.D.V', icon: 'pi pi-fw pi-clone',
                            items: [
                                { label: 'Facturar', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/ventas'] },
                                { label: 'Cambios', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/cambios'] },
                                { label: 'Devoluciones', icon: 'pi pi-fw pi-arrow-down', routerLink: ['/pages/devoluciones'] },
                                { label: 'Garantías', icon: 'pi pi-fw pi-times-circle', routerLink: ['/pages/garantias'] },
                               
                            ]
                        },
                        { label: 'Historico', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/historicoVentas'] },
                    ]
                },
                {
                    label: 'Reportes', icon: 'pi pi-fw pi-file', routerLink: ['/pages/reportes']
                },
                {
                    label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/gastos']
                },
            ];
        }








        /* Admin */
     else if(this.user.user.role_id == 2)
      {
        this.model = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
            {
                label: 'Administrador', icon: 'pi pi-fw pi-desktop', routerLink: ['/usuarios'],
                items: [
                    { label: 'Marcas', icon: 'pi pi-fw pi-star', routerLink: ['/pages/marcas'] },
                    { label: 'Referencias', icon: 'pi pi-fw pi-compass', routerLink: ['/pages/referencias'] },
                    { label: 'Categorías', icon: 'pi pi-fw pi-table', routerLink: ['/pages/categorias'] },
                    { label: 'Proveedores', icon: 'pi pi-fw pi-user-plus', routerLink: ['/pages/proveedores'] },

                ]
            },
            {
                label: 'Inventarios', icon: 'pi pi-fw pi-box', routerLink: ['/usuarios'],
                items: [
                    { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] },
                    {
                        label: 'Movimientos', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Recepción', icon: 'pi pi-fw pi-check-square', routerLink: ['/pages/recepcion'] },
                            { label: 'Salidas', icon: 'pi pi-fw pi-arrow-circle-up', routerLink: ['/pages/salidas'] },
                            { label: 'Entradas', icon: 'pi pi-fw pi-arrow-circle-down', routerLink: ['/pages/entradas'] },
                            { label: 'Ajustes', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/ajustes'] }
                        ]
                    },
                ]
            },
            {
                label: 'Ventas', icon: 'pi pi-fw pi-dollar', routerLink: ['/inventario'],
                items: [
                    /* { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] }, */
                    {
                        label: 'P.D.V', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Facturar', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/ventas'] },
                            { label: 'Cambios', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/cambios'] },
                            { label: 'Devoluciones', icon: 'pi pi-fw pi-arrow-down', routerLink: ['/pages/devoluciones'] },
                            { label: 'Garantías', icon: 'pi pi-fw pi-times-circle', routerLink: ['/pages/garantias'] },
                           
                        ]
                    },
                    { label: 'Historico', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/historicoVentas'] },
                ]
            },
            {
                label: 'Reportes', icon: 'pi pi-fw pi-file', routerLink: ['/pages/reportes']
            },
            {
                label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/gastos']
            },
        ];





        /* receptor bodega a */
      }else if(this.user.user.role_id == 3)
      {
        this.model = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
            {
                label: 'Inventarios', icon: 'pi pi-fw pi-box', routerLink: ['/usuarios'],
                items: [
                    { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] },
                    {
                        label: 'Movimientos', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Recepción', icon: 'pi pi-fw pi-check-square', routerLink: ['/pages/recepcion'] },
                            { label: 'Salidas', icon: 'pi pi-fw pi-arrow-circle-up', routerLink: ['/pages/salidas'] },
                            { label: 'Entradas', icon: 'pi pi-fw pi-arrow-circle-down', routerLink: ['/pages/entradas'] },
                        ]
                    },
                ]
            },
            {
                label: 'Ventas', icon: 'pi pi-fw pi-dollar', routerLink: ['/inventario'],
                items: [
                    /* { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] }, */
                    {
                        label: 'P.D.V', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Facturar', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/ventas'] },
                           
                        ]
                    },
                    { label: 'Historico', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/historicoVentas'] },
                ]
            },
            {
                label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/gastos']
            },
        ];
      }








      /* vendedor punto de venta */
      else if(this.user.user.role_id == 4)
      {
        this.model = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
            {
                label: 'Inventarios', icon: 'pi pi-fw pi-box', routerLink: ['/usuarios'],
                items: [
                    // { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] },
                    {
                        label: 'Movimientos', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Salidas', icon: 'pi pi-fw pi-arrow-circle-up', routerLink: ['/pages/salidas'] },
                            { label: 'Entradas', icon: 'pi pi-fw pi-arrow-circle-down', routerLink: ['/pages/entradas'] },
                        ]
                    },
                ]
            },
            {
                label: 'Ventas', icon: 'pi pi-fw pi-dollar', routerLink: ['/inventario'],
                items: [
                    /* { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] }, */
                    {
                        label: 'P.D.V', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Facturar', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/ventas'] },
                            { label: 'Cambios', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/cambios'] },
                            { label: 'Devoluciones', icon: 'pi pi-fw pi-arrow-down', routerLink: ['/pages/devoluciones'] },
                            { label: 'Garantías', icon: 'pi pi-fw pi-times-circle', routerLink: ['/pages/garantias'] },
                        ]
                    },
                    { label: 'Historico', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/historicoVentas'] },
                ]
            },
            {
                label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/gastos']
            },
        ];
      }










      /* secretaria administrativa */
      else if(this.user.user.role_id == 5)
      {
        this.model = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
            {
                label: 'Inventarios', icon: 'pi pi-fw pi-box', routerLink: ['/usuarios'],
                items: [
                    // { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    // { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] },
                    {
                        label: 'Movimientos', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Salidas', icon: 'pi pi-fw pi-arrow-circle-up', routerLink: ['/pages/salidas'] },
                            { label: 'Entradas', icon: 'pi pi-fw pi-arrow-circle-down', routerLink: ['/pages/entradas'] },
                        ]
                    },
                ]
            },
            {
                label: 'Ventas', icon: 'pi pi-fw pi-dollar', routerLink: ['/inventario'],
                items: [
                    /* { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] }, */
                   /*  {
                        label: 'P.D.V', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Facturar', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/ventas'] },
                            { label: 'Cambios', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/pages/cambios'] },
                            { label: 'Devoluciones', icon: 'pi pi-fw pi-arrow-down', routerLink: ['/pages/devoluciones'] },
                            { label: 'Garantías', icon: 'pi pi-fw pi-times-circle', routerLink: ['/pages/garantias'] },
                        ]
                    }, */
                    { label: 'Historico', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/historicoVentas'] },
                ]
            },
            {
                label: 'Reportes', icon: 'pi pi-fw pi-file', routerLink: ['/pages/reportes']
            },
            {
                label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/gastos']
            },
        ];

        /* auxiliar bodega */
      }else if(this.user.user.role_id == 6)
      {
        this.model = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
            {
                label: 'Inventarios', icon: 'pi pi-fw pi-box', routerLink: ['/usuarios'],
                items: [
                    { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['/pages/inventario'] },
                    {
                        label: 'Movimientos', icon: 'pi pi-fw pi-clone',
                        items: [
                            { label: 'Salidas', icon: 'pi pi-fw pi-arrow-circle-up', routerLink: ['/pages/salidas'] },
                            { label: 'Entradas', icon: 'pi pi-fw pi-arrow-circle-down', routerLink: ['/pages/entradas'] },
                        ]
                    },
                ]
            },
            {
                label: 'Gastos', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/gastos']
            },
        ];
      }




     
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}

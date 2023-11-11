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
        if(this.user.user.role_id == 1){
            this.model = [
                { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
                {
                    label: 'Administrador', icon: 'pi pi-fw pi-desktop', routerLink: ['/usuarios'],
                    items: [
                        { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/pages/usuarios'] },
                        { label: 'Roles', icon: 'pi pi-fw pi-sitemap', routerLink: ['/pages/roles'] },
                        { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/pages/productos'] },
                        { label: 'Almacenes', icon: 'pi pi-fw pi-th-large', routerLink: ['/pages/almacenes'] },
                        { label: 'Marcas', icon: 'pi pi-fw pi-star', routerLink: ['/pages/marcas'] },
                        { label: 'Modelos', icon: 'pi pi-fw pi-compass', routerLink: ['/pages/modelos'] },
                        { label: 'Categorías', icon: 'pi pi-fw pi-table', routerLink: ['/pages/categorias'] },
    
                    ]
                },
            ];
        }
     else if(this.user.user.role_id == 2)
      {
        this.model = [
            { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
            {
                label: 'Administrador', icon: 'pi pi-fw pi-desktop', routerLink: ['/usuarios'],
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/pages/usuarios'] },
                    { label: 'Programas', icon: 'pi pi-fw pi-desktop', routerLink: ['/pages/programas'] },
                    { label: 'Grupos', icon: 'pi pi-fw pi-sitemap', routerLink: ['/pages/grupos'] },
                    { label: 'Materias', icon: 'pi pi-fw pi-book', routerLink: ['/pages/materias'] },

                ]
            },
           
        ];
      }else if(this.user.user.role_id == 4)
      {
        this.model = [
           



        ];
      }else if(this.user.user.role_id == 5)
      {
        this.model = [
           




        ];
      }

    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}

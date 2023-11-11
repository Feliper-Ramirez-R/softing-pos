import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { RolesComponent } from './admin/roles/roles.component';
import { ProductosComponent } from './admin/productos/productos.component';
import { AlmacenesComponent } from './admin/almacenes/almacenes.component';
import { MarcasComponent } from './admin/marcas/marcas.component';
import { ModelosComponent } from './admin/modelos/modelos.component';
import { CategotiasComponent } from './admin/categotias/categotias.component';






const routes: Routes = [
  { 
    path:'',
    children:[ 

        {
            path:'home',
            component: HomeComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'usuarios',
            component: UsuariosComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'roles',
            component: RolesComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'productos',
            component: ProductosComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'almacenes',
            component: AlmacenesComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'marcas',
            component: MarcasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'modelos',
            component: ModelosComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'categorias',
            component: CategotiasComponent,
            canActivate:[AuthGuard]
        }, 
        
        

        {
            path: '**',
            redirectTo: ''
        }
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

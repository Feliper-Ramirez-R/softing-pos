import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { RolesComponent } from './admin/roles/roles.component';
import { ProductosComponent } from './inventario/productos/productos.component';
import { AlmacenesComponent } from './admin/almacenes/almacenes.component';
import { MarcasComponent } from './admin/marcas/marcas.component';
import { CategotiasComponent } from './admin/categotias/categotias.component';
import { ProveedoresComponent } from './admin/proveedores/proveedores.component';
import { RecepcionComponent } from './inventario/recepcion/recepcion.component';
import { InventarioComponent } from './inventario/inventario/inventario.component';
import { SalidasComponent } from './inventario/salidas/salidas.component';
import { EntradasComponent } from './inventario/entradas/entradas.component';
import { ReferenciasComponent } from './admin/referencias/referencias.component';
import { VentasComponent } from './ventas/ventas/ventas.component';
import { HistoricoVentasComponent } from './ventas/historico-ventas/historico-ventas.component';
import { AjustesComponent } from './inventario/ajustes/ajustes.component';
import { CambiosComponent } from './ventas/cambios/cambios.component';







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
            path:'referencias',
            component: ReferenciasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'categorias',
            component: CategotiasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'proveedores',
            component: ProveedoresComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'recepcion',
            component: RecepcionComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'inventario',
            component: InventarioComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'salidas',
            component: SalidasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'entradas',
            component: EntradasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'ajustes',
            component: AjustesComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'ventas',
            component: VentasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'historicoVentas',
            component: HistoricoVentasComponent,
            canActivate:[AuthGuard]
        }, 
        {
            path:'cambios',
            component: CambiosComponent,
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

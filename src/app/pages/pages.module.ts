import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';

/* prime */
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';

/* barcode */
import { NgxBarcodeModule } from 'ngx-barcode';

/* Componentes */
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
import { CalendarModule } from 'primeng/calendar';
import { ReferenciasComponent } from './admin/referencias/referencias.component';
import { VentasComponent } from './ventas/ventas/ventas.component';
import { HistoricoVentasComponent } from './ventas/historico-ventas/historico-ventas.component';
import { AjustesComponent } from './inventario/ajustes/ajustes.component';
import { CambiosComponent } from './ventas/cambios/cambios.component';
import { ReportesComponent } from './reportes/reportes.component';






@NgModule({
  declarations: [
    HomeComponent,
    UsuariosComponent,
    RolesComponent,
    ProductosComponent,
    AlmacenesComponent,
    MarcasComponent,
    CategotiasComponent,
    ProveedoresComponent,
    RecepcionComponent,
    InventarioComponent,
    SalidasComponent,
    EntradasComponent,
    ReferenciasComponent,
    VentasComponent,
    HistoricoVentasComponent,
    AjustesComponent,
    CambiosComponent,
    ReportesComponent,
  ],
  imports: [
    PagesRoutingModule,
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    AvatarModule,
    OverlayPanelModule,
    SkeletonModule,
    SelectButtonModule,
    TooltipModule,
    ConfirmPopupModule,
    ImageModule,
    GalleriaModule,
    CarouselModule,
    ScrollTopModule,
    ScrollPanelModule,
    MenubarModule,
    PanelModule,
    PanelMenuModule,
    SplitButtonModule,
    MenuModule,
    DataViewModule,
    OrderListModule,
    PickListModule,
    InputSwitchModule,
    DividerModule,
    CheckboxModule,
    AccordionModule, 
    NgxBarcodeModule,
    AutoCompleteModule,
    TagModule,
    CalendarModule,
    FieldsetModule
  ]
})
export class PagesModule { }

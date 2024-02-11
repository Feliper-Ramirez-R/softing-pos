import {LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
// import { register } from 'swiper/element';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DockModule } from 'primeng/dock';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { ToolbarModule } from 'primeng/toolbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';

import { PickListModule } from 'primeng/picklist';




import { AppMenuComponent } from './app.menu.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppRightPanelComponent } from './app.rightpanel.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { AppFooterComponent } from './app.footer.component';
import { MenuService } from './app.menu.service';
import { AppMainComponent } from './app.main.component';
import { AppConfigComponent } from './app.config.component';
import { ConfigService } from './services/app.config.service';
import { AppMenuitemComponent } from './app.menuitem.component';
import { CalendarModule } from 'primeng/calendar';



registerLocaleData(localeEs)

// register()

@NgModule({
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppTopBarComponent,
    AppRightPanelComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
    AppMainComponent,
    AppConfigComponent,
    AppMenuitemComponent,
  ],
  imports: [
   /*  SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
    
      registrationStrategy: 'registerWhenStable:30000'
    }), */
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    DockModule,
    NgxSpinnerModule,
    ProgressSpinnerModule,
    ButtonModule,
    SidebarModule,
    MenubarModule,
    BreadcrumbModule,
    ContextMenuModule,
    MegaMenuModule,
    MenuModule,
    CheckboxModule,
    TabViewModule,
    TreeModule,
    TreeTableModule,
    ToolbarModule,
    PickListModule,
    RadioButtonModule,
    InputSwitchModule,
    CalendarModule

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' },
    MessageService,
    ConfirmationService,
    BreadcrumbService,
    MenuService,
    ConfigService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }

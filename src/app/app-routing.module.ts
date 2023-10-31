import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AppMainComponent } from './app.main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
 
  {
     path: 'auth',
     loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
   },
  {
    component:AppMainComponent,
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesModule ),
     canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

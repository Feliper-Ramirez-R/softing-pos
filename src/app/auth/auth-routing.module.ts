import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyuserComponent } from './verifyuser/verifyuser.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RegisterComponent } from './register/register.component';





const routes: Routes = [
    { 
        path:'',
        children:[
            {
                path:'login',
                component: LoginComponent
            }, 
            {
                path:'verifyuser',
                component: VerifyuserComponent
            }, 
            {
                path:'reset-password',
                component: ResetpasswordComponent
            }, 
            {
                path:'register',
                component: RegisterComponent
            }, 
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

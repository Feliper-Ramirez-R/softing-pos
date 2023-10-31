import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyuserComponent } from './verifyuser/verifyuser.component';
import { DialogModule } from 'primeng/dialog';
import { RegisterComponent } from '../auth/register/register.component';




@NgModule({
  declarations: [
    LoginComponent,
    ResetpasswordComponent,
    VerifyuserComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CheckboxModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    DialogModule
  ],
  providers: [
   
  ]
})
export class AuthModule { }

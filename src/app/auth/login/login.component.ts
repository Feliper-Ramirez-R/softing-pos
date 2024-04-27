import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  dark: boolean | undefined;
  submitted: boolean = false;
  get password() { return this.form.get('password'); }
  get email() { return this.form.get('email'); }

  /* checked: boolean | undefined; */

  form = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
  });

 

  constructor(
    private fb: FormBuilder,
    private user: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }


  async login() {

    this.submitted = true;
    if (this.form.get('email')?.hasError('email')) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ingresa un email válido!', life: 5000 }); return }
    if (this.form.invalid) { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Todos los campos son requeridos!', life: 5000 }); return }
   

    let dataPost = {
      email: this.form.get('email')?.value?.trim(),
      password: this.form.get('password')?.value?.trim(),
    };
    console.log(dataPost);

    const valid: any = await this.user.login(dataPost);
    console.log(valid)


    if (!valid.error) {
      if (valid.status == 200) {
        this.router.navigate(['/pages/home'])
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }

  }

}

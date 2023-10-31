import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResetpasswordService } from './resetpassword.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent {

  dark: boolean | undefined;
  submitted: boolean = false;
  get password() { return this.form.get('password'); }
  get email() { return this.form.get('email'); }

  form = this.fb.group({
    password: ['', [Validators.minLength(6), Validators.required]],
    password2: ['', [Validators.minLength(6), Validators.required]],
    codigo: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private resetService: ResetpasswordService
  ) { }

  async resetPassword() {
    this.submitted = true;

    if (this.form.get('password')?.value != this.form.get('password2')?.value) { this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Las contraseñas deben ser iguales!', life: 5000 }); return }
    if (this.form.invalid) { this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Todos los campos son requeridos!', life: 5000 }); return }


    let dataPost = {

      newPassword: this.form.get('password')?.value,
      code:this.form.get('codigo')?.value
    };
    console.log(dataPost);

    const valid: any = await this.resetService.resetPassword(dataPost);
    console.log(valid)


    if (!valid.error) {
      if (valid.status == 201) {
        this.router.navigate(['/auth/login'])
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error!', life: 5000 }); }
    }

  }

}

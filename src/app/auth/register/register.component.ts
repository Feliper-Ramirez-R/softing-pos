import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RegisterService } from './register.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  dark: boolean | undefined;
  submitted: boolean = false;
  get password() { return this.form.get('password'); }
  get email() { return this.form.get('email'); }
  get nombre() { return this.form.get('nombre'); }

  form = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    nombre: ['', [Validators.minLength(10), Validators.required]],
    cedula: ['', [ Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
    password2: ['', [Validators.minLength(6), Validators.required]],
  });

  constructor(private messageService: MessageService,
    private registerService: RegisterService,
    private fb: FormBuilder,
    private router:Router) { }

  ngOnInit() {
   
  }

  async register() {

    this.submitted = true;
    if (this.form.invalid ) { this.messageService.add({ severity: 'error', summary: 'Campos requeridos!', detail: 'Llena todo los campos!', life: 5000 }); return }
    if (this.form.get('password')?.value != this.form.get('password2')?.value ) { this.messageService.add({ severity: 'error', summary: 'Contraseñas !', detail: 'Las contraseñas no son iguales!', life: 5000 }); return }
    let dataPost = {
        name: this.form.get('nombre')?.value,
        email:this.form.get('email')?.value ,
        password:this.form.get('password')?.value ,
        dni:this.form.get('cedula')?.value ,
    }
    console.log(dataPost);
    const valid: any = await this.registerService.register(dataPost);
    console.log(valid)

    if (!valid.error) {
      if (valid.status == 201) {
        this.form.reset();
        this.messageService.add({ severity: 'success', summary: 'Bien!', detail: valid.message, life: 5000 });
        this.router.navigate(['/auth/login'])
       
      } else { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Ups!', detail: 'Ocurrió un error!', life: 5000 }); }
    }
  }

}

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VerifyuserService } from './verifyuser.service';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.component.html',
  styleUrls: ['./verifyuser.component.scss']
})
export class VerifyuserComponent {

  dark: boolean | undefined;
  submitted: boolean = false;
  visible: boolean = false;
  mensaje_del_dialog: string = ''

  get email() { return this.form.get('email'); }

  form = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    cedula: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private verifyService: VerifyuserService
  ) { }


  async validarDatos() {
    this.submitted = true;
    if (this.form.get('email')?.hasError('email')) { this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Ingresa un email valido!', life: 5000 }); return }
    if (this.form.invalid) { this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Todos los campos son requeridos!', life: 5000 }); return }


    let dataPost = {

      email: this.form.get('email')?.value,
      dni: this.form.get('cedula')?.value,
    };
    console.log(dataPost);

    const valid: any = await this.verifyService.validarDatos(dataPost);
    console.log(valid)


    if (!valid.error) {
      if (valid.status == 200) {
        this.mensaje_del_dialog = valid.message
        this.showDialog();
        this.form.reset();
      } else { return this.messageService.add({ severity: 'info', summary: 'Ups!', detail: valid.message, life: 5000 }); }
    } else {
      if (valid.status != 500) { return this.messageService.add({ severity: 'info', summary: 'Info!', detail: valid.error.message, life: 5000 }); }
      else { this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error!', life: 5000 }); }
    }

  }

  showDialog() {
    this.visible = true;
  }

}

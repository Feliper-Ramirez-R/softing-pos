import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rutas } from '../../../env/rutas'

@Injectable({
  providedIn: 'root'
})
export class VerifyuserService {

  prefix: string = 'auth'

  constructor(private http: HttpClient) { }

  validarDatos(dataPost: any) {
    console.log(rutas.ruta + this.prefix + '/login');

    return new Promise((resolve) => {
      this.http.post(rutas.ruta + this.prefix + '/verifyUser', dataPost).subscribe({
        next: async (answer: any) => {

          resolve(answer);
        },
        error: (error: any) => {
          console.log(<any>error);
          localStorage.clear();
          resolve(error);
        }
      });
    });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { rutas } from 'src/env/rutas';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  prefix:string = 'sales'

  constructor(private user: AuthService, private http: HttpClient) { }


  async leerProducto(dataPost:any) {

    return new Promise(resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.user.token,
      });

      this.http.post(rutas.ruta + this.prefix+'/readProduct',dataPost, { headers }).subscribe({
        next: (answer: any) => {
          resolve(answer);
        },
        error: error => {
          console.log(<any>error);
          resolve(error);
        }
      });
    });
  }


  async enviarFactura(dataPost:any) {

    return new Promise(resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.user.token,
      });

      this.http.post(rutas.ruta + this.prefix,dataPost, { headers }).subscribe({
        next: (answer: any) => {
          resolve(answer);
        },
        error: error => {
          console.log(<any>error);
          resolve(error);
        }
      });
    });
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { rutas } from 'src/env/rutas';


@Injectable({
  providedIn: 'root'
})
export class AjustesService {

  prefix:string = 'inventories'

  constructor(private user: AuthService, private http: HttpClient) { }


  async getAjustes(dataPost:any) {

    return new Promise(resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.user.token,
      });

      this.http.post(rutas.ruta + this.prefix+'/getAdjustments',dataPost, { headers }).subscribe({
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


  async ajustarInventario(dataPost:any) {

    return new Promise(resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.user.token,
      });

      this.http.post(rutas.ruta + this.prefix+'/adjustments',dataPost, { headers }).subscribe({
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

  async getAlmacenes() {

   
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.user.token,
      });

      this.http.get(rutas.ruta +'reports/sales', { headers }).subscribe({
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

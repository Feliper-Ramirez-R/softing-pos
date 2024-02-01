import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { rutas } from 'src/env/rutas';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private user: AuthService, private http: HttpClient) { }


  async getReportes(tipo:string,dataPost: any) {
  
    let api = ''

    switch (tipo) {
      case 'Ventas':
        api = 'reports/sales'
        break;
      case 'Cambios':
        api = 'reports/changes'
        break;
      default:
        api = 'reports/inventories'
        break;
    }

    return new Promise(resolve => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.user.token,
      });

      this.http.post(rutas.ruta + api, dataPost,{ headers }).subscribe({
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

import { Injectable } from '@angular/core';
import { rutas } from '../../env/rutas'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  prefix: string = 'auth'

  user: any = {}
  // permissions: any = [];
  get token() { return localStorage.getItem('token') }

  constructor(private http: HttpClient, private router: Router) { }

  login(dataPost: any) {
    console.log(rutas.ruta + this.prefix + '/login');

    return new Promise((resolve) => {
      this.http.post(rutas.ruta + this.prefix + '/login', dataPost).subscribe({
        next: async (answer: any) => {

          await localStorage.setItem('token', answer['token']);

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

  async validaToken(): Promise<boolean> {

    if (!this.token) {

      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      });

      this.http.get(rutas.ruta + 'auth/me', { headers }).subscribe({
        next: (resp: any) => {
          console.log(resp, 'aca, aca')
          if (resp) {
            this.user = resp.user;
            // this.permissions = resp.permissions
            resolve(true);
          } else {
            this.router.navigate(['/auth/login']);
            resolve(false);
          }
        },
        error: async (error) => {
          console.log(<any>error);
          localStorage.clear();
          this.router.navigate(['/auth/login']);
          resolve(false);
        }
      });
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}

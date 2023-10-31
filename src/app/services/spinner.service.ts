import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinnerService: NgxSpinnerService) { }
  public llamarspinner() {
    this.spinnerService.show();
  }
  detenerspinner(){ 
      this.spinnerService.hide();
   

  }
}

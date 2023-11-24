import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
			<div class="logo-text">
				<img src="assets/images/logo.png" style="border-radius: 50%;" />
				<div class="text">
					<h1>Softing-pos</h1>
					<span>Powered by Softingdev - {{fecha | date:'yyyy'}}</span>
				</div>
			</div>
			<div class="icons">
				<!-- <div class="icon icon-hastag">
					<i class="pi pi-facebook"></i>
				</div>
				<div class="icon icon-twitter">
					<i class="pi pi-instagram"></i>
				</div> -->
				<div class="icon icon-prime" (click)="whatsapp()" >
					<i class="pi pi-whatsapp"></i>
				</div>
			</div>
        </div>
    `
})
export class AppFooterComponent {

	fecha:any = new Date();

	whatsapp() {

		location.href = 'whatsapp://send?text=Hola, quiero información sobre Softingdev&phone=+573216201657'
	  }

}

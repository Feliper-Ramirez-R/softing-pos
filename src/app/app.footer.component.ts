import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
			<div class="logo-text">
				<!-- <img src="assets/images/Edu-Logo.png" alt="mirage-layout" /> -->
				<div class="text">
					<h1>Softing-pos</h1>
					<span>Powered by Softingdev - {{fecha | date:'yyyy'}}</span>
				</div>
			</div>
			<div class="icons">
				<div class="icon icon-hastag">
					<i class="pi pi-facebook"></i>
				</div>
				<div class="icon icon-twitter">
					<i class="pi pi-instagram"></i>
				</div>
				<div class="icon icon-prime">
					<i class="pi pi-whatsapp"></i>
				</div>
			</div>
        </div>
    `
})
export class AppFooterComponent {

	fecha:any = new Date();

}

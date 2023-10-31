import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'edusoft';
  horizontalMenu: boolean | undefined;

  darkMode = false;

  menuColorMode = 'light';

  menuColor = 'layout-menu-light';

  themeColor = 'blue';

  layoutColor = 'blue';

  ripple = true;

  inputStyle:any = 'outlined';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
      this.primengConfig.ripple = true;
  }
}

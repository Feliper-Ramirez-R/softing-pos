import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/* import { AppConfig } from '../domain/appconfig'; */

@Injectable()
export class ConfigService {

    config: any = {
        theme: 'lara-light-indigo',
        dark: false,
        inputStyle: 'outlined',
        ripple: true
    };

    private configUpdate = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    updateConfig(config: any) {
        this.config = config;
        this.configUpdate.next(config);
    }

    getConfig() {
        return this.config;
    }
}

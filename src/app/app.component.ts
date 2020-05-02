import { Component } from '@angular/core';
import { ConfigService } from './services/config.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private conf: ConfigService) { }

  title = 'sphinx-desktop';

  async test() {
    console.log('clicked test');
    const url = '/member';
    // const test = await this.rest.httpGet(url);
    // console.log(test);
    // const email = this.conf.getEmail();
    const config = await this.conf.getConfig();
    console.log(config);
  }
}

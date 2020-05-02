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
    console.log('test');
  }
}

import { Component } from '@angular/core';
import { ConfigService } from './services/config.service';
import { KeychainService } from './services/keychain.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private conf: ConfigService, private keychain: KeychainService) { }

  title = 'sphinx-desktop';

  async test() {
    // tests
  }
}

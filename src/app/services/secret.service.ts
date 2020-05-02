import { Injectable, Injector } from '@angular/core';
import { RestService } from './rest.service';
import { UserService } from './user.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  constructor(private injector: Injector) { }

  private restService = this.injector.get(RestService);
  private userService = this.injector.get(UserService);
  private cryptoService = this.injector.get(CryptoService);

  async getAllSecrets(): Promise<any> {
    const user = await this.userService.getUserInfo();
    const secrets = user.receivedSecrets;
    for (let secret of secrets) {
      secret.ttl = await this.calculateTimeLeft(secret.createdAt, secret.ttl);
    }
    return secrets;
  }

  async createSecret(secretObj: any): Promise<object> {
    const publicKey = await this.userService.getPublicKeyByEmail(secretObj.recipientEmail);
    const cipher = await this.cryptoService.encrypt(secretObj.secret, publicKey);
    secretObj.secret = cipher;
    const secret = await this.restService.httpPost('/secret', secretObj);
    return secret;
  }

  async readSecret(secret: object): Promise<boolean> {

    return true;
  }

  async calculateTimeLeft(createdAt: string, ttl: number): Promise<number> {
    const currentTime = Date.now();
    const diff = currentTime - Date.parse(createdAt);
    const diffDate = new Date(diff);
    const age = diffDate.getUTCHours();
    return (24 * ttl - age);
  }

}

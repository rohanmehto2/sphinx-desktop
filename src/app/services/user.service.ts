import { Injectable, Injector } from '@angular/core';
import { RestService } from './rest.service';
import { ConfigService } from './config.service';
// import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private injector: Injector) { }

  private restService = this.injector.get(RestService);
  private configService = this.injector.get(ConfigService);
  // private cryptoService = this.injector.get(CryptoService);

  async listUsers(): Promise<any> {
    const users = await this.restService.httpGet('/member');
    return users.members;
  }

  async updateUser(data: object): Promise<boolean> {
    // const user = await this.getUserInfo();
    const email = await this.configService.getEmail();
    await this.restService.httpPut('/member', email, data);
    return true;
  }

  async getUserInfo(): Promise<any> {
    const email = await this.configService.getEmail();
    const user = await this.restService.httpGet('/member', email);
    return user.member;
  }

  async setUserConf(baseApi: string, email: string = ''): Promise<boolean> {
    this.configService.setBaseApi(baseApi);
    this.configService.setEmail(email);
    return true;
  }

  // async setUpKeys(): Promise<void> {
  //   const user = await this.getUserInfo();
  //   const publicKey = await this.cryptoService.generateKeyPair(user.name, user.email);
  //   await this.restService.httpPut('/member', user.email, { publicKey });
  // }

  // async cleanUpKeys(): Promise<void> {
  //   const user = await this.getUserInfo();
  //   await this.cryptoService.deleteKeyPair();
  //   await this.restService.httpPut('/member', user.email, { publicKey: null });
  // }

  async getPublicKeyByEmail(email: string): Promise<string> {
    const user = await this.restService.httpGet('/member', email);
    return user.member;
  }

}

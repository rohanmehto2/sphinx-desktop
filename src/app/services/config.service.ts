import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private ipc: IpcRenderer;

  constructor() {
    this.ipc = window.require('electron').ipcRenderer;
    if ((window as any).require) {
      try {
        this.ipc = (window as any).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  async getConfig() {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getConfigResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getConfig');
    });
  }

  // getEmail(): string {
  //   return conf.get('sphinx.email');
  // }

  // getBaseApi(): string {
  //   return conf.get('sphinx.baseApi');
  // }

  // getJwtPublicKey(): string {
  //   return conf.get('sphinx.jwtPublicKey');
  // }

  // setEmail(email: string): void {
  //   conf.set('sphinx.email', email);
  // }

  // setBaseApi(api: string): void {
  //   conf.set('sphinx.baseApi', api);
  // }

  // setJwtPublicKey(jwtPk: string): void {
  //   conf.set('sphinx.jwtPublicKey', jwtPk);
  // }

  // async isConfigured(): Promise<boolean> {
  //   if (this.getBaseApi() == null) {
  //     return false;
  //   }
  //   return true;
  // }
}

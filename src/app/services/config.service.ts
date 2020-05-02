import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private ipc: IpcRenderer;
  private config;

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

  private async getConfigIPC() {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getConfigResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getConfig');
    });
  }

  private async getConfigProperty(property: string): Promise<string> {
    if (this.config == null) {
      this.config = await this.getConfigIPC();
    }
    return this.config[property];
  }

  async getEmail(): Promise<string> {
    return await this.getConfigProperty('email');
  }

  async getBaseApi(): Promise<string> {
    return await this.getConfigProperty('baseApi');
  }

  async getJwtPublicKey(): Promise<string> {
    return await this.getConfigProperty('jwtPublicKey');
  }

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

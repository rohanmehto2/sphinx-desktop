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
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('getConfigResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getConfig');
    });
  }

  private async setConfigIPC(config: any) {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('setConfigResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('setConfig', config);
    });
  }

  private async getConfigProperty(property: string): Promise<string> {
    if (this.config == null) {
      this.config = await this.getConfigIPC();
    }
    return this.config[property];
  }

  private async setConfigProperty(property: string, value: string): Promise<any> {
    if (this.config == null) {
      this.config = await this.getConfigIPC();
    }
    let config = this.config;
    config[property] = value;
    config = await this.setConfigIPC(config);
    this.config = config;
    return config[property];
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

  async setEmail(email: string): Promise<string> {
    const updatedEmail = await this.setConfigProperty('email', email);
    return updatedEmail;
  }

  async setBaseApi(api: string): Promise<string> {
    const updatedApi = await this.setConfigProperty('baseApi', api);
    return updatedApi;
  }

  async setJwtPublicKey(jwtPk: string): Promise<void> {
    const updatedJwtPk = await this.setConfigProperty('jwtPublicKey', jwtPk);
    return updatedJwtPk;
  }

  async isConfigured(): Promise<boolean> {
    if (await this.getBaseApi() == null) {
      return false;
    }
    return true;
  }
}

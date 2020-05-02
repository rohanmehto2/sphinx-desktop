import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class KeychainService {
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

  private async getKeychainSecretIPC(name: string) {
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('getKeychainSecretResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getKeychainSecret', name);
    });
  }

  private async setKeychainSecretIPC(secret: any) {
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('setKeychainSecretResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('setKeychainSecret', secret);
    });
  }

  async getAccessToken(): Promise<string> {
    return await this.getKeychainSecretIPC('sphinxDesktopAccessToken');
  }

  async getRefreshToken(): Promise<string> {
    return await this.getKeychainSecretIPC('sphinxDesktopRefreshToken');
  }

  async getKey(): Promise<string> {
    return await this.getKeychainSecretIPC('sphinxDesktopKey');
  }

  async getPassphrase(): Promise<string> {
    return await this.getKeychainSecretIPC('sphinxDesktopPassphrase');
  }

  async setAccessToken(value: string): Promise<string> {
    const secret = {
      name: 'sphinxDesktopAccessToken',
      value
    };
    return await this.setKeychainSecretIPC(secret);
  }

  async setRefreshToken(value: string): Promise<string> {
    const secret = {
      name: 'sphinxDesktopRefreshToken',
      value
    };
    return await this.setKeychainSecretIPC(secret);
  }

  async setKey(value: string): Promise<string> {
    const secret = {
      name: 'sphinxDesktopKey',
      value
    };
    return await this.setKeychainSecretIPC(secret);
  }

  async setPassphrase(value: string): Promise<string> {
    const secret = {
      name: 'sphinxDesktopPassphrase',
      value
    };
    return await this.setKeychainSecretIPC(secret);
  }

}

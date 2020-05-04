import { Injectable, Injector } from '@angular/core';
import { KeychainService } from './keychain.service';
// const openpgp = require('openpgp');
// const password = require('secure-random-password');
import * as openpgp from 'openpgp';
import * as password from 'secure-random-password';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(private injector: Injector) { }

  private keychainService = this.injector.get(KeychainService);

  async encrypt(plaintext: string, publicKeyArmored: string): Promise<string> {
    const { data: encrypted } = await openpgp.encrypt({
      message: openpgp.message.fromText(plaintext),
      publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
      // TODO: add signing with private key
      // privateKeys: [privateKey]
    });
    return encrypted;
  }

  async decrypt(ciphertext: string, publicKeyArmored: string): Promise<string> {
    const privateKeyArmored = await this.keychainService.getKey();
    const passphrase = await this.keychainService.getPassphrase();
    const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);

    const { data: decrypted } = await openpgp.decrypt({
      message: await openpgp.message.readArmored(ciphertext),
      // TODO: verify signature
      publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
      privateKeys: [privateKey]
    });
    return decrypted;
  }

  async generateKeyPair(name: string, email: string): Promise<string> {
    const passphrase = password.randomString({ length: 512 });
    const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
      userIds: [{ name, email }],
      curve: 'ed25519',
      passphrase
    });
    await this.keychainService.setKey(privateKeyArmored);
    await this.keychainService.setPassphrase(passphrase);
    return publicKeyArmored;
  }

  async deleteKeyPair(): Promise<void> {
    await this.keychainService.deleteKey();
    await this.keychainService.deletePassphrase();
  }

  async keyExists(): Promise<boolean> {
    const key = await this.keychainService.getKey();
    if (key != null) {
      return true;
    }
    return false;
  }

}

import { Injectable, Injector } from '@angular/core';
import { RestService } from './rest.service';
import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { CryptoService } from './crypto.service';
import { KeychainService } from './keychain.service';
import { verify } from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private injector: Injector) { }

  private restService = this.injector.get(RestService);
  private configService = this.injector.get(ConfigService);
  private cryptoService = this.injector.get(CryptoService);
  private userService = this.injector.get(UserService);
  private keychainService = this.injector.get(KeychainService);

  async login(credentials: any): Promise<boolean> {
    const tokens = await this.restService.httpPost('/login', credentials);
    if (tokens == null) { return false; }
    await this.configService.setJwtPublicKey(tokens.jwtPublicKey);
    await this.setRefreshToken(tokens.refreshToken);
    await this.setAccessToken(tokens.accessToken);
    if (!(await this.cryptoService.keyExists())) {
      await this.userService.setUpKeys();
    }
    return true;
  }

  async logout(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    await this.restService.httpPost('/logout', { refreshToken });
    await this.userService.cleanUpKeys();
    await this.deleteRefreshToken();
    await this.deleteAccessToken();
  }

  async getAccessToken(): Promise<string> {
    return await this.keychainService.getAccessToken();
  }

  async getRefreshToken(): Promise<string> {
    return await this.keychainService.getRefreshToken();
  }

  async setAccessToken(token: string): Promise<void> {
    await this.keychainService.setAccessToken(token);
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.keychainService.setRefreshToken(token);
  }

  async deleteAccessToken(): Promise<void> {
    await this.keychainService.deleteAccessToken();
  }

  async deleteRefreshToken(): Promise<void> {
    await this.keychainService.deleteRefreshToken();
  }

  async fetchAccessToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      const token = await this.restService.httpPost('/token', { refreshToken });
      await this.setAccessToken(token.accessToken);
      return true;
    } catch (err) {
      if (err.message === 'refreshTokenExpired') {
        await this.logout();
        console.log('LOGGED_OUT');
      }
      return false;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      if (await this.getAccessToken() == null) {
        console.log('LOGIN_REQ');
        return false;
      }
      const publicKey = Buffer.from(await this.configService.getJwtPublicKey(), 'utf8');
      const accessToken = await this.getAccessToken();
      const payload = await verify(accessToken, publicKey);
      return true;
    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        const tokenUpdated = await this.fetchAccessToken();
        if (!tokenUpdated) {
          return false;
        }
        return await this.isLoggedIn();
      }
      console.log('NOT_LOGGED_IN');
      return false;
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    try {
      const verified = await this.restService.httpPost('/verify', { password });
      if (verified) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}

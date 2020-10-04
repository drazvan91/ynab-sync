import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { AccountModel } from './models';

const { Storage } = Plugins;

@Injectable()
export class AccountRepository {
  private STORAGE_KEY = 'ACCOUNTS';
  constructor() {}

  public async getAll(): Promise<AccountModel[]> {
    const result = await Storage.get({ key: this.STORAGE_KEY });
    if (!result?.value) {
      return [];
    }

    return JSON.parse(result.value);
  }

  public async setAll(accounts: AccountModel[]) {
    await Storage.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(accounts),
    });
  }
}

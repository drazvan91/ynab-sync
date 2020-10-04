import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { PayeeModel } from './models';

const { Storage } = Plugins;

@Injectable()
export class PayeeRepository {
  private STORAGE_KEY = 'PAYEES';
  constructor() {}

  public async getAll(): Promise<PayeeModel[]> {
    const result = await Storage.get({ key: this.STORAGE_KEY });
    if (!result?.value) {
      return [];
    }

    return JSON.parse(result.value);
  }

  public async getById(payeeId: string) {
    const all = await this.getAll();
    return all.find((p) => p.id === payeeId);
  }

  public async setAll(payees: PayeeModel[]) {
    await Storage.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(payees),
    });
  }
}

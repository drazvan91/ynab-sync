import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable()
export class ConfigRepository {
  private TOKEN_KEY = 'TOKEN';
  private START_DATE_KEY = 'START_DATE';

  public async getToken(): Promise<string | undefined> {
    const result = await Storage.get({ key: this.TOKEN_KEY });
    return result?.value || undefined;
  }

  public async setToken(token: string) {
    await Storage.set({
      key: this.TOKEN_KEY,
      value: token,
    });
  }

  public async getStartDate(): Promise<Date | undefined> {
    const result = await Storage.get({ key: this.START_DATE_KEY });
    if (!result?.value) {
      return undefined;
    }

    return new Date(result.value);
  }

  public async setStartDate(startDate: Date) {
    await Storage.set({
      key: this.START_DATE_KEY,
      value: startDate.toString(),
    });
  }
}

import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { mockedData } from './sms-reader-mocked-data';

export interface SmsModel {
  _id: number;
  thread_id: number;
  address: string;
  body: string;
  date: number;
}

@Injectable()
export class SmsReaderService {
  public async read(
    from: string,
    skip: number,
    take: number
  ): Promise<SmsModel[]> {
    if (true) {
      return mockedData;
    }

    await this.requestPermission();
    if (!window['SMS']) {
      return Promise.reject('SMS cordova plugin is not available');
    }

    const promise = new Promise<SmsModel[]>((resolve, reject) => {
      const filter = {
        box: 'inbox',
        // address: from,
        indexFrom: skip,
        maxCount: take,
      };

      window['SMS'].listSMS(filter, resolve, reject);
    });

    return await promise;
  }

  private async requestPermission() {
    const result = await Diagnostic.getPermissionAuthorizationStatus(
      Diagnostic.permission.READ_SMS
    );
    console.log(result);

    if (result === Diagnostic.permissionStatus.GRANTED) {
      return;
    }

    Diagnostic.requestRuntimePermission(Diagnostic.permission.READ_SMS).then(
      (data) => {
        console.log(`getCameraAuthorizationStatus`);
        console.log(data);
      }
    );
  }
}

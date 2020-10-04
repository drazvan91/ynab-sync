import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { isAfter, isBefore } from 'date-fns';
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
    if (false) {
      return mockedData;
    }

    await this.requestPermission();
    if (!window['SMS']) {
      return Promise.reject('SMS cordova plugin is not available');
    }

    const promise = new Promise<SmsModel[]>((resolve, reject) => {
      const filter = {
        // box: 'inbox',
        // address: from,
        indexFrom: skip,
        maxCount: take,
      };

      window['SMS'].listSMS(filter, resolve, reject);
    });

    return await promise;
  }

  public async readUntil(date: Date): Promise<SmsModel[]> {
    let smsList: SmsModel[] = [];
    const PAGE_SIZE = 10;
    let pageStart = 0;
    while (true) {
      const page = await this.read(undefined, pageStart, PAGE_SIZE);
      smsList = [...smsList, ...page.filter((p) => isAfter(p.date, date))];
      console.log('page', pageStart, page);

      if (page.find((p) => isBefore(p.date, date)) || page.length === 0) {
        break;
      }
      pageStart += PAGE_SIZE;
    }

    return smsList;
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

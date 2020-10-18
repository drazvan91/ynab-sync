import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import 'capacitor-sms-reader';
import { isAfter, isBefore } from 'date-fns';
import { mockedData } from './sms-reader-mocked-data';
import { slice } from 'lodash';

const { SmsReader } = Plugins;

export interface SmsModel {
  id: number;
  threadId: number;
  address: string;
  body: string;
  date: number;
}

@Injectable()
export class SmsReaderService {
  public async read(
    from: string,
    skip: number,
    take: number,
  ): Promise<SmsModel[]> {
    if (false) {
      return slice(mockedData, skip, skip + take);
    }

    const result = await SmsReader.read({ skip, take });
    return result.items;
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
}

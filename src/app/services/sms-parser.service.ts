import { Injectable } from '@angular/core';
import { SmsModel } from './sms-reader.service';
import { ParsedSms } from './sms.service';
import { parse } from 'date-fns';
@Injectable()
export class SmsParserService {
  public parse(smsList: SmsModel[]): ParsedSms[] {
    console.log(smsList);

    const parsed = smsList.map<ParsedSms | undefined>((sms) => {
      const result = this.parseSmsBody(sms.body);
      if (!result) return undefined;

      return {
        account: result.card,
        amount: parseFloat(result.amount),
        date: new Date(sms.date),
        payee: result.payee,
        smsId: `${sms.thread_id}-${sms._id}`,
      };
    });

    return parsed.filter((s) => s !== undefined);
  }

  private parseSmsBody(body: string) {
    const regex = /Suma (?<amount>[0-9.]+) (?<currency>EUR|RON|USD).* Card nr. (?<card>[\*0-9]+).* (?<date>\d\d\.\d\d\.\d\d \d\d:\d\d).*Comerciant: (?<payee>.*)/;

    const result = body.match(regex);
    console.log(result);
    if (!result) return undefined;

    return result.groups;
  }
}

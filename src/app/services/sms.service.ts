import { Injectable } from '@angular/core';
import { getUnixTime } from 'date-fns';
import { AccountRepository } from '../database/repositories/account.repository';
import { TransactionStatus } from '../database/models';
import { TransactionDbModel } from '../database/models/db-context';
import { SmsParserService } from './sms-parser.service';
import { SmsReaderService } from './sms-reader.service';
import {
  ConfigRepository,
  PayeeRepository,
  TransactionRepository,
} from '../database/repositories';

export interface ParsedSms {
  smsId: string;
  amount: number;
  account: string;
  payee: string;
  date: Date;
  currency: string;
}

@Injectable()
export class SmsService {
  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
    private payeeRepo: PayeeRepository,
    private smsReader: SmsReaderService,
    private smsParser: SmsParserService,
    private configRepo: ConfigRepository,
  ) {}

  public async importSmsList() {
    const startDate = (await this.configRepo.getStartDate()) || new Date();
    const rawSmsList = await this.smsReader.readUntil(startDate);
    const parsedSmsList = this.smsParser.parse(rawSmsList);

    const transactions = await this.transactionRepo.getAll();
    const newSmses = parsedSmsList.filter(
      (sms) => transactions.find((t) => t.smsId === sms.smsId) === undefined,
    );

    const accounts = await this.accountRepo.getAll();
    const payees = await this.payeeRepo.getAll();

    const newTransactions = newSmses.map<TransactionDbModel>((sms) => {
      const account = accounts.find(
        (a) => a.mappedNames.indexOf(sms.account) >= 0,
      );
      const payee = payees.find((p) => p.mappedNames.indexOf(sms.payee) >= 0);
      const status = TransactionStatus.New;

      return {
        id: sms.smsId,
        amount: sms.amount,
        currency: sms.currency,
        dateUnix: getUnixTime(sms.date),
        rawAccount: sms.account,
        rawPayee: sms.payee,
        smsId: sms.smsId,
        accountId: account?.id,
        payeeId: payee?.id,
        status,
      } as TransactionDbModel;
    });

    const result = await this.transactionRepo.bulkInsert(newTransactions);
    return result.success;
  }
}

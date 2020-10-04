import { Injectable } from '@angular/core';
import { AccountRepository } from '../database/account.repository';
import { TransactionModel, TransactionStatus } from '../database/models';
import { PayeeRepository } from '../database/payee.repository';
import { TransactionRepository } from '../database/transaction.repository';
import { SmsParserService } from './sms-parser.service';
import { SmsReaderService } from './sms-reader.service';

export interface ParsedSms {
  smsId: string;
  amount: number;
  account: string;
  payee: string;
  date: Date;
}

@Injectable()
export class SmsService {
  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
    private payeeRepo: PayeeRepository,
    private smsReader: SmsReaderService,
    private smsParser: SmsParserService
  ) {}

  public async importSmsList() {
    const rawSmsList = await this.smsReader.read('BT Carduri', 0, 10);
    const parsedSmsList = this.smsParser.parse(rawSmsList);

    console.table(parsedSmsList);

    const transactions = await this.transactionRepo.getAll();
    const newSmses = parsedSmsList.filter(
      (sms) => transactions.find((t) => t.smsId === sms.smsId) === undefined
    );

    const accounts = await this.accountRepo.getAll();
    const payees = await this.payeeRepo.getAll();

    const newTransactions = newSmses.map<TransactionModel>((sms) => {
      const account = accounts.find(
        (a) => a.mappedNames.indexOf(sms.account) >= 0
      );
      const payee = payees.find((p) => p.mappedNames.indexOf(sms.payee) >= 0);
      const status =
        account && payee ? TransactionStatus.Ready : TransactionStatus.NotReady;
      return {
        id: sms.smsId,
        amount: sms.amount,
        date: sms.date,
        rawAccount: sms.account,
        rawPayee: sms.payee,
        smsId: sms.smsId,
        account,
        payee,
        status,
      };
    });
    await this.transactionRepo.bulkInsert(newTransactions);
  }
}

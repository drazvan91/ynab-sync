import { Injectable } from '@angular/core';
import { AccountRepository } from '../database/account.repository';
import { TransactionModel, TransactionStatus } from '../database/models';
import { PayeeRepository } from '../database/payee.repository';
import { TransactionRepository } from '../database/transaction.repository';

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
    private payeeRepo: PayeeRepository
  ) {}

  private getParsedSmsList(): ParsedSms[] {
    return [
      {
        smsId: '3',
        amount: 23.0,
        account: '****6747',
        payee: 'CARTOFISERIE VIVO',
        date: new Date('2020.10.05 10:10'),
      },
      {
        smsId: '4',
        amount: 1.0,
        account: '****6747',
        payee: 'AMERICAN',
        date: new Date('2020.10.06 10:10'),
      },
    ];
  }

  public async importSmsList() {
    const smsList = this.getParsedSmsList();
    const transactions = await this.transactionRepo.getAll();
    const newSmses = smsList.filter(
      (sms) => transactions.find((t) => t.smsId === sms.smsId) === undefined
    );

    const accounts = await this.accountRepo.getAll();
    const payees = await this.payeeRepo.getAll();

    const newTransactions = newSmses.map<TransactionModel>((sms) => {
      const account = accounts.find((a) => a.mappedName === sms.account);
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

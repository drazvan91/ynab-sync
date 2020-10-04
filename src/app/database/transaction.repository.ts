import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { parse } from 'date-fns';
import { AccountRepository } from './account.repository';
import { TransactionModel, TransactionStatus } from './models';
import { PayeeRepository } from './payee.repository';

const { Storage } = Plugins;

interface TransactionDbModel {
  id: string;
  smsId: string;
  amount: number;
  date: Date;
  rawAccount: string;
  accountId?: string;
  rawPayee: string;
  payeeId?: string;
  status: number;
}

@Injectable()
export class TransactionRepository {
  private STORAGE_KEY = 'TRANSACTIONS';
  constructor(
    private payeeRepo: PayeeRepository,
    private accountRepo: AccountRepository
  ) {}

  public async getAll(): Promise<TransactionModel[]> {
    const result = await Storage.get({ key: this.STORAGE_KEY });
    if (!result?.value) {
      return [];
    }

    const payees = await this.payeeRepo.getAll();
    const accounts = await this.accountRepo.getAll();

    const dbModels = JSON.parse(result.value) as Array<TransactionDbModel>;
    return dbModels.map((model) => {
      return {
        ...model,
        date: new Date(model.date),
        account: accounts.find((a) => a.id === model.accountId),
        payee: payees.find((p) => p.id === model.payeeId),
      };
    });
  }

  public async getById(transactionId: string): Promise<TransactionModel> {
    const all = await this.getAll();
    return all.find((t) => t.id === transactionId);
  }

  public async setAll(transactions: TransactionModel[]) {
    const dbModels = transactions.map<TransactionDbModel>((t) => {
      let status = t.status;
      if (status === TransactionStatus.NotReady) {
        if (t.account && t.payee) {
          status = TransactionStatus.Ready;
        }
      }

      return {
        ...t,
        accountId: t.account?.id,
        payeeId: t.payee?.id,
        status,
      };
    });

    await Storage.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(dbModels),
    });
  }

  public async bulkInsert(newTransactions: TransactionModel[]) {
    const existing = await this.getAll();
    const newArray = [...existing, ...newTransactions];
    await this.setAll(newArray);
  }

  public async save(transaction: TransactionModel) {
    const all = await this.getAll();
    const index = all.findIndex((t) => t.id === transaction.id);
    if (index < 0) return;

    all[index] = transaction;

    await this.setAll(all);
  }
}

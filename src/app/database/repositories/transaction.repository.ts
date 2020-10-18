import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database.provider';
import { TransactionDbModel, TransactionStatus } from '../models';

@Injectable()
export class TransactionRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public getAll$() {
    return this.dbProvider.get().transactions.find().$;
  }

  public async getAll(): Promise<TransactionDbModel[]> {
    return await this.dbProvider.get().transactions.find().exec();
  }

  public async getReadyToSync(): Promise<TransactionDbModel[]> {
    return await this.dbProvider
      .get()
      .transactions.find({
        selector: {
          accountId: { $exists: true },
          payeeId: { $exists: true },
          status: TransactionStatus.New,
        },
      })
      .exec();
  }

  public getById$(transactionId: string) {
    return this.dbProvider.get().transactions.findOne(transactionId).$;
  }

  public async bulkInsert(newTransactions: TransactionDbModel[]) {
    await this.dbProvider.get().transactions.bulkInsert(newTransactions);
  }

  public async updateAccountForTransaction(id: string, accountId: string) {
    await this.dbProvider
      .get()
      .transactions.findOne(id)
      .update({
        $set: {
          accountId: accountId,
        },
      });
  }

  public async updatePayeeForTransaction(id: string, payeeId: string) {
    await this.dbProvider
      .get()
      .transactions.findOne(id)
      .update({
        $set: {
          payeeId: payeeId,
        },
      });
  }

  public async autoFillAccountId(rawAccountName: string, accountId: string) {
    const transactions = await this.dbProvider
      .get()
      .transactions.find({
        selector: {
          rawAccount: { $eq: rawAccountName },
          accountId: { $exists: false },
        },
      })
      .update({
        $set: {
          accountId: accountId,
        },
      });

    console.log('Autofilled transactions: ', transactions);
  }

  public async autoFillPayeeId(rawPayeeName: string, payeeId: string) {
    const transactions = await this.dbProvider
      .get()
      .transactions.find({
        selector: {
          rawPayee: { $eq: rawPayeeName },
          payeeId: { $exists: false },
        },
      })
      .update({
        $set: {
          payeeId: payeeId,
        },
      });

    console.log('Autofilled transactions: ', transactions);
  }

  public async bulkSetStatus(
    transactionIds: string[],
    status: TransactionStatus,
  ) {
    await this.dbProvider
      .get()
      .transactions.find()
      .where('id')
      .in(transactionIds)
      .update({
        $set: {
          status: status,
        },
      });
  }
}

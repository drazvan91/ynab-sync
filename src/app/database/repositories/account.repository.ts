import { Injectable } from '@angular/core';
import { RxDocument } from 'rxdb';
import { DatabaseProvider } from '../database.provider';
import { AccountDbModel } from '../models';

@Injectable()
export class AccountRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public getAll$() {
    return this.dbProvider.get().accounts.find().$;
  }

  public async getAll() {
    return await this.dbProvider.get().accounts.find().exec();
  }

  public async addNameMapping(rawAccountName: string, accountId: string) {
    const assigned = await this.dbProvider
      .get()
      .accounts.find({
        selector: {
          mappedNames: {
            $elemMatch: rawAccountName,
          },
        },
      })
      .exec();

    for (const account of assigned) {
      await account.update({
        $set: {
          mappedNames: account.mappedNames.filter((n) => n !== rawAccountName),
        },
      });
    }

    const newAssigned = await this.dbProvider
      .get()
      .accounts.findOne(accountId)
      .exec();
    await newAssigned.update({
      $set: {
        mappedNames: [...newAssigned.mappedNames, rawAccountName],
      },
    });
  }

  public async syncAccounts(accounts: AccountDbModel[]) {
    const accountIds = accounts.map((a) => a.id);

    const removed = await this.dbProvider
      .get()
      .accounts.find()
      .where('id')
      .nin(accountIds)
      .remove();

    const updated = new Array<RxDocument<AccountDbModel>>();
    const inserted = new Array<RxDocument<AccountDbModel>>();

    const existingAccounts = await this.dbProvider.get().accounts.find().exec();
    for (const account of accounts) {
      const existing = existingAccounts.find((a) => a.id === account.id);
      if (!existing) {
        const newAccount = await this.dbProvider.get().accounts.insert({
          id: account.id,
          name: account.name,
          mappedNames: [],
        });
        inserted.push(newAccount);
      } else {
        if (existing.name !== account.name) {
          existing.update({
            $set: {
              name: account.name,
            },
          });
          updated.push(existing);
        }
      }
    }

    return { inserted, updated, removed };
  }
}

import { Injectable } from '@angular/core';
import { RxDocument } from 'rxdb';
import { DatabaseProvider } from '../database.provider';
import { PayeeDbModel } from '../models';

@Injectable()
export class PayeeRepository {
  constructor(private dbProvider: DatabaseProvider) {}

  public getAll$() {
    return this.dbProvider.get().payees.find().$;
  }

  public getAll() {
    return this.dbProvider.get().payees.find().exec();
  }

  public getById$(payeeId: string) {
    return this.dbProvider.get().payees.findOne(payeeId).$;
  }

  public async addNameMapping(rawPayeeName: string, payeeId: string) {
    const assigned = await this.dbProvider
      .get()
      .payees.find({
        selector: {
          mappedNames: {
            $elemMatch: rawPayeeName,
          },
        },
      })
      .exec();

    for (const account of assigned) {
      await account.update({
        $set: {
          mappedNames: account.mappedNames.filter((n) => n !== rawPayeeName),
        },
      });
    }

    const newAssigned = await this.dbProvider
      .get()
      .payees.findOne(payeeId)
      .exec();
    await newAssigned.update({
      $set: {
        mappedNames: [...newAssigned.mappedNames, rawPayeeName],
      },
    });
  }

  public async syncPayees(payees: PayeeDbModel[]) {
    const payeeIds = payees.map((a) => a.id);

    const deleted = await this.dbProvider
      .get()
      .payees.find()
      .where('id')
      .nin(payeeIds)
      .remove();

    const updated = new Array<RxDocument<PayeeDbModel>>();
    const inserted = new Array<RxDocument<PayeeDbModel>>();

    const existingPayees = await this.getAll();
    for (const account of payees) {
      const existing = existingPayees.find((a) => a.id === account.id);
      if (!existing) {
        const newAccount = await this.dbProvider.get().payees.insert({
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

    return { deleted, updated, inserted };
  }
}

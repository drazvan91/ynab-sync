import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { RxDocument } from 'rxdb';
import { DatabaseProvider } from '../database.provider';
import { BudgetDbModel } from '../models';

const { Storage } = Plugins;

@Injectable()
export class BudgetRepository {
  private SELECTED_KEY = 'SELECTED_BUDGET';

  public constructor(private dbProvider: DatabaseProvider) {}

  public async getSelected(): Promise<string | undefined> {
    const result = await Storage.get({ key: this.SELECTED_KEY });
    if (!result?.value) {
      return undefined;
    }

    return JSON.parse(result.value);
  }

  public async setSelected(budgetId: string) {
    await Storage.set({
      key: this.SELECTED_KEY,
      value: JSON.stringify(budgetId),
    });
  }

  public getAll() {
    return this.dbProvider.get().budgets.find().exec();
  }

  public async syncBudgets(budgets: BudgetDbModel[]) {
    const budgetIds = budgets.map((a) => a.id);

    const deleted = await this.dbProvider
      .get()
      .budgets.find()
      .where('id')
      .nin(budgetIds)
      .remove();

    const updated = new Array<RxDocument<BudgetDbModel>>();
    const inserted = new Array<RxDocument<BudgetDbModel>>();

    const existingBudgets = await this.dbProvider.get().budgets.find().exec();
    for (const account of budgets) {
      const existing = existingBudgets.find((a) => a.id === account.id);
      if (!existing) {
        const newAccount = await this.dbProvider.get().budgets.insert({
          id: account.id,
          name: account.name,
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

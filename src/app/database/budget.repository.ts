import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { BudgetModel } from './models';

const { Storage } = Plugins;

@Injectable()
export class BudgetRepository {
  private SELECTED_KEY = 'SELECTED_BUDGET';
  private ALL_KEY = 'ALL_BUDGET';

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

  public async getAll(): Promise<BudgetModel[]> {
    const result = await Storage.get({ key: this.ALL_KEY });
    if (!result?.value) {
      return [];
    }

    return JSON.parse(result.value);
  }

  public async setAll(budgets: BudgetModel[]) {
    await Storage.set({
      key: this.ALL_KEY,
      value: JSON.stringify(budgets),
    });
  }
}

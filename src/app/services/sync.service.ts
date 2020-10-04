import { Injectable } from '@angular/core';
import { ynabToken } from 'src/constants';
import { API } from 'ynab';
import { AccountRepository } from '../database/account.repository';
import { BudgetRepository } from '../database/budget.repository';
import { AccountModel, BudgetModel, PayeeModel } from '../database/models';
import { PayeeRepository } from '../database/payee.repository';

@Injectable()
export class SyncService {
  private ynabApi: API;
  constructor(
    private accountsRepo: AccountRepository,
    private budgetRepo: BudgetRepository,
    private payeeRepo: PayeeRepository
  ) {
    this.ynabApi = new API(ynabToken);
  }

  public async sync() {
    const budgets = await this.syncBudgets();

    const budgetId = await this.budgetRepo.getSelected();
    if (!budgetId) {
      return;
    }

    await this.syncAccounts(budgetId);
    await this.syncPayees(budgetId);
  }

  private async syncAccounts(budgetId: string) {
    const existingAccounts = await this.accountsRepo.getAll();

    const response = await this.ynabApi.accounts.getAccounts(budgetId);
    const accounts = response.data.accounts.map<AccountModel>((a) => {
      const existingAccount = existingAccounts.find((ea) => ea.id === a.id);
      return {
        id: a.id,
        name: a.name,
        mappedName: existingAccount?.mappedName,
      };
    });

    await this.accountsRepo.setAll(accounts);
  }

  private async syncPayees(budgetId: string) {
    const existingPayees = await this.payeeRepo.getAll();

    const response = await this.ynabApi.payees.getPayees(budgetId);
    const payees = response.data.payees.map<PayeeModel>((p) => {
      const existingPayee = existingPayees.find((ep) => ep.id === p.id);
      return {
        id: p.id,
        name: p.name,
        mappedNames: existingPayee?.mappedNames || [],
      };
    });

    await this.payeeRepo.setAll(payees);
  }

  private async syncBudgets() {
    const response = await this.ynabApi.budgets.getBudgets(false);
    const budgets = response.data.budgets.map<BudgetModel>((b) => {
      return {
        id: b.id,
        name: b.name,
      };
    });

    await this.budgetRepo.setAll(budgets);
    return budgets;
  }
}

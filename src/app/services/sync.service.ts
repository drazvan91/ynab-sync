import { Injectable } from '@angular/core';
import { formatISO } from 'date-fns';
import { ynabToken } from 'src/constants';
import { API, BulkTransactions, SaveTransaction } from 'ynab';
import { AccountRepository } from '../database/account.repository';
import { BudgetRepository } from '../database/budget.repository';
import {
  AccountModel,
  BudgetModel,
  PayeeModel,
  TransactionStatus,
} from '../database/models';
import { PayeeRepository } from '../database/payee.repository';
import { TransactionRepository } from '../database/transaction.repository';

@Injectable()
export class SyncService {
  private ynabApi: API;
  constructor(
    private accountsRepo: AccountRepository,
    private budgetRepo: BudgetRepository,
    private payeeRepo: PayeeRepository,
    private transactionRepo: TransactionRepository
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
        mappedNames: existingAccount?.mappedNames || [],
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

  public async syncTransactions() {
    const allTransactions = await this.transactionRepo.getAll();
    const readyTransactions = allTransactions.filter(
      (t) => t.status === TransactionStatus.Synced
    );

    const bulkTransactions: BulkTransactions = {
      transactions: readyTransactions.map<SaveTransaction>((t) => {
        return {
          account_id: t.account.id,
          date: formatISO(t.date),
          amount: Math.floor(t.amount * 1000) + 0.1,
          payee_id: t.payee.id,
          category_id: null,
          flag_color: SaveTransaction.FlagColorEnum.Blue,
          import_id: 'impor' + t.id,
        };
      }),
    };

    const budgetId = await this.budgetRepo.getSelected();
    if (!budgetId) {
      throw 'No budget selected';
    }

    await this.ynabApi.transactions.bulkCreateTransactions(
      budgetId,
      bulkTransactions
    );

    readyTransactions.forEach((t) => (t.status = TransactionStatus.Synced));
    await this.transactionRepo.setAll(allTransactions);
  }
}

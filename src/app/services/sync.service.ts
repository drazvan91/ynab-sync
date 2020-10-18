import { Injectable } from '@angular/core';
import { formatISO, fromUnixTime } from 'date-fns';
import { API, BulkTransactions, SaveTransaction } from 'ynab';
import {
  AccountDbModel,
  BudgetDbModel,
  PayeeDbModel,
  TransactionStatus,
} from '../database/models';
import {
  AccountRepository,
  BudgetRepository,
  ConfigRepository,
  PayeeRepository,
  TransactionRepository,
} from '../database/repositories';

@Injectable()
export class SyncService {
  constructor(
    private accountsRepo: AccountRepository,
    private budgetRepo: BudgetRepository,
    private payeeRepo: PayeeRepository,
    private configRepo: ConfigRepository,
    private transactionRepo: TransactionRepository,
  ) {}

  private async getYnabApi(): Promise<API> {
    const token = await this.configRepo.getToken();
    return new API(token);
  }

  public async syncPayeesAndAccounts() {
    const budgetId = await this.budgetRepo.getSelected();
    if (!budgetId) {
      return;
    }

    const resultAccounts = await this.syncAccounts(budgetId);
    const resultPayees = await this.syncPayees(budgetId);
    return {
      accounts: resultAccounts,
      payeess: resultPayees,
    };
  }

  private async syncAccounts(budgetId: string) {
    const ynabApi = await this.getYnabApi();
    const existingAccounts = await this.accountsRepo.getAll();

    const response = await ynabApi.accounts.getAccounts(budgetId);
    const accounts = response.data.accounts.map<AccountDbModel>((a) => {
      const existingAccount = existingAccounts.find((ea) => ea.id === a.id);
      return {
        id: a.id,
        name: a.name,
        mappedNames: existingAccount?.mappedNames || [],
      };
    });

    return await this.accountsRepo.syncAccounts(accounts);
  }

  private async syncPayees(budgetId: string) {
    const ynabApi = await this.getYnabApi();

    const response = await ynabApi.payees.getPayees(budgetId);
    const payees = response.data.payees.map<PayeeDbModel>((p) => {
      return {
        id: p.id,
        name: p.name,
        mappedNames: [],
      };
    });

    return await this.payeeRepo.syncPayees(payees);
  }

  public async syncBudgets() {
    const ynabApi = await this.getYnabApi();

    const response = await ynabApi.budgets.getBudgets(false);
    const budgets = response.data.budgets.map<BudgetDbModel>((b) => {
      return {
        id: b.id,
        name: b.name,
      };
    });

    return await this.budgetRepo.syncBudgets(budgets);
  }

  public async syncTransactions() {
    const budgetId = await this.budgetRepo.getSelected();
    if (!budgetId) {
      throw 'No budget selected';
    }

    const toSyncTransactions = await this.transactionRepo.getReadyToSync();
    const bulkTransactions: BulkTransactions = {
      transactions: toSyncTransactions.map<SaveTransaction>((t) => {
        return {
          account_id: t.accountId,
          date: formatISO(fromUnixTime(t.dateUnix)),
          amount: Math.floor(t.amount * 1000),
          payee_id: t.payeeId,
          category_id: null,
          flag_color: SaveTransaction.FlagColorEnum.Blue,
          import_id: 'impo' + t.id,
        };
      }),
    };

    const transactionIds = toSyncTransactions.map((t) => t.id);
    await this.transactionRepo.bulkSetStatus(
      transactionIds,
      TransactionStatus.Syncing,
    );

    try {
      const ynabApi = await this.getYnabApi();
      await ynabApi.transactions.bulkCreateTransactions(
        budgetId,
        bulkTransactions,
      );
    } catch {
      await this.transactionRepo.bulkSetStatus(
        transactionIds,
        TransactionStatus.New,
      );
      return;
    }

    await this.transactionRepo.bulkSetStatus(
      transactionIds,
      TransactionStatus.Synced,
    );
  }
}

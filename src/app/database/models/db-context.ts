import { RxCollection } from 'rxdb';

export interface DbContext {
  accounts: RxCollection<AccountDbModel>;
  budgets: RxCollection<BudgetDbModel>;
  payees: RxCollection<PayeeDbModel>;
  transactions: RxCollection<TransactionDbModel>;
}

export interface AccountDbModel {
  name: string;
  mappedNames: string[];
  id: string;
}

export interface BudgetDbModel {
  id: string;
  name: string;
}

export interface PayeeDbModel {
  id: string;
  name: string;
  mappedNames: string[];
}

export enum TransactionStatus {
  New = 1,
  Syncing,
  Synced,
}

export interface TransactionDbModel {
  id: string;
  smsId: string;
  amount: number;
  dateUnix: number;
  rawAccount: string;
  accountId?: string;
  rawPayee: string;
  payeeId?: string;
  status: TransactionStatus;
}

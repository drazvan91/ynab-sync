import { RxCollection } from 'rxdb';

export interface DbContext {
    accounts: RxCollection<AccountDbModel>;
    // budgets: RxCollection<BudgetModel>;
    // payees: RxCollection<PayeeModel>;
    transactions: RxCollection<TransactionDbModel>;
}

export interface AccountDbModel {
    name: string;
    mappedNames: string[];
    id: string;
  }
  
  export interface BudgetModel {
    name: string;
    id: string;
  }
  
  export interface PayeeModel {
    name: string;
    mappedNames: string[];
    id: string;
  }
  
  export enum TransactionStatus {
    NotReady = 1,
    Ready,
    Syncing,
    Synced,
  }
  
  export interface TransactionDbModel {
    id: string;
    smsId: string;
    amount: number;
    dateUnix: number;
    rawAccount: string;
    accountId?: number;
    rawPayee: string;
    payeeId?: number;
    status: TransactionStatus;
  }
  
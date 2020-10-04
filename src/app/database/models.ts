export interface AccountModel {
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

export interface TransactionModel {
  id: string;
  smsId: string;
  amount: number;
  date: Date;
  rawAccount: string;
  account?: AccountModel;
  rawPayee: string;
  payee?: PayeeModel;
  status: TransactionStatus;
}

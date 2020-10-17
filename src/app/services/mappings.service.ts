import { Injectable } from '@angular/core';
import { AccountRepository } from '../database/account.repository';
import { PayeeRepository } from '../database/payee.repository';
import { TransactionRepository } from '../database/transaction.repository';

@Injectable()
export class MappingsService {
  constructor(
    private payeeRepo: PayeeRepository,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  public async mapPayee(rawPayeeName: string, payeeId: string) {
    const payees = await this.payeeRepo.getAll();
    for (const payee of payees) {
      payee.mappedNames = payee.mappedNames.filter((p) => p !== rawPayeeName);
    }

    const selectedPayee = payees.find((p) => p.id === payeeId);
    selectedPayee.mappedNames.push(rawPayeeName);

    await this.payeeRepo.setAll(payees);

    const transactions = await this.transactionRepo.getAll();
    for (const transaction of transactions) {
      if (
        transaction.payee === undefined &&
        transaction.rawPayee === rawPayeeName
      ) {
        transaction.payee = selectedPayee;
      }
    }

    await this.transactionRepo.setAll(transactions);
  }

  public async mapAccount(rawAccountName: string, accountId: string) {
    const accounts = await this.accountRepo.assignRawAccount(rawAccountName, accountId);

    // const transactions = await this.transactionRepo.getAll();
    // for (const transaction of transactions) {
    //   if (
    //     transaction.account === undefined &&
    //     transaction.rawAccount === rawAccountName
    //   ) {
    //     transaction.account = selectedAccount;
    //   }
    // }

    // await this.transactionRepo.setAll(transactions);
  }
}

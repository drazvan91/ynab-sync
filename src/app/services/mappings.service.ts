import { Injectable } from '@angular/core';
import {
  AccountRepository,
  PayeeRepository,
  TransactionRepository,
} from '../database/repositories';

@Injectable()
export class MappingsService {
  constructor(
    private payeeRepo: PayeeRepository,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  public async mapPayee(rawPayeeName: string, payeeId: string) {
    await this.payeeRepo.addNameMapping(rawPayeeName, payeeId);
    await this.transactionRepo.autoFillPayeeId(rawPayeeName, payeeId);
  }

  public async mapAccount(rawAccountName: string, accountId: string) {
    await this.accountRepo.addNameMapping(rawAccountName, accountId);
    await this.transactionRepo.autoFillAccountId(rawAccountName, accountId);
  }
}

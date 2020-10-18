import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import cordovaSqliteAdapter from 'pouchdb-adapter-cordova-sqlite';
import idbAdapter from 'pouchdb-adapter-idb';
import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import {
  AccountDbModel,
  BudgetDbModel,
  DbContext,
  PayeeDbModel,
  TransactionDbModel,
} from './models/db-context';
import accountSchema from './schemas/account.schema';
import transactionSchema from './schemas/transaction.schema';
import payeeSchema from './schemas/payee.schema';
import budgetSchema from './schemas/budget.schema';

@Injectable()
export class DatabaseProvider {
  private database: RxDatabase<DbContext>;

  constructor(private platform: Platform) {}

  public get() {
    return this.database;
  }

  public async clearDatabase(): Promise<void> {
    if (this.database) {
      await this.database.requestIdlePromise();
      await this.database.remove();
      this.database = null;
      await this.create();
    }
  }

  public async create() {
    if (this.database) {
      return this.database;
    }

    console.log('Creating database');
    const adapter = this.detectAdaptorToBeUsed();

    console.log('Adaptor being used: ', adapter);

    this.database = await createRxDatabase({
      name: 'ynabdb2',
      adapter,
      pouchSettings: {
        location: 'default',
      },
      // password: 'myPassword', // <- password (optional)
      // multiInstance: true, // <- multiInstance (optional, default: true)
      // eventReduce: false, // <- eventReduce (optional, default: true)
    });

    this.database.accounts = await this.database.collection<AccountDbModel>({
      name: 'account',
      schema: accountSchema,
    });

    this.database.budgets = await this.database.collection<BudgetDbModel>({
      name: 'budget',
      schema: budgetSchema,
    });

    this.database.payees = await this.database.collection<PayeeDbModel>({
      name: 'payee',
      schema: payeeSchema,
    });
    this.database.transactions = await this.database.collection<
      TransactionDbModel
    >({
      name: 'transaction',
      schema: transactionSchema,
    });

    return this.database;
  }

  private detectAdaptorToBeUsed(): 'cordova-sqlite' | 'idb' {
    if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      addRxPlugin(idbAdapter);
      return 'idb';
    } else {
      addRxPlugin(cordovaSqliteAdapter);
      return 'cordova-sqlite';
    }
  }
}

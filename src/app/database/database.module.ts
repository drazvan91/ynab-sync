import { APP_INITIALIZER, NgModule } from '@angular/core';
import { DatabaseProvider } from './database.provider';
import {
  AccountRepository,
  BudgetRepository,
  ConfigRepository,
  PayeeRepository,
  TransactionRepository,
} from './repositories';

function AppInitializer(dbProvider: DatabaseProvider) {
  return () => dbProvider.create();
}

@NgModule({
  declarations: [],
  entryComponents: [],
  imports: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer,
      deps: [DatabaseProvider],
      multi: true,
    },
    AccountRepository,
    BudgetRepository,
    ConfigRepository,
    PayeeRepository,
    TransactionRepository,
    DatabaseProvider,
  ],
  bootstrap: [],
})
export class DatabaseModule {}

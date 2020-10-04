import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountRepository } from './database/account.repository';
import { BudgetRepository } from './database/budget.repository';
import { SyncService } from './services/sync.service';
import { SmsService } from './services/sms.service';
import { CommonModule } from '@angular/common';
import { TransactionDetailsPage } from './pages/transaction-details/transaction-details.page';
import { PayeeRepository } from './database/payee.repository';
import { PayeePickerModal } from './pages/transaction-details/payee-picker.modal';
import { TransactionRepository } from './database/transaction.repository';
import { SmsReaderService } from './services/sms-reader.service';
import { SmsParserService } from './services/sms-parser.service';
import { MappingsService } from './services/mappings.service';

@NgModule({
  declarations: [AppComponent, TransactionDetailsPage, PayeePickerModal],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot({
      mode: 'md',
    }),
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AccountRepository,
    BudgetRepository,
    PayeeRepository,
    TransactionRepository,
    SyncService,
    SmsService,
    SmsReaderService,
    SmsParserService,
    MappingsService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

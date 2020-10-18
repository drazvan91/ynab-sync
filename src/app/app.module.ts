import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SyncService } from './services/sync.service';
import { SmsService } from './services/sms.service';
import { CommonModule } from '@angular/common';
import { TransactionDetailsPage } from './pages/transaction-details/transaction-details.page';
import { PayeePickerModal } from './pages/transaction-details/payee-picker.modal';
import { SmsReaderService } from './services/sms-reader.service';
import { SmsParserService } from './services/sms-parser.service';
import { MappingsService } from './services/mappings.service';
import { DatabaseModule } from './database/database.module';

@NgModule({
  declarations: [AppComponent, TransactionDetailsPage, PayeePickerModal],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    DatabaseModule,
    IonicModule.forRoot({
      mode: 'md',
    }),
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
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

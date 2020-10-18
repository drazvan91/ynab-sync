import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ToastController } from '@ionic/angular';
import { fromUnixTime } from 'date-fns';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AccountDbModel,
  PayeeDbModel,
  TransactionDbModel,
} from 'src/app/database/models';
import {
  AccountRepository,
  PayeeRepository,
  TransactionRepository,
} from 'src/app/database/repositories';
import { SmsService } from 'src/app/services';
import { SyncService } from 'src/app/services/sync.service';
import { TransactionListItem } from './components/transaction-list.component';

const sliderNamesMap = {
  'not-ready-transactions': 0,
  'synced-transactions': 1,
  'all-transactions': 2,
};

@Component({
  selector: 'home-transactions-tab',
  templateUrl: 'transactions.tab.html',
  styleUrls: ['./transactions.tab.scss'],
})
export class TransactionsTab implements OnInit {
  @ViewChild('slider', { static: false }) slider: IonSlides;

  public readyToSyncCount$ = this.transactionRepo.getReadyToSync$().pipe(
    map((transactions) => {
      return transactions.length;
    }),
  );

  public notReadyToSyncCount$ = this.transactionRepo.getNotReadyToSync$().pipe(
    map((transactions) => {
      return transactions.length;
    }),
  );

  public notReadyTransactions$ = combineLatest([
    this.transactionRepo.getNotReadyToSync$(),
    this.accountRepo.getAll$(),
    this.payeeRepo.getAll$(),
  ]).pipe(
    map(([transactions, accounts, payees]) => {
      return this.mapToItems(transactions, accounts, payees);
    }),
  );

  public readyToSyncTransactions$ = combineLatest([
    this.transactionRepo.getReadyToSync$(),
    this.accountRepo.getAll$(),
    this.payeeRepo.getAll$(),
  ]).pipe(
    map(([transactions, accounts, payees]) => {
      return this.mapToItems(transactions, accounts, payees);
    }),
  );

  public allTransactions$ = combineLatest([
    this.transactionRepo.getAll$(),
    this.accountRepo.getAll$(),
    this.payeeRepo.getAll$(),
  ]).pipe(
    map(([transactions, accounts, payees]) => {
      return this.mapToItems(transactions, accounts, payees);
    }),
  );

  private mapToItems(
    transactions: TransactionDbModel[],
    accounts: AccountDbModel[],
    payees: PayeeDbModel[],
  ) {
    return transactions.map<TransactionListItem>((t) => {
      return {
        date: fromUnixTime(t.dateUnix),
        rawAccount: t.rawAccount,
        accountName: accounts.find((a) => a.id === t.accountId)?.name,
        payeeName: payees.find((p) => p.id === t.payeeId)?.name,
        amount: t.amount,
        currency: t.currency,
        rawPayee: t.rawPayee,
        status: t.status,
        id: t.id,
      };
    });
  }

  public selectedSegment = 'not-ready-transactions';
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  public transactions: TransactionDbModel[];

  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
    private payeeRepo: PayeeRepository,
    private smsService: SmsService,
    private syncService: SyncService,
    public toastController: ToastController,
  ) {}

  async ngOnInit() {}

  public segmentChanged(ev: CustomEvent) {
    this.selectedSegment = ev.detail.value;
    const gotoSlideIndex = sliderNamesMap[this.selectedSegment];
    this.slider.slideTo(gotoSlideIndex);
  }

  public async sliderWillChange(ev: CustomEvent) {
    const active = await this.slider.getActiveIndex();
    for (const key in sliderNamesMap) {
      if (sliderNamesMap[key] === active) {
        this.selectedSegment = key;
      }
    }
  }

  public async checkSms() {
    const newTransactions = await this.smsService.importSmsList();
    const toast = await this.toastController.create({
      message: newTransactions.length + ' new transactions added',
      duration: 2000,
    });
    toast.present();
  }

  public async syncTransactions() {
    await this.syncService.syncTransactions();
  }
}

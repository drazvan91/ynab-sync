import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { fromUnixTime } from 'date-fns';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AccountDbModel,
  PayeeDbModel,
  TransactionDbModel,
  TransactionStatus,
} from '../database/models';
import {
  AccountRepository,
  PayeeRepository,
  TransactionRepository,
} from '../database/repositories';
import { SyncService } from '../services/sync.service';

interface TransactionItem {
  id: string;
  rawAccount: string;
  accountName?: string;
  rawPayee: string;
  payeeName?: string;
  amount: number;
  date: Date;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('slider', { static: false }) slider: IonSlides;

  public transactions$ = combineLatest([
    this.transactionRepo.getAll$(),
    this.accountRepo.getAll$(),
    this.payeeRepo.getAll$(),
  ]).pipe(
    map((v) => {
      return this.mapToItems(v[0], v[1], v[2]);
    }),
    tap((trs) => {
      console.log(trs);
    })
  );

  private mapToItems(
    transactions: TransactionDbModel[],
    accounts: AccountDbModel[],
    payees: PayeeDbModel[]
  ) {
    return transactions.map<TransactionItem>((t) => {
      return {
        date: fromUnixTime(t.dateUnix),
        rawAccount: t.rawAccount,
        accountName: accounts.find((a) => a.id === t.accountId)?.name,
        payeeName: payees.find((p) => p.id === t.payeeId)?.name,
        amount: t.amount,
        rawPayee: t.rawPayee,
        id: t.id,
      };
    });
  }

  public selectedSegment = 'new-transactions';
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  public transactions: TransactionDbModel[];

  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
    private payeeRepo: PayeeRepository,
    private syncService: SyncService
  ) {}

  async ngOnInit() {
    // this.transactions = await this.transactionsRepo.getAll();
    // this.transactions = this.transactions.sort((a, b) => {
    //   return compareDesc(a.date, b.date);
    // });
  }

  public getIconName(transaction: TransactionDbModel): string {
    switch (transaction.status) {
      case TransactionStatus.New:
        return 'warning';
      case TransactionStatus.Synced:
        return 'checkmark-done';
      case TransactionStatus.Syncing:
        return 'swap-horizontal';
      default:
    }
  }

  public segmentChanged(ev: CustomEvent) {
    this.selectedSegment = ev.detail.value;
    const gotoSlideIndex = this.selectedSegment === 'new-transactions' ? 0 : 1;
    this.slider.slideTo(gotoSlideIndex);
  }

  public async sliderWillChange(ev: CustomEvent) {
    const active = await this.slider.getActiveIndex();
    this.selectedSegment =
      active === 0 ? 'new-transactions' : 'synced-transactions';
  }

  public async syncTransactions() {
    await this.syncService.syncTransactions();
  }
}

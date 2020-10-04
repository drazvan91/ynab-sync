import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { TransactionModel, TransactionStatus } from '../database/models';
import { TransactionRepository } from '../database/transaction.repository';
import { SyncService } from '../services/sync.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('slider', { static: false }) slider: IonSlides;

  public selectedSegment = 'new-transactions';
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  public transactions: TransactionModel[];

  constructor(
    private transactionsRepo: TransactionRepository,
    private syncService: SyncService
  ) {}

  async ngOnInit() {
    this.transactions = await this.transactionsRepo.getAll();
  }

  public getIconName(transaction: TransactionModel): string {
    switch (transaction.status) {
      case TransactionStatus.NotReady:
        return 'warning';
      case TransactionStatus.Ready:
        return 'checkmark';
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

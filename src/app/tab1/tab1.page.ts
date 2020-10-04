import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { TransactionModel } from '../database/models';
import { TransactionRepository } from '../database/transaction.repository';

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

  constructor(private transactionsRepo: TransactionRepository) {}

  async ngOnInit() {
    this.transactions = await this.transactionsRepo.getAll();
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
}

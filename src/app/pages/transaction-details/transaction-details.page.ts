import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AccountRepository } from 'src/app/database/account.repository';
import {
  AccountModel,
  TransactionModel,
  TransactionStatus,
} from 'src/app/database/models';
import { PayeeRepository } from 'src/app/database/payee.repository';
import { TransactionRepository } from 'src/app/database/transaction.repository';
import { PayeePickerModal } from './payee-picker.modal';

@Component({
  templateUrl: 'transaction-details.page.html',
  styleUrls: [],
})
export class TransactionDetailsPage implements OnInit {
  public transaction?: TransactionModel;
  public accounts: AccountModel[];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository,
    private payeeRepo: PayeeRepository
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (p) => {
      console.log(p);
      this.transaction = await this.transactionRepo.getById(p.id);
    });

    this.accounts = await this.accountRepo.getAll();
  }

  public async accountChanged(ev: CustomEvent) {
    const account = this.accounts.find((a) => a.id === ev.detail.value);
    this.transaction.account = account;
    await this.save();
  }

  public async openPayeeModal() {
    const modal = await this.modalController.create({
      component: PayeePickerModal,
      cssClass: 'my-custom-class',
      componentProps: {
        selectedPayeeId: this.transaction.payee?.id,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.payeeId) {
      const payee = await this.payeeRepo.getById(data.payeeId);
      this.transaction.payee = payee;
    }
  }

  private async save() {
    if (!this.transaction) {
      return;
    }

    if (this.transaction.status === TransactionStatus.NotReady) {
      if (this.transaction.account && this.transaction.payee) {
        this.transaction.status = TransactionStatus.Ready;
      }
    }

    await this.transactionRepo.save(this.transaction);
  }
}

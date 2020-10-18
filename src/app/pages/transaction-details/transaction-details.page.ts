import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RxDocument } from 'rxdb';
import { of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  AccountDbModel,
  PayeeDbModel,
  TransactionDbModel,
} from 'src/app/database/models/db-context';
import {
  PayeeRepository,
  TransactionRepository,
} from 'src/app/database/repositories';
import { AccountRepository } from 'src/app/database/repositories/account.repository';
import { MappingsService } from 'src/app/services/mappings.service';
import { PayeePickerModal } from './payee-picker.modal';

@Component({
  templateUrl: 'transaction-details.page.html',
  styleUrls: [],
})
export class TransactionDetailsPage implements OnInit, OnDestroy {
  public transaction: TransactionDbModel;
  public accounts: AccountDbModel[];
  public payee: RxDocument<PayeeDbModel>;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository,
    private payeeRepo: PayeeRepository,
    private mappingsService: MappingsService
  ) {}

  public ngOnInit() {
    this.subscriptions.add(
      this.route.params
        .pipe(
          switchMap((p) => {
            console.log('param changed');
            return this.transactionRepo.getById$(p.id);
          }),
          switchMap((t) => {
            console.log('transaction changed', t.payeeId);
            if (!t.payeeId) {
              return of({
                transaction: t,
                payee: undefined,
              });
            }

            return this.payeeRepo.getById$(t.payeeId).pipe(
              map((payee) => {
                console.log('payee changed', payee.id);
                return {
                  transaction: t,
                  payee: payee,
                };
              })
            );
          })
        )
        .subscribe((result) => {
          this.transaction = result.transaction;
          this.payee = result.payee;
        })
    );

    this.subscriptions.add(
      this.accountRepo.getAll$().subscribe((accounts) => {
        this.accounts = accounts;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async accountChanged(ev: CustomEvent) {
    const newAccountId: string = ev.detail.value;
    await this.transactionRepo.updateAccountForTransaction(
      this.transaction.id,
      newAccountId
    );

    await this.mappingsService.mapAccount(
      this.transaction.rawAccount,
      newAccountId
    );
  }

  public async openPayeeModal() {
    const modal = await this.modalController.create({
      component: PayeePickerModal,
      cssClass: 'my-custom-class',
      componentProps: {
        selectedPayeeId: this.transaction.payeeId,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.payeeId) {
      await this.transactionRepo.updatePayeeForTransaction(
        this.transaction.id,
        data.payeeId
      );
      await this.mappingsService.mapPayee(
        this.transaction.rawPayee,
        data.payeeId
      );
    }
  }
}

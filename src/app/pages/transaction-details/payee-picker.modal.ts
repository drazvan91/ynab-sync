import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PayeeRepository } from 'src/app/database/repositories';

@Component({
  templateUrl: 'payee-picker.modal.html',
  styleUrls: [],
})
export class PayeePickerModal implements OnInit {
  @Input() selectedPayeeId?: string;
  public payees$ = this.payeeRepo.getAll$();

  constructor(
    private modalCtrl: ModalController,
    private payeeRepo: PayeeRepository
  ) {}

  async ngOnInit() {
    // this.payees = await this.payeeRepo.getAll();
  }

  public async selectPayee(payeeId: string) {
    await this.modalCtrl.dismiss({
      payeeId,
    });
  }

  public async dismissModal() {
    await this.modalCtrl.dismiss();
  }
}

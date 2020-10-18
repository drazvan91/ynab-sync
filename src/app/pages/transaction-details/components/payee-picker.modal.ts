import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { PayeeRepository } from 'src/app/database/repositories';

@Component({
  templateUrl: 'payee-picker.modal.html',
  styleUrls: [],
})
export class PayeePickerModal implements OnInit {
  @ViewChild('searchBar') searchbar: IonSearchbar;

  @Input() selectedPayeeId?: string;

  private searchTerm = new BehaviorSubject<string>('');

  public payees$ = this.searchTerm.asObservable().pipe(
    debounceTime(200),
    switchMap((value) => {
      return this.payeeRepo.search$(value);
    }),
  );

  constructor(
    private modalCtrl: ModalController,
    private payeeRepo: PayeeRepository,
  ) {}

  async ngOnInit() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1000);
  }

  public async selectPayee(payeeId: string) {
    await this.modalCtrl.dismiss({
      payeeId,
    });
  }

  public async dismissModal() {
    await this.modalCtrl.dismiss();
  }

  public searchTermChanged(ev: CustomEvent) {
    this.searchTerm.next(ev.detail.value);
  }
}

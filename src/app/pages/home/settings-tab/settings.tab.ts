import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { BudgetDbModel } from 'src/app/database/models';
import {
  AccountRepository,
  BudgetRepository,
  ConfigRepository,
  PayeeRepository,
} from 'src/app/database/repositories';
import { SmsService } from 'src/app/services/sms.service';
import { SyncService } from 'src/app/services/sync.service';

@Component({
  selector: 'home-settings-tab',
  templateUrl: 'settings.tab.html',
  styleUrls: [],
})
export class SettingsTab implements OnInit {
  public budgets: BudgetDbModel[];
  public budgets$ = this.budgetRepo.getAll$().pipe(
    tap(async (_) => {
      this.selectedBudgetId = await this.budgetRepo.getSelected();
    }),
  );
  public selectedBudgetId?: string;
  public startDate: string;
  public ynabToken: string;

  public payeesCount$ = this.payeeRepo.getAll$().pipe(
    map((payees) => {
      return payees.length;
    }),
  );
  public accountsCount$ = this.accountRepo.getAll$().pipe(
    map((accounts) => {
      return accounts.length;
    }),
  );

  constructor(
    private budgetRepo: BudgetRepository,
    private syncService: SyncService,
    private payeeRepo: PayeeRepository,
    private accountRepo: AccountRepository,
    private configRepo: ConfigRepository,
    public toastController: ToastController,
  ) {}

  public async ngOnInit() {
    this.startDate = (await this.configRepo.getStartDate())?.toString();
    this.ynabToken = (await this.configRepo.getToken()) || '';
  }

  public async syncBudgets() {
    try {
      const result = await this.syncService.syncBudgets();

      const changes =
        result.deleted.length + result.inserted.length + result.updated.length;
      let message = `Budgets sync success: ${changes} changes`;

      const toast = await this.toastController.create({
        message,
        duration: 2000,
      });
      await toast.present();
    } catch (er) {
      const toast = await this.toastController.create({
        message: JSON.stringify(er),
        duration: 2000,
      });
      await toast.present();
    }
  }

  public async syncPayeesAndAccount() {
    try {
      const result = await this.syncService.syncPayeesAndAccounts();

      const changes =
        result.accounts.removed.length +
        result.accounts.inserted.length +
        result.accounts.updated.length +
        result.payeess.deleted.length +
        result.payeess.inserted.length +
        result.payeess.updated.length;

      let message = `Sync success: ${changes} changes`;

      const toast = await this.toastController.create({
        message,
        duration: 2000,
      });
      await toast.present();
    } catch (er) {
      const toast = await this.toastController.create({
        message: JSON.stringify(er),
        duration: 2000,
      });
      await toast.present();
    }
  }

  public async budgetChanged(ev: CustomEvent) {
    await this.budgetRepo.setSelected(ev.detail.value);
  }

  public async startDateChanged(ev: CustomEvent) {
    this.startDate = ev.detail.value;
    const date = new Date(ev.detail.value);
    await this.configRepo.setStartDate(date);
  }

  public async ynabTokenChanged(ev: CustomEvent) {
    this.ynabToken = ev.detail.value;
    await this.configRepo.setToken(this.ynabToken);
  }
}

import { Component, OnInit } from '@angular/core';
import { BudgetDbModel } from 'src/app/database/models';
import {
  BudgetRepository,
  ConfigRepository,
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
  public selectedBudgetId?: string;
  public startDate: string;
  public ynabToken: string;

  constructor(
    private budgetRepo: BudgetRepository,
    private syncService: SyncService,
    private smsService: SmsService,
    private configRepo: ConfigRepository,
  ) {}

  public async ngOnInit() {
    this.budgets = await this.budgetRepo.getAll();
    this.selectedBudgetId = await this.budgetRepo.getSelected();

    this.startDate = (await this.configRepo.getStartDate())?.toString();
    this.ynabToken = (await this.configRepo.getToken()) || '';
  }

  public async sync() {
    await this.syncService.sync();
    await this.ngOnInit();
  }

  public async syncSms() {
    await this.smsService.importSmsList();
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

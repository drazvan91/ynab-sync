import { Component, OnInit } from '@angular/core';
import { RxDocument } from 'rxdb';
import { Observable } from 'rxjs';
import { AccountRepository } from '../database/account.repository';
import { BudgetRepository } from '../database/budget.repository';
import { ConfigRepository } from '../database/config.repository';
import { BudgetModel } from '../database/models';
import { AccountDbModel } from '../database/models/db-context';
import { SmsService } from '../services/sms.service';
import { SyncService } from '../services/sync.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public budgets: BudgetModel[];
  public selectedBudgetId?: string;
  public startDate: string;
  public ynabToken: string;

  constructor(
    private budgetRepo: BudgetRepository,
    private accountsRepo: AccountRepository,
    private syncService: SyncService,
    private smsService: SmsService,
    private configRepo: ConfigRepository
  ) {}

  public async ngOnInit() {
    this.budgets = await this.budgetRepo.getAll();
    this.selectedBudgetId = await this.budgetRepo.getSelected();

    this.startDate = await (await this.configRepo.getStartDate())?.toString();
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
    // await this.accountsRepo.setAll([]);
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

import { Component, OnInit } from '@angular/core';
import { AccountRepository } from '../database/account.repository';
import { BudgetRepository } from '../database/budget.repository';
import { BudgetModel } from '../database/models';
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

  constructor(
    private budgetRepo: BudgetRepository,
    private accountsRepo: AccountRepository,
    private syncService: SyncService,
    private smsService: SmsService
  ) {}

  public async ngOnInit() {
    this.budgets = await this.budgetRepo.getAll();
    this.selectedBudgetId = await this.budgetRepo.getSelected();
  }

  public async sync() {
    await this.syncService.sync();
    await this.ngOnInit();
  }

  public async syncSms() {
    await this.smsService.importSmsList();
  }

  public async budgetChanged(ev: CustomEvent) {
    console.log('bu', ev);
    await this.budgetRepo.setSelected(ev.detail.value);
    await this.accountsRepo.setAll([]);
  }
}

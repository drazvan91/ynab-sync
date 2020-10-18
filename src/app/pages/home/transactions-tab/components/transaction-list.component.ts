import { Component, Input, OnInit } from '@angular/core';
import { TransactionDbModel, TransactionStatus } from 'src/app/database';

export interface TransactionListItem {
  id: string;
  rawAccount: string;
  accountName?: string;
  rawPayee: string;
  payeeName?: string;
  amount: number;
  date: Date;
  status: TransactionStatus;
}

@Component({
  selector: 'transaction-list',
  templateUrl: 'transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  @Input() items: TransactionListItem[];

  ngOnInit(): void {}

  public getIconName(transaction: TransactionListItem): string {
    switch (transaction.status) {
      case TransactionStatus.New:
        return 'warning';
      case TransactionStatus.Synced:
        return 'checkmark-done';
      case TransactionStatus.Syncing:
        return 'swap-horizontal';
      default:
        return 'empty';
    }
  }
}

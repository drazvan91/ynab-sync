import { Component, Input, OnInit } from '@angular/core';

export interface TransactionListItem {
  id: string;
  rawAccount: string;
  accountName?: string;
  rawPayee: string;
  payeeName?: string;
  amount: number;
  date: Date;
}

@Component({
  selector: 'transaction-list',
  templateUrl: 'transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  @Input() items: TransactionListItem[];

  ngOnInit(): void {}
}

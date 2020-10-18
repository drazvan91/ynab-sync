import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransactionListComponent } from './components/transaction-list.component';
import { TransactionsTab } from './transactions.tab';

const routes: Routes = [
  {
    path: '',
    component: TransactionsTab,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsTabRoutingModule {}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TransactionsTabRoutingModule,
  ],
  declarations: [TransactionsTab, TransactionListComponent],
})
export class TransactionsTabModule {}

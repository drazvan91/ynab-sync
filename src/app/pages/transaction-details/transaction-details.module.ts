import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { TransactionDetailsPage } from './transaction-details.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsTabRoutingModule {}

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SettingsTabRoutingModule],
  declarations: [],
})
export class SettingsTabModule {}

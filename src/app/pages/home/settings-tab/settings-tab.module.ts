import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SettingsTab } from './settings.tab';

const routes: Routes = [
  {
    path: '',
    component: SettingsTab,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsTabRoutingModule {}

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SettingsTabRoutingModule],
  declarations: [SettingsTab],
})
export class SettingsTabModule {}

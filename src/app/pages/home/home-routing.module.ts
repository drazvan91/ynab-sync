import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'transactions',
        loadChildren: () =>
          import('./transactions-tab/transactions-tab.module').then(
            (m) => m.TransactionsTabModule,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings-tab/settings-tab.module').then(
            (m) => m.SettingsTabModule,
          ),
      },
      {
        path: '',
        redirectTo: '/transactions',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

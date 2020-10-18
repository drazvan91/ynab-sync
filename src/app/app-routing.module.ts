import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TransactionDetailsPage } from './pages/transaction-details/transaction-details.page';

const routes: Routes = [
  { path: 'transaction/:id', component: TransactionDetailsPage },
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home-page.module').then((m) => m.HomePageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

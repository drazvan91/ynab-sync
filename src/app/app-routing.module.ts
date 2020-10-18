import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'transaction/:id',
    loadChildren: () =>
      import('./pages/transaction-details/transaction-details.module').then(
        (m) => m.SettingsTabModule,
      ),
  },
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

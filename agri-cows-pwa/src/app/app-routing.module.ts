import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CowsListComponent } from './components/cows/cows-list.component';
import { CowFormComponent } from './components/cows/cow-form.component';
import { CowDetailComponent } from './components/cows/cow-detail.component';
import { MilkFormComponent } from './components/milk/milk-form.component';
import { MilkListComponent } from './components/milk/milk-list.component';


import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'vaches', component: CowsListComponent, canActivate: [AuthGuard] },
  { path: 'vaches/new', component: CowFormComponent, canActivate: [AuthGuard] },
  { path: 'vaches/:id', component: CowDetailComponent, canActivate: [AuthGuard] },
  { path: 'vaches/:id/milk', component: MilkFormComponent, canActivate: [AuthGuard] }, // ✅ nouvelle route
  { path: '', pathMatch: 'full', redirectTo: 'vaches' },
  { path: '**', redirectTo: 'vaches' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}

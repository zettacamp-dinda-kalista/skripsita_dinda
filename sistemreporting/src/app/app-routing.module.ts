import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { LoginComponent } from './pages/login/login.component';

const subroutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/issue' },
  { path: 'issue', loadChildren: () => import('./pages/issue/issue.module').then(m => m.IssueModule) },
];

const routes: Routes = [
  { path: '', component: ShellComponent, children: subroutes }
  // { path: '', pathMatch: 'full', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

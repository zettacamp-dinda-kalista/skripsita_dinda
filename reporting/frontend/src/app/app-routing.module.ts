import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IssueGuard } from './guards/issue.guard';
import { FeatureGuard } from './guards/feature.guard';
import { UserGuard } from './guards/user.guard';
import { ProfileGuard } from './guards/profile.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'issue'
    },
    {
        path: 'login',
        canActivate: [LoginGuard],
        component: LoginComponent
    },
    {
        path: 'issue',
        canActivate: [IssueGuard],
        loadChildren: () => import('./components/issue/issue.module').then(m => m.IssueModule)
    },
    {
        path: 'feature',
        canActivate: [FeatureGuard],
        loadChildren: () => import('./components/feature/feature.module').then(m => m.FeatureModule)
    },
    {
        path: 'user',
        canActivate: [UserGuard],
        loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
    },
    {
        path: 'profile',
        canActivate: [ProfileGuard],
        loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule)
    },
];

@NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
})
export class AppRoutingModule { }

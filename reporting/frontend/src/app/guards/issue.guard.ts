import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IssueGuard {
    constructor(
        private authService: AuthService, 
        private router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const { token } = this.authService.getData();
        
        if (!!token) {
            return true
        } 
        
        else {
            this.authService.setState(false);
            this.router.navigate(['/login']);
            return false;
        }
    }
}

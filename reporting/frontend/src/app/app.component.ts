import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    subs = new Subscription();
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.subs.add(this.authService.$loginStateChanged.subscribe(state => {
            this.isLoggedIn = state;
        }));

        this.authService.verify()
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}

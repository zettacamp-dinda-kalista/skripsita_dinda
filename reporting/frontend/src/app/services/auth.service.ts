import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:8080';
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';

    private loginStateChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    $loginStateChanged: Observable<boolean> = this.loginStateChanged.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(email: string, password: string) {
        return this.http.post(this.API_URL + '/auth/login', { email, password }).pipe(
            tap((data: any) => {
                this.setData(data);
                this.setState(true);
                this.router.navigate(['']);
            })
        );
    }

    logout() {
        this.clearData();
        this.setState(false);
        this.router.navigate(['/login']);
    }

    verify() {
        const { token } = this.getData();
        this.setState(!!token);
    }

    getCurrentData() {
        return JSON.parse(localStorage.getItem(this.USER_KEY) || '{}');
    }

    isAdmin() {
        const user = this.getCurrentData();
        return user?.role == 'ADMIN';
    }

    setData(data: any) {
        const { token, user } = data;

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    
    getData() {
        const user = localStorage.getItem(this.USER_KEY) || '{}';
        const token = localStorage.getItem(this.USER_KEY);

        return { token, user: JSON.parse(user) };
    }

    clearData() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    setState(state: boolean) {
        this.loginStateChanged.next(state);
    }
}

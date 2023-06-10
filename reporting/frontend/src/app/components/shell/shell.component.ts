import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {
  currentUser: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentData();
  }

  logout() {
    this.authService.logout();
  }
}

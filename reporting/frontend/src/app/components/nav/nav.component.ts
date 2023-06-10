import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }
  
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }
}

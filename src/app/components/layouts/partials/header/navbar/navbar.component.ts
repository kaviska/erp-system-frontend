import { Component } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  onLogout(): void {
    this.authService.logout();

    this.router.navigate(['/']);
  }

}

import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-header',
  imports: [MenuComponent, NavbarComponent, MenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}

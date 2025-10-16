import { MenuComponent } from './menu/menu.component';
import { LogoComponent } from './logo/logo.component';
import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-sidebar',
  imports: [MenuComponent, LogoComponent, FooterComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}

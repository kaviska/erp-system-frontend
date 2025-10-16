import { Component } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { SidebarComponent } from '../partials/sidebar/sidebar.component';
import { ToolbarComponent } from '../partials/toolbar/toolbar.component';
import { ContentComponent } from '../partials/content/content.component';
import { FooterComponent } from '../partials/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-default',
  imports: [HeaderComponent,SidebarComponent,RouterModule],
  templateUrl: './default.component.html',
  styleUrl: './default.component.css'
})
export class DefaultComponent {

}

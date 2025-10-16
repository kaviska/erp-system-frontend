import { Component } from '@angular/core';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-dashboard',
  imports: [HasPermissionDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}

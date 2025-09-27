import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BreadcrumbItem {
  text: string;
  route?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  @Input() title: string = 'Title';
  @Input() breadcrumbItems: BreadcrumbItem[] = [
    { text: 'Home', route: '#' },
    { text: 'Library', route: '#' },
    { text: 'Active', active: true }
  ];

}

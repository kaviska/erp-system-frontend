import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {
  features = [
    {
      icon: 'dashboard',
      title: 'Smart Dashboard',
      description: 'Get real-time insights with customizable dashboards and KPI tracking',
      color: 'blue'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Make data-driven decisions with powerful reporting and forecasting tools',
      color: 'purple'
    },
    {
      icon: 'automation',
      title: 'Workflow Automation',
      description: 'Streamline processes with intelligent automation and approval workflows',
      color: 'green'
    },
    {
      icon: 'inventory',
      title: 'Inventory Management',
      description: 'Track stock levels, manage suppliers, and optimize inventory costs',
      color: 'orange'
    },
    {
      icon: 'finance',
      title: 'Financial Management',
      description: 'Complete accounting, budgeting, and financial reporting solutions',
      color: 'red'
    },
    {
      icon: 'crm',
      title: 'Customer Relations',
      description: 'Manage customer interactions, sales pipeline, and support tickets',
      color: 'indigo'
    }
  ];
}

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
      icon: 'fas fa-chart-line',
      title: 'Financial Management',
      description: 'Complete accounting, budgeting, and financial reporting tools to keep your finances in perfect order.',
      highlights: ['Real-time Reports', 'Budget Planning', 'Tax Management']
    },
    {
      icon: 'fas fa-users',
      title: 'Human Resources',
      description: 'Streamlined HR processes from recruitment to payroll, employee management made simple.',
      highlights: ['Payroll Processing', 'Performance Tracking', 'Leave Management']
    },
    {
      icon: 'fas fa-boxes',
      title: 'Inventory Control',
      description: 'Smart inventory tracking with automated alerts, stock optimization, and supply chain management.',
      highlights: ['Stock Tracking', 'Auto Reorder', 'Supplier Management']
    },
    {
      icon: 'fas fa-handshake',
      title: 'CRM Integration',
      description: 'Build stronger customer relationships with integrated sales, marketing, and customer service tools.',
      highlights: ['Lead Management', 'Sales Pipeline', 'Customer Support']
    },
    {
      icon: 'fas fa-cogs',
      title: 'Process Automation',
      description: 'Automate repetitive tasks and workflows to boost productivity and reduce manual errors.',
      highlights: ['Workflow Automation', 'Task Scheduling', 'Smart Notifications']
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with role-based access, data encryption, and compliance management.',
      highlights: ['Data Encryption', 'Role Management', 'Audit Trails']
    }
  ];
}
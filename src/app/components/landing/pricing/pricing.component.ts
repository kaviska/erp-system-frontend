import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  pricingPlans = [
    {
      name: 'Starter',
      price: '49',
      period: 'per month',
      description: 'Perfect for small businesses getting started with ERP',
      features: [
        'Up to 10 users',
        'Basic reporting',
        'Email support',
        'Standard integrations',
        'Mobile app access',
        '5GB storage'
      ],
      popular: false,
      buttonText: 'Start Free Trial',
      color: 'blue'
    },
    {
      name: 'Professional',
      price: '99',
      period: 'per month',
      description: 'Ideal for growing businesses with advanced needs',
      features: [
        'Up to 50 users',
        'Advanced analytics',
        'Priority support',
        'All integrations',
        'Custom workflows',
        '50GB storage',
        'API access',
        'Advanced security'
      ],
      popular: true,
      buttonText: 'Get Started',
      color: 'purple'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations with complex requirements',
      features: [
        'Unlimited users',
        'Custom reporting',
        'Dedicated support',
        'Custom integrations',
        'Advanced automation',
        'Unlimited storage',
        'White-label options',
        'SLA guarantee',
        'On-premise deployment'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      color: 'green'
    }
  ];

  onSelectPlan(plan: any) {
    console.log('Selected plan:', plan.name);
    // Handle plan selection logic
  }
}

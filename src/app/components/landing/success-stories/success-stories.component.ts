import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-stories.component.html',
  styleUrl: './success-stories.component.css'
})
export class SuccessStoriesComponent {
  successStories = [
    {
      company: 'TechCorp Manufacturing',
      industry: 'Manufacturing',
      logo: 'assets/media/logos/company-1.png',
      challenge: 'Manual inventory tracking and disconnected systems',
      solution: 'Implemented full ERP with automated inventory management',
      results: {
        efficiency: '40% increase in operational efficiency',
        cost: '25% reduction in inventory costs',
        time: '60% faster order processing'
      },
      testimonial: 'ERP Pro transformed our operations completely. We now have real-time visibility into our entire supply chain.',
      person: 'Sarah Johnson',
      position: 'Operations Director'
    },
    {
      company: 'GrowthStart Inc',
      industry: 'E-commerce',
      logo: 'assets/media/logos/company-2.png',
      challenge: 'Scaling business with manual processes and multiple tools',
      solution: 'Centralized operations with integrated CRM and analytics',
      results: {
        efficiency: '300% growth in 18 months',
        cost: '50% reduction in processing time',
        time: '99.9% order accuracy'
      },
      testimonial: 'The scalability and integration capabilities helped us grow from a startup to a multi-million dollar company.',
      person: 'Mike Chen',
      position: 'CEO & Founder'
    },
    {
      company: 'Regional Healthcare',
      industry: 'Healthcare',
      logo: 'assets/media/logos/company-3.png',
      challenge: 'Compliance requirements and patient data management',
      solution: 'HIPAA-compliant ERP with patient management modules',
      results: {
        efficiency: '35% improvement in patient care',
        cost: '20% cost reduction',
        time: '100% compliance maintained'
      },
      testimonial: 'Patient care improved significantly with streamlined processes and real-time access to critical information.',
      person: 'Dr. Emily Rodriguez',
      position: 'Chief Administrator'
    }
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs: FAQItem[] = [
    {
      id: 1,
      question: 'What is ERP Pro and how can it help my business?',
      answer: 'ERP Pro is a comprehensive Enterprise Resource Planning system that integrates all your business processes into a single platform. It helps streamline operations, improve efficiency, reduce costs, and provide real-time insights for better decision-making. From inventory management to financial reporting, ERP Pro covers all aspects of your business.',
      isOpen: false
    },
    {
      id: 2,
      question: 'How long does implementation typically take?',
      answer: 'Implementation time varies based on company size and complexity. For small to medium businesses, implementation typically takes 2-4 weeks. Larger enterprises may require 6-12 weeks. We provide dedicated project managers and support teams to ensure smooth deployment with minimal disruption to your operations.',
      isOpen: false
    },
    {
      id: 3,
      question: 'Is my data secure with ERP Pro?',
      answer: 'Absolutely. We employ enterprise-grade security measures including 256-bit SSL encryption, regular security audits, compliance with SOC 2 Type II, GDPR, and other international standards. Your data is stored in secure, redundant data centers with 99.9% uptime guarantee and daily automated backups.',
      isOpen: false
    },
    {
      id: 4,
      question: 'Can ERP Pro integrate with my existing software?',
      answer: 'Yes! ERP Pro offers 30+ pre-built integrations with popular business tools including accounting software (QuickBooks, Xero), CRM systems (Salesforce, HubSpot), e-commerce platforms (Shopify, WooCommerce), and more. We also provide API access for custom integrations.',
      isOpen: false
    },
    {
      id: 5,
      question: 'What kind of support do you provide?',
      answer: 'We offer comprehensive 24/7 support including phone, email, and live chat. All plans include free onboarding, training sessions, documentation, video tutorials, and access to our knowledge base. Premium plans include dedicated account managers and priority support.',
      isOpen: false
    },
    {
      id: 6,
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 30-day free trial with full access to all features. No credit card required. During the trial, you\'ll have access to our support team and can schedule one-on-one demos to help you get started and maximize the platform\'s potential.',
      isOpen: false
    },
    {
      id: 7,
      question: 'How does pricing work?',
      answer: 'Our pricing is based on the number of users and features needed. We offer flexible monthly and annual plans starting from $29/user/month. Volume discounts are available for larger teams. All plans include core ERP features, with advanced analytics and custom integrations available in higher tiers.',
      isOpen: false
    },
    {
      id: 8,
      question: 'Can I migrate data from my current system?',
      answer: 'Yes, we provide comprehensive data migration services. Our team will help you import data from spreadsheets, legacy systems, or other ERP platforms. We ensure data integrity throughout the process and provide validation tools to verify successful migration.',
      isOpen: false
    }
  ];

  toggleFaq(faqId: number) {
    const faq = this.faqs.find(f => f.id === faqId);
    if (faq) {
      faq.isOpen = !faq.isOpen;
    }
  }

  openAll() {
    this.faqs.forEach(faq => faq.isOpen = true);
  }

  closeAll() {
    this.faqs.forEach(faq => faq.isOpen = false);
  }
}

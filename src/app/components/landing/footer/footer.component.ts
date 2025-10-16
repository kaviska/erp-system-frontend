import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  showBackToTop = false;
  
  // Newsletter form
  newsletterEmail = '';
  isSubmittingNewsletter = false;
  newsletterSuccess = false;
  
  productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Security', href: '#security' },
    { name: 'API Docs', href: '#api' }
  ];

  companyLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press Kit', href: '#press' },
    { name: 'Contact', href: '#contact' }
  ];

  resourceLinks = [
    { name: 'Documentation', href: '#docs' },
    { name: 'Tutorials', href: '#tutorials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Webinars', href: '#webinars' },
    { name: 'Case Studies', href: '#cases' }
  ];

  supportLinks = [
    { name: 'Help Center', href: '#help' },
    { name: 'Live Chat', href: '#chat' },
    { name: 'Community', href: '#community' },
    { name: 'System Status', href: '#status' },
    { name: 'Contact Support', href: '#support' }
  ];

  legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR', href: '#gdpr' }
  ];

  socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/erpproapp',
      iconClass: 'fab fa-twitter'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/erpproapp',
      iconClass: 'fab fa-linkedin-in'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/erpproapp',
      iconClass: 'fab fa-github'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/erpproapp',
      iconClass: 'fab fa-youtube'
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/erpproapp',
      iconClass: 'fab fa-discord'
    }
  ];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.showBackToTop = window.pageYOffset > 300;
  }

  ngOnInit() {
    // Initialize any required setup
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  handleNavClick(event: Event, href: string): void {
    if (href.startsWith('#')) {
      event.preventDefault();
      this.scrollToSection(href);
    }
  }

  scrollToSection(href: string): void {
    if (href.startsWith('#')) {
      const elementId = href.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  scrollToTop(): void {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }

  async onNewsletterSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.newsletterEmail || this.isSubmittingNewsletter) {
      return;
    }

    this.isSubmittingNewsletter = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      this.newsletterSuccess = true;
      this.newsletterEmail = '';
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        this.newsletterSuccess = false;
      }, 3000);
      
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      // Handle error (show error message, etc.)
    } finally {
      this.isSubmittingNewsletter = false;
    }
  }
}

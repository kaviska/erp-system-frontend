import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  agreeToTerms: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: ContactForm = {
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    agreeToTerms: false
  };

  subjects = [
    'General Inquiry',
    'Sales Question',
    'Technical Support',
    'Partnership Opportunity',
    'Demo Request',
    'Billing Question'
  ];

  isSubmitting = false;
  isSubmitted = false;

  onSubmit(form: NgForm) {
    if (form.valid && this.contactForm.agreeToTerms) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        
        // Reset form after 3 seconds
        setTimeout(() => {
          this.resetForm();
          form.resetForm();
          this.isSubmitted = false;
        }, 3000);
      }, 1500);
    }
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: 'General Inquiry',
      message: '',
      agreeToTerms: false
    };
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

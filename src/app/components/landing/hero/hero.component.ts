import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  constructor(private router: Router) {}

  onGetStarted() {
    // Navigate to registration or demo request
    this.scrollToSection('contact');
  }

  onWatchDemo() {
    // Scroll to features section or open demo modal
    this.scrollToSection('features');
  }

  scrollToNext() {
    this.scrollToSection('about');
  }

  private scrollToSection(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

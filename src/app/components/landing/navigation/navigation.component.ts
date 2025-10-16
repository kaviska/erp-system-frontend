import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isScrolled = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateScrollState();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateScrollState();
  }

  private updateScrollState() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(elementId: string) {
    this.isMenuOpen = false;
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

  onLogin() {
    this.router.navigate(['/login']);
  }

  onDemo() {
    // For now, scroll to features section as a demo preview
    this.scrollTo('features');
    // Later you can implement a dedicated demo route or modal
  }
}

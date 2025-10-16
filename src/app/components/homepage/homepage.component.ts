import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../landing/navigation/navigation.component';
import { HeroComponent } from '../landing/hero/hero.component';
import { AboutComponent } from '../landing/about/about.component';
import { SuccessStoriesComponent } from '../landing/success-stories/success-stories.component';
import { FeaturesComponent } from '../landing/features/features.component';
import { TeamComponent } from '../landing/team/team.component';
import { PricingComponent } from '../landing/pricing/pricing.component';
import { FaqComponent } from '../landing/faq/faq.component';
import { ContactComponent } from '../landing/contact/contact.component';
import { FooterComponent } from '../landing/footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    HeroComponent,
    AboutComponent,
    SuccessStoriesComponent,
    FeaturesComponent,
    TeamComponent,
    PricingComponent,
    FaqComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
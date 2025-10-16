import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  teamMembers = [
    {
      name: 'Alex Thompson',
      position: 'Lead Developer & CTO',
      photo: 'assets/media/avatars/300-1.jpg',
      bio: '10+ years in enterprise software development. Expert in scalable architecture and cloud solutions.',
      skills: ['Angular', 'Node.js', 'AWS', 'Microservices'],
      social: {
        linkedin: 'https://linkedin.com/in/alexthompson',
        github: 'https://github.com/alexthompson',
        twitter: 'https://twitter.com/alexthompson'
      }
    },
    {
      name: 'Maria Garcia',
      position: 'UI/UX Designer',
      photo: 'assets/media/avatars/300-2.jpg',
      bio: 'Passionate about creating intuitive user experiences. 8 years of experience in enterprise UX design.',
      skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
      social: {
        linkedin: 'https://linkedin.com/in/mariagarcia',
        dribbble: 'https://dribbble.com/mariagarcia',
        behance: 'https://behance.net/mariagarcia'
      }
    },
    {
      name: 'David Kim',
      position: 'Senior Backend Developer',
      photo: 'assets/media/avatars/300-3.jpg',
      bio: 'Database optimization specialist with expertise in high-performance backend systems and API design.',
      skills: ['Python', 'PostgreSQL', 'Redis', 'Docker'],
      social: {
        linkedin: 'https://linkedin.com/in/davidkim',
        github: 'https://github.com/davidkim',
        medium: 'https://medium.com/@davidkim'
      }
    },
    {
      name: 'Lisa Chen',
      position: 'Product Manager',
      photo: 'assets/media/avatars/300-4.jpg',
      bio: 'Strategic product leader with 12 years experience bringing complex software products to market.',
      skills: ['Product Strategy', 'Agile', 'Market Research', 'Analytics'],
      social: {
        linkedin: 'https://linkedin.com/in/lisachen',
        twitter: 'https://twitter.com/lisachen',
        medium: 'https://medium.com/@lisachen'
      }
    },
    {
      name: 'James Wilson',
      position: 'DevOps Engineer',
      photo: 'assets/media/avatars/300-5.jpg',
      bio: 'Infrastructure automation expert ensuring 99.9% uptime and seamless deployments.',
      skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Monitoring'],
      social: {
        linkedin: 'https://linkedin.com/in/jameswilson',
        github: 'https://github.com/jameswilson'
      }
    },
    {
      name: 'Sophie Martin',
      position: 'QA Lead',
      photo: 'assets/media/avatars/300-6.jpg',
      bio: 'Quality assurance specialist ensuring robust, bug-free software through comprehensive testing strategies.',
      skills: ['Test Automation', 'Selenium', 'API Testing', 'Performance Testing'],
      social: {
        linkedin: 'https://linkedin.com/in/sophiemartin',
        github: 'https://github.com/sophiemartin'
      }
    }
  ];
}

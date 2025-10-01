import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HasPermissionDirective} from '../../../../../directives/has-permission.directive'
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface MenuItem {
  title: string;
  icon?: string;
  permission?: string;
  route?: string;
  active?: boolean;
  children?: MenuItem[];
  isAccordion?: boolean;
  isHeader?: boolean;
  hasExpandCollapse?: boolean;
  expandCollapseId?: string;
  expandCollapseText?: string;
  expandCollapseHiddenItems?: number;
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule,HasPermissionDirective,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {
  
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to router events to update active states
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveStates(event.url);
      });

    // Set initial active state
    this.updateActiveStates(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateActiveStates(currentUrl: string): void {
    // Reset all active states
    this.menuItems.forEach(menuItem => {
      menuItem.active = false;
      if (menuItem.children) {
        menuItem.children.forEach(subItem => {
          subItem.active = false;
        });
      }
    });

    // Set active state based on current route
    this.menuItems.forEach(menuItem => {
      if (menuItem.children) {
        const hasActiveChild = menuItem.children.some(subItem => {
          if (subItem.route) {
            // Check for exact route match or if current URL starts with the route
            const isActive = currentUrl === subItem.route || 
                           (currentUrl.startsWith(subItem.route) && 
                            (currentUrl.charAt(subItem.route.length) === '/' || 
                             currentUrl.charAt(subItem.route.length) === '?' ||
                             currentUrl.length === subItem.route.length));
            
            if (isActive) {
              subItem.active = true;
              return true;
            }
          }
          return false;
        });
        
        // If any child is active, activate the parent accordion
        if (hasActiveChild) {
          menuItem.active = true;
        }
      }
    });
  }
  
  menuItems: MenuItem[] = [

    {
      title: "Users & Permission",
      icon : 'ki-duotone ki-user fs-2',
      isAccordion: true,
      children: [
        {
          title: "Users" ,
          route : '/dashboard/users',
          permission: "user.view.*"
        },
         {
          title: "User Add",
          route: '/dashboard/user-add',
          permission: "user.create.*"

        },
        {
          title: "Roles & Permissions" ,
          route : '/dashboard/roles-permissions',
          permission: "role.view.*"
        },
        {
          title :"Roles & Permissions Add",
          route: '/dashboard/roles-permissions-add',
          permission: "role.create.*"
        },
       
        {
          title: "temp",
          permission: 'temp.navbar.*'
        }
      ]
    },
    {
      title: "Permission Testing",
      icon : 'ki-duotone ki-lock fs-2',
      isAccordion: true,
      children: [
        {
          title: "Inventory" ,
          route : '/dashboard/inventory',
          permission: "inventory.view.*"
        },
        {
          title: "Accounts",
          route : '/dashboard/accounts',
          permission: "accounts.view.*"
        },
        {
          title: "Employees",
          route : '/dashboard/employees',
          permission: "employee.view.*"
        }
      ]

    }
    // {
    //   title: 'Dashboards',
    //   icon: 'ki-duotone ki-category fs-2',
    //   isAccordion: true,
    //   active: true,
    //   children: [
    //     {
    //       title: 'Default',
    //       route: '?page=index',
    //       active: true
    //     },
    //     {
    //       title: 'Projects',
    //       route: '?page=dashboards/projects'
    //     },
    //     {
    //       title: 'eCommerce',
    //       route: '?page=dashboards/ecommerce'
    //     },
    //     {
    //       title: 'Marketing',
    //       route: '?page=dashboards/marketing'
    //     },
    //     {
    //       title: 'Social',
    //       route: '?page=dashboards/social'
    //     },
    //     {
    //       title: 'Bidding',
    //       route: '?page=dashboards/bidding'
    //     },
    //     {
    //       title: 'Online Courses',
    //       route: '?page=dashboards/online-courses'
    //     },
    //     {
    //       title: 'Logistics',
    //       route: '?page=dashboards/logistics'
    //     }
    //   ],
    //   hasExpandCollapse: true,
    //   expandCollapseId: 'kt_app_sidebar_menu_dashboards_collapse',
    //   expandCollapseText: 'Show 4 More',
    //   expandCollapseHiddenItems: 4
    // },
    // {
    //   title: 'Pages',
    //   isHeader: true
    // },
    // {
    //   title: 'User Profile',
    //   icon: 'ki-duotone ki-address-book fs-2',
    //   isAccordion: true,
    //   children: [
    //     {
    //       title: 'Overview',
    //       route: '?page=pages/user-profile/overview'
    //     },
    //     {
    //       title: 'Projects',
    //       route: '?page=pages/user-profile/projects'
    //     },
    //     {
    //       title: 'Campaigns',
    //       route: '?page=pages/user-profile/campaigns'
    //     }
    //   ]
    // }
  ];

}

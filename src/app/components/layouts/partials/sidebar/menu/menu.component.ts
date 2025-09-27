import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  title: string;
  icon?: string;
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
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  menuItems: MenuItem[] = [

    {
      title: "Users",
      icon : 'ki-duotone ki-user fs-2',
      isAccordion: true,
      active: true,
      children: [
        {
          title: "Users" ,
          route : '/dashboard/users'
        },
        {
          title: "Roles & Permissions" ,
          route : '/dashboard/roles-permissions'
        },
        {
          title: "User Add",
          route: '/dashboard/user-add'

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

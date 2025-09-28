import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { DatatableComponent, DatatableColumn, DatatableAction, DatatableConfig } from '../../components/datatable/datatable.component';
import { RoleService, Role } from '../../services/role.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-role',
  imports: [CommonModule, BreadcrumbComponent, DatatableComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  roleData: any[] = [];
  isLoading = false;
  selectedRolePermissions: any[] = [];
  selectedRoleName = '';

  constructor(
    private roleService: RoleService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.isLoading = true;
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data || [];
        this.roleData = this.roles.map(role => ({
          id: role.id,
          name: role.name,
          guard_name: role.guard_name,
          permissions_count: role.permissions ? role.permissions.length : 0,
          permissions: role.permissions ? this.formatPermissionsForDisplay(role.permissions) : 'No permissions',
          raw_permissions: role.permissions || [],
          created_at: role.created_at,
          status: 'Active'
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.toastService.handleApiError(error, 'Failed to load roles');
        this.isLoading = false;
      }
    });
  }

  private formatPermissionsForDisplay(permissions: any[]): string {
    if (!permissions || permissions.length === 0) return 'No permissions';
    
    const formatted = permissions.map(p => {
      // Convert permission names like "delete.account.1" to readable format
      return this.makePermissionReadable(p.name);
    });
    
    // Show first 3 permissions and indicate if there are more
    if (formatted.length <= 3) {
      return formatted.join(', ');
    } else {
      return formatted.slice(0, 3).join(', ') + ` and ${formatted.length - 3} more...`;
    }
  }

  private makePermissionReadable(permission: string): string {
    // Convert permission names to readable format
    const parts = permission.split('.');
    if (parts.length >= 2) {
      const action = parts[0];
      const resource = parts[1];
      const id = parts[2] ? ` ${parts[2]}` : '';
      
      // Capitalize first letter and format
      const readableAction = action.charAt(0).toUpperCase() + action.slice(1);
      const readableResource = resource.charAt(0).toUpperCase() + resource.slice(1);
      
      return `${readableAction} ${readableResource}${id}`;
    }
    return permission;
  }

  // Define table columns
  tableColumns: DatatableColumn[] = [
    {
      key: 'name',
      title: 'Role Name',
      sortable: true,
      type: 'text'
    },
    {
      key: 'guard_name',
      title: 'Guard',
      sortable: true,
      type: 'badge'
    },
    {
      key: 'permissions_count',
      title: 'Permissions Count',
      type: 'number',
      sortable: true
    },
    {
      key: 'permissions',
      title: 'Permissions',
      type: 'text',
      sortable: false
    },
    {
      key: 'created_at',
      title: 'Created At',
      type: 'date',
      sortable: true,
      format: (value) => {
        return new Date(value).toLocaleDateString() + ', ' + 
               new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
    }
  ];

  // Define table actions
  tableActions: DatatableAction[] = [
    {
      label: 'View Permissions',
      icon: 'ki-duotone ki-security-user',
      class: 'btn-light-success',
      action: (row) => this.viewPermissions(row)
    },
    {
      label: 'View',
      icon: 'ki-duotone ki-eye',
      class: 'btn-light-info',
      action: (row) => this.viewRole(row)
    },
    {
      label: 'Edit',
      icon: 'ki-duotone ki-pencil',
      class: 'btn-light-primary',
      action: (row) => this.editRole(row)
    },
    {
      label: 'Delete',
      icon: 'ki-duotone ki-trash',
      class: 'btn-light-danger',
      action: (row) => this.deleteRole(row)
    }
  ];

  // Table configuration
  tableConfig: DatatableConfig = {
    searchPlaceholder: 'Search roles...',
    showSearch: true,
    showExport: true,
    pageSize: 10,
    showPagination: true,
    customButtons: [
      {
        label: 'Add Role',
        icon: 'ki-duotone ki-plus',
        class: 'btn-primary',
        action: () => this.addRole()
      },
      {
        label: 'Refresh',
        icon: 'ki-duotone ki-arrows-circle',
        class: 'btn-light-secondary',
        action: () => this.loadRoles()
      }
    ]
  };

  // Event handlers
  viewRole(role: any) {
    console.log('View role:', role);
    this.router.navigate(['/roles/view', role.id]);
  }

  editRole(role: any) {
    console.log('Edit role:', role);
    this.router.navigate(['/roles/edit', role.id]);
  }

  deleteRole(role: any) {
    console.log('Delete role:', role);
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      this.roleService.deleteRole(role.id).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Role deleted successfully!', 'Success');
          this.loadRoles(); // Refresh the list
        },
        error: (error) => {
          console.error('Failed to delete role:', error);
          this.toastService.handleApiError(error, 'Failed to delete role');
        }
      });
    }
  }

  addRole() {
    console.log('Add new role');
    this.router.navigate(['/roles/add']);
  }

  onRowClick(row: any) {
    console.log('Row clicked:', row);
    this.viewRole(row);
  }

  onExport(event: {type: string, data: any[]}) {
    console.log('Export:', event.type, event.data);
    this.toastService.showInfo(`Exporting ${event.data.length} roles as ${event.type.toUpperCase()}`, 'Export');
    // Implement export logic based on type
    switch(event.type) {
      case 'copy':
        // Copy to clipboard logic
        break;
      case 'excel':
        // Export to Excel logic
        break;
      case 'csv':
        // Export to CSV logic
        break;
      case 'pdf':
        // Export to PDF logic
        break;
    }
  }

  viewPermissions(role: any) {
    this.selectedRoleName = role.name;
    this.selectedRolePermissions = (role.raw_permissions || []).map((permission: any) => ({
      ...permission,
      readable_name: this.makePermissionReadable(permission.name),
      description: this.getPermissionDescription(permission.name)
    }));

    // Trigger modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('kt_modal_permissions');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private getPermissionDescription(permission: string): string {
    const descriptions: { [key: string]: string } = {
      'delete.account.1': 'Delete single account record',
      'delete.account.all': 'Delete all account records',
      'create.user': 'Create new user accounts',
      'edit.user': 'Edit existing user accounts',
      'view.user': 'View user account details',
      'manage.roles': 'Manage user roles and permissions',
      // Add more descriptions as needed
    };

    return descriptions[permission] || 'Permission to perform specific action';
  }
}


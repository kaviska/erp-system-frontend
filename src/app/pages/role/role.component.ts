import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { DatatableComponent, DatatableColumn, DatatableAction, DatatableConfig } from '../../components/datatable/datatable.component';
import { DeleteConfirmationComponent } from '../../components/delete-confirmation/delete-confirmation.component';
import { RoleService, Role } from '../../services/role.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-role',
  imports: [CommonModule, BreadcrumbComponent, DatatableComponent, DeleteConfirmationComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationComponent;

  roles: Role[] = [];
  roleData: any[] = [];
  isLoading = false;
  isDeletingRole = false;
  roleToDelete: any = null;
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
      key: 'permissions_count',
      title: 'Permissions Count',
      type: 'number',
      sortable: true
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
    
    // Set the role to delete and show confirmation modal
    this.roleToDelete = role;
    this.deleteConfirmation.show();
  }

  onDeleteConfirmed() {
    if (!this.roleToDelete) return;
    
    this.isDeletingRole = true;
    
    // Call delete API
    this.roleService.deleteRole(this.roleToDelete.id).subscribe({
      next: (response) => {
        console.log('Role deleted successfully:', response);
        this.toastService.showSuccess(
          `Role "${this.roleToDelete.name}" has been deleted successfully.`,
          'Role Deleted'
        );
        
        // Reload roles data
        this.loadRoles();
        
        // Hide modal and reset state
        this.deleteConfirmation.hide();
        this.isDeletingRole = false;
        this.roleToDelete = null;
      },
      error: (error) => {
        console.error('Failed to delete role:', error);
        const errorMessage = error?.error?.message || 'Failed to delete role. Please try again.';
        this.toastService.showError(errorMessage, 'Delete Failed');
        
        this.isDeletingRole = false;
      }
    });
  }

  onDeleteCancelled() {
    console.log('Delete cancelled');
    this.roleToDelete = null;
    this.isDeletingRole = false;
  }

  addRole() {
    console.log('Add new role');
    this.router.navigate(['dashboard/roles-permissions-add']);
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
       'user.create.*': 'Create Account User',
      'role.create.*': 'Create Account Role',
      'user.update.*': 'Update Account User',
      'user.delete.*': 'Delete Account User',
      'user.view.*': 'View Account User',
      'role.update.*': 'Update Account Role',
      'role.delete.*': 'Delete Account Role',
      'role.view.*': 'View Account Role',
      
      // Add more descriptions as needed
    };

    return descriptions[permission] || 'Permission to perform specific action';
  }
}


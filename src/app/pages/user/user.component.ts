import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { DatatableComponent, DatatableColumn, DatatableAction, DatatableConfig } from '../../components/datatable/datatable.component';
import { DeleteConfirmationComponent } from '../../components/delete-confirmation/delete-confirmation.component';
import { UserUpdateComponent } from '../../components/update/user-update/user-update.component';
import { UserViewComponent } from '../../components/view/user-view/user-view.component';
import { UserService, User } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-user',
  imports: [CommonModule, BreadcrumbComponent, DatatableComponent, DeleteConfirmationComponent, UserUpdateComponent, UserViewComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationComponent;

  users: User[] = [];
  userData: any[] = [];
  isLoading = false;
  isDeletingUser = false;
  userToDelete: any = null;
  
  // Update modal properties
  selectedUserId: number | null = null;
  
  // View modal properties
  selectedViewUserId: number | null = null;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data || response.users || [];
        this.userData = this.users.map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          registered_at: user.created_at,
          role_name: user.roles && user.roles.length > 0 ? user.roles[0].name : 'No Role',
          status: 'Active' // You can add status logic here
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }



  // Define table columns
  tableColumns: DatatableColumn[] = [
    {
      key: 'first_name',
      title: 'First Name',
      sortable: true,
      type: 'text'
    },
    {
      key: 'last_name',
      title: 'Last Name',
      sortable: true,
      type: 'text'
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      type: 'email'
    },
    {
      key: 'registered_at',
      title: 'Registered At',
      type: 'date',
      sortable: true,
      format: (value) => {
        return new Date(value).toLocaleDateString() + ', ' + 
               new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
    },
    {
      key: 'role_name',
      title: 'Role',
      type: 'badge',
      sortable: true
    }
  ];

  // Define table actions
  tableActions: DatatableAction[] = [
    {
      label: 'View',
      icon: 'ki-duotone ki-eye',
      class: 'btn-light-info',
      action: (row) => this.viewUser(row)
    },
    {
      label: 'Edit',
      icon: 'ki-duotone ki-pencil',
      class: 'btn-light-primary',
      action: (row) => this.editUser(row)
    },
    {
      label: 'Delete',
      icon: 'ki-duotone ki-trash',
      class: 'btn-light-danger',
      action: (row) => this.deleteUser(row)
    }
  ];

  // Table configuration
  tableConfig: DatatableConfig = {
    searchPlaceholder: 'Search users...',
    showSearch: true,
    showExport: true,
    pageSize: 10,
    showPagination: true,
    customButtons: [
      {
        label: 'Add User',
        icon: 'ki-duotone ki-plus',
        class: 'btn-primary',
        action: () => this.addUser()
      },
      {
        label: 'Refresh',
        icon: 'ki-duotone ki-arrows-circle',
        class: 'btn-light-secondary',
        action: () => this.loadUsers()
      }
    ]
  };

  // Event handlers
  

  viewUser(user: any) {
    console.log('View user:', user);
    this.selectedViewUserId = user.id;
  }

  editUser(user: any) {
    console.log('Edit user:', user);
    this.selectedUserId = user.id;
  }

  onUserUpdated() {
    this.loadUsers();
  }

  onModalClosed() {
    this.selectedUserId = null;
  }

  onViewModalClosed() {
    this.selectedViewUserId = null;
  }

  deleteUser(user: any) {
    console.log('Delete user:', user);
    
    // Set the user to delete and show confirmation modal
    this.userToDelete = user;
    this.deleteConfirmation.show();
  }

  onDeleteConfirmed() {
    if (!this.userToDelete) return;
    
    this.isDeletingUser = true;
    
    // Call delete API
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        this.toastService.showSuccess(
          `User ${this.userToDelete.first_name} ${this.userToDelete.last_name} has been deleted successfully.`,
          'User Deleted'
        );
        
        // Reload users data
        this.loadUsers();
        
        // Hide modal and reset state
        this.deleteConfirmation.hide();
        this.isDeletingUser = false;
        this.userToDelete = null;
      },
      error: (error) => {
        console.error('Failed to delete user:', error);
        const errorMessage = error?.error?.message || 'Failed to delete user. Please try again.';
        this.toastService.showError(errorMessage, 'Delete Failed');
        
        this.isDeletingUser = false;
      }
    });
  }

  onDeleteCancelled() {
    console.log('Delete cancelled');
    this.userToDelete = null;
    this.isDeletingUser = false;
  }

  addUser() {
    console.log('Add new user');
    // Implement add logic here - maybe navigate to add user page
  }

  onRowClick(row: any) {
    console.log('Row clicked:', row);
    // Handle row click - maybe navigate to user details
  }

  onExport(event: {type: string, data: any[]}) {
    console.log('Export:', event.type, event.data);
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

}

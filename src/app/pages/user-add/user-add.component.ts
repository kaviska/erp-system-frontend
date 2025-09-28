import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { UserService,Role } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user-add',
  imports: [CommonModule, FormGeneratorComponent, RouterModule,BreadcrumbComponent],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent implements OnInit {
  formConfig!: FormConfig;
  loading = false;
  initialData: any = {};
  roles: Role[] = [];


  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.initializeFormConfig();
  }

  loadRoles() {
    this.userService.getRole().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.updateRoleOptions();
      },
      error: (err) => {
        console.error('Failed to fetch roles', err);
        this.toastService.handleApiError(err, 'Failed to fetch roles');
      }
    });
  }

  updateRoleOptions() {
    if (this.formConfig && this.formConfig.fields) {
      const roleField = this.formConfig.fields.find(field => field.name === 'role');
      if (roleField) {
        roleField.options = this.roles.map(role => ({
          value: role.id,  // Remove .toString() to keep as number
          label: role.name
        }));
        
        // Trigger form re-initialization to update validators
        this.initializeFormConfig();
      }
    }
  }

  private initializeFormConfig() {
    this.formConfig = {
      fields: [
        {
          name: 'first_name',
          label: 'First Name',
          permission: "always-allow",

          type: 'text',
          placeholder: 'Enter first name',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 50
          }
        },
        {
          name: 'last_name',
          permission: "always-allow",

          label: 'Last Name',
          type: 'text',
          placeholder: 'Enter last name',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 50
          }
        },
        {
          name: 'email',
          permission: "always-allow",

          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter email address',
          validation: {
            required: true,
            email: true
          },
         
        
        },
        {
          name: 'password',
          permission: "always-allow",

          label: 'Password',
          type: 'password',
          placeholder: 'Enter password',
          validation: {
            required: true,
            minLength: 8
          }
        },
        {
          name: 'password_confirmation',
          permission: "always-allow",

          label: 'Confirm Password',
          type: 'password',
          placeholder: 'Confirm password',
          validation: {
            required: true,
            minLength: 8
          }
        },
        {
          name: 'role',
          label: 'User Role',
          permission: "always-allow",

          type: 'select',
          placeholder: 'Select user role',
          validation: {
            required: true
          },
          options: this.roles.map(role => ({
            value: role.id,  // Keep as number
            label: role.name
          })),
          style: 'solid'
        },
        {
          name: "Test Permission",
        permission: "temp.navbar.*",
        type: 'text',
        placeholder: 'This field requires test-permission',
        label: 'Test Permission Field',
        
        }
      
       
      ],
      submitButtonText: 'Create User',
      resetButtonText: 'Clear Form',
      showResetButton: true
    };

    // Set some default values
    this.initialData = {
      is_active: true,
      notification_preference: 'email'
      // Don't set role here, let user select
    };
  }

  onFormSubmit(formData: any) {
    console.log('Form submitted with data:', formData);
    
    // Validate password confirmation
    if (formData.password !== formData.password_confirmation) {
      this.toastService.showWarning('Passwords do not match!', 'Validation Error');
      return;
    }

    this.loading = true;

    // Prepare data for API (remove password_confirmation)
    const userData = { ...formData };
    delete userData.password_confirmation;
    
    // Call the API to create user
    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.toastService.showSuccess('User has been created successfully!', 'Success');
        this.loading = false;
        
       
        
        // Alternatively, reset form if staying on the same page
         this.onFormReset();
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.loading = false;
        // Show actual error message from API if available
        const apiErrorMsg = err?.error?.errors || err?.error?.message || 'Failed to create user. Please try again.';
        this.toastService.showError(apiErrorMsg, 'Error');
      }
    });
  }

  onFormReset() {
    console.log('Form reset');
    // Reset to initial data
    this.initialData = {
      is_active: true,
      notification_preference: 'email'
      // Don't set role here, let user select
    };
  }

  onFormChange(formData: any) {
    console.log('Form data changed:', formData);
    // You can perform real-time validation or other actions here
  }

  onFieldChange(fieldChange: {fieldName: string, value: any}) {
    console.log('Field changed:', fieldChange.fieldName, fieldChange.value);
    
    // Example: If role changes to admin, require additional fields
    if (fieldChange.fieldName === 'role' && fieldChange.value === 'admin') {
      // You could dynamically update form configuration here
      console.log('Admin role selected - additional validation may be required');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { UserService,Role } from '../../services/user.service';

declare var toastr: any;

@Component({
  selector: 'app-user-add',
  imports: [FormGeneratorComponent, RouterModule],
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
    private router: Router
  ) {
    this.initializeToastr();
  }

  ngOnInit() {
    this.loadRoles();
    this.initializeFormConfig();
  }

  private initializeToastr(): void {
    if (typeof toastr !== 'undefined') {
      toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toastr-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };
    }
  }

  loadRoles() {
    this.userService.getRole().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.updateRoleOptions();
      },
      error: (err) => {
        console.error('Failed to fetch roles', err);
        this.showErrorToast('Failed to load user roles. Please refresh the page.', 'Loading Error');
      }
    });
  }

  updateRoleOptions() {
    if (this.formConfig && this.formConfig.fields) {
      const roleField = this.formConfig.fields.find(field => field.name === 'role');
      if (roleField) {
        roleField.options = this.roles.map(role => ({
          value: role.id.toString(),
          label: role.name
        }));
      }
    }
  }

  private initializeFormConfig() {
    this.formConfig = {
      fields: [
        {
          name: 'first_name',
          label: 'First Name',
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
          type: 'select',
          placeholder: 'Select user role',
          validation: {
            required: true
          },
          options: [], // Will be populated dynamically from API
          style: 'solid'
        },
       
      ],
      submitButtonText: 'Create User',
      resetButtonText: 'Clear Form',
      showResetButton: true
    };

    // Set some default values
    this.initialData = {
      is_active: true,
      // role will be set by user selection
      notification_preference: 'email'
    };
  }

  onFormSubmit(formData: any) {
    console.log('Form submitted with data:', formData);
    
    // Validate password confirmation
    if (formData.password !== formData.password_confirmation) {
      this.showErrorToast('Passwords do not match!', 'Validation Error');
      return;
    }

    this.loading = true;

    // Prepare data for API (remove password_confirmation and convert role to integer)
    const userData = { ...formData };
    delete userData.password_confirmation;
    
    // Convert role ID from string to integer
    if (userData.role) {
      userData.role = parseInt(userData.role, 10);
    }
    
    // Call the API to create user
    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.showSuccessToast('User has been created successfully!', 'Success');
        this.loading = false;
        // Navigate to user list or reset form
        // Uncomment the line below if you want to navigate to users list
        // setTimeout(() => {
        //   this.router.navigate(['/users']);
        // }, 1500);
        this.onFormReset();
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.handleCreateUserError(err);
        this.loading = false;
      }
    });
  }

  onFormReset() {
    console.log('Form reset');
    // Reset to initial data
    this.initialData = {
      is_active: true,
      // role will be set by user selection
      notification_preference: 'email'
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

  private handleCreateUserError(error: any): void {
    let errorMessage = 'Failed to create user. Please try again.';
    let errorTitle = 'Create User Failed';
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      }
      
      // Handle validation errors
      if (error.error.errors) {
        if (typeof error.error.errors === 'string') {
          errorMessage = error.error.errors;
        } else if (typeof error.error.errors === 'object') {
          // Handle validation errors object
          const firstError = Object.values(error.error.errors)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0] as string;
          } else {
            errorMessage = firstError as string;
          }
        }
        errorTitle = 'Validation Error';
      }
    }

    // Map specific error status codes
    switch (error.status) {
      case 422:
        this.showWarningToast(errorMessage, errorTitle);
        break;
      case 400:
        this.showWarningToast(errorMessage, 'Bad Request');
        break;
      case 500:
        this.showErrorToast('Server error occurred. Please try again later.', 'Server Error');
        break;
      case 0:
        this.showErrorToast('Unable to connect to server. Please check your connection.', 'Connection Error');
        break;
      default:
        this.showErrorToast(errorMessage, errorTitle);
    }
  }

  private showSuccessToast(message: string, title: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.success(message, title);
    }
  }

  private showErrorToast(message: string, title: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.error(message, title);
    }
  }

  private showWarningToast(message: string, title: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.warning(message, title);
    }
  }

  private showInfoToast(message: string, title: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.info(message, title);
    }
  }
}

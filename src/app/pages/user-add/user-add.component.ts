import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { UserService,Role } from '../../services/user.service';

@Component({
  selector: 'app-user-add',
  imports: [CommonModule, FormGeneratorComponent, RouterModule],
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
      alert('Passwords do not match!');
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
        alert('User created successfully!');
        this.loading = false;
        // Navigate to user list or reset form
        // Uncomment the line below if you want to navigate to users list
        // this.router.navigate(['/users']);
        this.onFormReset();
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        alert('Failed to create user. Please try again.');
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
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { ToastService } from '../../services/toast.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-inventory-test',
  imports: [CommonModule, FormGeneratorComponent, RouterModule, BreadcrumbComponent],
  templateUrl: './inventory-test.component.html',
  styleUrl: './inventory-test.component.css'
})
export class InventoryTestComponent implements OnInit {
  formConfig!: FormConfig;
  loading = false;
  initialData: any = {};

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.initializeFormConfig();
  }

  private initializeFormConfig() {
    this.formConfig = {
      fields: [
        {
          name: 'username',
          label: 'Username',
          permission: "inventory.username.view",
          type: 'text',
          placeholder: 'Enter username',
          validation: {
            required: true,
            minLength: 3,
            maxLength: 50
          }
        },
        {
          name: 'email',
          label: 'Email Address',
          permission: "inventory.email.view",
          type: 'email',
          placeholder: 'Enter email address',
          validation: {
            required: true,
            email: true
          }
        },
        {
          name: 'password',
          label: 'Password',
          permission: "inventory.password.view",
          type: 'password',
          placeholder: 'Enter password',
          validation: {
            required: true,
            minLength: 8
          }
        },
        {
          name: 'confirm_password',
          label: 'Confirm Password',
          permission: "inventory.confirm_password.view",
          type: 'password',
          placeholder: 'Confirm password',
          validation: {
            required: true,
            minLength: 8
          }
        },
        {
          name: 'role',
          label: 'Role',
          permission: "inventory.role.view",
          type: 'select',
          placeholder: 'Select role',
          validation: {
            required: true
          },
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Manager' },
            { value: 'staff', label: 'Staff' },
            { value: 'guest', label: 'Guest' }
          ],
          style: 'solid'
        },
        {
          name: 'phone',
          label: 'Phone Number',
          permission: "inventory.phone.view",
          type: 'text',
          placeholder: 'Enter phone number',
          validation: {
            required: true,
            pattern: '^[0-9+\\-\\s()]+$'
          }
        },
        {
          name: 'status',
          label: 'Status',
          permission: "inventory.status.view",
          type: 'select',
          placeholder: 'Select status',
          validation: {
            required: true
          },
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ],
          style: 'solid'
        }
      ],
      submitButtonText: 'Submit Inventory Form',
      resetButtonText: 'Clear Form',
      showResetButton: true
    };

    // Set some default values
    this.initialData = {
      status: 'active'
    };
  }

  onFormSubmit(formData: any) {
    console.log('Inventory form submitted with data:', formData);
    
    // Validate password confirmation
    if (formData.password !== formData.confirm_password) {
      this.toastService.showWarning('Passwords do not match!', 'Validation Error');
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Inventory form processed successfully:', formData);
      this.toastService.showSuccess('Inventory form has been submitted successfully!', 'Success');
      this.loading = false;
      this.onFormReset();
    }, 2000);
  }

  onFormReset() {
    console.log('Inventory form reset');
    this.initialData = {
      status: 'active'
    };
  }

  onFormChange(formData: any) {
    console.log('Inventory form data changed:', formData);
  }

  onFieldChange(fieldChange: {fieldName: string, value: any}) {
    console.log('Inventory field changed:', fieldChange.fieldName, fieldChange.value);
    
    if (fieldChange.fieldName === 'role' && fieldChange.value === 'admin') {
      console.log('Admin role selected - additional validation may be required');
    }
  }
}

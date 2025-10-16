import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { RoleService } from '../../services/role.service';
import { ToastService } from '../../services/toast.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-role-add',
  imports: [CommonModule, FormGeneratorComponent, RouterModule, BreadcrumbComponent],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css'
})
export class RoleAddComponent implements OnInit {
  formConfig!: FormConfig;
  loading = false;
  initialData: any = {};

  constructor(
    private roleService: RoleService,
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
          name: 'name',
          label: 'Role Name',
          permission: "always-allow",
          type: 'text',
          placeholder: 'Enter role name (e.g., Book Keeper, Manager)',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 100
          },
          fullWidth: true
        },
        {
          name: 'permissions',
          label: 'Permissions',
          permission: "always-allow",
          type: 'checkbox-group',
          validation: {
            required: true
          },
          fullWidth: true,
          groups: [
            {
              title: 'Dashboard & Navigation',
              options: [
                { value: 'dashboard.view.*', label: 'View Dashboard' },
                { value: 'sidebar.navigation.*', label: 'Sidebar Navigation Access' },
                { value: 'temp.navbar.*', label: 'Temp Navigation Bar Access' }
              ]
            },
            {
              title: 'User Management',
              options: [
                { value: 'user.create.*', label: 'Create Users' },
                { value: 'user.update.*', label: 'Update Users' },
                { value: 'user.delete.*', label: 'Delete Users' },
                { value: 'user.view.*', label: 'View Users' },
                { value: 'user.tempFiled.*', label: 'User Temp Field Access' }
              ]
            },
            {
              title: 'Role Management',
              options: [
                { value: 'role.create.*', label: 'Create Roles' },
                { value: 'role.update.*', label: 'Update Roles' },
                { value: 'role.delete.*', label: 'Delete Roles' },
                { value: 'role.view.*', label: 'View Roles' }
              ]
            },
            {
              title: 'Inventory Management Permissions',
              options: [
                { value: 'inventory.view.*', label: 'View Inventory Module' },
                { value: 'inventory.username.view', label: 'View Username Field' },
                { value: 'inventory.email.view', label: 'View Email Field' },
                { value: 'inventory.password.view', label: 'View Password Field' },
                { value: 'inventory.confirm_password.view', label: 'View Confirm Password Field' },
                { value: 'inventory.role.view', label: 'View Role Field' },
                { value: 'inventory.phone.view', label: 'View Phone Field' },
                { value: 'inventory.status.view', label: 'View Status Field' },
                { value: 'inventory.create.*', label: 'Create Inventory Records' },
                { value: 'inventory.update.*', label: 'Update Inventory Records' },
                { value: 'inventory.delete.*', label: 'Delete Inventory Records' }
              ]
            },
            {
              title: 'Accounts/Finance Management Permissions',
              options: [
                { value: 'accounts.view.*', label: 'View Accounts Module' },
                { value: 'accounts.invoice_number.view', label: 'View Invoice Number Field' },
                { value: 'accounts.customer_name.view', label: 'View Customer Name Field' },
                { value: 'accounts.amount.view', label: 'View Amount Field' },
                { value: 'accounts.tax_percentage.view', label: 'View Tax Percentage Field' },
                { value: 'accounts.total_amount.view', label: 'View Total Amount Field' },
                { value: 'accounts.payment_method.view', label: 'View Payment Method Field' },
                { value: 'accounts.payment_status.view', label: 'View Payment Status Field' },
                { value: 'accounts.due_date.view', label: 'View Due Date Field' },
                { value: 'accounts.create.*', label: 'Create Financial Records' },
                { value: 'accounts.update.*', label: 'Update Financial Records' },
                { value: 'accounts.delete.*', label: 'Delete Financial Records' }
              ]
            },
            {
              title: 'Employee Management Permissions',
              options: [
                { value: 'employee.view.*', label: 'View Employee Module' },
                { value: 'employee.employee_id.view', label: 'View Employee ID Field' },
                { value: 'employee.full_name.view', label: 'View Full Name Field' },
                { value: 'employee.email.view', label: 'View Employee Email Field' },
                { value: 'employee.phone.view', label: 'View Employee Phone Field' },
                { value: 'employee.department.view', label: 'View Department Field' },
                { value: 'employee.designation.view', label: 'View Designation Field' },
                { value: 'employee.joining_date.view', label: 'View Joining Date Field' },
                { value: 'employee.salary.view', label: 'View Salary Field' },
                { value: 'employee.employment_type.view', label: 'View Employment Type Field' },
                { value: 'employee.status.view', label: 'View Employee Status Field' },
                { value: 'employee.create.*', label: 'Create Employee Records' },
                { value: 'employee.update.*', label: 'Update Employee Records' },
                { value: 'employee.delete.*', label: 'Delete Employee Records' }
              ]
            },
          ]
        }
      ],
      submitButtonText: 'Create Role',
      resetButtonText: 'Clear Form',
      showResetButton: true
    };

    // Set default values
    this.initialData = {
      permissions: []
    };
  }

  onFormSubmit(formData: any) {
    console.log('Form submitted with data:', formData);
    
    this.loading = true;

    // Call the API to create role
    this.roleService.createRole(formData).subscribe({
      next: (response) => {
        console.log('Role created successfully:', response);
        this.toastService.showSuccess('Role has been created successfully!', 'Success');
        this.loading = false;
        
        // Reset form after successful creation
        this.onFormReset();
        
        // Optionally navigate to roles list
        // this.router.navigate(['/roles']);
      },
      error: (err) => {
        console.error('Failed to create role:', err);
        this.loading = false;
        
        // Handle error response
        const apiErrorMsg = err?.error?.errors || err?.error?.message || 'Failed to create role. Please try again.';
        this.toastService.showError(apiErrorMsg, 'Error');
      }
    });
  }

  onFormReset() {
    console.log('Form reset');
    // Reset to initial data
    this.initialData = {
      permissions: []
    };
  }

  onFormChange(formData: any) {
    console.log('Form data changed:', formData);
    // You can perform real-time validation or other actions here
  }

  onFieldChange(fieldChange: {fieldName: string, value: any}) {
    console.log('Field changed:', fieldChange.fieldName, fieldChange.value);
    
    // Example: Log permission selections
    if (fieldChange.fieldName === 'permissions') {
      console.log('Selected permissions:', fieldChange.value);
    }
  }
}

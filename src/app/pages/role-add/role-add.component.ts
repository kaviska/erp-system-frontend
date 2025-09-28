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
              title: "Temp Nav Bar",
              options: [
                { value: 'temp.navbar.*', label: 'Temp Nav Bar Access' }
              ]
            },

            {
              title: 'Account Management',
              options: [
                { value: 'create.account.*', label: 'Create Accounts' },
                { value: 'update.account.*', label: 'Update Accounts' },
                { value: 'delete.account.*', label: 'Delete Accounts' },
                { value: 'view.account.*', label: 'View Accounts' }
              ]
            },
            {
              title: 'System Administration',
              options: [
                { value: 'system.settings.*', label: 'System Settings' },
                { value: 'system.backup.*', label: 'System Backup' },
                { value: 'system.logs.*', label: 'View System Logs' },
                { value: 'system.maintenance.*', label: 'System Maintenance' }
              ]
            }
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

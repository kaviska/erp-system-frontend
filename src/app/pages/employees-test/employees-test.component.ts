import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { ToastService } from '../../services/toast.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-employees-test',
  imports: [CommonModule, FormGeneratorComponent, RouterModule, BreadcrumbComponent],
  templateUrl: './employees-test.component.html',
  styleUrl: './employees-test.component.css'
})
export class EmployeesTestComponent implements OnInit {
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
          name: 'employee_id',
          label: 'Employee ID',
          permission: "employee.employee_id.view",
          type: 'text',
          placeholder: 'Enter employee ID',
          validation: {
            required: true,
            minLength: 3,
            maxLength: 20
          }
        },
        {
          name: 'full_name',
          label: 'Full Name',
          permission: "employee.full_name.view",
          type: 'text',
          placeholder: 'Enter full name',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 100
          }
        },
        {
          name: 'email',
          label: 'Email Address',
          permission: "employee.email.view",
          type: 'email',
          placeholder: 'Enter email address',
          validation: {
            required: true,
            email: true
          }
        },
        {
          name: 'phone',
          label: 'Phone Number',
          permission: "employee.phone.view",
          type: 'text',
          placeholder: 'Enter phone number',
          validation: {
            required: true,
            pattern: '^[0-9+\\-\\s()]+$'
          }
        },
        {
          name: 'department',
          label: 'Department',
          permission: "employee.department.view",
          type: 'select',
          placeholder: 'Select department',
          validation: {
            required: true
          },
          options: [
            { value: 'hr', label: 'HR' },
            { value: 'finance', label: 'Finance' },
            { value: 'it', label: 'IT' },
            { value: 'sales', label: 'Sales' },
            { value: 'operations', label: 'Operations' }
          ],
          style: 'solid'
        },
        {
          name: 'designation',
          label: 'Designation',
          permission: "employee.designation.view",
          type: 'text',
          placeholder: 'Enter designation',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 50
          }
        },
        {
          name: 'joining_date',
          label: 'Joining Date',
          permission: "employee.joining_date.view",
          type: 'date',
          placeholder: 'Select joining date',
          validation: {
            required: true
          }
        },
        {
          name: 'salary',
          label: 'Salary',
          permission: "employee.salary.view",
          type: 'number',
          placeholder: 'Enter salary',
          validation: {
            required: true,
            min: 0
          }
        },
        {
          name: 'employment_type',
          label: 'Employment Type',
          permission: "employee.employment_type.view",
          type: 'select',
          placeholder: 'Select employment type',
          validation: {
            required: true
          },
          options: [
            { value: 'full_time', label: 'Full-time' },
            { value: 'part_time', label: 'Part-time' },
            { value: 'contract', label: 'Contract' }
          ],
          style: 'solid'
        },
        {
          name: 'status',
          label: 'Status',
          permission: "employee.status.view",
          type: 'select',
          placeholder: 'Select status',
          validation: {
            required: true
          },
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'on_leave', label: 'On Leave' }
          ],
          style: 'solid'
        }
      ],
      submitButtonText: 'Submit Employee Form',
      resetButtonText: 'Clear Form',
      showResetButton: true
    };

    // Set some default values
    this.initialData = {
      employment_type: 'full_time',
      status: 'active'
    };
  }

  onFormSubmit(formData: any) {
    console.log('Employees form submitted with data:', formData);
    
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Employees form processed successfully:', formData);
      this.toastService.showSuccess('Employee form has been submitted successfully!', 'Success');
      this.loading = false;
      this.onFormReset();
    }, 2000);
  }

  onFormReset() {
    console.log('Employees form reset');
    this.initialData = {
      employment_type: 'full_time',
      status: 'active'
    };
  }

  onFormChange(formData: any) {
    console.log('Employees form data changed:', formData);
  }

  onFieldChange(fieldChange: {fieldName: string, value: any}) {
    console.log('Employees field changed:', fieldChange.fieldName, fieldChange.value);
    
    if (fieldChange.fieldName === 'department' && fieldChange.value === 'hr') {
      console.log('HR department selected - may require special permissions');
    }
    
    if (fieldChange.fieldName === 'employment_type' && fieldChange.value === 'contract') {
      console.log('Contract employment selected - may need different salary structure');
    }
  }
}

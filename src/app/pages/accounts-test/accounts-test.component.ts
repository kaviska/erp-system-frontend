import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent, FormConfig } from '../../components/form-generator/form-generator.component';
import { ToastService } from '../../services/toast.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-accounts-test',
  imports: [CommonModule, FormGeneratorComponent, RouterModule, BreadcrumbComponent],
  templateUrl: './accounts-test.component.html',
  styleUrl: './accounts-test.component.css'
})
export class AccountsTestComponent implements OnInit {
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
          name: 'invoice_number',
          label: 'Invoice Number',
          permission: "accounts.invoice_number.view",
          type: 'text',
          placeholder: 'Enter invoice number',
          validation: {
            required: true,
            minLength: 3,
            maxLength: 20
          }
        },
        {
          name: 'customer_name',
          label: 'Customer Name',
          permission: "accounts.customer_name.view",
          type: 'text',
          placeholder: 'Enter customer name',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 100
          }
        },
        {
          name: 'amount',
          label: 'Amount',
          permission: "accounts.amount.view",
          type: 'number',
          placeholder: 'Enter amount',
          validation: {
            required: true,
            min: 0
          }
        },
        {
          name: 'tax_percentage',
          label: 'Tax (%)',
          permission: "accounts.tax_percentage.view",
          type: 'number',
          placeholder: 'Enter tax percentage',
          validation: {
            required: true,
            min: 0,
            max: 100
          }
        },
        {
          name: 'total_amount',
          label: 'Total Amount',
          permission: "accounts.total_amount.view",
          type: 'number',
          placeholder: 'Total amount (calculated)',
          validation: {
            required: true,
            min: 0
          },
          readonly: true
        },
        {
          name: 'payment_method',
          label: 'Payment Method',
          permission: "accounts.payment_method.view",
          type: 'select',
          placeholder: 'Select payment method',
          validation: {
            required: true
          },
          options: [
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' }
          ],
          style: 'solid'
        },
        {
          name: 'payment_status',
          label: 'Payment Status',
          permission: "accounts.payment_status.view",
          type: 'select',
          placeholder: 'Select payment status',
          validation: {
            required: true
          },
          options: [
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
            { value: 'overdue', label: 'Overdue' }
          ],
          style: 'solid'
        },
        {
          name: 'due_date',
          label: 'Due Date',
          permission: "accounts.due_date.view",
          type: 'date',
          placeholder: 'Select due date',
          validation: {
            required: true
          }
        }
      ],
      submitButtonText: 'Submit Finance Form',
      resetButtonText: 'Clear Form',
      showResetButton: true
    };

    // Set some default values
    this.initialData = {
      tax_percentage: 18,
      payment_status: 'pending'
    };
  }

  onFormSubmit(formData: any) {
    console.log('Accounts form submitted with data:', formData);
    
    this.loading = true;

    // Calculate total amount if not already calculated
    if (formData.amount && formData.tax_percentage) {
      const taxAmount = (formData.amount * formData.tax_percentage) / 100;
      formData.total_amount = formData.amount + taxAmount;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Accounts form processed successfully:', formData);
      this.toastService.showSuccess('Finance form has been submitted successfully!', 'Success');
      this.loading = false;
      this.onFormReset();
    }, 2000);
  }

  onFormReset() {
    console.log('Accounts form reset');
    this.initialData = {
      tax_percentage: 18,
      payment_status: 'pending'
    };
  }

  onFormChange(formData: any) {
    console.log('Accounts form data changed:', formData);
    
    // Auto-calculate total amount when amount or tax changes
    if (formData.amount && formData.tax_percentage) {
      const taxAmount = (formData.amount * formData.tax_percentage) / 100;
      const totalAmount = formData.amount + taxAmount;
      
      // Update total amount field if it exists
      if (this.formConfig && this.formConfig.fields) {
        const totalField = this.formConfig.fields.find(field => field.name === 'total_amount');
        if (totalField) {
          // Trigger form update with calculated total
          setTimeout(() => {
            const formElement = document.querySelector('input[name="total_amount"]') as HTMLInputElement;
            if (formElement) {
              formElement.value = totalAmount.toFixed(2);
              formElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }, 100);
        }
      }
    }
  }

  onFieldChange(fieldChange: {fieldName: string, value: any}) {
    console.log('Accounts field changed:', fieldChange.fieldName, fieldChange.value);
    
    if (fieldChange.fieldName === 'payment_method' && fieldChange.value === 'cash') {
      console.log('Cash payment selected - may require special handling');
    }
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

export interface FormField {
  name: string;
  permission?: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'checkbox-group';
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    email?: boolean;
  };
  options?: { value: any; label: string }[]; // For select, radio inputs
  groups?: { title: string; options: { value: any; label: string }[] }[]; // For checkbox-group with headers
  fullWidth?: boolean; // If true, takes full width instead of col-6
  style?: 'default' | 'solid' | 'transparent'; // Input style variants
  size?: 'sm' | 'default' | 'lg'; // Input size variants (sm, default, lg)
  rows?: number; // For textarea
  disabled?: boolean;
  readonly?: boolean;
  multiple?: boolean; // For select
  searchable?: boolean; // Enable Select2 search functionality
  allowClear?: boolean; // Allow clearing Select2 selection
  closeOnSelect?: boolean; // Close dropdown after selection (useful for multiple)
}

export interface FormConfig {
  fields: FormField[];
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
}

@Component({
  selector: 'app-form-generator',
  imports: [CommonModule, ReactiveFormsModule,HasPermissionDirective],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.css'
})
export class FormGeneratorComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() config!: FormConfig;
  @Input() initialData?: any;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();
  @Output() formChange = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<{fieldName: string, value: any}>();

  form!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.form) {
      this.form.patchValue(this.initialData || {});
    }
    if (changes['config'] && !changes['config'].firstChange) {
      this.initializeForm();
    }
  }

  ngAfterViewChecked() {
    this.updateIndeterminateStates();
  }

  private updateIndeterminateStates() {
    if (!this.config?.fields) return;
    
    this.config.fields.forEach(field => {
      if (field.type === 'checkbox-group' && field.groups) {
        field.groups.forEach((group, groupIndex) => {
          if (group.options && group.options.length > 1) {
            const selectAllId = `${field.name}_group_${groupIndex}_select_all`;
            const selectAllElement = document.getElementById(selectAllId) as HTMLInputElement;
            
            if (selectAllElement) {
              const isIndeterminate = this.isGroupSelectAllIndeterminate(field.name, group.options);
              selectAllElement.indeterminate = isIndeterminate;
            }
          }
        });
      }
    });
  }

  private initializeForm() {
    if (!this.config?.fields) return;
    
    const formControls: any = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const initialValue = this.getInitialValue(field);
      
      formControls[field.name] = [
        {value: initialValue, disabled: field.disabled || field.readonly}, 
        validators
      ];
    });

    this.form = this.fb.group(formControls);
    
    // Subscribe to form changes
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value);
    });

    // Subscribe to individual field changes
    Object.keys(formControls).forEach(fieldName => {
      this.form.get(fieldName)?.valueChanges.subscribe(value => {
        this.fieldChange.emit({fieldName, value});
      });
    });
  }

  private getInitialValue(field: FormField): any {
    if (this.initialData && this.initialData[field.name] !== undefined) {
      return this.initialData[field.name];
    }
    
    // Set default values based on field type
    switch (field.type) {
      case 'checkbox':
        return false;
      case 'checkbox-group':
        return []; // Array to store selected checkbox values
      case 'number':
        return null;
      case 'select':
        return field.multiple ? [] : '';  // Use empty string for single select
      default:
        return '';
    }
  }

  private buildValidators(field: FormField) {
    const validators = [];
    
    if (field.validation?.required) {
      // For select fields, use a custom validator that checks for empty string
      if (field.type === 'select') {
        validators.push((control: any) => {
          const value = control.value;
          return (value === null || value === undefined || value === '') ? { required: true } : null;
        });
      } else if (field.type === 'checkbox-group') {
        // For checkbox groups, require at least one selection
        validators.push((control: any) => {
          const value = control.value;
          return (!value || !Array.isArray(value) || value.length === 0) ? { required: true } : null;
        });
      } else {
        validators.push(Validators.required);
      }
    }
    if (field.validation?.email || field.type === 'email') {
      validators.push(Validators.email);
    }
    if (field.validation?.minLength) {
      validators.push(Validators.minLength(field.validation.minLength));
    }
    if (field.validation?.maxLength) {
      validators.push(Validators.maxLength(field.validation.maxLength));
    }
    if (field.validation?.min && (field.type === 'number')) {
      validators.push(Validators.min(field.validation.min));
    }
    if (field.validation?.max && (field.type === 'number')) {
      validators.push(Validators.max(field.validation.max));
    }
    if (field.validation?.pattern) {
      validators.push(Validators.pattern(field.validation.pattern));
    }

    return validators;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const formData = { ...this.form.value };
      
      // Convert string values to numbers for select fields that should be integers
      this.config.fields.forEach(field => {
        if (field.type === 'select' && !field.multiple && formData[field.name]) {
          // Convert to number if the original option value was a number
          const option = field.options?.find(opt => opt.value == formData[field.name]);
          if (option && typeof option.value === 'number') {
            formData[field.name] = Number(formData[field.name]);
          }
        }
      });
      
      this.formSubmit.emit(formData);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onReset() {
    this.form.reset();
    this.submitted = false;
    this.initializeForm(); // Reinitialize with default values
    this.formReset.emit();
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    const fieldConfig = this.config.fields.find(f => f.name === fieldName);
    
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldConfig?.label || fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `Minimum value is ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `Maximum value is ${field.errors['max'].max}`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid format';
      }
    }
    return '';
  }

  getFieldClass(field: FormField): string {
    let cssClass = '';
    
    if (field.type === 'select') {
      cssClass = 'form-select';
      
      // Add size classes
      if (field.size === 'sm') {
        cssClass += ' form-select-sm';
      } else if (field.size === 'lg') {
        cssClass += ' form-select-lg';
      }
      
      // Add style classes
      if (field.style === 'solid') {
        cssClass += ' form-select-solid';
      } else if (field.style === 'transparent') {
        cssClass += ' form-select-transparent';
      }
    } else if (field.type === 'checkbox') {
      cssClass = 'form-check-input';
    } else {
      cssClass = 'form-control';
      
      // Add size classes for regular inputs
      if (field.size === 'sm') {
        cssClass += ' form-control-sm';
      } else if (field.size === 'lg') {
        cssClass += ' form-control-lg';
      }
      
      // Add style classes
      if (field.style === 'solid') {
        cssClass += ' form-control-solid';
      }
    }
    
    return cssClass;
  }

  getColumnClass(field: FormField): string {
    return field.fullWidth ? 'col-12' : 'col-12 col-md-6';
  }

  // Helper method to check if field should show error
  shouldShowError(fieldName: string): boolean {
    return this.isFieldInvalid(fieldName) && this.getFieldError(fieldName) !== '';
  }

  // Helper method to get form control value
  getFieldValue(fieldName: string): any {
    return this.form.get(fieldName)?.value;
  }

  // Helper method to update field value programmatically
  setFieldValue(fieldName: string, value: any): void {
    this.form.get(fieldName)?.setValue(value);
  }

  // Helper method to enable/disable field
  setFieldDisabled(fieldName: string, disabled: boolean): void {
    if (disabled) {
      this.form.get(fieldName)?.disable();
    } else {
      this.form.get(fieldName)?.enable();
    }
  }

  // Helper methods for checkbox groups
  isCheckboxChecked(fieldName: string, value: any): boolean {
    const fieldValue = this.getFieldValue(fieldName);
    return Array.isArray(fieldValue) && fieldValue.includes(value);
  }

  onCheckboxGroupChange(fieldName: string, value: any, checked: boolean): void {
    const currentValue = this.getFieldValue(fieldName) || [];
    let newValue = [...currentValue];

    if (checked) {
      if (!newValue.includes(value)) {
        newValue.push(value);
      }
    } else {
      newValue = newValue.filter(v => v !== value);
    }

    this.setFieldValue(fieldName, newValue);
  }

  // Methods for "Select All" functionality
  isGroupSelectAllChecked(fieldName: string, groupOptions: {value: any, label: string}[]): boolean {
    const fieldValue = this.getFieldValue(fieldName) || [];
    return groupOptions.every(option => fieldValue.includes(option.value));
  }

  isGroupSelectAllIndeterminate(fieldName: string, groupOptions: {value: any, label: string}[]): boolean {
    const fieldValue = this.getFieldValue(fieldName) || [];
    const checkedCount = groupOptions.filter(option => fieldValue.includes(option.value)).length;
    return checkedCount > 0 && checkedCount < groupOptions.length;
  }

  onGroupSelectAllChange(fieldName: string, groupOptions: {value: any, label: string}[], checked: boolean): void {
    const currentValue = this.getFieldValue(fieldName) || [];
    let newValue = [...currentValue];

    if (checked) {
      // Add all group options that aren't already selected
      groupOptions.forEach(option => {
        if (!newValue.includes(option.value)) {
          newValue.push(option.value);
        }
      });
    } else {
      // Remove all group options from selection
      newValue = newValue.filter(value => 
        !groupOptions.some(option => option.value === value)
      );
    }

    this.setFieldValue(fieldName, newValue);
  }
}

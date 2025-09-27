import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ChangePasswordFirstTimeRequest } from '../../services/auth.service';

declare var toastr: any;

@Component({
  selector: 'app-change-password-first-time',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-first-time.component.html',
  styleUrl: './change-password-first-time.component.css'
})
export class ChangePasswordFirstTimeComponent implements OnInit {
  changePasswordForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.configureToastr();
  }

  private initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      password_confirmation: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private passwordStrengthValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
    
    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('password_confirmation');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const password = this.changePasswordForm.get('password')?.value;
      const passwordConfirmation = this.changePasswordForm.get('password_confirmation')?.value;

      this.authService.changePasswordFirstTime(password, passwordConfirmation).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.status === 'success') {
            this.showSuccessToast('Password changed successfully!', 'Success');
            
            // Navigate to dashboard after a short delay
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleError(error: any): void {
    let errorMessage = 'Failed to change password. Please try again.';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.showErrorToast(errorMessage, 'Error');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private showSuccessToast(message: string, title: string): void {
    toastr.success(message, title);
  }

  private showErrorToast(message: string, title: string): void {
    toastr.error(message, title);
  }

  private configureToastr(): void {
    if (typeof toastr !== 'undefined') {
      toastr.options = {
        "closeButton": false,
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

  getPasswordStrengthText(): string {
    const password = this.changePasswordForm.get('password')?.value;
    if (!password) return '';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const score = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial].filter(Boolean).length;

    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }

  getPasswordStrengthClass(): string {
    const password = this.changePasswordForm.get('password')?.value;
    if (!password) return '';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const score = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial].filter(Boolean).length;

    switch (score) {
      case 0:
      case 1:
        return 'text-danger';
      case 2:
        return 'text-warning';
      case 3:
        return 'text-info';
      case 4:
        return 'text-success';
      default:
        return '';
    }
  }
}
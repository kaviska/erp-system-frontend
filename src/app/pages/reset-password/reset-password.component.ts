import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

declare var toastr: any;

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading = false;
  email = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeToastr();
  }

  ngOnInit(): void {
    // Get email from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      if (!this.email) {
        // If no email provided, redirect to forgot password
        this.router.navigate(['/forgot-password']);
        return;
      }
    });

    this.initializeForm();
  }

  private initializeForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom password validator
  private passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8;

    if (!passwordValid) {
      return { 'passwordStrength': true };
    }

    return null;
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(group: AbstractControl): {[key: string]: any} | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
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

  onSubmit(): void {
    if (this.resetPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const password = this.resetPasswordForm.get('password')?.value;
      const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

      this.authService.resetPassword(this.email, password, confirmPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.status === 'success') {
            this.showSuccessToast('Password reset successfully', 'Success');
            
            // Navigate to login page after successful reset
            setTimeout(() => {
              this.router.navigate(['/login'], {
                queryParams: { message: 'Password reset successfully. Please login with your new password.' }
              });
            }, 2000);
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
    let errorMessage = 'Failed to reset password. Please try again.';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Map specific error messages
    switch (error.status) {
      case 400:
        if (errorMessage.includes('OTP')) {
          errorMessage = 'No verified OTP found. Please verify OTP first.';
          this.showErrorToast(errorMessage, 'Verification Required');
          // Redirect back to verify OTP
          setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              queryParams: { email: this.email } 
            });
          }, 2000);
        } else {
          errorMessage = 'Invalid request. Please check your input.';
          this.showErrorToast(errorMessage, 'Validation Error');
        }
        break;
      case 422:
        errorMessage = 'Password validation failed. Please check requirements.';
        this.showWarningToast(errorMessage, 'Validation Error');
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later';
        this.showWarningToast(errorMessage, 'Rate Limited');
        break;
      case 0:
        errorMessage = 'Unable to connect to server. Please check your connection';
        this.showErrorToast(errorMessage, 'Connection Error');
        break;
      default:
        this.showErrorToast(errorMessage, 'Reset Failed');
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

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFormInvalid(): boolean {
    return !!(this.resetPasswordForm.invalid && (this.resetPasswordForm.dirty || this.resetPasswordForm.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  get password() { return this.resetPasswordForm.get('password'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }

  // Password strength checker
  getPasswordStrength(): string {
    const password = this.password?.value || '';
    let score = 0;

    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'strong': return '#198754';
      default: return '#6c757d';
    }
  }

  // Password requirement checkers for template
  hasMinLength(): boolean {
    return (this.password?.value || '').length >= 8;
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password?.value || '');
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.password?.value || '');
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.password?.value || '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password?.value || '');
  }
}
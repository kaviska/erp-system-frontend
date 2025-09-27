import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest, ErrorResponse } from '../../services/auth.service';

declare var toastr: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeToastr();
  }

  ngOnInit(): void {
    this.initializeForm();
    
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
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
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const loginData: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.status === 'success') {
            // Check if user needs to change password first time
            if (response.data.user.is_new_user === 'true') {
              this.showSuccessToast('Please change your password', 'First Time Login');
              
              // Navigate to change password page after a short delay
              setTimeout(() => {
                this.router.navigate(['/change-password-first-time']);
              }, 1500);
            } else {
              this.showSuccessToast('Will Redirect to Home', 'Login Success');
              
              // Navigate to dashboard after a short delay
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1500);
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.handleLoginError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleLoginError(error: any): void {
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Map specific error messages
    switch (error.status) {
      case 401:
        errorMessage = 'Invalid email or password';
        this.showErrorToast(errorMessage, 'Authentication Failed');
        break;
      case 404:
        errorMessage = 'User not found';
        this.showErrorToast(errorMessage, 'User Not Found');
        break;
      case 422:
        errorMessage = 'Please check your input and try again';
        this.showWarningToast(errorMessage, 'Validation Error');
        break;
      case 429:
        errorMessage = 'Too many login attempts. Please try again later';
        this.showWarningToast(errorMessage, 'Rate Limited');
        break;
      case 0:
        errorMessage = 'Unable to connect to server. Please check your connection';
        this.showErrorToast(errorMessage, 'Connection Error');
        break;
      default:
        this.showErrorToast(errorMessage, 'Login Failed');
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

declare var toastr: any;

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeToastr();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
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
    if (this.forgotPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.status === 'success') {
            this.showSuccessToast('OTP sent to your email successfully', 'Check Your Email');
            
            // Navigate to OTP verification with email as parameter
            setTimeout(() => {
              this.router.navigate(['/verify-otp'], { 
                queryParams: { email: email } 
              });
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
    let errorMessage = 'Failed to send OTP. Please try again.';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Map specific error messages
    switch (error.status) {
      case 404:
        errorMessage = 'User not found with this email address';
        this.showErrorToast(errorMessage, 'User Not Found');
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
        this.showErrorToast(errorMessage, 'Request Failed');
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  get email() { return this.forgotPasswordForm.get('email'); }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

declare var toastr: any;

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  verifyOtpForm!: FormGroup;
  isLoading = false;
  email = '';
  countdown = 45; // 45 seconds as per API documentation
  private countdownInterval: any;
  canResend = false;

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
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private initializeForm(): void {
    this.verifyOtpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/), Validators.minLength(6), Validators.maxLength(6)]]
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

  private startCountdown(): void {
    this.countdown = 45;
    this.canResend = false;
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.canResend = true;
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.verifyOtpForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const otp = this.verifyOtpForm.get('otp')?.value;

      this.authService.verifyOtp(this.email, otp).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.status === 'success') {
            this.showSuccessToast('OTP verified successfully', 'Verification Complete');
            
            // Navigate to reset password with email as parameter
            setTimeout(() => {
              this.router.navigate(['/reset-password'], { 
                queryParams: { email: this.email } 
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

  resendOtp(): void {
    if (!this.canResend || this.isLoading) return;

    this.isLoading = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.status === 'success') {
          this.showSuccessToast('New OTP sent to your email', 'OTP Resent');
          this.startCountdown();
          this.verifyOtpForm.get('otp')?.setValue('');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    let errorMessage = 'Failed to verify OTP. Please try again.';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Map specific error messages
    switch (error.status) {
      case 400:
        errorMessage = 'Invalid or expired OTP. Please try again.';
        this.showErrorToast(errorMessage, 'Invalid OTP');
        // Clear the OTP field
        this.verifyOtpForm.get('otp')?.setValue('');
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
        this.showErrorToast(errorMessage, 'Verification Failed');
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
    const field = this.verifyOtpForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.verifyOtpForm.controls).forEach(key => {
      const control = this.verifyOtpForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method for template
  get otp() { return this.verifyOtpForm.get('otp'); }

  // Utility method to get countdown in MM:SS format
  getFormattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Handle OTP input (auto-format and validate)
  onOtpInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 6) {
      value = value.substring(0, 6); // Limit to 6 digits
    }
    this.verifyOtpForm.get('otp')?.setValue(value);
  }
}
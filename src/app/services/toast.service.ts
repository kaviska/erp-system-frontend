import { Injectable } from '@angular/core';

declare var toastr: any;

export interface ToastOptions {
  closeButton?: boolean;
  debug?: boolean;
  newestOnTop?: boolean;
  progressBar?: boolean;
  positionClass?: string;
  preventDuplicates?: boolean;
  onclick?: any;
  showDuration?: string;
  hideDuration?: string;
  timeOut?: string;
  extendedTimeOut?: string;
  showEasing?: string;
  hideEasing?: string;
  showMethod?: string;
  hideMethod?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() {
    this.initializeToastr();
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

  /**
   * Show success toast message
   */
  showSuccess(message: string, title?: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.success(message, title || 'Success');
    }
  }

  /**
   * Show error toast message
   */
  showError(message: string, title?: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.error(message, title || 'Error');
    }
  }

  /**
   * Show warning toast message
   */
  showWarning(message: string, title?: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.warning(message, title || 'Warning');
    }
  }

  /**
   * Show info toast message
   */
  showInfo(message: string, title?: string): void {
    if (typeof toastr !== 'undefined') {
      toastr.info(message, title || 'Info');
    }
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    if (typeof toastr !== 'undefined') {
      toastr.clear();
    }
  }

  /**
   * Remove specific toast
   */
  remove(toast?: any): void {
    if (typeof toastr !== 'undefined') {
      toastr.remove(toast);
    }
  }

  /**
   * Update toast options
   */
  updateOptions(options: ToastOptions): void {
    if (typeof toastr !== 'undefined') {
      Object.assign(toastr.options, options);
    }
  }

  /**
   * Handle API error responses with appropriate toast messages
   */
  handleApiError(error: any, defaultMessage: string = 'An error occurred'): void {
    let errorMessage = defaultMessage;
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Map specific error messages based on status codes
    switch (error.status) {
      case 400:
        this.showWarning(errorMessage, 'Bad Request');
        break;
      case 401:
        this.showError(errorMessage, 'Unauthorized');
        break;
      case 403:
        this.showError(errorMessage, 'Forbidden');
        break;
      case 404:
        this.showWarning(errorMessage, 'Not Found');
        break;
      case 422:
        this.showWarning(errorMessage, 'Validation Error');
        break;
      case 429:
        this.showWarning(errorMessage, 'Rate Limited');
        break;
      case 500:
        this.showError('Internal server error. Please try again later.', 'Server Error');
        break;
      case 0:
        this.showError('Unable to connect to server. Please check your connection.', 'Connection Error');
        break;
      default:
        this.showError(errorMessage, 'Error');
    }
  }
}

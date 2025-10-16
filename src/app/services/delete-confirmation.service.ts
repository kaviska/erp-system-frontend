import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface DeleteConfirmationConfig {
  itemType: string;
  itemName?: string;
  isDestructive?: boolean;
  customMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteConfirmationService {
  private confirmationSubject = new Subject<boolean>();
  private currentConfig: DeleteConfirmationConfig | null = null;

  constructor() {}

  /**
   * Show delete confirmation dialog
   * @param config Configuration for the delete confirmation
   * @returns Observable that emits true if confirmed, false if cancelled
   */
  confirm(config: DeleteConfirmationConfig): Observable<boolean> {
    this.currentConfig = config;
    
    // Create and show modal programmatically
    this.showModal(config);
    
    return this.confirmationSubject.asObservable();
  }

  private showModal(config: DeleteConfirmationConfig) {
    // This would be implemented with dynamic component creation
    // or by using a global modal service
    // For now, we'll use the component directly in templates
  }

  /**
   * Handle confirmation
   */
  onConfirmed() {
    this.confirmationSubject.next(true);
    this.currentConfig = null;
  }

  /**
   * Handle cancellation
   */
  onCancelled() {
    this.confirmationSubject.next(false);
    this.currentConfig = null;
  }

  /**
   * Get current configuration
   */
  getCurrentConfig(): DeleteConfirmationConfig | null {
    return this.currentConfig;
  }
}
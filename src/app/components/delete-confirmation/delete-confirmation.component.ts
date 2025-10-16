import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeleteConfirmationData {
  itemType: string;
  itemName?: string;
  isDestructive?: boolean;
  customMessage?: string;
}

/**
 * Universal Delete Confirmation Component
 * 
 * Usage Example:
 * ```html
 * <app-delete-confirmation
 *   #deleteConfirmation
 *   [itemType]="'user'"
 *   [itemName]="selectedUser?.name"
 *   [isDestructive]="true"
 *   [isLoading]="isDeletingUser"
 *   (confirmed)="onDeleteConfirmed()"
 *   (cancelled)="onDeleteCancelled()">
 * </app-delete-confirmation>
 * ```
 * 
 * And in your component:
 * ```typescript
 * @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationComponent;
 * 
 * showDeleteConfirmation() {
 *   this.deleteConfirmation.show();
 * }
 * ```
 */

@Component({
  selector: 'app-delete-confirmation',
  imports: [CommonModule],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent implements OnInit {
  @Input() modalId: string = 'deleteConfirmationModal';
  @Input() itemType: string = 'item';
  @Input() itemName?: string;
  @Input() isDestructive: boolean = false;
  @Input() customMessage?: string;
  @Input() isLoading: boolean = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    // Generate unique modal ID if not provided
    if (this.modalId === 'deleteConfirmationModal') {
      this.modalId = 'deleteConfirmationModal_' + Math.random().toString(36).substr(2, 9);
    }
  }

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }

  // Method to programmatically show modal
  show() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      // Using Bootstrap 5 modal API
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  // Method to programmatically hide modal
  hide() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  // Static method to show confirmation with configuration
  static showConfirmation(config: DeleteConfirmationData): Promise<boolean> {
    return new Promise((resolve) => {
      // This would be implemented with dynamic component creation
      // For now, we use the template-based approach
      resolve(false);
    });
  }

  // Get display text for the confirmation message
  getConfirmationMessage(): string {
    if (this.customMessage) {
      return this.customMessage;
    }
    
    const itemDisplay = this.itemName ? `"${this.itemName}"` : `this ${this.itemType}`;
    return `${itemDisplay} will be permanently deleted and cannot be recovered.`;
  }

  // Check if the modal is currently visible
  isVisible(): boolean {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      return modal.classList.contains('show');
    }
    return false;
  }
}

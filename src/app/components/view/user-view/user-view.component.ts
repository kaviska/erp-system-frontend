import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-view',
  imports: [CommonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnInit, OnChanges {
  @Input() userId: number | null = null;
  @Output() modalClosed = new EventEmitter<void>();

  selectedUser: User | null = null;
  isLoadingUserData = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // No need to load roles for view-only component
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.openModal();
    }
  }

  openModal() {
    if (!this.userId) return;
    
    this.isLoadingUserData = true;
    this.selectedUser = null;
    
    // Open modal
    const modalElement = document.getElementById('kt_modal_user_view');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
      
      // Add event listener for modal close
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.modalClosed.emit();
      });
    }
    
    // Load user data
    this.userService.getUserById(this.userId).subscribe({
      next: (response: any) => {
        this.selectedUser = response.data || response;
        this.isLoadingUserData = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.toastService.showError('Failed to load user data. Please try again.', 'Error');
        this.isLoadingUserData = false;
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }
}
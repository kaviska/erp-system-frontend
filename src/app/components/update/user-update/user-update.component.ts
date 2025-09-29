import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, Role } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit, OnChanges {
  @Input() userId: number | null = null;
  @Output() userUpdated = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  selectedUser: User | null = null;
  isLoadingUserData = false;
  isUpdatingUser = false;
  availableRoles: Role[] = [];
  
  updateUserData = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    role: ''
  };

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.openModal();
    }
  }

  loadRoles() {
    this.userService.getRole().subscribe({
      next: (response: any) => {
        this.availableRoles = response.data || response.roles || [];
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  openModal() {
    if (!this.userId) return;
    
    this.isLoadingUserData = true;
    this.selectedUser = null;
    
    // Reset update form data
    this.updateUserData = {
      id: this.userId,
      first_name: '',
      last_name: '',
      email: '',
      role: ''
    };
    
    // Open modal
    const modalElement = document.getElementById('kt_modal_user_update');
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
        if (this.selectedUser) {
          this.updateUserData = {
            id: this.selectedUser.id,
            first_name: this.selectedUser.first_name,
            last_name: this.selectedUser.last_name,
            email: this.selectedUser.email,
            role: this.selectedUser.roles && this.selectedUser.roles.length > 0 ? 
                  this.selectedUser.roles[0].id.toString() : ''
          };
        }
        this.isLoadingUserData = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.toastService.showError('Failed to load user data. Please try again.', 'Error');
        this.isLoadingUserData = false;
      }
    });
  }

  onUpdateUser() {
    if (this.isUpdatingUser) return;
    
    // Basic validation
    if (!this.updateUserData.first_name || 
        !this.updateUserData.last_name || 
        !this.updateUserData.email || 
        !this.updateUserData.role) {
      this.toastService.showError('Please fill in all required fields.', 'Validation Error');
      return;
    }
    
    this.isUpdatingUser = true;
    
    const updateData = {
      id: this.updateUserData.id,
      first_name: this.updateUserData.first_name,
      last_name: this.updateUserData.last_name,
      email: this.updateUserData.email,
      role: parseInt(this.updateUserData.role)
    };
    
    this.userService.updateUserWithoutPassword(updateData.id, updateData).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.toastService.showSuccess(
          `User ${updateData.first_name} ${updateData.last_name} has been updated successfully.`,
          'User Updated'
        );
        
        // Close modal
        const modalElement = document.getElementById('kt_modal_user_update');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
        
        // Emit event to parent component
        this.userUpdated.emit();
        
        this.isUpdatingUser = false;
      },
      error: (error) => {
        console.error('Failed to update user:', error);
        const errorMessage = error?.error?.message || 'Failed to update user. Please try again.';
        this.toastService.showError(errorMessage, 'Update Failed');
        
        this.isUpdatingUser = false;
      }
    });
  }

  isUpdateFormValid(): boolean {
    return !!(this.updateUserData.first_name && 
             this.updateUserData.last_name && 
             this.updateUserData.email && 
             this.updateUserData.role);
  }
}

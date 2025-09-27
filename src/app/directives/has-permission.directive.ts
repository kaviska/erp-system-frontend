import { Directive, Input, OnDestroy, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permission!: string;
  private userSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to user changes to update view when permissions change
    this.userSubscription = this.authService.currentUser$.subscribe(() => {
      if (this.permission) {
        this.updateView();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  @Input()
  set appHasPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  private updateView() {
    if (this.authService.hasPermission(this.permission)) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', '');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
    }
  }
}
   
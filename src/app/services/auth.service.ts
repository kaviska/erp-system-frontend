import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
  permissions: Permission[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  is_new_user?: string;
  created_at: string;
  updated_at: string;
  last_login_browser: string;
  last_login_device: string;
  last_login_platform: string;
  last_login_ip: string;
  last_login_at: string;
  roles: Role[];
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
    requires_password_change: boolean;
    message: string;
  };
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
  data: {
    email: string;
    expires_in: number;
  };
}

export interface VerifyOtpResponse {
  status: string;
  message: string;
  data: {
    email: string;
    verified: boolean;
  };
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
  data: string;
}

export interface ChangePasswordFirstTimeRequest {
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordFirstTimeResponse {
  status: string;
  message: string;
  data: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private user:User|null=null;

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser()
  );
  private serUser(user:User){
    this.user=user
  }
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, {
        headers,
      })
      .pipe(
        tap((response) => {
          if (response.status === 'success') {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticatedSubject.next(true);
            this.setUser(response.data.user);
           
            //add expire date in localstroage up to 3 days
          }
        })
      );
  }

  logout(): void {
    // Get token before clearing it for server logout call
    const currentToken = this.getToken();
    
    // Clear local state immediately
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Clear local storage immediately to ensure logout works even if API fails
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }

    // Make API call to logout on server side (optional cleanup)
    if (currentToken) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      });

      this.http
        .get(`${this.apiUrl}/auth/logout`, { headers })
        .subscribe({
          next: (response) => {
            console.log('Server logout successful', response);
          },
          error: (error) => {
            console.error('Server logout error (but local logout completed):', error);
            // Local logout is already complete, so this error doesn't matter
          },
        });
    }
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  public getCurrentUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  public isAuthenticated(): boolean {
   
    return this.hasToken();
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Password Reset Methods
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload: ForgotPasswordRequest = { email };

    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/auth/forgot-password`,
      payload,
      { headers }
    );
  }

  verifyOtp(email: string, otp: string): Observable<VerifyOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload: VerifyOtpRequest = { email, otp };

    return this.http.post<VerifyOtpResponse>(
      `${this.apiUrl}/auth/verify-otp`,
      payload,
      { headers }
    );
  }

  resetPassword(
    email: string,
    password: string,
    passwordConfirmation: string
  ): Observable<ResetPasswordResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload: ResetPasswordRequest = {
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/auth/reset-password`,
      payload,
      { headers }
    );
  }

  // First Time Password Change Method
  changePasswordFirstTime(
    password: string,
    passwordConfirmation: string
  ): Observable<ChangePasswordFirstTimeResponse> {
    const payload: ChangePasswordFirstTimeRequest = {
      password,
      password_confirmation: passwordConfirmation,
    };

    return this.http.post<ChangePasswordFirstTimeResponse>(
      `${this.apiUrl}/auth/change-password-first-time`,
      payload,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getPermissions(): string[] {
    if (!this.user?.roles) return [];
    return this.user.roles.flatMap((role: any) =>
      role.permissions.map((p: any) => p.name)
    );
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();

    return permissions.some(p => {
      if (p === permission) return true;
      if (p.includes('*')) {
        const base = p.replace('*', '');
        return permission.startsWith(base);
      }
      return false;
    });
  }
}

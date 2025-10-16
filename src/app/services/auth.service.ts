import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ================== Interfaces ===================
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

// Other responses (for reset/otp etc.)
export interface ForgotPasswordResponse {
  status: string;
  message: string;
  data: { email: string; expires_in: number };
}

export interface VerifyOtpResponse {
  status: string;
  message: string;
  data: { email: string; verified: boolean };
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

// ================== Service ===================
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private expiryKey = 'auth_expiry';
  private user: User | null = null;

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ----------------- Auth Methods -----------------
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        tap((response) => {
          if (response.status === 'success') {
            this.setToken(response.data.token);
            this.setUser(response.data.user);

            this.currentUserSubject.next(response.data.user);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    const currentToken = this.getToken();

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.expiryKey);
    }

    if (currentToken) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      });

      this.http.get(`${this.apiUrl}/auth/logout`, { headers }).subscribe({
        next: (res) => console.log('Server logout successful', res),
        error: (err) =>
          console.error('Server logout error (local logout still done):', err),
      });
    }
  }

  // ----------------- Token & User -----------------
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      const expiry = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days
      localStorage.setItem(this.expiryKey, expiry.toString());
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const expiry = localStorage.getItem(this.expiryKey);
      if (expiry && new Date().getTime() > parseInt(expiry, 10)) {
        this.logout(); // expired
        return null;
      }
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setUser(user: User): void {
    this.user = user;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  public getCurrentUser(): User | null {
    if (this.user) return this.user;

    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userKey);
      if (userJson) {
        this.user = JSON.parse(userJson);
        return this.user;
      }
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

  // ----------------- Password Reset -----------------
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/auth/forgot-password`,
      { email },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  verifyOtp(email: string, otp: string): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(
      `${this.apiUrl}/auth/verify-otp`,
      { email, otp },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  resetPassword(
    email: string,
    password: string,
    passwordConfirmation: string
  ): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/auth/reset-password`,
      {
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  changePasswordFirstTime(
    password: string,
    passwordConfirmation: string
  ): Observable<ChangePasswordFirstTimeResponse> {
    return this.http.post<ChangePasswordFirstTimeResponse>(
      `${this.apiUrl}/auth/change-password-first-time`,
      {
        password,
        password_confirmation: passwordConfirmation,
      },
      { headers: this.getAuthHeaders() }
    );
  }

  // ----------------- Permissions -----------------
  getPermissions(): string[] {
    const user = this.getCurrentUser();
    if (!user?.roles) return [];
    return user.roles.flatMap((role) =>
      role.permissions.map((p) => p.name)
    );
  }

  hasPermission(permission: string): boolean {
    // If no permission is required or it's 'always-allow', grant access
    if (!permission || permission === 'always-allow' || permission === '') {
      return true;
    }
    
    const permissions = this.getPermissions();
    return permissions.some((p) => {
      if (p === permission) return true;
      if (p.includes('*')) {
        const base = p.replace('*', '');
        return permission.startsWith(base);
      }
      return false;
    });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface RolePivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: RolePivot;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  is_new_user: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface UserResponse {
  status: string;
  message: string;
  data: User[];
}

export interface RoleResponse{
  status: string;
  message:string;
  data:Role[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl=environment.apiUrl

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('auth_token') || '';
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  getUsers() {
    const headers = this.getAuthHeaders();
    return this.http.get<UserResponse>(`${this.apiUrl}/users`, { headers });
  }

  createUser(userData: any) {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/auth/create-user`, userData, { headers });
  }

  updateUser(userId: number, userData: any) {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/users`, userData, { headers });
  }

  updateUserWithoutPassword(userId: number, userData: any) {
    const headers = this.getAuthHeaders();
    // Create a clean object without password
    const updatePayload = {
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      role: userData.role
    };
    return this.http.put<any>(`${this.apiUrl}/users`, updatePayload, { headers });
  }

  deleteUser(userId: number) {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, { headers });
  }

  getUserById(userId: number) {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/users?id=${userId}`, { headers });
  }

  getRole() {
    const headers = this.getAuthHeaders();
    return this.http.get<RoleResponse>(`${this.apiUrl}/permission/get-role-with-permissions`, { headers });
  }


}

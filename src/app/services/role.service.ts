import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface RoleResponse {
  status: string;
  message: string;
  data: Role[];
}

export interface SingleRoleResponse {
  status: string;
  message: string;
  data: Role;
}

export interface PermissionResponse {
  status: string;
  message: string;
  data: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;

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

  /**
   * Get all roles with permissions
   */
  getRoles(): Observable<RoleResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<RoleResponse>(`${this.apiUrl}/permission/get-role-with-permissions`, { headers });
  }

  /**
   * Get single role by ID
   */
  getRoleById(roleId: number): Observable<SingleRoleResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<SingleRoleResponse>(`${this.apiUrl}/permission/roles/${roleId}`, { headers });
  }

  /**
   * Create new role
   */
  createRole(roleData: { name: string; permissions: number[] }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/permission/roles`, roleData, { headers });
  }

  /**
   * Update existing role
   */
  updateRole(roleId: number, roleData: { name: string; permissions: number[] }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/permission/roles/${roleId}`, roleData, { headers });
  }

  /**
   * Delete role
   */
  deleteRole(roleId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/permission/roles/${roleId}`, { headers });
  }

  /**
   * Get all permissions
   */
  getPermissions(): Observable<PermissionResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<PermissionResponse>(`${this.apiUrl}/permission/permissions`, { headers });
  }

  /**
   * Assign permissions to role
   */
  assignPermissions(roleId: number, permissionIds: number[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/permission/roles/${roleId}/permissions`, 
      { permissions: permissionIds }, { headers });
  }

  /**
   * Remove permissions from role
   */
  removePermissions(roleId: number, permissionIds: number[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/permission/roles/${roleId}/permissions`, 
      { headers, body: { permissions: permissionIds } });
  }
}

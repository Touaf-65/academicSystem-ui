import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = `${API_CONFIG.BASE_URL}/auth`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  requestPasswordReset(email: string): Observable<ApiResponse> {
    const data: PasswordResetRequest = { email };
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password-request`, data, this.httpOptions);
  }

  confirmPasswordReset(token: string, new_password: string, confirmPassword: string): Observable<ApiResponse> {
    const data: PasswordResetConfirm = {
      token,
      new_password,
      confirm_password: confirmPassword
    };
    console.log('📤 Payload envoyé:', data);
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password`, data, this.httpOptions);
  }
}


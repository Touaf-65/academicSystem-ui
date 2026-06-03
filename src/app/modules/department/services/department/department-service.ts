import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DepartmentModel {
  id: number;
  code: string;
  nom: string;
  description: string;
}

export interface CreateDepartmentRequest {
  code: string;
  nom: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private depBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.DEPARTMENT.BASE}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return headers;
  }

  getDepartments(): Observable<DepartmentModel[]> {
    return this.http.get<DepartmentModel[]>(this.depBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createDepartment(depData: CreateDepartmentRequest): Observable<DepartmentModel> {
    return this.http.post<DepartmentModel>(this.depBase_apiUrl, depData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateDepartment(id: number, depData: CreateDepartmentRequest): Observable<DepartmentModel> {
    return this.http.put<DepartmentModel>(`${this.depBase_apiUrl}/${id}`, depData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.depBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}





import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClassModel {
  id: number;
  code: string;
  nom: string;
  capacite: number;
  levelId: number;
}

export interface CreateClassRequest {
  code: string;
  nom: string;
  capacite: number;
  levelId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private classBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.CLASS.BASE}`;

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

  getClasss(): Observable<ClassModel[]> {
    return this.http.get<ClassModel[]>(this.classBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createClass(classData: CreateClassRequest): Observable<ClassModel> {
    return this.http.post<ClassModel>(this.classBase_apiUrl, classData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateClass(id: number, classData: CreateClassRequest): Observable<ClassModel> {
    return this.http.put<ClassModel>(`${this.classBase_apiUrl}/${id}`, classData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.classBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

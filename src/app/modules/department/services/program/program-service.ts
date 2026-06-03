import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProgramModel {
  id: number;
  code: string;
  nom: string;
  departmentId: number;
  description: string;
}

export interface CreateProgramRequest {
  code: string;
  nom: string;
  departmentId: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  private progBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.PROGRAM.BASE}`;

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

  getPrograms(): Observable<ProgramModel[]> {
    return this.http.get<ProgramModel[]>(this.progBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createProgram(progData: CreateProgramRequest): Observable<ProgramModel> {
    return this.http.post<ProgramModel>(this.progBase_apiUrl, progData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProgram(id: number, progData: CreateProgramRequest): Observable<ProgramModel> {
    return this.http.put<ProgramModel>(`${this.progBase_apiUrl}/${id}`, progData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.progBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

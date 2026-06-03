import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CycleModel {
  id: number;
  code: string;
  nom: string;
  dureeAnnees: number;
  programId: number;
}

export interface CreateCycleRequest {
  code: string;
  nom: string;
  dureeAnnees: number;
  programId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CycleService {
  private cycleBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.CYCLE.BASE}`;

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

  getCycles(): Observable<CycleModel[]> {
    return this.http.get<CycleModel[]>(this.cycleBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createCycle(cycleData: CreateCycleRequest): Observable<CycleModel> {
    return this.http.post<CycleModel>(this.cycleBase_apiUrl, cycleData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCycle(id: number, cycleData: CreateCycleRequest): Observable<CycleModel> {
    return this.http.put<CycleModel>(`${this.cycleBase_apiUrl}/${id}`, cycleData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCycle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.cycleBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LevelModel {
  id: number;
  code: string;
  nom: string;
  ordre: number;
  cycleId: number;
}

export interface CreateLevelRequest {
  code: string;
  nom: string;
  ordre: number;
  cycleId: number;
}

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private levelBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.LEVEL.BASE}`;

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

  getLevels(): Observable<LevelModel[]> {
    return this.http.get<LevelModel[]>(this.levelBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createLevel(levelData: CreateLevelRequest): Observable<LevelModel> {
    return this.http.post<LevelModel>(this.levelBase_apiUrl, levelData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateLevel(id: number, levelData: CreateLevelRequest): Observable<LevelModel> {
    return this.http.put<LevelModel>(`${this.levelBase_apiUrl}/${id}`, levelData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.levelBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

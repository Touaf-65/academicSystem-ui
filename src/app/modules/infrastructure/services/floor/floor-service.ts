import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FloorModel {
  id: number;
  numero: number;
  capacite: number;
  buildingId: number;
}

export interface CreateFloorRequest {
  numero: number;
  capacite: number;
  buildingId: number;
}

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  private floorBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.FLOOR.BASE}`;

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

  getFloors(): Observable<FloorModel[]> {
    return this.http.get<FloorModel[]>(this.floorBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createFloor(floorData: CreateFloorRequest): Observable<FloorModel> {
    return this.http.post<FloorModel>(this.floorBase_apiUrl, floorData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateFloor(id: number, floorData: CreateFloorRequest): Observable<FloorModel> {
    return this.http.put<FloorModel>(`${this.floorBase_apiUrl}/${id}`, floorData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteFloor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.floorBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

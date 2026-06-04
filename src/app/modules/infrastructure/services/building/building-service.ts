import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BuildingModel {
  id: number;
  description: string;
  nom: string;
  capaciteTotale: number;
}

export interface CreateBuildingRequest {
  description: string;
  nom: string;
  capaciteTotale: number;
}

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private buildingBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.BUILDING.BASE}`;

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

  getBuildings(): Observable<BuildingModel[]> {
    return this.http.get<BuildingModel[]>(this.buildingBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createBuilding(buildingData: CreateBuildingRequest): Observable<BuildingModel> {
    return this.http.post<BuildingModel>(this.buildingBase_apiUrl, buildingData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateBuilding(id: number, buildingData: CreateBuildingRequest): Observable<BuildingModel> {
    return this.http.put<BuildingModel>(`${this.buildingBase_apiUrl}/${id}`, buildingData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBuilding(id: number): Observable<void> {
    return this.http.delete<void>(`${this.buildingBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

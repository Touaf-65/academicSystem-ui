import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomModel {
  id: number;
  nom: string;
  capacite: number;
  floorId: number;
  type: 'CLASSROOM' | 'AMPHI' | 'LAB';
}

export interface CreateRoomRequest {
  nom: string;
  capacite: number;
  floorId: number;
  type: 'CLASSROOM' | 'AMPHI' | 'LAB';
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private roomBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.ROOM.BASE}`;

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

  getRooms(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(this.roomBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createRoom(roomData: CreateRoomRequest): Observable<RoomModel> {
    return this.http.post<RoomModel>(this.roomBase_apiUrl, roomData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateRoom(id: number, roomData: CreateRoomRequest): Observable<RoomModel> {
    return this.http.put<RoomModel>(`${this.roomBase_apiUrl}/${id}`, roomData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.roomBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel } from '../../../course/services/course/course-service';

export interface GroupModel {
  id: number;
  nom: string;
  type: 'TD' | 'TP';
  capaciteMax: number;
  classRoomId: number;
}

export interface CreateGroupRequest {
  nom: string;
  type: 'TD' | 'TP';
  capaciteMax: number;
  classRoomId: number;
}

export interface UpdateGroupRequest {
  nom: string;
  type: 'TD' | 'TP';
  capacite: number;
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private grpBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.GROUP.BASE}`;

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

  getGroups(): Observable<GroupModel[]> {
    return this.http.get<GroupModel[]>(this.grpBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createGroup(grpData: CreateGroupRequest): Observable<GroupModel> {
    return this.http.post<GroupModel>(this.grpBase_apiUrl, grpData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateGroup(id: number, grpData: UpdateGroupRequest): Observable<GroupModel> {
    return this.http.put<GroupModel>(`${this.grpBase_apiUrl}/${id}`, grpData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.grpBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Assigner un etudiant à un groupe
  assignStudent(groupId: number, studentId: number): Observable<GroupModel> {
    return this.http.post<GroupModel>(
      `${this.grpBase_apiUrl}/${groupId}/teachers/${studentId}`,
      {},
      { headers: this.getAuthHeaders() },
    );
  }

  // Désassigner un etudiant d'un groupe
  unassignStudent(groupId: number, studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.grpBase_apiUrl}/${groupId}/teachers/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

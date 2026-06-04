import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface TeacherModel {
  id: number;
  email: string;
  nom: string;
  password: string;
  departmentIds: number [];
  courseIds: number [];
}

export interface CreateTeacherRequest {
  id: number;
  email: string;
  nom: string;
  password: string;
  departmentIds: number[];
  courseIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private teacherBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.TEACHER.BASE}`;

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

  getTeachers(): Observable<TeacherModel[]> {
    return this.http.get<TeacherModel[]>(this.teacherBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createTeacher(teacherData: CreateTeacherRequest): Observable<TeacherModel> {
    return this.http.post<TeacherModel>(this.teacherBase_apiUrl, teacherData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateTeacher(id: number, teacherData: CreateTeacherRequest): Observable<TeacherModel> {
    return this.http.put<TeacherModel>(`${this.teacherBase_apiUrl}/${id}`, teacherData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.teacherBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

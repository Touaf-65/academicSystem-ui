import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EnrollmentModel {
  id: number;
  academicYear: string;
  classRoomId: number;
  studentId: number;
}

export interface CreateEnrollmentRequest {
  academicYear: string;
  classRoomId: number;
  studentId: number;
}

export interface UpdateEnrollmentRequest {
  nom: string;
  email: string;
  gender: 'M' | 'F';
  dateNaissance: Date;
  academicYear: string;
  classId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
    private enrBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.ENROLLMENT.BASE}`;

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

  getEnrollments(): Observable<EnrollmentModel[]> {
    return this.http.get<EnrollmentModel[]>(this.enrBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createEnrollment(depData: CreateEnrollmentRequest): Observable<EnrollmentModel> {
    return this.http.post<EnrollmentModel>(this.enrBase_apiUrl, depData, {
      headers: this.getAuthHeaders(),
    });
  }


  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.enrBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

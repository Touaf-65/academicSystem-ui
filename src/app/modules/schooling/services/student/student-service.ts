import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentModel {
  id: number;
  nom: string
  email: string;
  matricule: string;
  gender: 'M' | 'F';
  dateNaissance: Date;
  academicYear: string;
  password: string;
  classId: number;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'M' | 'F';
  dateNaissance: string;
  academicYear: string;
  password: string;
  classId: number;
}

export interface UpdateStudentRequest {
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
export class StudentService {
  private stdtBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.STUDENT.BASE}`;

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

  getStudents(): Observable<StudentModel[]> {
    return this.http.get<StudentModel[]>(this.stdtBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createStudent(depData: CreateStudentRequest): Observable<StudentModel> {
    return this.http.post<StudentModel>(this.stdtBase_apiUrl, depData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateStudent(id: number, depData: UpdateStudentRequest): Observable<StudentModel> {
    return this.http.put<StudentModel>(`${this.stdtBase_apiUrl}/${id}`, depData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.stdtBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

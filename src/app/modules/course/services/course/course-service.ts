import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseModel {
  id: number;
  name: string;
  code: string;
  volumeHoraire: number;
  departmentId: number;
  teacherIds: number[];
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  volumeHoraire: number;
  teacherIds: number[];
  departmentId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private courseBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.COURSE.BASE}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  getCourses(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(this.courseBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createCourse(courseData: CreateCourseRequest): Observable<CourseModel> {
    return this.http.post<CourseModel>(this.courseBase_apiUrl, courseData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCourse(id: number, courseData: CreateCourseRequest): Observable<CourseModel> {
    return this.http.put<CourseModel>(`${this.courseBase_apiUrl}/${id}`, courseData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.courseBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Assigner un enseignant à un cours
  assignTeacher(courseId: number, teacherId: number): Observable<CourseModel> {
    return this.http.post<CourseModel>(
      `${this.courseBase_apiUrl}/${courseId}/teachers/${teacherId}`,
      {},
      { headers: this.getAuthHeaders() },
    );
  }

  // Désassigner un enseignant d'un cours
  unassignTeacher(courseId: number, teacherId: number): Observable<void> {
    return this.http.delete<void>(`${this.courseBase_apiUrl}/${courseId}/teachers/${teacherId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

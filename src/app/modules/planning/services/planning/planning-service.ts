import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';

export interface ScheduleModel {
  id: number;
  classId: number;
  courseId: number;
  teacherId: number;
  groupId: number;
  roomId: number;
  semester: number;
  sessionType: 'COURSE' | 'TD' | 'TP' | 'EXAM';
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: Time,
  endTime: Time,
  academicYear: string
}

export interface CreateScheduleRequest {
  classId: number;
  courseId: number;
  teacherId: number;
  groupId: number;
  roomId: number;
  semester: number;
  sessionType: 'COURSE' | 'TD' | 'TP' | 'EXAM';
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: Time;
  endTime: Time;
  academicYear: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private planBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.PLANNING.BASE}`;

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

  getSchedules(): Observable<ScheduleModel[]> {
    return this.http.get<ScheduleModel[]>(this.planBase_apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  createSchedule(depData: CreateScheduleRequest): Observable<ScheduleModel> {
    return this.http.post<ScheduleModel>(this.planBase_apiUrl, depData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateSchedule(id: number, depData: CreateScheduleRequest): Observable<ScheduleModel> {
    return this.http.put<ScheduleModel>(`${this.planBase_apiUrl}/${id}`, depData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.planBase_apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

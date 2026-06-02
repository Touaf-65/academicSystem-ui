// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  closable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private defaultDuration = 5000; // 5 secondes

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  private addNotification(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? this.defaultDuration,
      closable: notification.closable ?? true
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, newNotification]);

    // Auto-suppression après la durée spécifiée
    const duration = newNotification.duration ?? this.defaultDuration;
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }
  }

  success(title: string, message: string, options?: Partial<Notification>): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  error(title: string, message: string, options?: Partial<Notification>): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Les erreurs ne se ferment pas automatiquement par défaut
      ...options
    });
  }

  warning(title: string, message: string, options?: Partial<Notification>): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  info(title: string, message: string, options?: Partial<Notification>): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications$.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(filteredNotifications);
  }

  clearAll(): void {
    this.notifications$.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
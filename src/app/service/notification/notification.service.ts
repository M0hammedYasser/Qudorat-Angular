import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  // ✅ Get all notifications
  findAll(): Observable<any> {
    return this.http.get<any>(`${environment.url}notification`);
  }

  count(){
    return this.http.get<number>(`${environment.url}notification/count`);
  }

  // ✅ Get only unread notifications
  findUnread(): Observable<any> {
    return this.http.get<any>(`${environment.url}notification/unread`);
  }

  // ✅ Mark specific notification as read
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${environment.url}notification/${notificationId}/mark-as-read`, {});
  }

  // ✅ Mark all as read
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${environment.url}notification/mark-all-as-read`, {});
  }

  // ✅ Clear all notifications
  clearAllNotifications(): Observable<void> {
    return this.http.delete<void>(`${environment.url}notification/clear-all`);
  }
}

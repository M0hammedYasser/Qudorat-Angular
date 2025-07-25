import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Notification } from '../../../../model/notification';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {NotificationService} from "../../../../service/notification/notification.service";
import { Router } from '@angular/router';

export interface Notification {
  id: number;
  action: string;
  message?: string;
  time: string;
  isRead: boolean;
}

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [NgIf, NgForOf, NgClass],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})


export class NotificationComponent implements OnInit, OnDestroy {

  notifications: Notification[] = [];
  tabs: Tab[] = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'unread', label: 'Unread' },
    { id: 'saved', label: 'Saved' }
  ];
  activeTab: string = 'all';
  filteredNotifications: Notification[] = [];
  savedNotifications: Set<number> = new Set();

  showToast = false;
  toastMessage = '';
  private toastTimeout: any;

  private pressTimer: any;
  private isLongPress = false;

  constructor(private service: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    if (this.pressTimer) clearTimeout(this.pressTimer);
  }

  loadNotifications(): void {
    this.service.findAll().subscribe((response: Notification[]) => {
      this.notifications = response;
      this.updateFilteredNotifications();
      this.updateNotificationCount();
    });
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.updateFilteredNotifications();
  }

  private updateFilteredNotifications(): void {
    switch (this.activeTab) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.isRead);
        break;
      case 'saved':
        this.filteredNotifications = this.notifications.filter(n => this.savedNotifications.has(n.id));
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  private updateNotificationCount(): void {
    const allTab = this.tabs.find(t => t.id === 'all');
    if (allTab) allTab.count = this.notifications.length;

    const unreadTab = this.tabs.find(t => t.id === 'unread');
    if (unreadTab) unreadTab.count = this.notifications.filter(n => !n.isRead).length || undefined;

    const savedTab = this.tabs.find(t => t.id === 'saved');
    if (savedTab) savedTab.count = this.savedNotifications.size || undefined;
  }

  markAsRead(notificationId: number, action: string): void {
    if (this.isLongPress) {
      this.isLongPress = false;
      return;
    }

    this.service.markAsRead(notificationId).subscribe(() => {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        this.updateFilteredNotifications();
        this.updateNotificationCount();
        this.router.navigateByUrl(action); // Navigate using action
      }
    });
  }

  markAllAsRead(): void {
    this.service.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.updateFilteredNotifications();
      this.updateNotificationCount();
      this.showToastMessage('All notifications marked as read');
    });
  }

  clearAllNotifications(): void {
    this.service.clearAllNotifications().subscribe(() => {
      this.notifications = [];
      this.savedNotifications.clear();
      this.updateFilteredNotifications();
      this.updateNotificationCount();
      this.showToastMessage('All notifications cleared');
    });
  }

  onTouchStart(event: TouchEvent, notificationId: number): void {
    this.isLongPress = false;
    this.pressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.toggleSaveNotification(notificationId);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, 500);
  }

  onTouchEnd(): void {
    if (this.pressTimer) clearTimeout(this.pressTimer);
  }

  onTouchMove(): void {
    if (this.pressTimer) clearTimeout(this.pressTimer);
  }

  private toggleSaveNotification(notificationId: number): void {
    if (this.savedNotifications.has(notificationId)) {
      this.savedNotifications.delete(notificationId);
      this.showToastMessage('Notification unsaved');
    } else {
      this.savedNotifications.add(notificationId);
      this.showToastMessage('Notification saved');
    }

    this.updateFilteredNotifications();
    this.updateNotificationCount();
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }

  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }
}


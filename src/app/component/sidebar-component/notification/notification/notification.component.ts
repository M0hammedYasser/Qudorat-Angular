import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Notification } from '../../../../model/notification';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NotificationService } from "../../../../service/notification/notification.service";
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
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'saved', label: 'Saved' }
  ];

  activeTab: string = 'unread';
  filteredNotifications: Notification[] = [];
  savedNotifications: Set<number> = new Set();

  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimeout: any;

  private pressTimer: any;
  private isLongPress: boolean = false;

  constructor(private service: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    if (this.pressTimer) clearTimeout(this.pressTimer);
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.loadNotifications();
  }

  private loadNotifications(): void {
    // 1. Always fetch accurate Unread Count for the badge
    this.service.count().subscribe(count => {
      const unreadTab = this.tabs.find(t => t.id === 'unread');
      if (unreadTab) unreadTab.count = count > 0 ? count : undefined;
    });

    // 2. Load list based on active tab
    if (this.activeTab === 'unread') {
      this.service.findUnread().subscribe(response => {
        this.notifications = response;
        this.updateFilteredNotifications();
        // In 'unread' mode, we don't know 'all' count, so we leave it as is or don't update it to avoid invalid overwrites
      });
    } else {
      this.service.findAll().subscribe(response => {
        this.notifications = response;
        this.updateFilteredNotifications();

        // In 'all' mode, we know the total count
        const allTab = this.tabs.find(t => t.id === 'all');
        if (allTab) allTab.count = response.length;
      });
    }

    // 3. Update saved count locally (since it's a local Set)
    const savedTab = this.tabs.find(t => t.id === 'saved');
    if (savedTab) savedTab.count = this.savedNotifications.size > 0 ? this.savedNotifications.size : undefined;
  }

  private updateFilteredNotifications(): void {
    switch (this.activeTab) {
      case 'all':
      case 'unread':
        this.filteredNotifications = [...this.notifications];
        break;
      case 'saved':
        this.filteredNotifications = this.notifications.filter(n =>
          this.savedNotifications.has(n.id)
        );
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  markAsRead(notificationId: number): void {
    if (this.isLongPress) {
      this.isLongPress = false;
      return;
    }

    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      this.service.markAsRead(notificationId).subscribe(() => {
        notification.isRead = true;
        this.updateNotificationCount();
        this.updateFilteredNotifications();
      });
    }
  }

  private updateNotificationCount(): void {
    // Re-trigger load to ensure consistency, or simply re-fetch count
    this.service.count().subscribe(count => {
      const unreadTab = this.tabs.find(t => t.id === 'unread');
      if (unreadTab) unreadTab.count = count > 0 ? count : undefined;
    });

    const savedTab = this.tabs.find(t => t.id === 'saved');
    if (savedTab) savedTab.count = this.savedNotifications.size > 0 ? this.savedNotifications.size : undefined;
  }

  handleReply(event: Event, notificationId: number): void {
    event.stopPropagation();
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      const reply = prompt(`Reply to ${notification.message}:`);
      if (reply && reply.trim()) {
        this.sendReply(notificationId, reply.trim());
      }
    }
  }

  private sendReply(notificationId: number, message: string): void {
    console.log(`Sending reply to notification ${notificationId}: ${message}`);
    this.showToastMessage('Reply sent successfully');
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
      this.showToastMessage('Notification removed from saved');
    } else {
      this.savedNotifications.add(notificationId);
      this.showToastMessage('Notification saved');
    }

    this.updateNotificationCount();
    this.updateFilteredNotifications();
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...this.notifications.map(n => n.id), 0) + 1
    };
    this.notifications.unshift(newNotification);
    this.updateNotificationCount();
    this.updateFilteredNotifications();
  }

  markAllAsRead(): void {
    this.service.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.updateNotificationCount();
      this.updateFilteredNotifications();
      this.showToastMessage('All notifications marked as read');
      this.loadNotifications();
    });
  }

  clearAllNotifications(): void {
    this.service.clearAllNotifications().subscribe(() => {
      this.notifications = [];
      this.savedNotifications.clear();
      this.updateNotificationCount();
      this.updateFilteredNotifications();
      this.showToastMessage('All notifications cleared');
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getSavedCount(): number {
    return this.savedNotifications.size;
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }

  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.isRead) {
      this.service.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this.updateNotificationCount();
        this.updateFilteredNotifications();
      });
    }

    if (notification.action.startsWith('/')) {
      this.router.navigateByUrl(notification.action);
    } else if (notification.action.startsWith('http')) {
      window.open(notification.action, '_blank');
    } else {
      console.warn('Unknown action format:', notification.action);
    }
  }

}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
// import { Notification } from '../../../../model/notification';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';

export interface Notification {
  id: number;
  type: 'lead' | 'reply' | 'file';
  user: string;
  action: string;
  target?: string;
  message?: string;
  fileName?: string;
  fileSize?: string;
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
notifications: Notification[] = [
    {
      id: 1,
      type: 'lead',
      user: 'Wade Warren',
      action: 'added new lead',
      target: 'Brooklyn Simmons',
      time: '12 min ago',
      isRead: false
    },
    {
      id: 2,
      type: 'lead',
      user: 'Esther Howard',
      action: 'added new lead',
      target: 'Leslie Alexander',
      time: '12 min ago',
      isRead: false
    },
    {
      id: 3,
      type: 'reply',
      user: 'Jenny Willson',
      action: 'sent you reply',
      message: 'We have scheduled a meeting for next week.',
      time: '12 min ago',
      isRead: true
    },
    {
      id: 4,
      type: 'file',
      user: 'Emily',
      action: 'sent Files',
      fileName: 'Copies of Government.pdf',
      fileSize: '2 MB',
      time: '12 min ago',
      isRead: true
    },
    {
      id: 5,
      type: 'reply',
      user: 'Robert Fox',
      action: 'sent you reply',
      message: 'Please ensure the feedback is constructive and actionable. We need to finalize this by tomorrow.',
      time: '12 min ago',
      isRead: true
    }
  ];

  tabs: Tab[] = [
    { id: 'all', label: 'All', count: 7 },
    { id: 'unread', label: 'Unread' },
    { id: 'saved', label: 'Saved' }
  ];

  activeTab: string = 'all';
  filteredNotifications: Notification[] = [];
  savedNotifications: Set<number> = new Set();
  
  // Toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimeout: any;

  // Long press properties
  private pressTimer: any;
  private isLongPress: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.updateFilteredNotifications();
    this.updateNotificationCount();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.updateFilteredNotifications();
  }

  private updateFilteredNotifications(): void {
    switch (this.activeTab) {
      case 'all':
        this.filteredNotifications = [...this.notifications];
        break;
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.isRead);
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
      notification.isRead = true;
      this.updateNotificationCount();
      this.updateFilteredNotifications();
    }
  }

  private updateNotificationCount(): void {
    const unreadCount = this.notifications.filter(n => !n.isRead).length;
    
    // Update All tab count
    const allTab = this.tabs.find(t => t.id === 'all');
    if (allTab) {
      allTab.count = this.notifications.length;
    }

    // Update Unread tab count
    const unreadTab = this.tabs.find(t => t.id === 'unread');
    if (unreadTab) {
      unreadTab.count = unreadCount > 0 ? unreadCount : undefined;
    }

    // Update Saved tab count
    const savedTab = this.tabs.find(t => t.id === 'saved');
    if (savedTab) {
      savedTab.count = this.savedNotifications.size > 0 ? this.savedNotifications.size : undefined;
    }
  }

  handleReply(event: Event, notificationId: number): void {
    event.stopPropagation();
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      // في التطبيق الحقيقي، هنا هتفتح modal للرد
      const reply = prompt(`Reply to ${notification.user}:`);
      if (reply && reply.trim()) {
        this.sendReply(notificationId, reply.trim());
      }
    }
  }

  private sendReply(notificationId: number, message: string): void {
    // هنا هتبعت الرد للسيرفر
    console.log(`Sending reply to notification ${notificationId}: ${message}`);
    this.showToastMessage('Reply sent successfully');
  }

  // Touch event handlers for long press
  onTouchStart(event: TouchEvent, notificationId: number): void {
    this.isLongPress = false;
    this.pressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.toggleSaveNotification(notificationId);
      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500);
  }

  onTouchEnd(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }

  onTouchMove(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
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

    // Clear existing timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Hide toast after 3 seconds
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Public methods for external usage
  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...this.notifications.map(n => n.id)) + 1
    };
    this.notifications.unshift(newNotification);
    this.updateNotificationCount();
    this.updateFilteredNotifications();
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.updateNotificationCount();
    this.updateFilteredNotifications();
    this.showToastMessage('All notifications marked as read');
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.savedNotifications.clear();
    this.updateNotificationCount();
    this.updateFilteredNotifications();
    this.showToastMessage('All notifications cleared');
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getSavedCount(): number {
    return this.savedNotifications.size;
  }

  // Utility methods
  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }

  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }

}

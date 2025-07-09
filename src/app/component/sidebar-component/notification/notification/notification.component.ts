import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { Notification } from '../../../../model/notification';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';



@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [NgIf, NgForOf, NgClass],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})


export class NotificationComponent implements OnInit { 
  notifications: Notification[] = [];
  unreadCount: number = 0;
  dropdownOpen = false;

  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.fetchNotifications();

    // نجيب IDs الإشعارات اللي كانت متقراة قبل كده
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    this.notifications.forEach(n => {
      if (readIds.includes(n.id)) {
        n.read = true;
      }
    });

    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }


fetchNotifications(): void {
  // بيانات وهمية مؤقتة (لحد ما الباك يشتغل)
  this.notifications = [
    {
      id: 1,
      title: 'تم إضافة اختبار جديد',
      message: 'قام موظف البيانات بإضافة اختبار جديد',
      read: false,
      createdAt: '2025-07-08T12:00:00Z'
    },
    {
      id: 2,
      title: 'موافقة مطلوبة',
      message: 'الاختبار بحاجة إلى مراجعة من المدير',
      read: false,
      createdAt: '2025-07-07T15:30:00Z'
    },
    {
      id: 3,
      title: 'موافقة مطلوبة',
      message: 'الاختبار بحاجة إلى مراجعة من المدير',
      read: true,
      createdAt: '2025-07-07T15:30:00Z'
    },
    {
      id: 4,
      title: 'موافقة مطلوبة',
      message: 'الاختبار بحاجة إلى مراجعة من المدير',
      read: false,
      createdAt: '2025-07-07T15:30:00Z'
    },
    {
      id: 5,
      title: 'موافقة مطلوبة',
      message: 'الاختبار بحاجة إلى مراجعة من المدير',
      read: false,
      createdAt: '2025-07-07T15:30:00Z'
    },
    {
      id: 6,
      title: 'موافقة مطلوبة',
      message: 'الاختبار بحاجة إلى مراجعة من المدير',
      read: false,
      createdAt: '2025-07-07T15:30:00Z'
    },
    {
      id: 7,
      title: ' علي موافقة مطلوبة',
      message: ' او الاختبار بحاجة إلى مراجعة من المدير',
      read: true,
      createdAt: '2025-07-07T15:31:00Z'
    },
    {
      id: 8,
      title: ' علي ghd موافقة مطلوبة',
      message: ' dfgاو الاختبار بحاجة إلى مراجعة من المدير',
      read: false,
      createdAt: '2025-07-07T15:33:00Z'
    },
    {
      id: 9,
      title: ' علي ghdhf موافقة مطلوبة',
      message: ' dfgsdfاو الاختبار بحاجة إلى مراجعة من المدير',
      read: false,
      createdAt: '2025-07-07T15:35:00Z'
    }
  ];

  this.unreadCount = this.notifications.filter(n => !n.read).length;
}


    toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen) {
      const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');

      // لو الإشعار مش موجود في الـ localStorage نعتبره unread ونظهره بلون أحمر
      this.notifications.forEach(notif => {
        notif.read = readIds.includes(notif.id);
      });

      this.unreadCount = this.notifications.filter(n => !n.read).length;

      // بعد الفتح لأول مرة، نخزن إنهم اتشافوا
      const allIds = this.notifications.map(n => n.id);
      localStorage.setItem('readNotifications', JSON.stringify(allIds));
    }
  }


  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.unreadCount--;
      });
    }
  }

}

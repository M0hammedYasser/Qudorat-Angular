import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import Chart from 'chart.js/auto';
import {DashboardService} from "../../../service/dashboard/dashboard.service";
import {forkJoin, interval} from "rxjs";
import {Test} from "../../../model/test";
import {AuthenticationService} from '../../../service/authentication/authentication.service';
import {NotificationService} from "../../../service/notification/notification.service";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  totalBalance = 0;
  totalSamples = 0;
  completedSamples = 0;
  notCompletedSamples = 0;
  processingSamples = 0;
  tests: Test[] = [];
  notification: any = [];
  role: string = '';


  constructor(private dashboardService: DashboardService, private notificationService: NotificationService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    forkJoin({
      totalBalance: this.dashboardService.totalCost(),
      totalSamples: this.dashboardService.totalSamples(),
      completedSamples: this.dashboardService.completeSample(),
      notCompletedSamples: this.dashboardService.notCompleteSample(),
      processSample: this.dashboardService.processSample(),
      tests: this.dashboardService.findTestDashboard()
    }).subscribe(res => {
      this.totalBalance = res.totalBalance;
      this.totalSamples = res.totalSamples;
      this.completedSamples = res.completedSamples;
      this.notCompletedSamples = res.notCompletedSamples;
      this.processingSamples = res.processSample;
      this.tests = res.tests;
      this.createBarChart();
    });

    this.role = this.authService.getAuthority();

    // 🔁 Call findAllNotification every 1 second
    if (this.role === "ROLE_ADMIN") {
      interval(1000).subscribe(() => {
        this.findAllNotification();
      });
    }
  }

  findAllNotification() {
    this.notificationService.findAll().subscribe(res => {
      this.notification = res
    })
  }

  createBarChart() {
    new Chart('samplesChart', {
      type: 'bar',
      data: {
        labels: ['Received', 'In Processing', 'Completed'],
        datasets: [{
          label: 'Samples',
          data: [this.totalSamples, this.processingSamples, this.completedSamples],
          backgroundColor: ['#007bff', '#ffc107', '#28a745'],
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {display: false}
        },
        scales: {
          y: {beginAtZero: true}
        }
      }
    });
  }

}

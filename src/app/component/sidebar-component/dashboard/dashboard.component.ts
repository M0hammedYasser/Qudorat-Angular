import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import Chart from 'chart.js/auto';
import {DashboardService} from "../../../service/dashboard/dashboard.service";
import {forkJoin} from "rxjs";
import {Test} from "../../../model/test";
import { AuthenticationService } from '../../../service/authentication/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
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
  tests : Test[] = [];
  role: string = '';

  // constructor(private dashboardService: DashboardService) {
  // }

  constructor(private dashboardService: DashboardService, private router: Router, private authService: AuthenticationService) {
  }

  ngOnInit() {
    forkJoin({
      totalBalance: this.dashboardService.totalCost(),
      totalSamples: this.dashboardService.totalSamples(),
      completedSamples: this.dashboardService.completeSample(),
      notCompletedSamples: this.dashboardService.notCompleteSample(),
      processSample : this.dashboardService.processSample(),
      tests : this.dashboardService.findTestDashboard()

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

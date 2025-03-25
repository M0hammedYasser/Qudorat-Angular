import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import Chart from 'chart.js/auto';
import {DashboardService} from "../../../service/dashboard/dashboard.service";
import {forkJoin} from "rxjs";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf
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

  sampleData = [
    {purpose: 'Medical Test', date: '2025-02-01', amount: 500, status: 'Completed'},
    {purpose: 'Lab Research', date: '2025-02-02', amount: 1200, status: 'Processing'},
    {purpose: 'Blood Analysis', date: '2025-02-03', amount: 750, status: 'Pending'},
    {purpose: 'DNA Test', date: '2025-02-04', amount: 1500, status: 'Completed'}
  ];

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    forkJoin({
      totalBalance: this.dashboardService.totalCost(),
      totalSamples: this.dashboardService.totalSamples(),
      completedSamples: this.dashboardService.completeSample(),
      notCompletedSamples: this.dashboardService.notCompleteSample(),
      processSample : this.dashboardService.processSample()
    }).subscribe(res => {
      this.totalBalance = res.totalBalance;
      this.totalSamples = res.totalSamples;
      this.completedSamples = res.completedSamples;
      this.notCompletedSamples = res.notCompletedSamples;
      this.processingSamples = res.processSample;
      this.createBarChart();
    });
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

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import Chart from 'chart.js/auto';
import {DashboardService} from "../../../service/dashboard/dashboard.service";


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
export class DashboardComponent implements AfterViewInit, OnInit {

  totalBalance = 0; // Example balance
  totalSamples = 0; // Example total samples
  completedSamples = 150; // Example completed samples
  notCompletedSamples = this.totalSamples - this.completedSamples;
  receivedSamples = 1000;
  processingSamples = 200;
  completedSamplesCount = 700;

  sampleData = [
    {purpose: 'Medical Test', date: '2025-02-01', amount: 500, status: 'Completed'},
    {purpose: 'Lab Research', date: '2025-02-02', amount: 1200, status: 'Processing'},
    {purpose: 'Blood Analysis', date: '2025-02-03', amount: 750, status: 'Pending'},
    {purpose: 'DNA Test', date: '2025-02-04', amount: 1500, status: 'Completed'}
  ];

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.dashboardService.totalCost().subscribe(res=>this.totalBalance = res);
    this.dashboardService.totalSamples().subscribe(res=>this.totalSamples = res);
  }

  ngAfterViewInit() {
    this.createBarChart();
  }

  createBarChart() {
    new Chart('samplesChart', {
      type: 'bar',
      data: {
        labels: ['Received', 'In Processing', 'Completed'],
        datasets: [{
          label: 'Samples',
          data: [this.receivedSamples, this.processingSamples, this.completedSamplesCount],
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

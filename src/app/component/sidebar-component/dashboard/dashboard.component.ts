import {AfterViewInit, Component} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import Chart from 'chart.js/auto';


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
export class DashboardComponent implements AfterViewInit{

  totalBalance = 50000; // Example balance
  totalSamples = 200; // Example total samples
  completedSamples = 150; // Example completed samples
  notCompletedSamples = this.totalSamples - this.completedSamples;

  sampleData = [
    { purpose: 'Medical Test', date: '2025-02-01', amount: 500, status: 'Completed' },
    { purpose: 'Lab Research', date: '2025-02-02', amount: 1200, status: 'Processing' },
    { purpose: 'Blood Analysis', date: '2025-02-03', amount: 750, status: 'Pending' },
    { purpose: 'DNA Test', date: '2025-02-04', amount: 1500, status: 'Completed' }
  ];

  receivedSamples = 1000;
  processingSamples = 200;
  completedSamplesCount = 700;

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
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

}

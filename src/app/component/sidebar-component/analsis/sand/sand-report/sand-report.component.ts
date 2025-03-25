import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from "chart.js/auto";
import {SieveAnalysis} from "../../../../../model/sieve-analysis";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import {ActivatedRoute} from "@angular/router"; // ✅ Import autoTable separately

@Component({
  selector: 'app-sand-report',
  standalone: true,
  imports: [],
  templateUrl: './sand-report.component.html',
  styleUrl: './sand-report.component.css'
})
export class SandReportComponent implements AfterViewInit, OnInit {

  currentDate = new Date().toLocaleDateString();

  @ViewChild('chartCanvas', {static: true}) chartCanvas!: ElementRef;
  chart!: Chart;
  sieveAnalysis: SieveAnalysis = {} as SieveAnalysis;
  id: number = 0;

  constructor(private sieveAnalysisService: SieveAnalysisService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.sieveAnalysisService.findById(this.id).subscribe(res => {
      this.sieveAnalysis = res;
      this.createChart();
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    // Sieve sizes (logarithmic scale)
    const sieveSizes: number[] = [1000, 75, 63, 50, 37.5, 25, 19, 12.5, 9.5, 4.75, 2, 0.425, 0.25, 0.1];

    // Cumulative passing percentages from backend
    const passingPercentages: number[] = [
      100, // 1000mm
      this.sieveAnalysis.passingA, this.sieveAnalysis.passingB, this.sieveAnalysis.passingC,
      this.sieveAnalysis.passingD, this.sieveAnalysis.passingE, this.sieveAnalysis.passingF,
      this.sieveAnalysis.passingG, this.sieveAnalysis.passingH, this.sieveAnalysis.passingI,
      this.sieveAnalysis.passingJ, this.sieveAnalysis.passingK, this.sieveAnalysis.passingL,
      this.sieveAnalysis.passingM
    ];

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: sieveSizes,
        datasets: [
          {
            label: 'Cumulative Passing (%)',
            data: passingPercentages,
            borderColor: 'red',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: 'red'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: {
            type: 'logarithmic',
            reverse: true, // Reversed direction: 0.1 on the right, 1000 on the left
            title: { display: true, text: 'Sieve Size (mm)' },
            ticks: {
              callback: function (value) {
                const staticLabels = [0.1, 1, 10, 100, 1000];
                return staticLabels.includes(value as number) ? value.toString() : '';
              }
            }
          },
          y: {
            title: { display: true, text: 'Cumulative Passing (%)' },
            min: 0,
            max: 100
          }
        }
      }
    });
  }


  generatePDF() {
    if (!this.sieveAnalysis || Object.keys(this.sieveAnalysis).length === 0) {
      console.error("Sieve Analysis data is not available. Please try again later.");
      alert("Data is not yet loaded. Please wait and try again.");
      return;
    }

    const doc = new jsPDF();
    const img = new Image();
    const qr = new Image();
    img.src = 'assets/Q.png'; // Adjust the path as needed
    qr.src = 'assets/barcode.jpg';
    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 5, 20, 20);
      doc.setFontSize(16);
      doc.text('Qudorat Laboratory', 35, 15);
      doc.setFontSize(11);
      doc.text(`Project         ${this.sieveAnalysis.projectName || 'N/A'}`, 13, 30);
      doc.text(`Client           ${this.sieveAnalysis.clientName || 'N/A'}`, 13, 36);
      doc.addImage(qr, 'PNG', 135, 25, 50, 10);

      // doc.line(10, 40, 200, 40);

      doc.text(`Sample By          ${this.sieveAnalysis.sampleBy || 'N/A'}`, 13, 42);
      doc.text(`Sampling Date    ${this.sieveAnalysis.samplingDate || 'N/A'}`, 13, 48);
      doc.text(`Testing Date     ${this.sieveAnalysis.testingDate || 'N/A'}`, 140, 42);
      doc.text(`Material Type    ${this.sieveAnalysis.materialType || 'N/A'}`, 140, 48);

      doc.line(10, 55, 200, 55);

      const tableColumn = ["Sieve sizes(Inch)", "Sieve sizes(mm)", "Retained Weight (gm)", "Retained%", "Passing%"];
      const tableRows: any[] = [];

      const sieveData = [
        ["3", 75.0, this.sieveAnalysis.massRetainedA,  this.sieveAnalysis.retainedA, this.sieveAnalysis.passingA],
        ["21/2", 62.5, this.sieveAnalysis.massRetainedB,  this.sieveAnalysis.retainedB, this.sieveAnalysis.passingB],
        ["2", 50.0, this.sieveAnalysis.massRetainedC,  this.sieveAnalysis.retainedC, this.sieveAnalysis.passingC],
        ["11/2", 37.5, this.sieveAnalysis.massRetainedD,  this.sieveAnalysis.retainedD, this.sieveAnalysis.passingD],
        ["1", 25.0, this.sieveAnalysis.massRetainedE,  this.sieveAnalysis.retainedE, this.sieveAnalysis.passingE],
        ["3/4", 19.0, this.sieveAnalysis.massRetainedF,  this.sieveAnalysis.retainedF, this.sieveAnalysis.passingF],
        ["1/2", 12.5, this.sieveAnalysis.massRetainedG,  this.sieveAnalysis.retainedG, this.sieveAnalysis.passingG],
        ["3/8", 9.5, this.sieveAnalysis.massRetainedH,  this.sieveAnalysis.retainedH, this.sieveAnalysis.passingH],
        ["#4", 4.75, this.sieveAnalysis.massRetainedI,  this.sieveAnalysis.retainedI, this.sieveAnalysis.passingI],
        ["#10", 2.00, this.sieveAnalysis.massRetainedJ,  this.sieveAnalysis.retainedJ, this.sieveAnalysis.passingJ],
        ["#40", 0.425, this.sieveAnalysis.massRetainedK,  this.sieveAnalysis.retainedK, this.sieveAnalysis.passingK],
        ["#100", 0.150, this.sieveAnalysis.massRetainedL,  this.sieveAnalysis.retainedL, this.sieveAnalysis.passingL],
        ["#200", 0.075, this.sieveAnalysis.massRetainedM,  this.sieveAnalysis.retainedM, this.sieveAnalysis.passingM],
        ["Total Wt.", "", this.sieveAnalysis.totalWeigh, "", ""]
      ];

      sieveData.forEach(row => tableRows.push(row));

      autoTable(doc, {
        startY: 60,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: {fontSize: 10}
      });

      const finalY = (doc as any).lastAutoTable?.finalY ?? 80;

      setTimeout(() => {
        const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL('image/png');
          doc.addImage(chartImage, 'PNG', 10, finalY + 10, 180, 80);
          doc.save('Sieve_Analysis_Report.pdf');
        } else {
          console.error("Chart canvas not found! Ensure it is fully loaded before generating the PDF.");
        }
      }, 1000);
    };

    img.onerror = () => {
      console.error("Error loading image from assets.");
    };


    doc.setFontSize(9);
    if (this.sieveAnalysis.notes){
      doc.line(10, 265, 200, 265);
      doc.text(`Remarks : ${this.sieveAnalysis.notes || ""}`, 13, 270);
    }
    doc.line(10, 280, 200, 280);

    doc.setFontSize(11);

    doc.text(`Approved by: ${this.sieveAnalysis.approveBy || 'N/A'}`, 13, 285);
    doc.text(`Test by: ${this.sieveAnalysis.testBy || 'N/A'}`, 80, 285);
    doc.text(`Checked by: ${this.sieveAnalysis.activist || 'N/A'}`, 150, 285);
  }


}

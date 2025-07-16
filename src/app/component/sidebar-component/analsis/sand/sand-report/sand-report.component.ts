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
          legend: {display: true}
        },
        scales: {
          x: {
            type: 'logarithmic',
            reverse: true, // Reversed direction: 0.1 on the right, 1000 on the left
            title: {display: true, text: 'Sieve Size (mm)'},
            ticks: {
              callback: function (value) {
                const staticLabels = [0.1, 1, 10, 100, 1000];
                return staticLabels.includes(value as number) ? value.toString() : '';
              }
            }
          },
          y: {
            title: {display: true, text: 'Cumulative Passing (%)'},
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
    const head = new Image();
    const tail = new Image();
    const qr = new Image();

    head.src = 'assets/head.png';
    tail.src = 'assets/tail.png';
    qr.src = 'assets/barcode.jpg';

    head.onload = () => {
      doc.addImage(head, 'PNG', 0, 0, 210, 33);
      doc.setFontSize(14);
      doc.text('Sieve Analysis Test', 80, 36);
      doc.setFontSize(9);

      const infoRows = [
        ['Project', this.sieveAnalysis.projectName || 'N/A', 'Test Name', this.sieveAnalysis.nameOfTest || 'N/A'],
        ['Client', this.sieveAnalysis.clientName || 'N/A', 'Testing Date', this.sieveAnalysis.testingDate || 'N/A'],
        ['Sample No', this.sieveAnalysis.sampleNo || 'N/A', 'Standard', this.sieveAnalysis.materialType || 'N/A'],
        ['Sample By', this.sieveAnalysis.sampleBy || 'N/A', 'Consultant', this.sieveAnalysis.consultant || 'N/A'],
        ['Sampling Date', this.sieveAnalysis.samplingDate || 'N/A', 'Owner', this.sieveAnalysis.owner || 'N/A'],
      ];

      autoTable(doc, {
        startY: 40,
        body: infoRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5 },
        columnStyles: {
          0: { cellWidth: 31 },
          1: { cellWidth: 60 },
          2: { cellWidth: 31 },
          3: { cellWidth: 60 },
        },
      });

      const tableStartY = (doc as any).lastAutoTable.finalY + 2;

      const tableColumn = ["Sieve sizes(Inch)", "Sieve sizes(mm)", "Retained Weight (gm)", "Retained%", "Passing%"];
      const tableRows: any[] = [];

      const sieveData = [
        ["3", 75.0, this.sieveAnalysis.massRetainedA, this.sieveAnalysis.retainedA, Number(this.sieveAnalysis.passingA).toFixed(0)],
        ["21/2", 62.5, this.sieveAnalysis.massRetainedB, this.sieveAnalysis.retainedB, Number(this.sieveAnalysis.passingB).toFixed(0)],
        ["2", 50.0, this.sieveAnalysis.massRetainedC, this.sieveAnalysis.retainedC, Number(this.sieveAnalysis.passingC).toFixed(0)],
        ["11/2", 37.5, this.sieveAnalysis.massRetainedD, this.sieveAnalysis.retainedD, Number(this.sieveAnalysis.passingD).toFixed(0)],
        ["1", 25.0, this.sieveAnalysis.massRetainedE, this.sieveAnalysis.retainedE, Number(this.sieveAnalysis.passingE).toFixed(0)],
        ["3/4", 19.0, this.sieveAnalysis.massRetainedF, this.sieveAnalysis.retainedF, Number(this.sieveAnalysis.passingF).toFixed(0)],
        ["1/2", 12.5, this.sieveAnalysis.massRetainedG, this.sieveAnalysis.retainedG, Number(this.sieveAnalysis.passingG).toFixed(0)],
        ["3/8", 9.5, this.sieveAnalysis.massRetainedH, this.sieveAnalysis.retainedH, Number(this.sieveAnalysis.passingH).toFixed(0)],
        ["#4", 4.75, this.sieveAnalysis.massRetainedI, this.sieveAnalysis.retainedI, Number(this.sieveAnalysis.passingI).toFixed(0)],
        ["#10", 2.00, this.sieveAnalysis.massRetainedJ, this.sieveAnalysis.retainedJ, Number(this.sieveAnalysis.passingJ).toFixed(0)],
        ["#40", 0.425, this.sieveAnalysis.massRetainedK, this.sieveAnalysis.retainedK, Number(this.sieveAnalysis.passingK).toFixed(0)],
        ["#100", 0.150, this.sieveAnalysis.massRetainedL, this.sieveAnalysis.retainedL, Number(this.sieveAnalysis.passingL).toFixed(2)],
        ["#200", 0.075, this.sieveAnalysis.massRetainedM, this.sieveAnalysis.retainedM, this.sieveAnalysis.passingM],
        ["Total Wt.", this.sieveAnalysis.totalWeigh, "", "", ""]
      ];

      sieveData.forEach(row => tableRows.push(row));

      autoTable(doc, {
        startY: tableStartY,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.7 },
      });

      const finalY = (doc as any).lastAutoTable.finalY ?? 100;

      setTimeout(() => {
        const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL('image/png');
          doc.addImage(chartImage, 'PNG', 10, finalY + 3, 180, 80);
          let footerY = finalY + 80 + 5;
          doc.setFontSize(8);

          if (this.sieveAnalysis.notes) {
            doc.line(10, footerY - 1, 200, footerY - 1);
            const splitNotes = doc.splitTextToSize(
              `Remarks: ${this.sieveAnalysis.notes || ""}`,
              180
            );
            doc.text(splitNotes, 13, footerY + 2);
            footerY += (splitNotes.length * 7);
          }

          doc.line(10, 258, 200, 257);
          doc.setFontSize(10);
          doc.text(`Approved by: ${this.sieveAnalysis.approveBy || 'N/A'}`, 13, 261);
          doc.text(`Test by: ${this.sieveAnalysis.testBy || 'N/A'}`, 80, 261);
          doc.text(`Checked by: ${this.sieveAnalysis.activist || 'N/A'}`, 150, 261);

          doc.addImage(tail, 'PNG', 0, 265, 210, 33);

          doc.setFontSize(5);
          const formatDateTime = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
          };
          const currentDateTime = formatDateTime(new Date());
          doc.text(`Report Date: ${currentDateTime}`, 1, 290);

          doc.save('Sieve_Analysis_Report.pdf');
        } else {
          console.error("Chart canvas not found! Ensure it is fully loaded before generating the PDF.");
        }
      }, 1000);
    };

    head.onerror = () => {
      console.error("Error loading image from assets.");
    };
  }

}

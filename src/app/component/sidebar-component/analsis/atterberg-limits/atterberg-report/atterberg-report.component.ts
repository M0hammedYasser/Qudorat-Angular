import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AtterbergLimits} from "../../../../../model/atterberg-limits";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";

@Component({
  selector: 'app-atterberg-report',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './atterberg-report.component.html',
  styleUrl: './atterberg-report.component.css'
})
export class AtterbergReportComponent implements OnInit {

  atterbergLimits: AtterbergLimits = {} as AtterbergLimits;
  id: number = 0;

  @ViewChild('chartCanvas', {static: true}) chartCanvas!: ElementRef;
  chart!: Chart;

  @ViewChild('moistureChartCanvas', {static: true}) moistureChartCanvas!: ElementRef;
  moistureChart!: Chart;

  massOfSoil1: number = 0;
  massOfSoil2: number = 0;
  massOfSoil3: number = 0;
  massOfSoil4: number = 0;
  massOfSoil5: number = 0;
  massOfSoil6: number = 0;
  massOfSoil7: number = 0;
  massOfSoil8: number = 0;

  massOfWater1: number = 0;
  massOfWater2: number = 0;
  massOfWater3: number = 0;
  massOfWater4: number = 0;
  massOfWater5: number = 0;
  massOfWater6: number = 0;
  massOfWater7: number = 0;
  massOfWater8: number = 0;

  constructor(private service: AtterbergLimitsService, private activatedRoute: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => {
      this.atterbergLimits = res;
      this.massOfSoil1 = Number(this.atterbergLimits.massCanAndSoilDry1 - this.atterbergLimits.massOfEmptyCan1);
      this.massOfSoil2 = Number(this.atterbergLimits.massCanAndSoilDry2 - this.atterbergLimits.massOfEmptyCan2);
      this.massOfSoil3 = Number(this.atterbergLimits.massCanAndSoilDry3 - this.atterbergLimits.massOfEmptyCan3);
      this.massOfSoil4 = Number(this.atterbergLimits.massCanAndSoilDry4 - this.atterbergLimits.massOfEmptyCan4);
      this.massOfSoil5 = Number(this.atterbergLimits.massCanAndSoilDry5 - this.atterbergLimits.massOfEmptyCan5);
      this.massOfSoil6 = Number(this.atterbergLimits.massCanAndSoilDry6 - this.atterbergLimits.massOfEmptyCan6);
      this.massOfSoil7 = Number(this.atterbergLimits.massCanAndSoilDry7 - this.atterbergLimits.massOfEmptyCan7);
      this.massOfSoil8 = Number(this.atterbergLimits.massCanAndSoilDry8 - this.atterbergLimits.massOfEmptyCan8);
      this.massOfWater1 = Number(this.atterbergLimits.massCanAndSoilWet1 - this.atterbergLimits.massCanAndSoilDry1);
      this.massOfWater2 = Number(this.atterbergLimits.massCanAndSoilWet2 - this.atterbergLimits.massCanAndSoilDry2);
      this.massOfWater3 = Number(this.atterbergLimits.massCanAndSoilWet3 - this.atterbergLimits.massCanAndSoilDry3);
      this.massOfWater4 = Number(this.atterbergLimits.massCanAndSoilWet4 - this.atterbergLimits.massCanAndSoilDry4);
      this.massOfWater5 = Number(this.atterbergLimits.massCanAndSoilWet5 - this.atterbergLimits.massCanAndSoilDry5);
      this.massOfWater6 = Number(this.atterbergLimits.massCanAndSoilWet6 - this.atterbergLimits.massCanAndSoilDry6);
      this.massOfWater7 = Number(this.atterbergLimits.massCanAndSoilWet7 - this.atterbergLimits.massCanAndSoilDry7);
      this.massOfWater8 = Number(this.atterbergLimits.massCanAndSoilWet8 - this.atterbergLimits.massCanAndSoilDry8);
      this.createPlasticityChart();
      this.createMoistureChart();
    })
  }

  createPlasticityChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    // Extract values with fallback to 0 if null
    const liquidLimit = this.atterbergLimits.liquidLimit;
    const plasticLimit = this.atterbergLimits.plasticLimit;
    const plasticityIndex = liquidLimit - plasticLimit;

    // Define the A-line and U-line
    const xValues = Array.from({length: 101}, (_, i) => i); // 0 to 100
    const aLine = xValues.map(x => 0.73 * (x - 20));
    const uLine = xValues.map(x => 0.9 * (x - 8));

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Plasticity Point',
            data: [{x: liquidLimit, y: plasticLimit}],
            backgroundColor: 'orange',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
          },
          {
            label: 'A-Line',
            data: xValues.map((x, i) => ({x, y: aLine[i]})),
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            showLine: true,
            pointRadius: 0
          },
          {
            label: 'U-Line',
            data: xValues.map((x, i) => ({x, y: uLine[i]})),
            borderColor: 'purple',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            showLine: true,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'nearest'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Liquid Limit (LL or wL)'
            },
            min: 0,
            max: 100
          },
          y: {
            title: {
              display: true,
              text: 'Plasticity Index (PI)'
            },
            min: 0,
            max: 60
          }
        }
      }
    });
  }

  createMoistureChart(): void {
    if (this.moistureChart) {
      this.moistureChart.destroy();
    }

    const blows = [
      this.atterbergLimits.numberOfBlows5,
      this.atterbergLimits.numberOfBlows6,
      this.atterbergLimits.numberOfBlows7,
      this.atterbergLimits.numberOfBlows8
    ];

    const waterContents = [
      Number((this.massOfWater5 / this.massOfSoil5) * 100),
      Number((this.massOfWater6 / this.massOfSoil6) * 100),
      Number((this.massOfWater7 / this.massOfSoil7) * 100),
      Number((this.massOfWater8 / this.massOfSoil8) * 100)
    ];

    const dataPoints = blows.map((x, i) => ({ x, y: waterContents[i] }));

    // Compute ln(x)
    const lnX = blows.map(x => Math.log(x));
    const y = waterContents;

    const n = blows.length;
    const sumLnX = lnX.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumLnX2 = lnX.reduce((a, b) => a + b * b, 0);
    const sumLnXy = lnX.reduce((sum, lnxi, i) => sum + lnxi * y[i], 0);

    const a = (n * sumLnXy - sumLnX * sumY) / (n * sumLnX2 - sumLnX * sumLnX);
    const b = (sumY - a * sumLnX) / n;

    const yMean = sumY / n;
    const ssTot = y.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0);
    const ssRes = y.reduce((sum, yi, i) => sum + (yi - (a * lnX[i] + b)) ** 2, 0);
    const r2 = 1 - ssRes / ssTot;

    // Regression line from x = 10 to 100
    const regressionLine = [];
    for (let x = 10; x <= 100; x += 1) {
      regressionLine.push({ x, y: a * Math.log(x) + b });
    }

    this.moistureChart = new Chart(this.moistureChartCanvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Water Content Data',
            data: dataPoints,
            backgroundColor: 'blue',
            pointRadius: 6
          },
          {
            label: 'Log Regression Fit',
            data: regressionLine,
            borderColor: 'red',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'nearest' },
          title: {
            display: true,
            text: `y = ${a.toFixed(3)}ln(x) + ${b.toFixed(3)} | R² = ${r2.toFixed(4)}`
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: true, text: 'Number of Blows (N)' },
            min: 10,
            max: 100
          },
          y: {
            title: { display: true, text: 'Water Content (%)' },
            min: 30,
            max: 38
          }
        }
      }
    });
  }




  generatePDF() {
    const doc = new jsPDF();
    const head = new Image();
    const tail = new Image();
    const qr = new Image();

    head.src = 'assets/head.png';
    tail.src = 'assets/tail.png';
    qr.src = 'assets/barcode.jpg';

    head.onload = () => {
      doc.addImage(head, 'PNG', 0, 0, 210, 33);
      doc.setFontSize(12);
      doc.text('Atterberg Limits Data Sheet', 70, 34)
      doc.setFontSize(10);
      const infoRows = [
        ['Project', this.atterbergLimits.projectName || 'N/A', 'Test Name', this.atterbergLimits.nameOfTest || 'N/A'],
        ['Client', this.atterbergLimits.clientName || 'N/A', 'Testing Date', this.atterbergLimits.testingDate || 'N/A'],
        ['Sample No', this.atterbergLimits.sampleNo || 'N/A', 'Standard', this.atterbergLimits.classification || 'N/A'],
        ['Sample By', this.atterbergLimits.sampleBy || 'N/A', 'Consultant', this.atterbergLimits.consultant || 'N/A'],
        ['Sampling Date', this.atterbergLimits.sampleDate || 'N/A', 'Owner', this.atterbergLimits.owner || 'N/A']
      ];

      autoTable(doc, {
        body: infoRows,
        startY: 36, 
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 1
        },
        columnStyles: {
          0: { cellWidth: 32 },
          1: { cellWidth: 58 },
          2: { cellWidth: 32 },
          3: { cellWidth: 59 }
        },
        margin: { left: 13, right: 13 },
        tableWidth: 'auto'
      });


      autoTable(doc, {
        startY: 65 ,
        head: [
          [
            {content: 'TEST', colSpan: 3, styles: {lineWidth: 0.5}},
            {content: 'PLASTIC LIMIT', colSpan: 4, styles: {lineWidth: 0.5}},
            {content: 'LIQUID LIMIT', colSpan: 4, styles: {lineWidth: 0.5}}
          ],
          [
            {content: 'Variable', styles: {lineWidth: 0.5}},
            {content: 'NO', colSpan: 2, styles: {lineWidth: 0.5}},
            {content: '1', styles: {lineWidth: 0.5}},
            {content: '2', styles: {lineWidth: 0.5}},
            {content: '3', styles: {lineWidth: 0.5}},
            {content: '4', styles: {lineWidth: 0.5}},
            {content: '1', styles: {lineWidth: 0.5}},
            {content: '2', styles: {lineWidth: 0.5}},
            {content: '3', styles: {lineWidth: 0.5}},
            {content: '4', styles: {lineWidth: 0.5}}
          ],
          [
            {content: '', styles: {lineWidth: 0.5}},
            {content: 'Var.', styles: {lineWidth: 0.5}},
            {content: 'Units', styles: {lineWidth: 0.5}},
            ...Array(8).fill({content: '', styles: {lineWidth: 0.5}})
          ]
        ],
        body: [
          ['Number of Blows', 'N', 'blows', '', '', '', '', this.atterbergLimits.numberOfBlows5, this.atterbergLimits.numberOfBlows6, this.atterbergLimits.numberOfBlows7, this.atterbergLimits.numberOfBlows8],
          ['Can Number', '---', '---', this.atterbergLimits.canNumber1, this.atterbergLimits.canNumber2, this.atterbergLimits.canNumber3, this.atterbergLimits.canNumber4,
            this.atterbergLimits.canNumber5, this.atterbergLimits.canNumber6, this.atterbergLimits.canNumber7, this.atterbergLimits.canNumber8],
          ['Mass of Empty Can', 'MC', '(g)', this.atterbergLimits.massOfEmptyCan1, this.atterbergLimits.massOfEmptyCan2, this.atterbergLimits.massOfEmptyCan3, this.atterbergLimits.massOfEmptyCan4,
            this.atterbergLimits.massOfEmptyCan5, this.atterbergLimits.massOfEmptyCan6, this.atterbergLimits.massOfEmptyCan7, this.atterbergLimits.massOfEmptyCan8],
          ['Mass Can & Soil (Wet)', 'MCMS', '(g)', this.atterbergLimits.massCanAndSoilWet1, this.atterbergLimits.massCanAndSoilWet2, this.atterbergLimits.massCanAndSoilWet3, this.atterbergLimits.massCanAndSoilWet4,
            this.atterbergLimits.massCanAndSoilWet5, this.atterbergLimits.massCanAndSoilWet6, this.atterbergLimits.massCanAndSoilWet7, this.atterbergLimits.massCanAndSoilWet8],
          ['Mass Can & Soil (Dry)', 'MCDS', '(g)', this.atterbergLimits.massCanAndSoilDry1, this.atterbergLimits.massCanAndSoilDry2, this.atterbergLimits.massCanAndSoilDry3, this.atterbergLimits.massCanAndSoilDry4,
            this.atterbergLimits.massCanAndSoilDry5, this.atterbergLimits.massCanAndSoilDry6, this.atterbergLimits.massCanAndSoilDry7, this.atterbergLimits.massCanAndSoilDry8],
          ['Mass of Soil', 'MS', '(g)',
            Number(this.massOfSoil1).toFixed(2),
            Number(this.massOfSoil2).toFixed(2),
            Number(this.massOfSoil3).toFixed(2),
            Number(this.massOfSoil4).toFixed(2),
            Number(this.massOfSoil5).toFixed(2),
            Number(this.massOfSoil6).toFixed(2),
            Number(this.massOfSoil7).toFixed(2),
            Number(this.massOfSoil8).toFixed(2)],
          ['Mass of Water', 'MW', '(g)',
            Number(this.massOfWater1).toFixed(2),
            Number(this.massOfWater2).toFixed(2),
            Number(this.massOfWater3).toFixed(2),
            Number(this.massOfWater4).toFixed(2),
            Number(this.massOfWater5).toFixed(2),
            Number(this.massOfWater6).toFixed(2),
            Number(this.massOfWater7).toFixed(2),
            Number(this.massOfWater8).toFixed(2)],
          ['Water Content', 'w', '(%)',
            Number(this.massOfWater1 / this.massOfSoil1 * 100).toFixed(2),
            Number(this.massOfWater2 / this.massOfSoil2 * 100).toFixed(2),
            Number(this.massOfWater3 / this.massOfSoil3 * 100).toFixed(2),
            Number(this.massOfWater4 / this.massOfSoil4 * 100).toFixed(2),
            Number(this.massOfWater5 / this.massOfSoil5 * 100).toFixed(2),
            Number(this.massOfWater6 / this.massOfSoil6 * 100).toFixed(2),
            Number(this.massOfWater7 / this.massOfSoil7 * 100).toFixed(2),
            Number(this.massOfWater8 / this.massOfSoil8 * 100).toFixed(2),
          ]
        ],
        theme: 'grid',
        styles: {
          fontSize: 5,
          cellPadding: 2,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        columnStyles: {
          0: {cellWidth: 30, halign: 'left'},
          1: {cellWidth: 15},
          2: {cellWidth: 15},
          3: {cellWidth: 15},
          4: {cellWidth: 15},
          5: {cellWidth: 15},
          6: {cellWidth: 15},
          7: {cellWidth: 15},
          8: {cellWidth: 15},
          9: {cellWidth: 15},
          10: {cellWidth: 15}
        },
        margin: {left: 14}
      });

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 5,
        body: [
          ['Liquid Limit (LL or wL) (%):', this.atterbergLimits.liquidLimit],
          ['Plastic Limit (PL or wP) (%):', this.atterbergLimits.plasticLimit],
          ['Plasticity Index (PI) (%):', Number((this.atterbergLimits.liquidLimit - this.atterbergLimits.plasticLimit).toFixed(2))],
          ['USCS Classification:', this.atterbergLimits.uscs]
        ],
        theme: 'grid',
        styles: {
          fontSize: 5,
          cellPadding: 2,
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        columnStyles: {
          0: {cellWidth: 40, halign: 'left'},
          1: {cellWidth: 15},
          2: {cellWidth: 15},
          3: {cellWidth: 15},
          7: {cellWidth: 20}
        }
      });

      let finalY = (doc as any).lastAutoTable.finalY + 3;

      setTimeout(() => {
        const chartCanvases = document.querySelectorAll('canvas') as NodeListOf<HTMLCanvasElement>;

        if (chartCanvases.length > 0) {
          const chartImage1 = chartCanvases[0].toDataURL('image/png');
          doc.addImage(chartImage1, 'PNG', 72, finalY - 30, 123, 55);

          // Optional space or heading between charts
          doc.setFontSize(10);
          finalY += 30;

          // Second Chart (e.g., index 1)
          if (chartCanvases.length > 1) {
            const chartImage2 = chartCanvases[1].toDataURL('image/png');
            doc.addImage(chartImage2, 'PNG', 10, finalY, 123, 55);
            finalY += 40;
          }
        }

        // Notes section (unchanged)
        if (this.atterbergLimits.notes) {
          doc.line(10, finalY + 18, 200, finalY + 18);
          const splitNotes = doc.splitTextToSize(`Remarks: ${this.atterbergLimits.notes || ""}`, 180);
          doc.text(splitNotes, 13, finalY + 21);
          finalY += (splitNotes.length * 7);
        }

        // Signatures & Footer
        doc.line(10, 257, 200, 257);
        doc.setFontSize(10);
        doc.text(`Approved by: ${this.atterbergLimits.approveBy || 'N/A'}`, 13, 261);
        doc.text(`Test by: ${this.atterbergLimits.testBy || 'N/A'}`, 80, 261);
        doc.text(`Checked by: ${this.atterbergLimits.activist || 'N/A'}`, 150, 261);
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

        doc.save(`AtterbergLimitsReport_${this.atterbergLimits.testName}.pdf`);
      }, 1000);
    };
  }
}

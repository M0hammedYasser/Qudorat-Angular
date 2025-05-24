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
  imports: [],
  templateUrl: './atterberg-report.component.html',
  styleUrl: './atterberg-report.component.css'
})
export class AtterbergReportComponent implements OnInit {

  atterbergLimits: AtterbergLimits = {} as AtterbergLimits;
  id: number = 0;

  @ViewChild('chartCanvas', {static: true}) chartCanvas!: ElementRef;
  chart!: Chart;

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
      doc.setFontSize(14);
      doc.text('Atterberg Limits Data Sheet', 70, 36)
      doc.setFontSize(10);
      doc.text(`Project                 ${this.atterbergLimits.projectName || 'N/A'}`, 13, 42);
      doc.text(`Client                   ${this.atterbergLimits.clientName || 'N/A'}`, 13, 47);
      doc.text(`Sample No          ${this.atterbergLimits.sampleNo || 'N/A'}`, 13, 52);
      doc.text(`Sample By          ${this.atterbergLimits.sampleBy || 'N/A'}`, 13, 57);
      doc.text(`Sampling Date   ${this.atterbergLimits.sampleDate || 'N/A'}`, 13, 62);
      doc.text(`Test Name          ${this.atterbergLimits.nameOfTest || 'N/A'}`, 110, 42);
      doc.text(`Testing Date       ${this.atterbergLimits.testingDate || 'N/A'}`, 110, 47);
      doc.text(`Standard             ${this.atterbergLimits.classification || 'N/A'}`, 110, 52);
      doc.text(`Consultant          ${this.atterbergLimits.consultant || 'N/A'}`, 110, 57);
      doc.text(`Owner                 ${this.atterbergLimits.owner || 'N/A'}`, 110, 62);
      doc.line(10, 65, 200, 65);

      autoTable(doc, {
        startY: 67,
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
          fontSize: 6,
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
          fontSize: 6,
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
          const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
          if (chartCanvas) {
            const chartImage = chartCanvas.toDataURL('image/png');
            doc.addImage(chartImage, 'PNG', 72, finalY - 30 , 123, 60);
            doc.setFontSize(9);

            if (this.atterbergLimits.notes) {
              doc.line(10, finalY + 75, 200, finalY + 75);
              const splitNotes = doc.splitTextToSize(
                `Remarks: ${this.atterbergLimits.notes || ""}`,
                180
              );
              doc.text(splitNotes, 13, finalY + 78);
              finalY += (splitNotes.length * 7);
            }
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
          }
        }, 1000);
    };
  }
}

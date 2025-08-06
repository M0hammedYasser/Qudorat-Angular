import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AtterbergLimits} from "../../../../../model/atterberg-limits";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MoistureDensityRelationship} from "../../../../../model/moisture-density-relationship";
import {
  MoistureDensityRelationshipService
} from "../../../../../service/MoistureDensityRelationship/moisture-density-relationship.service";
import {CommonModule, DecimalPipe} from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
declare let AmiriFont: any;

@Component({
  selector: 'app-moisture-density-relationship-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moisture-density-relationship-report.component.html',
  styleUrl: './moisture-density-relationship-report.component.css'
})
export class MoistureDensityRelationshipReportComponent implements OnInit {

  id: number = 0;
  moistureDensityRelationship: MoistureDensityRelationship = {} as MoistureDensityRelationship;
  role: string = '';


  @ViewChild('compactionChartCanvas', {static: true}) compactionChartCanvas!: ElementRef;
  compactionChart!: Chart;

  wetWtSoilA: number = 0;
  wetWtSoilB: number = 0;
  wetWtSoilC: number = 0;
  wetWtSoilD: number = 0;
  wetWtSoilE: number = 0;

  wetDensityA: number = 0;
  wetDensityB: number = 0;
  wetDensityC: number = 0;
  wetDensityD: number = 0;
  wetDensityE: number = 0;

  dryDensityA: number = 0;
  dryDensityB: number = 0;
  dryDensityC: number = 0;
  dryDensityD: number = 0;
  dryDensityE: number = 0;

  wtOfDrySoilA: number = 0;
  wtOfDrySoilB: number = 0;
  wtOfDrySoilC: number = 0;
  wtOfDrySoilD: number = 0;
  wtOfDrySoilE: number = 0;

  wtOfWaterA: number = 0;
  wtOfWaterB: number = 0;
  wtOfWaterC: number = 0;
  wtOfWaterD: number = 0;
  wtOfWaterE: number = 0;

  moistureContentA: number = 0;
  moistureContentB: number = 0;
  moistureContentC: number = 0;
  moistureContentD: number = 0;
  moistureContentE: number = 0;

  constructor(private authenticationService: AuthenticationService,private service: MoistureDensityRelationshipService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.role = this.authenticationService.getAuthority();
    this.service.findById(this.id).subscribe(res => {
      this.moistureDensityRelationship = res;
      this.wetWtSoilA = this.moistureDensityRelationship.wetWtSoilMouldA - this.moistureDensityRelationship.wtOfMould;
      this.wetWtSoilB = this.moistureDensityRelationship.wetWtSoilMouldB - this.moistureDensityRelationship.wtOfMould;
      this.wetWtSoilC = this.moistureDensityRelationship.wetWtSoilMouldC - this.moistureDensityRelationship.wtOfMould;
      this.wetWtSoilD = this.moistureDensityRelationship.wetWtSoilMouldD - this.moistureDensityRelationship.wtOfMould;
      this.wetWtSoilE = this.moistureDensityRelationship.wetWtSoilMouldE - this.moistureDensityRelationship.wtOfMould;
      this.wetDensityA = this.wetWtSoilA / this.moistureDensityRelationship.volOfMould;
      this.wetDensityB = this.wetWtSoilB / this.moistureDensityRelationship.volOfMould;
      this.wetDensityC = this.wetWtSoilC / this.moistureDensityRelationship.volOfMould;
      this.wetDensityD = this.wetWtSoilD / this.moistureDensityRelationship.volOfMould;
      this.wetDensityE = this.wetWtSoilE / this.moistureDensityRelationship.volOfMould;
      this.wtOfDrySoilA = this.moistureDensityRelationship.dryWtSoilContA - this.moistureDensityRelationship.wtOfContainerA;
      this.wtOfDrySoilB = this.moistureDensityRelationship.dryWtSoilContB - this.moistureDensityRelationship.wtOfContainerB;
      this.wtOfDrySoilC = this.moistureDensityRelationship.dryWtSoilContC - this.moistureDensityRelationship.wtOfContainerC;
      this.wtOfDrySoilD = this.moistureDensityRelationship.dryWtSoilContD - this.moistureDensityRelationship.wtOfContainerD;
      this.wtOfDrySoilE = this.moistureDensityRelationship.dryWtSoilContE - this.moistureDensityRelationship.wtOfContainerE;
      this.wtOfWaterA = this.moistureDensityRelationship.wetWtSoilContA - this.moistureDensityRelationship.dryWtSoilContA;
      this.wtOfWaterB = this.moistureDensityRelationship.wetWtSoilContB - this.moistureDensityRelationship.dryWtSoilContB;
      this.wtOfWaterC = this.moistureDensityRelationship.wetWtSoilContC - this.moistureDensityRelationship.dryWtSoilContC;
      this.wtOfWaterD = this.moistureDensityRelationship.wetWtSoilContD - this.moistureDensityRelationship.dryWtSoilContD;
      this.wtOfWaterE = this.moistureDensityRelationship.wetWtSoilContE - this.moistureDensityRelationship.dryWtSoilContE;
      this.moistureContentA = this.wtOfWaterA / this.wtOfDrySoilA * 100;
      this.moistureContentB = this.wtOfWaterB / this.wtOfDrySoilB * 100;
      this.moistureContentC = this.wtOfWaterC / this.wtOfDrySoilC * 100;
      this.moistureContentD = this.wtOfWaterD / this.wtOfDrySoilD * 100;
      this.moistureContentE = this.wtOfWaterE / this.wtOfDrySoilE * 100;
      this.dryDensityA = this.wetDensityA / (this.moistureContentA / 100 + 1);
      this.dryDensityB = this.wetDensityB / (this.moistureContentB / 100 + 1);
      this.dryDensityC = this.wetDensityC / (this.moistureContentC / 100 + 1);
      this.dryDensityD = this.wetDensityD / (this.moistureContentD / 100 + 1);
      this.dryDensityE = this.wetDensityE / (this.moistureContentE / 100 + 1);
      this.createCompactionChart();

    })
  }

  createCompactionChart(): void {
    if (this.compactionChart) {
      this.compactionChart.destroy();
    }

    // Example: replace with your actual values (from calculations)
    const moistureContent = [3, 4.5, 6, 7, 8.5, 9.5];
    const dryDensity = [2.08, 2.15, 2.24, 2.26, 2.20, 2.16];

    const dataPoints = moistureContent.map((mc, i) => ({x: mc, y: dryDensity[i]}));

    this.compactionChart = new Chart(this.compactionChartCanvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Dry Density vs Moisture Content',
            data: dataPoints,
            backgroundColor: 'blue',
            borderColor: 'blue',
            pointRadius: 5,
            pointHoverRadius: 7,
            showLine: true,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            mode: 'nearest'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Moisture Content %',
              font: {
                weight: 'bold',
                size: 20
              }
            },
            min: 2,
            max: 10,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: '#555'
            }
          },
          y: {
            title: {
              display: true,
              text: 'DRY DENSITY gm/cc',
              font: {
                weight: 'bold',
                size: 20
              }
            },
            min: 2.0,
            max: 2.3,
            ticks: {
              stepSize: 0.02
            },
            grid: {
              color: '#555'
            }
          }
        }
      }
    });
  }

generatePDF() {
  const doc = new jsPDF();
  doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont); // هذا اسم المتغير في ملف الخط
  doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
  doc.setFont('Amiri');
  const head = new Image();
  const tail = new Image();

  head.src = 'assets/head.png';
  tail.src = 'assets/tail.png';

  head.onload = () => {
    doc.addImage(head, 'PNG', 0, 0, 210, 33);
    doc.setFontSize(12);
    doc.text('Moisture Density Relationship', 70, 36);

    autoTable(doc, {
      startY: 38,
      body: [
        ['Project', this.moistureDensityRelationship.projectName || 'N/A',
          'Client', this.moistureDensityRelationship.clientName || 'N/A'],
        ['Sample No', this.moistureDensityRelationship.sampleNo || 'N/A',
          'Sample By', this.moistureDensityRelationship.sampleBy || 'N/A'],
        ['Sampling Date', this.moistureDensityRelationship.sampleDate || 'N/A',
          'Test Name', this.moistureDensityRelationship.nameOfTest || 'N/A'],
        ['Testing Date', this.moistureDensityRelationship.testingDate || 'N/A',
          'Standard', this.moistureDensityRelationship.classification || 'N/A'],
        ['Consultant', this.moistureDensityRelationship.consultant || 'N/A',
          'Owner', this.moistureDensityRelationship.owner || 'N/A'],
        ['Location', this.moistureDensityRelationship.location || 'N/A' ,
          'Wt. of Rammer', this.moistureDensityRelationship.wtOfRammer || 'N/A'],
        ['Wt. of mould', this.moistureDensityRelationship.wtOfMould || 'N/A' ,
          'No. Blows/Layers', this.moistureDensityRelationship.noBlows || 'N/A'],
        ['Vol. of mould', this.moistureDensityRelationship.volOfMould || 'N/A' ,
          'No. of Layers', this.moistureDensityRelationship.noOfLayers || 'N/A'],

      ],
      theme: 'grid',
      styles: {
        fontSize: 7,
        halign: 'left',
        valign: 'middle',
        cellPadding: 1,font: 'Amiri'
      },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 60 },
        2: { cellWidth: 32 },
        3: { cellWidth: 60 }
      },
      margin: { left: 14, right: 14 }
    });

    let finalY = (doc as any).lastAutoTable.finalY + 1;

    // جدول Mould Data
    autoTable(doc, {
      startY: finalY,
      head: [
        [{ content: 'Mould Data', colSpan: 6 }],
        [
          { content: 'Trial Number #', styles: { halign: 'left', fontStyle: 'bold' } },
          { content: '1' }, { content: '2' }, { content: '3' }, { content: '4' }, { content: '5' }
        ]
      ],
      body: [
        ['A. Wet Wt. Soil + Mould (gm)', this.moistureDensityRelationship.wetWtSoilMouldA,
          this.moistureDensityRelationship.wetWtSoilMouldB,
          this.moistureDensityRelationship.wetWtSoilMouldC,
          this.moistureDensityRelationship.wetWtSoilMouldD,
          this.moistureDensityRelationship.wetWtSoilMouldE],
        ['B. Wt. of Mould (gm)', ...Array(5).fill(this.moistureDensityRelationship.wtOfMould)],
        ['C. Wet Wt. Soil (gm)', this.wetWtSoilA, this.wetWtSoilB, this.wetWtSoilC, this.wetWtSoilD, this.wetWtSoilE],
        ['D. Volume of Mould (cc)', ...Array(5).fill(this.moistureDensityRelationship.volOfMould)],
        ['E. Wet Density (gm/cc)', this.wetDensityA.toFixed(1), this.wetDensityB.toFixed(1), this.wetDensityC.toFixed(1), this.wetDensityD.toFixed(1), this.wetDensityE.toFixed(1)],
        ['F. Dry Density (gm/cc)', this.dryDensityA.toFixed(3), this.dryDensityB.toFixed(3), this.dryDensityC.toFixed(3), this.dryDensityD.toFixed(3), this.dryDensityE.toFixed(3)]
      ],
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.3,
        lineColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 60, halign: 'left' },
        1: { cellWidth: 25 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 },
        4: { cellWidth: 25 }, 5: { cellWidth: 25 }
      },
      margin: { left: 14, right: 14 }
    });

    finalY = (doc as any).lastAutoTable.finalY + 1;

    // جدول Moisture Content
    autoTable(doc, {
      startY: finalY,
      head: [
        [{ content: 'Moisture Content Determination %', colSpan: 6 }],
        [
          { content: 'Container #', styles: { halign: 'left', fontStyle: 'bold' } },
          '1', '2', '3', '4', '5'
        ]
      ],
      body: [
        ['A. Wet Wt. Soil + Container (gm)', this.moistureDensityRelationship.wetWtSoilContA,
          this.moistureDensityRelationship.wetWtSoilContB,
          this.moistureDensityRelationship.wetWtSoilContC,
          this.moistureDensityRelationship.wetWtSoilContD,
          this.moistureDensityRelationship.wetWtSoilContE],
        ['B. Dry Wt. Soil + Container (gm)', this.moistureDensityRelationship.dryWtSoilContA,
          this.moistureDensityRelationship.dryWtSoilContB,
          this.moistureDensityRelationship.dryWtSoilContC,
          this.moistureDensityRelationship.dryWtSoilContD,
          this.moistureDensityRelationship.dryWtSoilContE],
        ['C. Wt. of Container (gm)', this.moistureDensityRelationship.wtOfContainerA,
          this.moistureDensityRelationship.wtOfContainerB,
          this.moistureDensityRelationship.wtOfContainerC,
          this.moistureDensityRelationship.wtOfContainerD,
          this.moistureDensityRelationship.wtOfContainerE],
        ['D. Wt. of Dry Soil (gm)', this.wtOfDrySoilA.toFixed(1), this.wtOfDrySoilB.toFixed(1), this.wtOfDrySoilC.toFixed(1), this.wtOfDrySoilD.toFixed(1), this.wtOfDrySoilE.toFixed(1)],
        ['E. Wt. of Water (gm)', this.wtOfWaterA.toFixed(1), this.wtOfWaterB.toFixed(1), this.wtOfWaterC.toFixed(1), this.wtOfWaterD.toFixed(1), this.wtOfWaterE.toFixed(1)],
        ['F. Moisture Content %', this.moistureContentA.toFixed(2), this.moistureContentB.toFixed(2), this.moistureContentC.toFixed(2), this.moistureContentD.toFixed(2), this.moistureContentE.toFixed(2)]
      ],
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.3,
        lineColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 60, halign: 'left' },
        1: { cellWidth: 25 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 },
        4: { cellWidth: 25 }, 5: { cellWidth: 25 }
      },
      margin: { left: 14, right: 14 }
    });

    finalY = (doc as any).lastAutoTable.finalY ;

    setTimeout(() => {
      const canvasElement = this.compactionChartCanvas.nativeElement;
      const chartImage = canvasElement.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 12, finalY + 3, 130, 55);

      const startX = 145;
      let y = finalY + 20;
      const rowHeight = 10;
      const col1Width = 30;
      const col2Width = 30;

      doc.setFontSize(10);
      doc.rect(startX, y, col1Width, rowHeight);
      doc.rect(startX + col1Width, y, col2Width, rowHeight);
      doc.text("M.D.D (gm/cc)", startX + 2, y + 7);
      doc.text(this.dryDensityC.toFixed(3), startX + col1Width + 2, y + 7);
      y += rowHeight + 2;

      doc.rect(startX, y, col1Width, rowHeight);
      doc.rect(startX + col1Width, y, col2Width, rowHeight);
      doc.text("O.M.C %", startX + 2, y + 7);
      doc.text(this.moistureContentC.toFixed(2), startX + col1Width + 2, y + 7);

      finalY += 60;

      if (this.moistureDensityRelationship.notes) {
        doc.line(10, finalY , 200, finalY );
        const splitNotes = doc.splitTextToSize(`Remarks: ${this.moistureDensityRelationship.notes || ""}`, 180);
        doc.text(splitNotes, 13, finalY + 4);
        finalY += (splitNotes.length * 7);
      }


      
      doc.line(10, 258, 200, 258);
      doc.setFontSize(7);
      doc.text(`Approved by: ${this.moistureDensityRelationship.adopter || 'N/A'}`, 12, 261);
      doc.text(`Test by: ${this.moistureDensityRelationship.testBy || 'N/A'}`, 85, 261);
      doc.text(`Checked by: ${this.moistureDensityRelationship.lastApproveBy || 'N/A'}`, 150, 261);

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

      doc.save(`MoistureDensityRelationshipReport_${this.moistureDensityRelationship.testName}.pdf`);
    }, 1000);
  };
}

}

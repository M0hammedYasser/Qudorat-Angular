import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from "chart.js/auto";
import {SieveAnalysis} from "../../../../../model/sieve-analysis";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
declare let AmiriFont: any;

@Component({
  selector: 'app-sand-report',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './sand-report.component.html',
  styleUrl: './sand-report.component.css'
})
export class SandReportComponent implements AfterViewInit, OnInit {

  currentDate = new Date().toLocaleDateString();

  @ViewChild('chartCanvas', {static: true}) chartCanvas!: ElementRef;
  chart!: Chart;
  sieveAnalysis: SieveAnalysis = {} as SieveAnalysis;
  role: string = '';
  id: number = 0;

  constructor(private authenticationService: AuthenticationService,private sieveAnalysisService: SieveAnalysisService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.role = this.authenticationService.getAuthority();

    this.sieveAnalysisService.findById(this.id).subscribe(res => {
      this.sieveAnalysis = res;

      for (let i = 0; i < 13; i++) {
        const char = String.fromCharCode(65 + i);
        const key = `expand${char}`;
        if (!this.sieveAnalysis[key] || this.sieveAnalysis[key] === '\u0000') {
          this.sieveAnalysis[key] = '';
        }
      }

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
          legend: {
            display: true,
            labels: {
              font: {
                weight: 'bold',   
                size: 16
              }
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            reverse: true,
            title: {
              display: true,
              text: 'Sieve Size (mm)',
              font: { weight: 'bold', size: 16 } 
            },
            ticks: {
              font: { weight: 'bold' },          
              callback: function (value) {
                const staticLabels = [0.1, 1, 10, 100, 1000];
                return staticLabels.includes(value as number) ? value.toString() : '';
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cumulative Passing (%)',
              font: { weight: 'bold', size: 16 } 
            },
            ticks: {
              font: { weight: 'bold' }           
            },
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
    doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');
    const head = new Image();
    const tail = new Image();
    const qr = new Image();

    head.src = 'assets/head.png';
    tail.src = 'assets/tail.png';
    qr.src = 'assets/barcode.jpg';

    head.onload = () => {
      doc.addImage(head, 'PNG', 0, 0, 210, 33);
      doc.setFontSize(8);
      doc.text('Standarded Test Method For Sieve Analysis Of Fine And Coarse Aggregates  AsTM C-136/ SAMPLING ASTM D75, ASTM D75M', 30, 34);
      doc.setFontSize(9);

      const infoRows = [
        ['Project', {content: this.sieveAnalysis.projectName , colSpan: 4}, 'Sampling Date', this.sieveAnalysis.samplingDate],
        ['Client', {content: this.sieveAnalysis.clientName, colSpan: 4}, 'Testing Date', this.sieveAnalysis.testingDate],
        ['Location', {content: this.sieveAnalysis.location, colSpan: 4}, 'Sample By', this.sieveAnalysis.sampleBy],
        ['Sample No', this.sieveAnalysis.sampleNo, 'Test Location', {content: this.sieveAnalysis.location, colSpan: 2}, 'Report Date', this.sieveAnalysis.reportDate],
        ['Report No', `${this.sieveAnalysis.clientCode}-${this.sieveAnalysis.projectCode}-${this.sieveAnalysis.testCode}`, 'Source Of Sample', {content: this.sieveAnalysis.sourceOfSample, colSpan: 2}, 'Material Type', this.sieveAnalysis.materialType],
        ['Description',{content : 'Orginal WT From Source kg' , colSpan: 2} , {content: this.sieveAnalysis.totalWeigh, colSpan: 2} , '', '' , '' , ''],
      ];

      const pageWidth = doc.internal.pageSize.getWidth();
      const tableWidth = 160; 
      const marginLeft = (pageWidth - tableWidth) / 2;

      autoTable(doc, {
        startY: 35,
        body: infoRows,
        theme: 'grid',
        styles: { 
          fontSize: 7, 
          cellPadding: 0.5, 
          font: 'Amiri', 
          textColor: [0, 0, 0],     
          lineColor: [0, 0, 0],     
          lineWidth: 0.4            
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 10 },
          5: { cellWidth: 20 },
          6: { cellWidth: 28 },
        },
        tableLineColor: [0, 0, 0],  
        tableLineWidth: 0.5,         

        tableWidth: tableWidth,
        margin: { left: marginLeft } 
      });


      const tableStartY = (doc as any).lastAutoTable.finalY -1;

      const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL('image/png');
        const pageWidth = doc.internal.pageSize.getWidth();
        const borderW = 160;
        const borderH = 70;
        const scale = 1; 
        const scaledBorderW = borderW * scale;
        const scaledBorderH = borderH * scale;
        const borderX = (pageWidth - scaledBorderW) / 2;
        const borderY = tableStartY + 1;
        const chartW = scaledBorderW - 2; 
        const chartH = scaledBorderH - 10;
        const chartX = borderX + (scaledBorderW - chartW) / 2;
        const chartY = borderY + (scaledBorderH - chartH) / 2;

        doc.addImage(chartImage, 'PNG', chartX, chartY, chartW, chartH);

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.6);
        doc.rect(borderX, borderY, scaledBorderW, scaledBorderH);
      }



      const afterChartY = tableStartY + 71;

      autoTable(doc, {
        startY: afterChartY,
        body: [
          [
            { content: "%Gravel", styles: { halign: 'center' as const, valign: 'middle' as const } },
            { content: "%Sand", styles: { halign: 'center' as const, valign: 'middle' as const } },
            { content: "%Silt", styles: { halign: 'center' as const, valign: 'middle' as const } },
            { content: "%Clay", styles: { halign: 'center' as const, valign: 'middle' as const } }
          ],
          [
            { content: this.sieveAnalysis.gravel || " ", styles: { halign: 'center' } },
            { content: this.sieveAnalysis.sand || " ", styles: { halign: 'center' } },
            { content: this.sieveAnalysis.silt || " ", colSpan: 2, styles: { halign: 'center' } }
          ],
        ],
        theme: 'grid',
        styles: { 
          fontSize: 7, 
          cellPadding: 1, 
          font: 'Amiri',
          textColor: [0, 0, 0],   
          lineColor: [0, 0, 0],   
          lineWidth: 0.5          
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
        },
        tableLineColor: [0, 0, 0], 
        tableWidth: tableWidth,      
        margin: { left: marginLeft } 
      });


      const afterMiniTableY = (doc as any).lastAutoTable.finalY;

      const tableColumn = [
        {content: "Sieve sizes" , colSpan : 2, styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Retained Weight (gm)"  , colSpan : 2, styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content :"Percent" , colSpan : 2, styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Expand", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Specification Limits" , rowSpan : 2, styles: {halign: 'center' as const, valign: 'middle' as const}}
      ];

      const tableColumn1 = [
        {content: "Inch", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "mm", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Individual", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Cumulative", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Retained%", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "Passing%", styles: {halign: 'center' as const, valign: 'middle' as const}},
        {content: "K.2", styles: {halign: 'center' as const, valign: 'middle' as const}}
      ];
      const tableRows: any[] = [];

      const sieveData = [
        ["3", 75.0 ,this.sieveAnalysis.individualA, this.sieveAnalysis.cumulativeA, this.sieveAnalysis.retainedA, Number(this.sieveAnalysis.passingA).toFixed(0), this.sieveAnalysis.expandA , this.sieveAnalysis.specificationLimitsA],
        ["21/2", 62.5 ,this.sieveAnalysis.individualB, this.sieveAnalysis.cumulativeB, this.sieveAnalysis.retainedB, Number(this.sieveAnalysis.passingB).toFixed(0), this.sieveAnalysis.expandB , this.sieveAnalysis.specificationLimitsB],
        ["2", 50.0, this.sieveAnalysis.individualC, this.sieveAnalysis.cumulativeC, this.sieveAnalysis.retainedC, Number(this.sieveAnalysis.passingC).toFixed(0), this.sieveAnalysis.expandC , this.sieveAnalysis.specificationLimitsC],
        ["11/2", 37.5, this.sieveAnalysis.individualD, this.sieveAnalysis.cumulativeD, this.sieveAnalysis.retainedD, Number(this.sieveAnalysis.passingD).toFixed(0), this.sieveAnalysis.expandD , this.sieveAnalysis.specificationLimitsD],
        ["1", 25.0, this.sieveAnalysis.individualE, this.sieveAnalysis.cumulativeE, this.sieveAnalysis.retainedE, Number(this.sieveAnalysis.passingE).toFixed(0), this.sieveAnalysis.expandE , this.sieveAnalysis.specificationLimitsE],
        ["3/4", 19.0, this.sieveAnalysis.individualF, this.sieveAnalysis.cumulativeF, this.sieveAnalysis.retainedF, Number(this.sieveAnalysis.passingF).toFixed(0), this.sieveAnalysis.expandF , this.sieveAnalysis.specificationLimitsF],
        ["1/2", 12.5, this.sieveAnalysis.individualG, this.sieveAnalysis.cumulativeG, this.sieveAnalysis.retainedG, Number(this.sieveAnalysis.passingG).toFixed(0), this.sieveAnalysis.expandG , this.sieveAnalysis.specificationLimitsG],
        ["3/8", 9.5, this.sieveAnalysis.individualH, this.sieveAnalysis.cumulativeH, this.sieveAnalysis.retainedH, Number(this.sieveAnalysis.passingH).toFixed(0), this.sieveAnalysis.expandH , this.sieveAnalysis.specificationLimitsH],
        ["#4", 4.75, this.sieveAnalysis.individualI, this.sieveAnalysis.cumulativeI, this.sieveAnalysis.retainedI, Number(this.sieveAnalysis.passingI).toFixed(0), this.sieveAnalysis.expandI , this.sieveAnalysis.specificationLimitsI],
        ["#10", 2.00, this.sieveAnalysis.individualJ, this.sieveAnalysis.cumulativeJ, this.sieveAnalysis.retainedJ, Number(this.sieveAnalysis.passingJ).toFixed(0), this.sieveAnalysis.expandJ , this.sieveAnalysis.specificationLimitsJ],
        ["#40", 0.425, this.sieveAnalysis.individualK, this.sieveAnalysis.cumulativeK, this.sieveAnalysis.retainedK, Number(this.sieveAnalysis.passingK).toFixed(0), this.sieveAnalysis.expandK , this.sieveAnalysis.specificationLimitsK],
        ["#100", 0.150, this.sieveAnalysis.individualL, this.sieveAnalysis.cumulativeL, this.sieveAnalysis.retainedL, Number(this.sieveAnalysis.passingL).toFixed(2), this.sieveAnalysis.expandL , this.sieveAnalysis.specificationLimitsL],
        ["#200", 0.075, this.sieveAnalysis.individualM, this.sieveAnalysis.cumulativeM, this.sieveAnalysis.retainedM, Number(this.sieveAnalysis.passingM).toFixed(2), this.sieveAnalysis.expandM , this.sieveAnalysis.specificationLimitsM],
        ["Total Wt.", this.sieveAnalysis.totalWeigh, "", "", ""]
      ];

      sieveData.forEach(row => tableRows.push(row));

      autoTable(doc, {
        startY: afterMiniTableY,
        head: [tableColumn, tableColumn1],
        body: tableRows,
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 1.7,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
        tableWidth: tableWidth,      
        margin: { left: marginLeft } 
      });

      const finalY = (doc as any).lastAutoTable.finalY ?? 100;

      setTimeout(() => {
        let footerY = finalY + 5;
        doc.setFontSize(8);

        const startX = 25;
        const endX = 185;
        const boxWidth = endX - startX;

        // Remarks
        let remarksHeight = 0;
        if (this.sieveAnalysis.notes) {
          const splitNotes = doc.splitTextToSize(
            `Remarks: ${this.sieveAnalysis.notes || ""}`,
            boxWidth - 8
          );

          doc.setFont("Amiri", "bold"); 
          doc.text(splitNotes, startX + 1, footerY - 1);

          remarksHeight = splitNotes.length * 5;
          footerY += remarksHeight + 5;
        }


        doc.line(startX, 260, endX, 260);

        doc.setFontSize(8);
        doc.text(`Approved by: ${this.sieveAnalysis.adopter || " "}`, startX + 1, 264);
        doc.text(`Test by: ${this.sieveAnalysis.testBy || " "}`, (startX + endX) / 2 - 25, 264);
        doc.text(`Checked by: ${this.sieveAnalysis.approveBy || " "}`, endX - 45, 264);

        const blockTop = finalY;
        const blockBottom = 266;            
        const blockHeight = blockBottom - blockTop;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.6);
        doc.rect(startX, blockTop, endX - startX, blockHeight);

        doc.addImage(tail, 'PNG', 0, 267, 210, 33);

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
      }, 1000);



    };

    head.onerror = () => {
      console.error("Error loading image from assets.");
    };
  }

} 
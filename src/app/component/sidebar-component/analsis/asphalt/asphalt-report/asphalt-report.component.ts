import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {ActivatedRoute} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import jsPDF from "jspdf";
import autoTable, {RowInput} from "jspdf-autotable";
import Chart from "chart.js/auto";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-asphalt-report',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './asphalt-report.component.html',
  styleUrl: './asphalt-report.component.css'
})
export class AsphaltReportComponent implements OnInit, AfterViewInit {

  asphalt: Asphalt = {} as Asphalt;
  chart: any;
  id: number = 0;

  bulkSpOfCompMix: number = 0;
  maxSpOfPAvgMix: number = 0;
  airVoid: number = 0;
  voidMineral: number = 0;
  voidFilled: number = 0;
  z12: number = 0;
  effectiveSpGravityOfAgg: number = 0;
  absorbedAps: number = 0;

  avgStabilityFor24Hrs: number = 0;

  avgStabilityFor30Min: number = 0;

  constructor(private service: AsphaltService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => {
      this.asphalt = res;
      this.bulkSpOfCompMix =
        ((this.asphalt.weightAirDryA / (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA)) +
          (this.asphalt.weightAirDryB / (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB)) +
          (this.asphalt.weightAirDryC / (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC)) +
          (this.asphalt.weightAirDryD / (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD)) +
          (this.asphalt.weightAirDryE / (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE)) +
          (this.asphalt.weightAirDryF / (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF))) / 6;
      this.maxSpOfPAvgMix = this.asphalt.netWeightOfLooseMix
        / (this.asphalt.netWeightOfLooseMix + this.asphalt.netWeightOfFlaskWater - this.asphalt.weightFlaskWaterSample);
      this.airVoid = (this.maxSpOfPAvgMix - this.bulkSpOfCompMix) / this.maxSpOfPAvgMix * 100;
      this.voidMineral = 100 - (this.bulkSpOfCompMix * (100 - this.asphalt.bitumen.percOfBit) / this.asphalt.bulkSpGrCombAgg)
      this.voidFilled = (this.voidMineral - this.airVoid) / this.voidMineral * 100;
      this.z12 = (100 / this.maxSpOfPAvgMix) - (this.asphalt.bitumen.percOfBit / this.asphalt.spGravityOfAspBit);
      this.effectiveSpGravityOfAgg = (100 - this.asphalt.bitumen.percOfBit) / this.z12;
      this.avgStabilityFor24Hrs = (this.asphalt.stabilityD * this.asphalt.correctionFactorD + this.asphalt.stabilityE * this.asphalt.correctionFactorE + this.asphalt.stabilityF * this.asphalt.correctionFactorF) / 3;
      this.avgStabilityFor30Min = (this.asphalt.stabilityA * this.asphalt.correctionFactorA +
        this.asphalt.stabilityB * this.asphalt.correctionFactorB +
        this.asphalt.stabilityC * this.asphalt.correctionFactorC) / 3;
      this.absorbedAps = 100 * (this.effectiveSpGravityOfAgg - this.asphalt.bulkSpGrCombAgg) / (this.effectiveSpGravityOfAgg * this.asphalt.bulkSpGrCombAgg) * this.asphalt.spGravityOfAspBit
    });


  }

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  ngAfterViewInit() {
    if (!this.tableContainer) {
      console.error('tableContainer is not initialized');
    }
    this.createChart();
  }

  createChart() {
    const canvas = document.getElementById('invoiceChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.service.findById(this.id).subscribe(res => {
      if (this.chart) {
        this.chart.destroy(); // destroy previous chart instance if any
      }

      this.chart = new Chart(ctx!, {
        type: 'line',
        data: {
          labels: ['1.5', '1', '3/4', '1/2', '3/8', '#4', '#10', '#40', '#80', '#200'],
          datasets: [
            {
              label: 'Max',
              data: [
                res.gradationTest.cvcMaxA, res.gradationTest.cvcMaxB, res.gradationTest.cvcMaxC,
                res.gradationTest.cvcMaxD, res.gradationTest.cvcMaxE, res.gradationTest.cvcMaxF,
                res.gradationTest.cvcMaxG, res.gradationTest.cvcMaxH, res.gradationTest.cvcMaxI,
                res.gradationTest.cvcMaxJ
              ],
              borderColor: 'grey',
              fill: false,
              tension: 0.2,
            },
            {
              label: 'Gradation',
              data: [
                100 - res.gradationTest.retainedA, 100 - res.gradationTest.retainedB,
                100 - res.gradationTest.retainedC, 100 - res.gradationTest.retainedD, 100 - res.gradationTest.retainedE,
                100 - res.gradationTest.retainedF, 100 - res.gradationTest.retainedG, 100 - res.gradationTest.retainedH,
                100 - res.gradationTest.retainedI, 100 - res.gradationTest.retainedJ
              ],
              borderColor: 'red',
              fill: false,
              tension: 0.2,
            },
            {
              label: 'Min',
              data: [
                res.gradationTest.cvcMinA, res.gradationTest.cvcMinB,
                res.gradationTest.cvcMinC, res.gradationTest.cvcMinD, res.gradationTest.cvcMinE,
                res.gradationTest.cvcMinF, res.gradationTest.cvcMinG, res.gradationTest.cvcMinH,
                res.gradationTest.cvcMinI, res.gradationTest.cvcMinJ
              ],
              borderColor: 'grey',
              fill: false,
              tension: 0.2,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              enabled: true,
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Sieve ',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Passing%',
              },
              beginAtZero: true,
              max: 110,
            }
          }
        }
      });
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
    doc.text("Asphalt Marshall", 80, 35);
    doc.setFontSize(9);

    const infoRows = [
      ["Project", this.asphalt.projectName || 'N/A', "Test Name", this.asphalt.nameOfTest || 'N/A'],
      ["Client", this.asphalt.clientName || 'N/A', "Testing Date", this.asphalt.testingDate || 'N/A'],
      ["Sample No", this.asphalt.sampleNo || 'N/A', "Consultant", this.asphalt.consultant || 'N/A'],
      ["Sample By", this.asphalt.sampleBy || 'N/A', "Owner", this.asphalt.owner || 'N/A'],
      ["Sampling Date", this.asphalt.sampleDate || 'N/A', "Asphalt Applier", this.asphalt.asphaltApplier || 'N/A'],
      ["Asphalt Type", this.asphalt.asphaltType || 'N/A']
    ];

    autoTable(doc, {
      // head: [["Field", "Value", "Field", "Value"]],
      body: infoRows,
      startY: 37,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1
      },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 60 },
        2: { cellWidth: 32 },
        3: { cellWidth: 60 }
      },
      margin: { left: 13, right: 13 },
      tableWidth: 'auto'
    });


      // doc.line(10, 68, 200, 68);
      doc.setFontSize(10);
      doc.text(`BITUMEN CONTENT TEST (${this.asphalt.bitumen.standard})`, 65, 73);

      // First table - Bitumen data
      const bitumenColumn = ['Parameter', 'Value'];
      const bitumenRows = [
        ['Wt. sample before gm', this.asphalt.bitumen.weightSampleBefore],
        ['Wt. of filter before gm', this.asphalt.bitumen.weightFilterBefore],
        ['Wt. Of filter after gm', this.asphalt.bitumen.weightFilterAfter],
        ['Increase of filter wt. gm', Number(this.asphalt.bitumen.increaseOfFilterWeight).toFixed(1)],
        ['Wt. of sample after gm', this.asphalt.bitumen.weightSampleAfter],
        ['Total wt. of sample gm', Number(this.asphalt.bitumen.totalWeightOfSample).toFixed(1)],
        ['Wt. of bit. gm', Number(this.asphalt.bitumen.weightOfBit).toFixed(1)],
        ['Perc of Bit %', Number(this.asphalt.bitumen.percOfBit).toFixed(2)],
      ];

      autoTable(doc, {
        head: [bitumenColumn],
        body: bitumenRows,
        startY: 74,
        styles: {
          fontSize: 6,
          cellPadding: 1.5,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        showHead: 'everyPage',
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.3,
      });

      let finalY = (doc as any).lastAutoTable.finalY + 5;

      doc.text(`SIEVE ANALYSIS (${this.asphalt.gradationTest.standard})` , 70 , finalY  )
      const sieveColumn: RowInput[] = [
        [
          { content: 'mm', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'inch', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Ret(gm)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Ret%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Passing%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Gmf limits', colSpan: 2, styles: { halign: 'center' } },
          { content: 'General specifications', colSpan: 2, styles: { halign: 'center' } },
          { content: 'Expand', rowSpan: 2, styles: { halign: 'center' , valign: 'middle'} },
        ],
        [
          { content: 'Min%', styles: { halign: 'center' } },
          { content: 'Max%', styles: { halign: 'center' } },
          { content: 'Min%', styles: { halign: 'center' } },
          { content: 'Max%', styles: { halign: 'center' } },
        ]
      ];


      const sieveRows = [
        ['37.5', '1.5', this.asphalt.gradationTest.massRetainedA, Number(this.asphalt.gradationTest.retainedA).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedA).toFixed(2), this.asphalt.gradationTest.cvcMinA, this.asphalt.gradationTest.cvcMaxA
          , this.asphalt.gradationTest.gcvcMinA, this.asphalt.gradationTest.gcvcMaxA , this.asphalt.gradationTest.expandA],
        ['25', '1', this.asphalt.gradationTest.massRetainedB, Number(this.asphalt.gradationTest.retainedB).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedB).toFixed(2), this.asphalt.gradationTest.cvcMinB, this.asphalt.gradationTest.cvcMaxB
          , this.asphalt.gradationTest.gcvcMinB, this.asphalt.gradationTest.gcvcMaxB , this.asphalt.gradationTest.expandB],
        ['19.0', '3/4', this.asphalt.gradationTest.massRetainedC, Number(this.asphalt.gradationTest.retainedC).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedC).toFixed(2), this.asphalt.gradationTest.cvcMinC, this.asphalt.gradationTest.cvcMaxC
          , this.asphalt.gradationTest.gcvcMinC, this.asphalt.gradationTest.gcvcMaxC , this.asphalt.gradationTest.expandC],
        ['12.5', '1/2', this.asphalt.gradationTest.massRetainedD, Number(this.asphalt.gradationTest.retainedD).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedD).toFixed(2), this.asphalt.gradationTest.cvcMinD, this.asphalt.gradationTest.cvcMaxD
          , this.asphalt.gradationTest.gcvcMinD, this.asphalt.gradationTest.gcvcMaxD , this.asphalt.gradationTest.expandD],
        ['9.5', '3/8', this.asphalt.gradationTest.massRetainedE, Number(this.asphalt.gradationTest.retainedE).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedE).toFixed(2), this.asphalt.gradationTest.cvcMinE, this.asphalt.gradationTest.cvcMaxE
          , this.asphalt.gradationTest.gcvcMinE, this.asphalt.gradationTest.gcvcMaxE , this.asphalt.gradationTest.expandE],
        ['4.75', '#4', this.asphalt.gradationTest.massRetainedF, Number(this.asphalt.gradationTest.retainedF).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedF).toFixed(2), this.asphalt.gradationTest.cvcMinF, this.asphalt.gradationTest.cvcMaxF
          , this.asphalt.gradationTest.gcvcMinF, this.asphalt.gradationTest.gcvcMaxF , this.asphalt.gradationTest.expandF],
        ['2.00', '#10', this.asphalt.gradationTest.massRetainedG, Number(this.asphalt.gradationTest.retainedG).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedG).toFixed(2), this.asphalt.gradationTest.cvcMinG, this.asphalt.gradationTest.cvcMaxG
          , this.asphalt.gradationTest.gcvcMinG, this.asphalt.gradationTest.gcvcMaxG , this.asphalt.gradationTest.expandG],
        ['0.425', '#40', this.asphalt.gradationTest.massRetainedH, Number(this.asphalt.gradationTest.retainedH).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedH).toFixed(2), this.asphalt.gradationTest.cvcMinH, this.asphalt.gradationTest.cvcMaxH
          , this.asphalt.gradationTest.gcvcMinH, this.asphalt.gradationTest.gcvcMaxH , this.asphalt.gradationTest.expandH],
        ['0.180', '#80', this.asphalt.gradationTest.massRetainedI, Number(this.asphalt.gradationTest.retainedI).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedI).toFixed(2), this.asphalt.gradationTest.cvcMinI, this.asphalt.gradationTest.cvcMaxI
          , this.asphalt.gradationTest.gcvcMinI, this.asphalt.gradationTest.gcvcMaxI , this.asphalt.gradationTest.expandI],
        ['0.075', '#200', this.asphalt.gradationTest.massRetainedJ, Number(this.asphalt.gradationTest.retainedJ).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedJ).toFixed(2), this.asphalt.gradationTest.cvcMinJ, this.asphalt.gradationTest.cvcMaxJ
          , this.asphalt.gradationTest.gcvcMinJ, this.asphalt.gradationTest.gcvcMaxJ , this.asphalt.gradationTest.expandJ],
      ];

      autoTable(doc, {
        head: sieveColumn,
        body: sieveRows,
        tableWidth: 'auto',
        startY: finalY +2 ,
        styles: {
          fontSize: 6,
          cellPadding: 1.5,
          lineColor: [0, 0, 0], // Black grid lines
          lineWidth: 0.1,       // Thin grid lines
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255], // White text for header
          fontStyle: 'bold',
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },

        tableLineColor: [220, 220, 220],
        tableLineWidth: 0.3,
        margin: { left: 14 }
      });

      finalY = (doc as any).lastAutoTable.finalY + 3;


      // Add chart after the second table
      setTimeout(() => {
        const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL('image/png');
          doc.addImage(chartImage, 'PNG', 15, finalY, 180, 60);


          finalY += 90;  // Chart height (80) + some margin
          doc.line(10, finalY - 27, 200, finalY - 27);
          doc.setFontSize(10);
          doc.text(`Approved by: ${this.asphalt.approveBy || 'N/A'}`, 13, finalY - 23);
          doc.text(`Test by: ${this.asphalt.testBy || 'N/A'}`, 80, finalY - 23 );
          doc.text(`Checked by: ${this.asphalt.activist || 'N/A'}`, 150, finalY - 23);
          doc.addImage(tail, 'PNG', 0, finalY - 20, 210, 33);

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
          doc.text(`Report Date: ${currentDateTime}`, 1, finalY + 5);

          const headerHeight = 15; // Approximate height needed for header
          const tableHeight = 200; // Estimate your table height (adjust based on rows)

          if (finalY + headerHeight + tableHeight > doc.internal.pageSize.height - 20) {
            doc.addPage();
            finalY = 2; // Reset Y position after new page
          }

          doc.addImage(head, 'PNG', 0, 0, 210, 33);
          doc.setFontSize(12);
          doc.text("Asphalt Marshall", 80, 36);
          doc.setFontSize(9);

          const infoRows = [
            ["Project", this.asphalt.projectName || 'N/A', "Test Name", this.asphalt.nameOfTest || 'N/A'],
            ["Client", this.asphalt.clientName || 'N/A', "Testing Date", this.asphalt.testingDate || 'N/A'],
            ["Sample No", this.asphalt.sampleNo || 'N/A', "Standard", this.asphalt.classification || 'N/A'],
            ["Sample By", this.asphalt.sampleBy || 'N/A', "Consultant", this.asphalt.consultant || 'N/A'],
            ["Sampling Date", this.asphalt.sampleDate || 'N/A', "Owner", this.asphalt.owner || 'N/A'],
            ["Asphalt Type", this.asphalt.asphaltType || 'N/A', "Asphalt Applier", this.asphalt.asphaltApplier || 'N/A']
          ];

          autoTable(doc, {
            body: infoRows,
            startY: 40,
            theme: 'grid',
            styles: {
              fontSize: 8,
              cellPadding: .5
            },
            columnStyles: {
              0: { cellWidth: 32 },
              1: { cellWidth: 60 },
              2: { cellWidth: 32 },
              3: { cellWidth: 60 }
            },
            margin: { left: 13, right: 13 },
            tableWidth: 'auto'
          });
          // doc.line(10, 68, 200, 68);
          doc.setFontSize(10);
          doc.text(`ASPHALT  MARSHALL & G.M.M TEST (${this.asphalt.classification})` , 60, 73)


          const tableColumn = ['Parameter', '1', '2', '3', '4', '5', '6'];
          const tableRows: RowInput[]  = [
            [
              { content: '% A/C by tot. wt. of mix', colSpan: 1, styles: { halign: 'left', fontStyle: 'bold' } },
              { content: Number(this.asphalt.bitumen.percOfBit).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            ['Wt. in air dry (gm)', this.asphalt.weightAirDryA, this.asphalt.weightAirDryB, this.asphalt.weightAirDryC, this.asphalt.weightAirDryD, this.asphalt.weightAirDryE, this.asphalt.weightAirDryF],
            ['Wt. in water (gm)', this.asphalt.weightWaterA, this.asphalt.weightWaterB, this.asphalt.weightWaterC, this.asphalt.weightWaterD, this.asphalt.weightWaterE, this.asphalt.weightWaterF],
            ['Wt. in air surf dry (gm)', this.asphalt.weightAirSurfDryA, this.asphalt.weightAirSurfDryB, this.asphalt.weightAirSurfDryC, this.asphalt.weightAirSurfDryD, this.asphalt.weightAirSurfDryE, this.asphalt.weightAirSurfDryF],
            ['Volumes (c.c)',
              (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA).toFixed(1),
              (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB).toFixed(1),
              (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC).toFixed(1),
              (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD).toFixed(1),
              (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE).toFixed(1),
              (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF).toFixed(1)],
            ['Bulk Sp.Gr.of Comp. mix',
              (this.asphalt.weightAirDryA / (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA)).toFixed(3),
              (this.asphalt.weightAirDryB / (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB)).toFixed(3),
              (this.asphalt.weightAirDryC / (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC)).toFixed(3),
              (this.asphalt.weightAirDryD / (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD)).toFixed(3),
              (this.asphalt.weightAirDryE / (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE)).toFixed(3),
              (this.asphalt.weightAirDryF / (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF)).toFixed(3)],
            [
              { content: 'Avg Bulk Sp.Gr.of Comp. mix Gmb gm/cm3', colSpan: 1, styles: { halign: 'left', fontStyle: 'bold' as 'bold' } },
              { content: Number(this.bulkSpOfCompMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Net. Wt. Of loose mix (gm)', styles: { fontStyle: 'bold' } },
              { content: this.asphalt.netWeightOfLooseMix.toString(), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Net Wt. Of Flask+water (gm)', styles: { fontStyle: 'bold' } },
              { content: this.asphalt.netWeightOfFlaskWater.toString(), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Wt. Flask+water+sample (gm)', styles: { fontStyle: 'bold' } },
              { content: this.asphalt.weightFlaskWaterSample.toString(), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Max. Sp. Gr of Paving mix', styles: { fontStyle: 'bold' } },
              { content: Number(this.maxSpOfPAvgMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Avg. max Sp. Gr of mix gmm gm/cm3', styles: { fontStyle: 'bold' } },
              { content: Number(this.maxSpOfPAvgMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: '% Air Voids', styles: { fontStyle: 'bold' } },
              { content: Number(this.airVoid).toFixed(1), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: '% Voids in mineral Agg.', styles: { fontStyle: 'bold' } },
              { content: Number(this.voidMineral).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: '% Voids filled with Asp.', styles: { fontStyle: 'bold' } },
              { content: Number(this.voidFilled).toFixed(1), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Effect. Sp. Gravity of Agg.', styles: { fontStyle: 'bold' } },
              { content: Number(this.effectiveSpGravityOfAgg).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Absorbed Asp. %', styles: { fontStyle: 'bold' } },
              { content: Number(this.absorbedAps).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              { content: 'Effective Asp. Content %', styles: { fontStyle: 'bold' } },
              { content: Number(this.asphalt.bitumen.percOfBit - (this.absorbedAps / 100) * (100 - this.asphalt.bitumen.percOfBit)).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            ['Stability (kg)', this.asphalt.stabilityA, this.asphalt.stabilityB, this.asphalt.stabilityC, this.asphalt.stabilityD, this.asphalt.stabilityE, this.asphalt.stabilityF],
            ['Correction factor', this.asphalt.correctionFactorA, this.asphalt.correctionFactorB, this.asphalt.correctionFactorC, this.asphalt.correctionFactorD, this.asphalt.correctionFactorE, this.asphalt.correctionFactorF],
            ['Corrected Stability (kg)',
              (this.asphalt.stabilityA * this.asphalt.correctionFactorA).toFixed(0),
              (this.asphalt.stabilityB * this.asphalt.correctionFactorB).toFixed(0),
              (this.asphalt.stabilityC * this.asphalt.correctionFactorC).toFixed(0),
              (this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0),
              (this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0),
              (this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0)],
            [
              { content: 'Stability (kg) for 30 min', styles: { fontStyle: 'bold' } },
              { content: Number(this.avgStabilityFor30Min).toFixed(0), colSpan: 3, styles: { halign: 'center' } },
              '', '', ''
            ],
            ['Stability (kg) for 24 Hrs.', '', '', '', Number(this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0), Number(this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0), Number(this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0)],
            [
              { content: 'Stability (kg) for 24 Hrs.', styles: { fontStyle: 'bold' } },
              '', '', '',
              {content: `${Number(this.avgStabilityFor24Hrs).toFixed(0)}`, colSpan: 3, styles: { halign: 'center' }}
            ],
            [
              { content: '% Loss of Stability', styles: { fontStyle: 'bold' } },
              {content: `${((this.avgStabilityFor30Min - this.avgStabilityFor24Hrs) / this.avgStabilityFor30Min * 100).toFixed(1)}`, colSpan: 6, styles: { halign: 'center' }}
            ],
            ['Flow (mm)', this.asphalt.flowA, this.asphalt.flowB, this.asphalt.flowC, '', '', ''],
            [
              { content: 'Avg. Flow (mm)', styles: { fontStyle: 'bold' } },
              { content: Number((this.asphalt.flowA + this.asphalt.flowB + this.asphalt.flowC) / 3).toFixed(2), colSpan: 3, styles: { halign: 'center' } },
              '', '', ''
            ],
            [
              { content: 'Sp. Gravity of Asp. Bit', styles: { fontStyle: 'bold' } },
              {content: `${this.asphalt.spGravityOfAspBit}`, colSpan: 6, styles: { halign: 'center' }}
            ],
            [
              { content: 'Agg. % total wt. of mix', styles: { fontStyle: 'bold' } },
              {content: `${Number(100 - this.asphalt.bitumen.percOfBit).toFixed(2)}`, colSpan: 6, styles: { halign: 'center' }}
            ],
            [
              { content: 'Bulk Sp. Gr. Comb. Agg.', styles: { fontStyle: 'bold' } },
              {content: `${this.asphalt.bulkSpGrCombAgg}`, colSpan: 6, styles: { halign: 'center' }}
            ],
          ];

          autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            styles: {
              fontSize: 6,
              cellPadding: 1.5,
              lineColor: [0, 0, 0], // Black grid lines
              lineWidth: 0.1,       // Thin grid lines
            },
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: [255, 255, 255], // White text for header
              fontStyle: 'bold',
              lineWidth: 0.1,
            },
            alternateRowStyles: {
              fillColor: [242, 242, 242], // Very light gray alternate rows
            },
            columnStyles: {
              0: { cellWidth: 'auto', fontStyle: 'bold' }, // Bold parameter names
              1: { halign: 'right' }, // Right-align values
              2: { halign: 'right' },
              3: { halign: 'right' },
              4: { halign: 'right' },
              5: { halign: 'right' },
              6: { halign: 'right' }
            },
            tableLineColor: [220, 220, 220], // Table border color
            tableLineWidth: 0.3,
            margin: { left: 10 }, // Add some left margin like Excel
            showHead: 'everyPage'
          });

          finalY = (doc as any).lastAutoTable.finalY || 100;

          doc.setFontSize(9);
          if (this.asphalt.notes) {
            doc.line(10, finalY+4, 200, finalY+4);
            const splitNotes = doc.splitTextToSize(
              `Remarks: ${this.asphalt.notes || ""}`,
              180
            );
            doc.text(splitNotes, 13, finalY + 8);
            finalY += (splitNotes.length * 7); // 7 is approximate line height
          }

          doc.line(10, 257, 200, 257);

          doc.setFontSize(10);
          doc.text(`Approved by: ${this.asphalt.approveBy || 'N/A'}`, 13, 261);
          doc.text(`Test by: ${this.asphalt.testBy || 'N/A'}`, 80, 261);
          doc.text(`Checked by: ${this.asphalt.activist || 'N/A'}`, 150, 261);
          doc.addImage(tail, 'PNG', 0, 265, 210, 33);
          doc.setFontSize(5);
          doc.text(`Report Date: ${currentDateTime}`, 1, 290);

          // Save the PDF
          doc.save(`Asphalt_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        } else {
          console.error("Chart canvas not found! Ensure it is fully loaded before generating the PDF.");
        }
      }, 1000);
    };
  }


}

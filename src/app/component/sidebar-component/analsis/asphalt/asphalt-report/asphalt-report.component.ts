import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {ActivatedRoute} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import jsPDF from "jspdf";
import autoTable, {RowInput} from "jspdf-autotable";
import Chart from "chart.js/auto";

@Component({
  selector: 'app-asphalt-report',
  standalone: true,
  imports: [],
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
    const ctx = document.getElementById('invoiceChart') as HTMLCanvasElement;

    this.service.findById(this.id).subscribe(res => {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1.5', '1', '3/4', '1/2', '3/8', '#4', '#10', '#40', '#80', "#200"],
          datasets: [
            {
              label: 'Max',
              data: [
                res.gradationTest.cvcMaxA, res.gradationTest.cvcMaxB, res.gradationTest.cvcMaxC,
                res.gradationTest.cvcMaxD, res.gradationTest.cvcMaxE, res.gradationTest.cvcMaxF,
                res.gradationTest.cvcMaxG, res.gradationTest.cvcMaxH, res.gradationTest.cvcMaxI,
                res.gradationTest.cvcMaxJ],
              borderColor: 'grey',
              fill: false
            },
            {
              label: 'Gradation',
              data: [
                100 - res.gradationTest.retainedA, 100 - res.gradationTest.retainedB,
                100 - res.gradationTest.retainedC, 100 - res.gradationTest.retainedD, 100 - res.gradationTest.retainedE,
                100 - res.gradationTest.retainedF, 100 - res.gradationTest.retainedG, 100 - res.gradationTest.retainedH,
                100 - res.gradationTest.retainedI, 100 - res.gradationTest.retainedJ],
              borderColor: 'red',
              fill: false
            },
            {
              label: 'Min',
              data: [
                res.gradationTest.cvcMinA, res.gradationTest.cvcMinB,
                res.gradationTest.cvcMinC, res.gradationTest.cvcMinD, res.gradationTest.cvcMinE,
                res.gradationTest.cvcMinF, res.gradationTest.cvcMinG, res.gradationTest.cvcMinH,
                res.gradationTest.cvcMinI, res.gradationTest.cvcMinJ],
              borderColor: 'grey',
              fill: false
            }
          ]
        }
      });
    })

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
      // Add header
      doc.addImage(head, 'PNG', 0, 0, 210, 33);

      // Add title and basic info
      doc.setFontSize(12);
      doc.text("Asphalt Marshall", 80, 36);
      doc.setFontSize(9);
      doc.text(`Project                 ${this.asphalt.projectName || 'N/A'}`, 13, 42);
      doc.text(`Client                   ${this.asphalt.clientName || 'N/A'}`, 13, 46);
      doc.text(`Sample No          ${this.asphalt.sampleNo || 'N/A'}`, 13, 50);
      doc.text(`Sample By          ${this.asphalt.sampleBy || 'N/A'}`, 13, 54);
      doc.text(`Sampling Date   ${this.asphalt.sampleDate || 'N/A'}`, 13, 58);
      doc.text(`Asphalt Type       ${this.asphalt.asphaltType || 'N/A'}`, 13, 62);
      doc.text(`Test Name          ${this.asphalt.nameOfTest || 'N/A'}`, 110, 42);
      doc.text(`Testing Date        ${this.asphalt.testingDate || 'N/A'}`, 110, 46);
      doc.text(`Standard             ${this.asphalt.classification || 'N/A'}`, 110, 50);
      doc.text(`Consultant          ${this.asphalt.consultant || 'N/A'}`, 110, 54);
      doc.text(`Owner                 ${this.asphalt.owner || 'N/A'}`, 110, 58);
      doc.text(`Asphalt Applier   ${this.asphalt.asphaltApplier || 'N/A'}`, 110, 62);
      doc.line(10, 65, 200, 65);
      doc.setFontSize(10);
      doc.text(`BITUMEN CONTENT TEST` , 75 , 70)

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
        startY: 72,  // Positioned below the header
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
        showHead: 'everyPage', // Show header on every page if table spans multiple pages
        tableLineColor: [0, 0, 0], // Outer table border
        tableLineWidth: 0.3,       // Slightly thicker outer border
      });

      let finalY = (doc as any).lastAutoTable.finalY + 5;

      doc.text(`SIEVE ANALYSIS` , 85 , finalY  )
      const sieveColumn: RowInput[] = [
        [
          { content: 'mm', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'inch', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Ret(gm)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Ret%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Passing%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Gmf limits', colSpan: 2, styles: { halign: 'center' } },
          { content: 'General specifications', colSpan: 2, styles: { halign: 'center' } },
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
          , this.asphalt.gradationTest.gcvcMinA, this.asphalt.gradationTest.gcvcMaxA],
        ['25', '1', this.asphalt.gradationTest.massRetainedB, Number(this.asphalt.gradationTest.retainedB).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedB).toFixed(2), this.asphalt.gradationTest.cvcMinB, this.asphalt.gradationTest.cvcMaxB
          , this.asphalt.gradationTest.gcvcMinB, this.asphalt.gradationTest.gcvcMaxB],
        ['19.0', '3/4', this.asphalt.gradationTest.massRetainedC, Number(this.asphalt.gradationTest.retainedC).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedC).toFixed(2), this.asphalt.gradationTest.cvcMinC, this.asphalt.gradationTest.cvcMaxC
          , this.asphalt.gradationTest.gcvcMinC, this.asphalt.gradationTest.gcvcMaxC],
        ['12.5', '1/2', this.asphalt.gradationTest.massRetainedD, Number(this.asphalt.gradationTest.retainedD).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedD).toFixed(2), this.asphalt.gradationTest.cvcMinD, this.asphalt.gradationTest.cvcMaxD
          , this.asphalt.gradationTest.gcvcMinD, this.asphalt.gradationTest.gcvcMaxD],
        ['9.5', '3/8', this.asphalt.gradationTest.massRetainedE, Number(this.asphalt.gradationTest.retainedE).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedE).toFixed(2), this.asphalt.gradationTest.cvcMinE, this.asphalt.gradationTest.cvcMaxE
          , this.asphalt.gradationTest.gcvcMinE, this.asphalt.gradationTest.gcvcMaxE],
        ['4.75', '#4', this.asphalt.gradationTest.massRetainedF, Number(this.asphalt.gradationTest.retainedF).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedF).toFixed(2), this.asphalt.gradationTest.cvcMinF, this.asphalt.gradationTest.cvcMaxF
          , this.asphalt.gradationTest.gcvcMinF, this.asphalt.gradationTest.gcvcMaxF],
        ['2.00', '#10', this.asphalt.gradationTest.massRetainedG, Number(this.asphalt.gradationTest.retainedG).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedG).toFixed(2), this.asphalt.gradationTest.cvcMinG, this.asphalt.gradationTest.cvcMaxG
          , this.asphalt.gradationTest.gcvcMinG, this.asphalt.gradationTest.gcvcMaxG],
        ['0.425', '#40', this.asphalt.gradationTest.massRetainedH, Number(this.asphalt.gradationTest.retainedH).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedH).toFixed(2), this.asphalt.gradationTest.cvcMinH, this.asphalt.gradationTest.cvcMaxH
          , this.asphalt.gradationTest.gcvcMinH, this.asphalt.gradationTest.gcvcMaxH],
        ['0.180', '#80', this.asphalt.gradationTest.massRetainedI, Number(this.asphalt.gradationTest.retainedI).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedI).toFixed(2), this.asphalt.gradationTest.cvcMinI, this.asphalt.gradationTest.cvcMaxI
          , this.asphalt.gradationTest.gcvcMinI, this.asphalt.gradationTest.gcvcMaxI],
        ['0.075', '#200', this.asphalt.gradationTest.massRetainedJ, Number(this.asphalt.gradationTest.retainedJ).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedJ).toFixed(2), this.asphalt.gradationTest.cvcMinJ, this.asphalt.gradationTest.cvcMaxJ
          , this.asphalt.gradationTest.gcvcMinJ, this.asphalt.gradationTest.gcvcMaxJ],
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

          const headerHeight = 15; // Approximate height needed for header
          const tableHeight = 200; // Estimate your table height (adjust based on rows)

          if (finalY + headerHeight + tableHeight > doc.internal.pageSize.height - 20) {
            doc.addPage();
            finalY = 2; // Reset Y position after new page
          }

          doc.addImage(head, 'PNG', 0, 0, 210, 33);

          // Add title and basic info
          doc.setFontSize(12);
          doc.text("Asphalt Marshall", 80, 36);
          doc.setFontSize(9);
          doc.text(`Project                 ${this.asphalt.projectName || 'N/A'}`, 13, 42);
          doc.text(`Client                   ${this.asphalt.clientName || 'N/A'}`, 13, 46);
          doc.text(`Sample No          ${this.asphalt.sampleNo || 'N/A'}`, 13, 50);
          doc.text(`Sample By          ${this.asphalt.sampleBy || 'N/A'}`, 13, 54);
          doc.text(`Sampling Date   ${this.asphalt.sampleDate || 'N/A'}`, 13, 58);
          doc.text(`Asphalt Type      ${this.asphalt.asphaltType || 'N/A'}`, 13, 62);
          doc.text(`Test Name          ${this.asphalt.nameOfTest || 'N/A'}`, 110, 42);
          doc.text(`Testing Date       ${this.asphalt.testingDate || 'N/A'}`, 110, 46);
          doc.text(`Standard             ${this.asphalt.classification || 'N/A'}`, 110, 50);
          doc.text(`Consultant          ${this.asphalt.consultant || 'N/A'}`, 110, 54);
          doc.text(`Owner                 ${this.asphalt.owner || 'N/A'}`, 110, 58);
          doc.text(`Asphalt Applier   ${this.asphalt.asphaltApplier || 'N/A'}`, 110, 62);
          doc.line(10, 65, 200, 65);
          doc.setFontSize(10);
          doc.text(`ASPHALT  MARSHALL & G.M.M TEST` , 75 , 70)


          const tableColumn = ['Parameter', '1', '2', '3', '4', '5', '6'];
          const tableRows = [
            ['% A/C by tot. wt. of mix', '', '', Number(this.asphalt.bitumen.percOfBit).toFixed(2)],
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
            ['Avg Bulk Sp.Gr.of Comp. mix Gmb gm/cm3', '', '', '', Number(this.bulkSpOfCompMix).toFixed(3)],
            ['Net. Wt. Of loose mix (gm)', '', '', this.asphalt.netWeightOfLooseMix],
            ['Net Wt. Of Flask+water (gm)', '', '', this.asphalt.netWeightOfFlaskWater],
            ['Wt. Flask+water+sample (gm)', '', '', this.asphalt.weightFlaskWaterSample],
            ['Max. Sp. Gr of Paving mix', '', '', Number(this.maxSpOfPAvgMix).toFixed(3)],
            ['Avg. max Sp. Gr of mix gmm gm/cm3', '', '', '', Number(this.maxSpOfPAvgMix).toFixed(3)],
            ['% Air Voids', '', '', '', Number(this.airVoid).toFixed(1)],
            ['% Voids in mineral Agg.', '', '', '', Number(this.voidMineral).toFixed(2)],
            ['% Voids filled with Asp.', '', '', '', Number(this.voidFilled).toFixed(1)],
            ['Effect. Sp. Gravity of Agg.', '', '', '', Number(this.effectiveSpGravityOfAgg).toFixed(3)],
            ['Absorbed Asp. %', '', '', '', Number(this.absorbedAps).toFixed(2)],
            ['Effective Asp. Content %', '', '', '', Number(this.asphalt.bitumen.percOfBit - (this.absorbedAps / 100) * (100 - this.asphalt.bitumen.percOfBit)).toFixed(2)],
            ['Stability (kg)', this.asphalt.stabilityA, this.asphalt.stabilityB, this.asphalt.stabilityC, this.asphalt.stabilityD, this.asphalt.stabilityE, this.asphalt.stabilityF],
            ['Correction factor', this.asphalt.correctionFactorA, this.asphalt.correctionFactorB, this.asphalt.correctionFactorC, this.asphalt.correctionFactorD, this.asphalt.correctionFactorE, this.asphalt.correctionFactorF],
            ['Corrected Stability (kg)',
              (this.asphalt.stabilityA * this.asphalt.correctionFactorA).toFixed(0),
              (this.asphalt.stabilityB * this.asphalt.correctionFactorB).toFixed(0),
              (this.asphalt.stabilityC * this.asphalt.correctionFactorC).toFixed(0),
              (this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0),
              (this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0),
              (this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0)],
            ['Stability (kg) for 30 min', '', Number(this.avgStabilityFor30Min).toFixed(0), '', '', '', ''],
            ['Stability (kg) for 24 Hrs.', '', '', '', Number(this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0), Number(this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0), Number(this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0)],
            ['Stability (kg) for 24 Hrs.', '', '', '', '', Number(this.avgStabilityFor24Hrs).toFixed(0), ''],
            ['% Loss of Stability', '', '', Number(((this.avgStabilityFor30Min - this.avgStabilityFor24Hrs) / this.avgStabilityFor30Min * 100).toFixed(1))],
            ['Flow (mm)', this.asphalt.flowA, this.asphalt.flowB, this.asphalt.flowC, '', '', ''],
            ['Avg. Flow (mm)', '', Number((this.asphalt.flowA + this.asphalt.flowB + this.asphalt.flowC) / 3).toFixed(2), '', '', '', ''],
            ['Sp. Gravity of Asp. Bit.', '', '', this.asphalt.spGravityOfAspBit],
            ['Agg. % total wt. of mix', '', '', Number(100 - this.asphalt.bitumen.percOfBit).toFixed(2)],
            ['Bulk Sp. Gr. Comb. Agg.', '', '', this.asphalt.bulkSpGrCombAgg]
          ];

          autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 73,
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

          // Save the PDF
          doc.save(`Asphalt_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        } else {
          console.error("Chart canvas not found! Ensure it is fully loaded before generating the PDF.");
        }
      }, 1000);
    };
  }


}

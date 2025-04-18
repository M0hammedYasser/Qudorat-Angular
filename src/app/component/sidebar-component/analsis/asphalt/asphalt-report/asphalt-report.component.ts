import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {ActivatedRoute} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
          labels: ['3/2', '1', '3/4', '1/2', '3/8', '#4', '#10', '#40', '#80', "#200"],
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
    const img = new Image();
    const qr = new Image();
    img.src = 'assets/Q.png'; // Adjust the path as needed
    qr.src = 'assets/barcode.jpg';

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 5, 20, 20);
      doc.setFontSize(16);
      doc.text('Qudorat Laboratory', 35, 15);
      doc.setFontSize(11);
      doc.text(`Project         ${this.asphalt.projectName || 'N/A'}`, 13, 30);
      doc.text(`Client           ${this.asphalt.clientName || 'N/A'}`, 13, 36);
      doc.addImage(qr, 'PNG', 125, 25, 50, 10);
      doc.text(`Sample By          ${this.asphalt.sampleBy || 'N/A'}`, 13, 42);
      doc.text(`Sampling Date    ${this.asphalt.sampleDate || 'N/A'}`, 13, 48);
      doc.text(`Testing Date     ${this.asphalt.testingDate || 'N/A'}`, 130, 42);
      doc.text(`Standard    ${this.asphalt.classification || 'N/A'}`, 130, 48);
      doc.line(10, 52, 200, 52);

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
        startY: 55,
        styles: {fontSize: 9},
        headStyles: {fillColor: [41, 128, 185]},
        alternateRowStyles: {fillColor: [240, 240, 240]},
      });

      let finalY = (doc as any).lastAutoTable.finalY + 10;

      const sieveColumn = [
        [' mm', 'inch', 'Ret(gm)', 'Ret%', 'Passing%', 'Min%', 'Max%']
      ];

      const sieveRows = [
        ['37.5', '3/2', this.asphalt.gradationTest.massRetainedA, Number(this.asphalt.gradationTest.retainedA).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedA).toFixed(2), this.asphalt.gradationTest.cvcMinA, this.asphalt.gradationTest.cvcMaxA],
        ['25', '1', this.asphalt.gradationTest.massRetainedB, Number(this.asphalt.gradationTest.retainedB).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedB).toFixed(2), this.asphalt.gradationTest.cvcMinB, this.asphalt.gradationTest.cvcMaxB],
        ['19.0', '3/4', this.asphalt.gradationTest.massRetainedC, Number(this.asphalt.gradationTest.retainedC).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedC).toFixed(2), this.asphalt.gradationTest.cvcMinC, this.asphalt.gradationTest.cvcMaxC],
        ['12.5', '1/2', this.asphalt.gradationTest.massRetainedD, Number(this.asphalt.gradationTest.retainedD).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedD).toFixed(2), this.asphalt.gradationTest.cvcMinD, this.asphalt.gradationTest.cvcMaxD],
        ['9.5', '3/8', this.asphalt.gradationTest.massRetainedE, Number(this.asphalt.gradationTest.retainedE).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedE).toFixed(2), this.asphalt.gradationTest.cvcMinE, this.asphalt.gradationTest.cvcMaxE],
        ['4.75', '#4', this.asphalt.gradationTest.massRetainedF, Number(this.asphalt.gradationTest.retainedF).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedF).toFixed(2), this.asphalt.gradationTest.cvcMinF, this.asphalt.gradationTest.cvcMaxF],
        ['2.00', '#10', this.asphalt.gradationTest.massRetainedG, Number(this.asphalt.gradationTest.retainedG).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedG).toFixed(2), this.asphalt.gradationTest.cvcMinG, this.asphalt.gradationTest.cvcMaxG],
        ['0.425', '#40', this.asphalt.gradationTest.massRetainedH, Number(this.asphalt.gradationTest.retainedH).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedH).toFixed(2), this.asphalt.gradationTest.cvcMinH, this.asphalt.gradationTest.cvcMaxH],
        ['0.180', '#80', this.asphalt.gradationTest.massRetainedI, Number(this.asphalt.gradationTest.retainedI).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedI).toFixed(2), this.asphalt.gradationTest.cvcMinI, this.asphalt.gradationTest.cvcMaxI],
        ['0.075', '#200', this.asphalt.gradationTest.massRetainedJ, Number(this.asphalt.gradationTest.retainedJ).toFixed(1),
          Number(100 - this.asphalt.gradationTest.retainedJ).toFixed(2), this.asphalt.gradationTest.cvcMinJ, this.asphalt.gradationTest.cvcMaxJ],
      ];

      autoTable(doc, {
        head: sieveColumn,
        body: sieveRows,
        startY: finalY,
        styles: {fontSize: 9},
        headStyles: {fillColor: [41, 128, 185]},
        alternateRowStyles: {fillColor: [240, 240, 240]},
      });

      finalY = (doc as any).lastAutoTable.finalY || 75;

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
        ['Avg Bulk Sp.Gr.of Comp. mix', '', '', '', Number(this.bulkSpOfCompMix).toFixed(3)],
        ['Net. Wt. Of loose mix (gm)', '', '', this.asphalt.netWeightOfLooseMix],
        ['Net Wt. Of Flask+water (gm)', '', '', this.asphalt.netWeightOfFlaskWater],
        ['Wt. Flask+water+sample (gm)', '', '', this.asphalt.weightFlaskWaterSample],
        ['Max. Sp. Gr of Paving mix', '', '', Number(this.maxSpOfPAvgMix).toFixed(3)],
        ['Avg. max Sp. Gr of mix', '', '', '', Number(this.maxSpOfPAvgMix).toFixed(3)],
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
        startY: finalY + 10,
        styles: {fontSize: 9},
        headStyles: {fillColor: [41, 128, 185]},
        alternateRowStyles: {fillColor: [240, 240, 240]},
      });

      finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.line(10, finalY + 2, 200, finalY + 2);

      if (this.asphalt.notes) {
        doc.text(`Remarks : ${this.asphalt.notes || ""}`, 13, finalY + 8);
      }

      doc.line(10, finalY + 10, 200, finalY + 10);

      doc.setFontSize(11);
      doc.text(`Approved by: ${this.asphalt.approveBy || 'N/A'}`, 13, finalY + 15);
      doc.text(`Test by: ${this.asphalt.testBy || 'N/A'}`, 80, finalY + 15);
      doc.text(`Checked by: ${this.asphalt.activist || 'N/A'}`, 150, finalY + 15);
      doc.save(`Asphalt_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };
  }


}

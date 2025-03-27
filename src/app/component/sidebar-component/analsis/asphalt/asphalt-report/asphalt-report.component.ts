import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import {DecimalPipe} from "@angular/common";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-asphalt-report',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './asphalt-report.component.html',
  styleUrl: './asphalt-report.component.css'
})
export class AsphaltReportComponent implements OnInit, AfterViewInit {

  asphalt: Asphalt = {} as Asphalt;
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

  constructor(private service: AsphaltService, private activatedRoute: ActivatedRoute, private router: Router) {
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
    // Ensures tableContainer is initialized
    if (!this.tableContainer) {
      console.error('tableContainer is not initialized');
    }
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

      // doc.line(10, 40, 200, 40);

      doc.text(`Sample By          ${this.asphalt.sampleBy || 'N/A'}`, 13, 42);
      doc.text(`Sampling Date    ${this.asphalt.sampleDate || 'N/A'}`, 13, 48);
      doc.text(`Testing Date     ${this.asphalt.testingDate || 'N/A'}`, 130, 42);
      doc.text(`Classification    ${this.asphalt.classification || 'N/A'}`, 130, 48);

      doc.line(10, 52, 200, 52);

      // Table Data
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
        startY: 55,
        styles: {fontSize: 9},
        headStyles: {fillColor: [41, 128, 185]},
        alternateRowStyles: {fillColor: [240, 240, 240]},
      });


      let finalY = (doc as any).lastAutoTable.finalY || 100;
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

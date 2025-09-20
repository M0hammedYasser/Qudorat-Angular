import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {ActivatedRoute} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import jsPDF from "jspdf";
import autoTable, {ColumnInput, RowInput} from "jspdf-autotable";
import Chart from "chart.js/auto";
import {DecimalPipe, NgIf} from '@angular/common';
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
declare let AmiriFont: any;


@Component({
  selector: 'app-asphalt-report',
  standalone: true,
  imports: [DecimalPipe, NgIf],
  templateUrl: './asphalt-report.component.html',
  styleUrl: './asphalt-report.component.css'
})
export class AsphaltReportComponent implements OnInit, AfterViewInit {

  asphalt: Asphalt = {} as Asphalt;
  role: string = '';
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

  constructor(private authenticationService: AuthenticationService,private service: AsphaltService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.role = this.authenticationService.getAuthority();
    this.service.findById(this.id).subscribe(res => {
      this.asphalt = res;

      const expandKeys = ['expandA', 'expandB', 'expandC', 'expandD', 'expandE', 'expandF', 'expandG', 'expandH', 'expandI', 'expandJ'];
      for (const key of expandKeys) {
        if (this.asphalt.gradationTest[key] === '\u0000') {
          this.asphalt.gradationTest[key] = '';
        }
      }

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

      this.voidMineral = 100 - (this.bulkSpOfCompMix * (100 - this.asphalt.bitumen.percOfBit) / this.asphalt.bulkSpGrCombAgg);

      this.voidFilled = (this.voidMineral - this.airVoid) / this.voidMineral * 100;

      this.z12 = (100 / this.maxSpOfPAvgMix) - (this.asphalt.bitumen.percOfBit / this.asphalt.spGravityOfAspBit);

      this.effectiveSpGravityOfAgg = (100 - this.asphalt.bitumen.percOfBit) / this.z12;

      this.avgStabilityFor24Hrs = (
        this.asphalt.stabilityD * this.asphalt.correctionFactorD +
        this.asphalt.stabilityE * this.asphalt.correctionFactorE +
        this.asphalt.stabilityF * this.asphalt.correctionFactorF
      ) / 3;

      this.avgStabilityFor30Min = (
        this.asphalt.stabilityA * this.asphalt.correctionFactorA +
        this.asphalt.stabilityB * this.asphalt.correctionFactorB +
        this.asphalt.stabilityC * this.asphalt.correctionFactorC
      ) / 3;

      this.absorbedAps = 100 *
        (this.effectiveSpGravityOfAgg - this.asphalt.bulkSpGrCombAgg) /
        (this.effectiveSpGravityOfAgg * this.asphalt.bulkSpGrCombAgg) *
        this.asphalt.spGravityOfAspBit;
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
    doc.setFontSize(10);
    const headerText = 'Bituminous Content & Gradation Test';
    const textX = 60;
    const textY = 33;

    doc.text(headerText, textX, textY);

    const textWidth = doc.getTextWidth(headerText);

    doc.setDrawColor(0, 0, 0); 
    doc.setLineWidth(0.5);
    doc.line(textX - 1, textY + .5 , textX + textWidth + 2, textY + .5 ); 
    doc.setFontSize(7);
    doc.text("ASTM D-2172, D-5444", 117, 33);
        doc.setFontSize(7);
    doc.text("Sampling ASTM D-979/979M", 143, 33);
    doc.setFontSize(9);

    const infoRows = [
      ["Project", this.asphalt.projectName || 'N/A', "Sampling Date", this.asphalt.sampleDate || 'N/A'],
      ["Contractor", this.asphalt.contractor || 'N/A', "Testing Date", this.asphalt.testingDate || 'N/A'],
      ["Location", this.asphalt.location || 'N/A', "Sample Type", this.asphalt.sampleType || 'N/A'],
      ["Job Order", this.asphalt.jobOrder || 'N/A', "Sample No", this.asphalt.sampleNo || 'N/A'],
      ["Asphalt Supplier", this.asphalt.asphaltApplier || 'N/A', "Sample By", this.asphalt.sampleBy || 'N/A'],
      ["Request Description", this.asphalt.requestDescription || 'N/A', "Asphalt Layer", this.asphalt.asphaltLayer || 'N/A']
    ];

    autoTable(doc, {
      body: infoRows,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 7,
        font: 'Amiri',
        cellPadding: 0.5,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.6
      },
      columnStyles: {
        0: { cellWidth: 34 },
        1: { cellWidth: 61 },
        2: { cellWidth: 34 },
        3: { cellWidth: 61 }
      },
      margin: { left: 10, right: 10 },
      tableWidth: 'auto'
    });

      doc.setFontSize(7);
      const bitumenText = 'BITUMEN'
      const gradationText = 'GRADATION'


      doc.text(bitumenText, 33, 61);
      doc.text(gradationText, 130, 61);

      const gradationWidth = doc.getTextWidth(gradationText);

      const boxStartX = 10; 
      const boxEndX = 181 + gradationWidth + 5; 

      const boxY = 58;       
      const boxHeight = 5;   
      const boxWidth = boxEndX - boxStartX;

      doc.setLineWidth(0.6);
      doc.rect(boxStartX, boxY, boxWidth, boxHeight);


      const bitumenRows = [
        ['Wt. sample before gm', {content: this.asphalt.bitumen.weightSampleBefore , colSpan: 2}, {content: '' , rowSpan: 10}],
        ['Wt. of filter before gm', {content: this.asphalt.bitumen.weightFilterBefore , colSpan: 2}],
        ['Wt. Of filter after gm', {content: this.asphalt.bitumen.weightFilterAfter , colSpan: 2}],
        ['Increase of filter wt. gm', {content: Number(this.asphalt.bitumen.increaseOfFilterWeight).toFixed(1) , colSpan: 2}],
        ['Wt. of sample after gm', {content: this.asphalt.bitumen.weightSampleAfter , colSpan: 2}],
        ['Total wt. of sample gm', {content: Number(this.asphalt.bitumen.totalWeightOfSample).toFixed(1) , colSpan: 2}],
        ['Wt. of bit. gm', {content: Number(this.asphalt.bitumen.weightOfBit).toFixed(1) , colSpan: 2}],
        ['Perc of Bit %', {content: Number(this.asphalt.bitumen.percOfBit).toFixed(2) , colSpan: 2}],
        ['JMF', '4.80', '5.60'],
        ['Result Bit', {content: `${Number(this.asphalt.bitumen.percOfBit).toFixed(2)} ${'±'} ${this.asphalt.bitumen.expand || ''}`, colSpan: 2 }],
        ['Equipment Used', {content:'BE-0001 Balance 6kg' , colSpan: 3}],
      ];

      autoTable(doc, {
        body: bitumenRows,
        theme: 'grid',
        startY: 62,
        styles: {
          fontSize: 7,
          cellPadding: 1.57,
          lineWidth: 0.6,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0]
        },
        tableLineColor: [0, 0, 0],
        margin: { left: 10, right: 78 },
        columnStyles: {
          0: { cellWidth: 33 },
          1: { cellWidth: 12 },
          2: { cellWidth: 12 },
          3: { cellWidth: 11 }

        }
      });

      const sieveColumn: RowInput[] =
       [ [ { content: 'Sieves', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Ret(gm)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Ret%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Passing%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Gmf limits', colSpan: 2, styles: { halign: 'center' } },
        { content: 'General specifications', colSpan: 2, styles: { halign: 'center' } },
        { content: 'U.Expand k.2/95%', rowSpan: 2, styles: { halign: 'center' , valign: 'middle'} }, ],
        [ { content: 'mm', styles: { halign: 'center' } },
          { content: 'inch', styles: { halign: 'center' } },
          { content: 'Min%', styles: { halign: 'center' } },
          { content: 'Max%', styles: { halign: 'center' } },
          { content: 'Min%', styles: { halign: 'center' } },
          { content: 'Max%', styles: { halign: 'center' } },
        ] ];

      const sieveRows = [
       ['37.5', '1.5', this.asphalt.gradationTest.massRetainedA, Number(this.asphalt.gradationTest.retainedA).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedA).toFixed(2), this.asphalt.gradationTest.cvcMinA, this.asphalt.gradationTest.cvcMaxA , this.asphalt.gradationTest.gcvcMinA, this.asphalt.gradationTest.gcvcMaxA , `${'±'} ${this.asphalt.gradationTest.expandA}`],
       ['25', '1', this.asphalt.gradationTest.massRetainedB, Number(this.asphalt.gradationTest.retainedB).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedB).toFixed(2), this.asphalt.gradationTest.cvcMinB, this.asphalt.gradationTest.cvcMaxB , this.asphalt.gradationTest.gcvcMinB, this.asphalt.gradationTest.gcvcMaxB , `${'±'} ${this.asphalt.gradationTest.expandB}`],
       ['19.0', '3/4', this.asphalt.gradationTest.massRetainedC, Number(this.asphalt.gradationTest.retainedC).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedC).toFixed(2), this.asphalt.gradationTest.cvcMinC, this.asphalt.gradationTest.cvcMaxC , this.asphalt.gradationTest.gcvcMinC, this.asphalt.gradationTest.gcvcMaxC , `${'±'} ${this.asphalt.gradationTest.expandC}`],
       ['12.5', '1/2', this.asphalt.gradationTest.massRetainedD, Number(this.asphalt.gradationTest.retainedD).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedD).toFixed(2), this.asphalt.gradationTest.cvcMinD, this.asphalt.gradationTest.cvcMaxD , this.asphalt.gradationTest.gcvcMinD, this.asphalt.gradationTest.gcvcMaxD , `${'±'} ${this.asphalt.gradationTest.expandD}`],
       ['9.5', '3/8', this.asphalt.gradationTest.massRetainedE, Number(this.asphalt.gradationTest.retainedE).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedE).toFixed(2), this.asphalt.gradationTest.cvcMinE, this.asphalt.gradationTest.cvcMaxE , this.asphalt.gradationTest.gcvcMinE, this.asphalt.gradationTest.gcvcMaxE , `${'±'} ${this.asphalt.gradationTest.expandE}`],
       ['4.75', '#4', this.asphalt.gradationTest.massRetainedF, Number(this.asphalt.gradationTest.retainedF).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedF).toFixed(2), this.asphalt.gradationTest.cvcMinF, this.asphalt.gradationTest.cvcMaxF , this.asphalt.gradationTest.gcvcMinF, this.asphalt.gradationTest.gcvcMaxF , `${'±'} ${this.asphalt.gradationTest.expandF}`],
       ['2.00', '#10', this.asphalt.gradationTest.massRetainedG, Number(this.asphalt.gradationTest.retainedG).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedG).toFixed(2), this.asphalt.gradationTest.cvcMinG, this.asphalt.gradationTest.cvcMaxG , this.asphalt.gradationTest.gcvcMinG, this.asphalt.gradationTest.gcvcMaxG , `${'±'} ${this.asphalt.gradationTest.expandG}`],
       ['0.425', '#40', this.asphalt.gradationTest.massRetainedH, Number(this.asphalt.gradationTest.retainedH).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedH).toFixed(2), this.asphalt.gradationTest.cvcMinH, this.asphalt.gradationTest.cvcMaxH , this.asphalt.gradationTest.gcvcMinH, this.asphalt.gradationTest.gcvcMaxH , `${'±'} ${this.asphalt.gradationTest.expandH}`],
       ['0.180', '#80', this.asphalt.gradationTest.massRetainedI, Number(this.asphalt.gradationTest.retainedI).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedI).toFixed(2), this.asphalt.gradationTest.cvcMinI, this.asphalt.gradationTest.cvcMaxI , this.asphalt.gradationTest.gcvcMinI, this.asphalt.gradationTest.gcvcMaxI , `${'±'} ${this.asphalt.gradationTest.expandI}`],
       ['0.075', '#200', this.asphalt.gradationTest.massRetainedJ, Number(this.asphalt.gradationTest.retainedJ).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedJ).toFixed(2), this.asphalt.gradationTest.cvcMinJ, this.asphalt.gradationTest.cvcMaxJ , this.asphalt.gradationTest.gcvcMinJ, this.asphalt.gradationTest.gcvcMaxJ , `${'±'} ${this.asphalt.gradationTest.expandJ}`], 
       [{content : 'Total Weight' , colSpan: 2}, this.asphalt.gradationTest.totalWeigh],
      ];

      // SIEVE ANALYSIS table on the RIGHT
      autoTable(doc, {
        head: sieveColumn,
        body: sieveRows,
        theme: 'grid',
        startY: 62,
        styles: {
          fontSize: 7,
          cellPadding: 1,
          lineWidth: 0.5,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.6,
          lineColor: [0, 0, 0]
        },
        tableLineColor: [0, 0, 0],
        // tableLineWidth: 0.5,
        margin: { left: 78, right: 13 },
        columnStyles: {
          0: { cellWidth: 13 },
          1: { cellWidth: 13 },
          2: { cellWidth: 12 },
          3: { cellWidth: 12 },
          4: { cellWidth: 15 },
          5: { cellWidth: 11 },
          6: { cellWidth: 11 },
          7: { cellWidth: 11 },
          8: { cellWidth: 11 },
          9: { cellWidth: 13 }
        }
      });
      let finalY = (doc as any).lastAutoTable.finalY + 5;

      setTimeout(() => {
        const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL('image/png');
          const scale = 1; 
          const originalWidth = 180;
          const originalHeight = 50;

          const chartWidth = originalWidth * scale;   
          const chartHeight = originalHeight * scale; 

          const pageWidth = doc.internal.pageSize.getWidth();
          const centerX = (pageWidth - originalWidth) / 2; 
          const borderPadding = 5;

          doc.setLineWidth(0.7);
          doc.rect(
            centerX - borderPadding,
            finalY - borderPadding,
            originalWidth + borderPadding * 2,
            originalHeight + borderPadding * 2
          );

          const chartX = centerX + (originalWidth - chartWidth) / 2;
          const chartY = finalY + (originalHeight - chartHeight) / 2;
          doc.addImage(chartImage, 'PNG', chartX, chartY, chartWidth, chartHeight);

          finalY += originalHeight + borderPadding * 2 + 4;
          doc.setLineWidth(0.2);
        }


          const sampleColumn = ['Item No', 'Limits', 'Result', 'Remarks'];
          const sampleRows = [
            ['Voids in mineral Agg. %', '14% Min', Number(this.voidMineral).toFixed(2) , { content: this.asphalt.remarks && this.asphalt.remarks.trim() !== '' ? this.asphalt.remarks : 'N/A', rowSpan: 8 }],
            ['Air Voids %', '3.0 -- 5.0' , Number(this.airVoid).toFixed(1) ],
            ['Bitumen Content %', '(5.2 ± 0.4)' , '4.88±0.0.001'],
            ['Loss of Stability kgm', '1000 Min' , Number(this.avgStabilityFor30Min).toFixed(0)],
            ['Voids filled with Asp. %', '65 -- 75' , Number(this.voidFilled).toFixed(1)],
            ['Max density as per design (gm/cm3)', '2.556' , Number(this.maxSpOfPAvgMix).toFixed(3) ],
            ['Flow (mm)', '2 -- 4' , Number((this.asphalt.flowA + this.asphalt.flowB + this.asphalt.flowC) / 3).toFixed(2)],
            ['Loss of Stability %', '25% Max' , `${((this.avgStabilityFor30Min - this.avgStabilityFor24Hrs) / this.avgStabilityFor30Min * 100).toFixed(1)}`],
          ];

          autoTable(doc, {
            head: [sampleColumn],
            body: sampleRows,
            theme: 'grid',
            startY:finalY - 9,
            styles: {
              fontSize: 7,
              font: 'Amiri',
              cellPadding: 1,
              lineWidth: 0.5,
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0]
            },
            headStyles: {
              font: 'Amiri',
              fontStyle: 'bold',
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              lineWidth: 0.6,
              lineColor: [0, 0, 0],
            },
            columnStyles: {
              0: { cellWidth: 47.5 },
              1: { cellWidth: 47.5 },
              2: { cellWidth: 47.5 },
              3: { cellWidth: 47.5 },
            },
            tableLineColor: [0, 0, 0],
            margin: { left: 10 },
            showHead: 'everyPage'
          });

          finalY += 34.5; 
          doc.setFontSize(10);

          const pageWidth1 = doc.internal.pageSize.getWidth();
          const tableWidth1 = 190; 
          const startX1 = (pageWidth1 - tableWidth1) / 2;
          const endX1 = startX1 + tableWidth1;
          const boxWidth1 = tableWidth1;

          let blockTop1 = finalY; 
          let footerY1 = blockTop1 + 5;

          let remarksHeight1 = 0;
          if (this.asphalt.notes) {
            const splitNotes = doc.splitTextToSize(
              `Remarks: ${this.asphalt.notes || ""}`,
              boxWidth1 - 8
            );

            doc.setFont("Amiri", "bold");
            doc.setFontSize(7);
            doc.text(splitNotes, startX1 + 4, footerY1 -1);

            remarksHeight1 = splitNotes.length * 5;
            footerY1 += remarksHeight1 + 12;
          }

          doc.line(startX1, footerY1, endX1, footerY1);

          doc.setFontSize(8);
          const sectionWidth1 = tableWidth1 / 3; 

          doc.text(
            `Approved by: ${this.asphalt.lastApproveBy || "N/A"}`,
            startX1 + 4,
            footerY1 + 4
          );

          doc.text(
            `Test by: ${this.asphalt.testBy || "N/A"}`,
            startX1 + sectionWidth1 + 4,
            footerY1 + 4
          );

          doc.text(
            `Checked by: ${this.asphalt.adopter || "N/A"}`,
            startX1 + sectionWidth1 * 2 + 4,
            footerY1 + 4
          );

          const blockBottom1 = footerY1 + 8;
          const blockHeight1 = blockBottom1 - blockTop1 - 1;

          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.6);
          doc.rect(startX1, blockTop1, tableWidth1, blockHeight1);
          doc.addImage(tail, 'PNG', 0, blockBottom1, 210, 33);
          finalY = blockBottom1 + 47;




          doc.setFontSize(7);
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

          const headerHeight = 15; 
          const tableHeight = 200; 

          if (finalY + headerHeight + tableHeight > doc.internal.pageSize.height - 20) {
            doc.addPage();
            finalY = 2;
          }


          doc.addImage(head, 'PNG', 0, 0, 210, 33);
          doc.setFontSize(10);
          const headerText = 'ASPHALT  MARSHALL & G.M.M TEST';
          const textX = 60;
          const textY = 34;

          doc.text(headerText, textX, textY);

          const textWidth = doc.getTextWidth(headerText);

          doc.setDrawColor(0, 0, 0); 
          doc.setLineWidth(0.5);
          doc.line(textX - 1, textY + .5 , textX + textWidth + 2, textY + .5 ); 
          doc.setFontSize(7);
          doc.text("ASTM D-2172, D-5444", 127 , 34);
          doc.setFontSize(7);
          doc.text("Sampling ASTM D-979/979M", 153 , 34);

          doc.setFontSize(9);
          const infoRows = [
            ["المشروع  Project ", this.asphalt.projectName || 'N/A', "تاريخ العينة Sampling Date", this.asphalt.sampleDate || 'N/A'],
            ["اسم المقاول Contractor", this.asphalt.contractor || 'N/A', "تاريخ الاختبار Testing Date", this.asphalt.testingDate || 'N/A'],
            ["الموقع Location", this.asphalt.location || 'N/A', "نوع العينة Samle Type", this.asphalt.sampleType || 'N/A'],
            ["رقم الامر العمل Job Order", this.asphalt.jobOrder || 'N/A', "رقم العينة Sample No", this.asphalt.sampleNo || 'N/A'],
            ["مورد الاسفلت  Asphalt Applier", this.asphalt.asphaltApplier || 'N/A', "سحب العينة Sample By", this.asphalt.sampleBy || 'N/A'],
            ["Equipment Used", this.asphalt.equipmentUsed || 'N/A', "صنف الاسفلت Asphalt Layer", this.asphalt.asphaltLayer || 'N/A']
          ];

          autoTable(doc, {
            body: infoRows,
            startY: 36,
            theme: 'grid',
            styles: {
              fontSize: 7,
              font: 'Amiri',
              cellPadding: 0.5,
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.4
            },
            columnStyles: {
              0: { cellWidth: 42 },
              1: { cellWidth: 53 },
              2: { cellWidth: 42 },
              3: { cellWidth: 53 }
            },
            margin: { left: 10, right: 10 },
            tableWidth: 'auto'
          });
          // doc.line(10, 68, 200, 68);
          doc.setFontSize(10);
          // doc.text(`ASPHALT  MARSHALL & G.M.M TEST (${this.asphalt.classification})` , 60, 63)


          // const tableColumn = ['Symbol', 'Item', {content:'Test Results' , colSpan: 6}, 'الصنف'];
          const tableRows: RowInput[]  = [
            [{content: 'Symbol' , styles:{fontSize: 10}}, {content: 'Item' , styles:{fontSize: 10}}, {content:'Test Results' , colSpan: 6 , styles:{fontSize: 10}}, {content: 'الصنف' , styles:{fontSize: 10 , halign: 'right'}}],
            ['Pb', '% A/C by tot. wt. of mix' ,
              {content: `${Number(this.asphalt.bitumen.percOfBit).toFixed(2)} ${'±'} ${this.asphalt.percofbitExpand || ''}`, colSpan: 2, styles: { halign: 'center' }}, { content: Number(this.asphalt.bitumen.percOfBit).toFixed(2), colSpan: 2, styles: { halign: 'center' } }, {content: '' , colSpan:2} , {content: '%نسبة الاسفلت من كامل الخلطة' , styles: { halign: 'right' }}
            ],
            ['', 'Specimen No.' , '1' , '2' , '3' , '4' , '5' , '6' , {content: 'رقم العينة' , styles: { halign: 'right' }}],
            ['', 'Wt. in air dry (gm)', this.asphalt.weightAirDryA, this.asphalt.weightAirDryB, this.asphalt.weightAirDryC, this.asphalt.weightAirDryD, this.asphalt.weightAirDryE, this.asphalt.weightAirDryF, {content: '(الوزن الجاف في الهواء) جرام' , styles: { halign: 'right' }}],
            ['','Wt. in water (gm)', this.asphalt.weightWaterA, this.asphalt.weightWaterB, this.asphalt.weightWaterC, this.asphalt.weightWaterD, this.asphalt.weightWaterE, this.asphalt.weightWaterF, {content: '(الوزن في الماء) جرام' , styles: { halign: 'right' }}],
            ['','Wt. in air surf dry (gm)', this.asphalt.weightAirSurfDryA, this.asphalt.weightAirSurfDryB, this.asphalt.weightAirSurfDryC, this.asphalt.weightAirSurfDryD, this.asphalt.weightAirSurfDryE, this.asphalt.weightAirSurfDryF, {content: 'وزن العينة مشبعة في الهواء جافة السطح' , styles: { halign: 'right' }}],
            ['','Volumes (c.c)',
              (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA).toFixed(1),
              (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB).toFixed(1),
              (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC).toFixed(1),
              (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD).toFixed(1),
              (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE).toFixed(1),
              (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF).toFixed(1),
              {content: '(الحجم) سم3' , styles: { halign: 'right' }}],
            ['Gmb','Bulk Sp.Gr.of Comp. mix',
              (this.asphalt.weightAirDryA / (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA)).toFixed(3),
              (this.asphalt.weightAirDryB / (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB)).toFixed(3),
              (this.asphalt.weightAirDryC / (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC)).toFixed(3),
              (this.asphalt.weightAirDryD / (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD)).toFixed(3),
              (this.asphalt.weightAirDryE / (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE)).toFixed(3),
              (this.asphalt.weightAirDryF / (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF)).toFixed(3),
              {content: '(الكثافة الظاهرية للخلطة) جرام/سم3' , styles: { halign: 'right' }}],
            [
              'Avg.', 'Avg Bulk Sp.Gr.of Comp. mix Gmb gm/cm3',
              {content: `${Number(this.bulkSpOfCompMix).toFixed(3)} ${'±'} ${this.asphalt.bulkspofcompMixExpand || ''}`, colSpan: 2, styles: { halign: 'center' }}, { content: Number(this.bulkSpOfCompMix).toFixed(3), colSpan: 4, styles: { halign: 'center' } }, {content: '(متوسط الكثافة الظاهرية) جرام/سم3' , styles: { halign: 'right' }}
            ],
            [
              'Gmm', 'Net. Wt. Of loose mix (gm)',
              { content: this.asphalt.netWeightOfLooseMix.toString(), colSpan: 6, styles: { halign: 'center' } } , {content: '(وزن العينة سائبة) جرام' , styles: { halign: 'right' }}
            ],
            [
              'W1', 'Net Wt. Of Flask+water (gm)',
              { content: this.asphalt.netWeightOfFlaskWater.toString(), colSpan: 6, styles: { halign: 'center' } } , {content: '(وزن الماء + الدورق) جرام' , styles: { halign: 'right' }}
            ],
            [
              'W2', 'Wt. Flask+water+sample (gm)',
              { content: this.asphalt.weightFlaskWaterSample.toString(), colSpan: 6, styles: { halign: 'center' } } , {content: '(وزن العينة + الماء + الدورق) جرام' , styles: { halign: 'right' }}
            ],
            [
              'Gmm', 'Max. Sp. Gr of Paving mix',
              { content: Number(this.maxSpOfPAvgMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } } , {content: 'الكثافة القصوي للخلطة مزيج الرصف' , styles: { halign: 'right' }}
            ],
            [
              '', 'Avg. max Sp. Gr of mix gmm gm/cm3',
              {content: `${Number(this.maxSpOfPAvgMix).toFixed(3)} ${'±'} ${this.asphalt.maxspofpavgmixExpand || ''}`, colSpan: 2, styles: { halign: 'center' }}, { content: Number(this.maxSpOfPAvgMix).toFixed(3), colSpan: 2, styles: { halign: 'center' } } , {content: 'حدود التصميم 2.556' , colSpan:2 , styles: { halign: 'right' }} , {content: '(متوسط الكثافة القصوي) جرام/سم3' , styles: { halign: 'right' }}
            ],
            [
              'VA', '% Air Voids',
              {content: `${Number(this.airVoid).toFixed(1)} ${'±'} ${this.asphalt.airvoidExpand || ''}`, colSpan: 2, styles: { halign: 'center' }}, { content: Number(this.airVoid).toFixed(1), colSpan: 2, styles: { halign: 'center' } } , {content: 'حدود التصميم 3-5' ,colSpan: 2 , styles: {halign: 'right'}} , {content: '%الفراغات الهوائية في الخلطة' , styles: { halign: 'right' }}
            ],
            [
              'VMA', '% Voids in mineral Agg.',
              {content: `${Number(this.voidMineral).toFixed(2)} ${'±'} ${this.asphalt.voidmineralExpand || ''}`, colSpan: 2, styles: { halign: 'center' }}, { content: Number(this.voidMineral).toFixed(2), colSpan: 2, styles: { halign: 'center' } } , {content: 'حدود التصميم 14-16' ,colSpan: 2 , styles: {halign: 'right'}} ,{content: '%الفراغات في الحمصة المتجانسة' , styles: { halign: 'right' }}
            ],
            [
              'VFA', '% Voids filled with Asp.',
              {content: `${Number(this.voidFilled).toFixed(1)} ${'±'} ${this.asphalt.voidfilledExpand || ''}`, colSpan: 2, styles: { halign: 'center' }}, { content: Number(this.voidFilled).toFixed(1), colSpan: 2, styles: { halign: 'center' } } , {content: 'حدود التصميم 65-75' ,colSpan: 2 , styles: {halign: 'right'}} ,{content: '%الفراغات المملؤة في الخلطة' , styles: { halign: 'right' }}
            ],
            [
              'Gse', 'Effect. Sp. Gravity of Agg.',
              { content: Number(this.effectiveSpGravityOfAgg).toFixed(3), colSpan: 6, styles: { halign: 'center' } } , {content: '(الوزن النوعي الفعال للبحص) جم/سم3' , styles: { halign: 'right' }}
            ],
            [
              'Pba', 'Absorbed Asp. %',
              { content: Number(this.absorbedAps).toFixed(2), colSpan: 6, styles: { halign: 'center' } } , {content: '%نسبة الاسفلت الممتص بالبحص' , styles: { halign: 'right' }}
            ],
            [
              'Pbe', 'Effective Asp. Content %',
              {content: `${Number(this.asphalt.bitumen.percOfBit - (this.absorbedAps / 100) * (100 - this.asphalt.bitumen.percOfBit)).toFixed(2)} ${'±'} ${this.asphalt.effectiveaspExpand || ''}`, colSpan: 1, styles: { halign: 'center' }}, { content: Number(this.asphalt.bitumen.percOfBit - (this.absorbedAps / 100) * (100 - this.asphalt.bitumen.percOfBit)).toFixed(2), colSpan: 5, styles: { halign: 'center' } } , {content: ' %نسبة الاسفلت الفعالة بالخلطة' , styles: { halign: 'right' }}
            ],
            ['', 'Stability (kg)', this.asphalt.stabilityA, this.asphalt.stabilityB, this.asphalt.stabilityC, this.asphalt.stabilityD, this.asphalt.stabilityE, this.asphalt.stabilityF , {content: '(الثبات) كجم' , styles: { halign: 'right' }}],
            ['', 'Correction factor', this.asphalt.correctionFactorA, this.asphalt.correctionFactorB, this.asphalt.correctionFactorC, this.asphalt.correctionFactorD, this.asphalt.correctionFactorE, this.asphalt.correctionFactorF , {content: 'معامل التصحيح' , styles: { halign: 'right' }}],
            ['', 'Corrected Stability (kg)',
              (this.asphalt.stabilityA * this.asphalt.correctionFactorA).toFixed(0),
              (this.asphalt.stabilityB * this.asphalt.correctionFactorB).toFixed(0),
              (this.asphalt.stabilityC * this.asphalt.correctionFactorC).toFixed(0),
              (this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0),
              (this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0),
              (this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0),
             {content: '(الثبات بعد التصحيح) كجم' , styles: { halign: 'right' }}],
            [
              'Avg.', 'Stability (kg) for 30 min',
              {content: `${Number(this.avgStabilityFor30Min).toFixed(0)} ${'±'} ${this.asphalt.avgstabilityfor30minExpand || ''}`, colSpan: 1, styles: { halign: 'center' }}, { content: Number(this.avgStabilityFor30Min).toFixed(0), colSpan: 2, styles: { halign: 'center' } }, {content: 'المواصفات المطلوبه 1000 Min.' ,colSpan: 3 , styles: {halign: 'right'}} ,
              {content: '(متوسط الثيات بعد 30د) كجم' , styles: { halign: 'right' }}
            ],
            ['Avg.', 'Stability (kg) for 24 Hrs.', {content:'' , colSpan: 3}, Number(this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0), Number(this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0), Number(this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0) , {content: '(متوسط الثبات بعد 24 ساعة) كجم', styles: { halign: 'right' }}],
            [
              'Avg.', 'Stability (kg) for 24 Hrs.',
              {content: `${Number(this.avgStabilityFor24Hrs).toFixed(0)}`, colSpan: 6, styles: { halign: 'center' }} , {content: '(متوسط الثبات بعد 24 ساعة) كجم', styles: { halign: 'right' }}
            ],
            [
              'Avg', '% Loss of Stability',
              {content: `${((this.avgStabilityFor30Min - this.avgStabilityFor24Hrs) / this.avgStabilityFor30Min * 100).toFixed(1)} ${'±'} ${this.asphalt.lossofstabilityExpand  || ''}`, colSpan: 2, styles: { halign: 'center' }}, {content: `${((this.avgStabilityFor30Min - this.avgStabilityFor24Hrs) / this.avgStabilityFor30Min * 100).toFixed(1)}`, colSpan: 2, styles: { halign: 'center' }} , {content: '25% Max المطلوب' ,colSpan: 2 , styles: {halign: 'right'}} , {content: '%قافد الثبات',  styles: { halign: 'right' }}
            ],
            ['', 'Flow (mm)', this.asphalt.flowA, this.asphalt.flowB, this.asphalt.flowC, {content: '' , colSpan: 3} , {content: '(الانسياب) مم',  styles: { halign: 'right' }}],
            ['', 'Avg. Flow (mm)',
              {content: `${Number((this.asphalt.flowA + this.asphalt.flowB + this.asphalt.flowC) / 3).toFixed(2)} ${'±'} ${this.asphalt.avgflowExpand || ''}`, colSpan: 1, styles: { halign: 'center' }}, { content: Number((this.asphalt.flowA + this.asphalt.flowB + this.asphalt.flowC) / 3).toFixed(2), colSpan: 2, styles: { halign: 'center' } },
              {content: 'المواصفات المطلوبه 2-4' ,colSpan: 3 , styles: {halign: 'right'}} , {content: '(متوسط الاتسياب) مم' ,  styles: { halign: 'right' }}
            ],
            ['Gb', 'Sp. Gravity of Asp. Bit',
              {content: `${this.asphalt.spGravityOfAspBit}`, colSpan: 6, styles: { halign: 'center' }} , {content: '(الوزن النوعي للاسفلت) جم/سم3' , styles: { halign: 'right' }}
            ],
            [
              'Ps', 'Agg. % total wt. of mix',
              {content: `${Number(100 - this.asphalt.bitumen.percOfBit).toFixed(2)}`, colSpan: 6, styles: { halign: 'center' }} , {content: ' %نسبة البحص في كامل الخلطة' , styles: { halign: 'right' }}
            ],
            [
              'Gsb', 'Bulk Sp. Gr. Comb. Agg.',
              {content: `${this.asphalt.bulkSpGrCombAgg}`, colSpan: 6, styles: { halign: 'center' }} , {content : ' (الوزن النوعي الكلي للبحص) جم/سم3' , styles: { halign: 'right' }}
            ],
            [
              'M.R.F', 'Machine Ring Factor', {content: 'Mach. Reading x Factor' , colSpan: 2 },{content: 'ELE- Serial No- 11116' ,colSpan : 4 , styles: { halign: 'center' }}, {content : 'الجهاز المستخدم' , styles: { halign: 'right' }}
            ],
          ];

          autoTable(doc, {
            body: tableRows,
            theme: 'grid',
            startY:59,
            styles: {
              fontSize: 7,
              font: 'Amiri',
              cellPadding: 1,
              lineWidth: 0.5,
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0]
            },
            columnStyles: {
              0: { cellWidth: 13 },
              1: { cellWidth: 47 },
              2: { cellWidth: 19 },
              3: { cellWidth: 11 },
              4: { cellWidth: 10 },
              5: { cellWidth: 13 },
              6: { cellWidth: 13 },
              7: { cellWidth: 13 },
              8: { cellWidth: 51 }

            },
            tableLineColor: [0, 0, 0],
            margin: { left: 10 },
            showHead: 'everyPage'
          });
          finalY = (doc as any).lastAutoTable.finalY || 100;

          const pageWidth = doc.internal.pageSize.getWidth();
          const tableWidth = 190; 
          const startX = (pageWidth - tableWidth) / 2;
          const endX = startX + tableWidth;
          const boxWidth = tableWidth;

          let blockTop = finalY; 
          let footerY = blockTop + 5;

          let remarksHeight = 0;
          if (this.asphalt.notes) {
            const splitNotes = doc.splitTextToSize(
              `Remarks: ${this.asphalt.notes || ""}`,
              boxWidth - 8
            );

            doc.setFont("Amiri", "bold");
            doc.setFontSize(7);
            doc.text(splitNotes, startX + 4, footerY);

            remarksHeight = splitNotes.length * 5;
            footerY += remarksHeight + 20;
          }
          doc.line(startX, footerY, endX, footerY);
          doc.setFontSize(8);
          const sectionWidth = tableWidth / 3; 

          doc.text(
            `Approved by: ${this.asphalt.lastApproveBy || "N/A"}`,
            startX + 4,
            footerY + 6
          );

          doc.text(
            `Test by: ${this.asphalt.testBy || "N/A"}`,
            startX + sectionWidth + 4,
            footerY + 6
          );

          doc.text(
            `Checked by: ${this.asphalt.adopter || "N/A"}`,
            startX + sectionWidth * 2 + 4,
            footerY + 6
          );

          const blockBottom = footerY + 10;
          const blockHeight = blockBottom - blockTop;

          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.6);
          doc.rect(startX, blockTop, tableWidth, blockHeight);

          doc.addImage(tail, 'PNG', 0, 267, 210, 33);
          doc.setFontSize(5);
          doc.text(`Report Date: ${currentDateTime}`, 1, 290);

          // Save the PDF
          doc.save(`Asphalt_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        // If chartCanvas is not found, log an error
        if (!chartCanvas) {
          console.error("Chart canvas not found! Ensure it is fully loaded before generating the PDF.");
        }
      }, 1000);
    };
  }


}


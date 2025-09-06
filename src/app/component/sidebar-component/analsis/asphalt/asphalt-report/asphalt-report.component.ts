import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {ActivatedRoute} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import jsPDF from "jspdf";
import autoTable, {RowInput} from "jspdf-autotable";
import Chart from "chart.js/auto";
import {DecimalPipe, NgIf} from '@angular/common';
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
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

  // const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setLineWidth(0.7); // سمك البوردر
  doc.rect(10, 10, pageWidth - 20, pageHeight - 100); // (x, y, العرض, الطول)

  head.src = 'assets/head.png';
  tail.src = 'assets/tail.png';
  qr.src = 'assets/barcode.jpg';

  head.onload = () => {
    doc.addImage(head, 'PNG', 0, 0, 210, 33);
    doc.setFontSize(12);
    doc.text("Asphalt Marshall", 80, 35);
    doc.setFontSize(9);

    const infoRows = [
      ["Project", this.asphalt.projectName || 'N/A', "Sampling Date", this.asphalt.sampleDate || 'N/A'],
      ["Contractor", this.asphalt.contractor || 'N/A', "Testing Date", this.asphalt.testingDate || 'N/A'],
      ["Location", this.asphalt.location || 'N/A', "Samle Type", this.asphalt.sampleType || 'N/A'],
      ["Job Order", this.asphalt.jobOrder || 'N/A', "Sample No", this.asphalt.sampleNo || 'N/A'],
      ["Asphalt Applier", this.asphalt.asphaltApplier || 'N/A', "Sample By", this.asphalt.sampleBy || 'N/A'],
      ["Request Description", this.asphalt.requestDescription || 'N/A', "Asphalt Layer", this.asphalt.asphaltLayer || 'N/A']
    ];

    autoTable(doc, {
      // head: [["Field", "Value", "Field", "Value"]],
      body: infoRows,
      startY: 37,
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
        0: { cellWidth: 32 },
        1: { cellWidth: 60 },
        2: { cellWidth: 32 },
        3: { cellWidth: 60 }
      },
      margin: { left: 13, right: 13 },
      tableWidth: 'auto'
    });


      // doc.line(10, 68, 200, 68);
      // Replace the existing BITUMEN CONTENT TEST and SIEVE ANALYSIS section with this code:

      doc.setFontSize(7);
      // Add titles for both tables
      doc.text(`BITUMEN CONTENT TEST (${this.asphalt.bitumen.standard})`, 13, 65);
      doc.text(`SIEVE ANALYSIS (${this.asphalt.gradationTest.standard})`, 115, 65);

      // First table - Bitumen data (LEFT SIDE)
      const bitumenColumn = ['Parameter', 'Value', 'U.Expand'];
      const bitumenRows = [
        ['Wt. sample before gm', this.asphalt.bitumen.weightSampleBefore, this.asphalt.bitumen.expandA],
        ['Wt. of filter before gm', this.asphalt.bitumen.weightFilterBefore, this.asphalt.bitumen.expandB],
        ['Wt. Of filter after gm', this.asphalt.bitumen.weightFilterAfter, this.asphalt.bitumen.expandC],
        ['Increase of filter wt. gm', Number(this.asphalt.bitumen.increaseOfFilterWeight).toFixed(1), this.asphalt.bitumen.expandD],
        ['Wt. of sample after gm', this.asphalt.bitumen.weightSampleAfter, this.asphalt.bitumen.expandE],
        ['Total wt. of sample gm', Number(this.asphalt.bitumen.totalWeightOfSample).toFixed(1), this.asphalt.bitumen.expandF],
        ['Wt. of bit. gm', Number(this.asphalt.bitumen.weightOfBit).toFixed(1), this.asphalt.bitumen.expandG],
        ['Perc of Bit %', Number(this.asphalt.bitumen.percOfBit).toFixed(2), this.asphalt.bitumen.expandH],
        ['JMF', Number(this.asphalt.bitumen.jmf).toFixed(2) || 'N/A', this.asphalt.bitumen.expandI],
        ['Result Bit', Number(this.asphalt.bitumen.resultBit) || 'N/A', this.asphalt.bitumen.expandJ],
        ['Equipment Used', Number(this.asphalt.bitumen.equipmentUsed) || 'N/A', this.asphalt.bitumen.expandK],
      ];

      // BITUMEN table on the LEFT
      autoTable(doc, {
        head: [bitumenColumn],
        body: bitumenRows,
        theme: 'grid',
        startY: 67,
        styles: {
          fontSize: 7,
          cellPadding: 1.32,
          lineWidth: 0.5,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        tableLineColor: [0, 0, 0],
        // tableLineWidth: 0.5,
        margin: { left: 13, right: 75 }, 
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 12 },
          2: { cellWidth: 15 }

        }
      });

      const sieveColumn: RowInput[] =
       [ [ { content: 'mm', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, 
        { content: 'inch', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, 
        { content: 'Ret(gm)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, 
        { content: 'Ret%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, 
        { content: 'Passing%', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, 
        { content: 'Gmf limits', colSpan: 2, styles: { halign: 'center' } }, 
        { content: 'General specifications', colSpan: 2, styles: { halign: 'center' } }, 
        { content: 'Expand', rowSpan: 2, styles: { halign: 'center' , valign: 'middle'} }, ], 
        [ { content: 'Min%', styles: { halign: 'center' } }, 
          { content: 'Max%', styles: { halign: 'center' } }, 
          { content: 'Min%', styles: { halign: 'center' } }, 
          { content: 'Max%', styles: { halign: 'center' } }, 
        ] ];

      const sieveRows = [
       ['37.5', '1.5', this.asphalt.gradationTest.massRetainedA, Number(this.asphalt.gradationTest.retainedA).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedA).toFixed(2), this.asphalt.gradationTest.cvcMinA, this.asphalt.gradationTest.cvcMaxA , this.asphalt.gradationTest.gcvcMinA, this.asphalt.gradationTest.gcvcMaxA , this.asphalt.gradationTest.expandA], 
       ['25', '1', this.asphalt.gradationTest.massRetainedB, Number(this.asphalt.gradationTest.retainedB).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedB).toFixed(2), this.asphalt.gradationTest.cvcMinB, this.asphalt.gradationTest.cvcMaxB , this.asphalt.gradationTest.gcvcMinB, this.asphalt.gradationTest.gcvcMaxB , this.asphalt.gradationTest.expandB], 
       ['19.0', '3/4', this.asphalt.gradationTest.massRetainedC, Number(this.asphalt.gradationTest.retainedC).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedC).toFixed(2), this.asphalt.gradationTest.cvcMinC, this.asphalt.gradationTest.cvcMaxC , this.asphalt.gradationTest.gcvcMinC, this.asphalt.gradationTest.gcvcMaxC , this.asphalt.gradationTest.expandC], 
       ['12.5', '1/2', this.asphalt.gradationTest.massRetainedD, Number(this.asphalt.gradationTest.retainedD).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedD).toFixed(2), this.asphalt.gradationTest.cvcMinD, this.asphalt.gradationTest.cvcMaxD , this.asphalt.gradationTest.gcvcMinD, this.asphalt.gradationTest.gcvcMaxD , this.asphalt.gradationTest.expandD], 
       ['9.5', '3/8', this.asphalt.gradationTest.massRetainedE, Number(this.asphalt.gradationTest.retainedE).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedE).toFixed(2), this.asphalt.gradationTest.cvcMinE, this.asphalt.gradationTest.cvcMaxE , this.asphalt.gradationTest.gcvcMinE, this.asphalt.gradationTest.gcvcMaxE , this.asphalt.gradationTest.expandE], 
       ['4.75', '#4', this.asphalt.gradationTest.massRetainedF, Number(this.asphalt.gradationTest.retainedF).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedF).toFixed(2), this.asphalt.gradationTest.cvcMinF, this.asphalt.gradationTest.cvcMaxF , this.asphalt.gradationTest.gcvcMinF, this.asphalt.gradationTest.gcvcMaxF , this.asphalt.gradationTest.expandF], 
       ['2.00', '#10', this.asphalt.gradationTest.massRetainedG, Number(this.asphalt.gradationTest.retainedG).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedG).toFixed(2), this.asphalt.gradationTest.cvcMinG, this.asphalt.gradationTest.cvcMaxG , this.asphalt.gradationTest.gcvcMinG, this.asphalt.gradationTest.gcvcMaxG , this.asphalt.gradationTest.expandG],
       ['0.425', '#40', this.asphalt.gradationTest.massRetainedH, Number(this.asphalt.gradationTest.retainedH).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedH).toFixed(2), this.asphalt.gradationTest.cvcMinH, this.asphalt.gradationTest.cvcMaxH , this.asphalt.gradationTest.gcvcMinH, this.asphalt.gradationTest.gcvcMaxH , this.asphalt.gradationTest.expandH], 
       ['0.180', '#80', this.asphalt.gradationTest.massRetainedI, Number(this.asphalt.gradationTest.retainedI).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedI).toFixed(2), this.asphalt.gradationTest.cvcMinI, this.asphalt.gradationTest.cvcMaxI , this.asphalt.gradationTest.gcvcMinI, this.asphalt.gradationTest.gcvcMaxI , this.asphalt.gradationTest.expandI], 
       ['0.075', '#200', this.asphalt.gradationTest.massRetainedJ, Number(this.asphalt.gradationTest.retainedJ).toFixed(1), Number(100 - this.asphalt.gradationTest.retainedJ).toFixed(2), this.asphalt.gradationTest.cvcMinJ, this.asphalt.gradationTest.cvcMaxJ , this.asphalt.gradationTest.gcvcMinJ, this.asphalt.gradationTest.gcvcMaxJ , this.asphalt.gradationTest.expandJ], [{content : 'Total Weight' , colSpan: 2}, this.asphalt.gradationTest.totalWeigh],
      ];

      // SIEVE ANALYSIS table on the RIGHT
      autoTable(doc, {
        head: sieveColumn,
        body: sieveRows,
        theme: 'grid',
        startY: 67,
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
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        tableLineColor: [0, 0, 0],
        // tableLineWidth: 0.5,
        margin: { left: 75, right: 13 }, 
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 12 },
          2: { cellWidth: 12 },
          3: { cellWidth: 12 },
          4: { cellWidth: 13 },
          5: { cellWidth: 12 },
          6: { cellWidth: 12 },
          7: { cellWidth: 12 },
          8: { cellWidth: 12 },
          9: { cellWidth: 12 }
        }
      });

      let finalY = (doc as any).lastAutoTable.finalY + 5;


      // Add chart after the second table
      setTimeout(() => {
        const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL('image/png');
          doc.addImage(chartImage, 'PNG', 15, finalY, 180, 60);


          finalY += 90;  // Chart height (80) + some margin
          doc.line(10, finalY - 27, 200, finalY - 27);
          doc.setFontSize(10);
          doc.text(`Approved by: ${this.asphalt.lastApproveBy || 'N/A'}`, 13, finalY - 23);
          doc.text(`Test by: ${this.asphalt.testBy || 'N/A'}`, 80, finalY - 23 );
          doc.text(`Checked by: ${this.asphalt.adopter || 'N/A'}`, 150, finalY - 23);
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

          // const doc = new jsPDF("p", "mm", "a4");
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          doc.setLineWidth(0.7);
          doc.rect(10, 10, pageWidth - 20, pageHeight - 43);

          doc.addImage(head, 'PNG', 0, 0, 210, 33);
          doc.setFontSize(12);
          doc.text("Asphalt Marshall", 80, 35);
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
              1: { cellWidth: 50 },
              2: { cellWidth: 42 },
              3: { cellWidth: 50 }
            },
            margin: { left: 13, right: 13 },
            tableWidth: 'auto'
          });
          // doc.line(10, 68, 200, 68);
          doc.setFontSize(10);
          doc.text(`ASPHALT  MARSHALL & G.M.M TEST (${this.asphalt.classification})` , 60, 63)


          const tableColumn = ['Parameter', '1', '2', '3', '4', '5', '6'];
          const tableRows: RowInput[]  = [
            ['%نسبة الاسفلت من كامل الخلطة  A/C by tot. wt. of mix %' ,
              { content: Number(this.asphalt.bitumen.percOfBit).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            ['الوزن الجاف في الهواء (جرام) Wt. in air dry (gm)', this.asphalt.weightAirDryA, this.asphalt.weightAirDryB, this.asphalt.weightAirDryC, this.asphalt.weightAirDryD, this.asphalt.weightAirDryE, this.asphalt.weightAirDryF],
            ['الوزن في الماء (جرام) Wt. in water (gm)', this.asphalt.weightWaterA, this.asphalt.weightWaterB, this.asphalt.weightWaterC, this.asphalt.weightWaterD, this.asphalt.weightWaterE, this.asphalt.weightWaterF],
            ['وزن العينة مشبعة في الهواء جافة السطح Wt. in air surf dry (gm)', this.asphalt.weightAirSurfDryA, this.asphalt.weightAirSurfDryB, this.asphalt.weightAirSurfDryC, this.asphalt.weightAirSurfDryD, this.asphalt.weightAirSurfDryE, this.asphalt.weightAirSurfDryF],
            ['الحجم (سم3) Volumes (c.c)',
              (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA).toFixed(1),
              (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB).toFixed(1),
              (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC).toFixed(1),
              (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD).toFixed(1),
              (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE).toFixed(1),
              (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF).toFixed(1)],
            ['الكثافة الظاهرية للخلطة (جرام/سم3) Bulk Sp.Gr.of Comp. mix',
              (this.asphalt.weightAirDryA / (this.asphalt.weightAirSurfDryA - this.asphalt.weightWaterA)).toFixed(3),
              (this.asphalt.weightAirDryB / (this.asphalt.weightAirSurfDryB - this.asphalt.weightWaterB)).toFixed(3),
              (this.asphalt.weightAirDryC / (this.asphalt.weightAirSurfDryC - this.asphalt.weightWaterC)).toFixed(3),
              (this.asphalt.weightAirDryD / (this.asphalt.weightAirSurfDryD - this.asphalt.weightWaterD)).toFixed(3),
              (this.asphalt.weightAirDryE / (this.asphalt.weightAirSurfDryE - this.asphalt.weightWaterE)).toFixed(3),
              (this.asphalt.weightAirDryF / (this.asphalt.weightAirSurfDryF - this.asphalt.weightWaterF)).toFixed(3)],
            [
              'متوسط الكثافة الظاهرية (جرام/سم3) Avg Bulk Sp.Gr.of Comp. mix Gmb gm/cm3',
              { content: Number(this.bulkSpOfCompMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              'وزن العينة سائبة(جرام) Net. Wt. Of loose mix (gm)',
              { content: this.asphalt.netWeightOfLooseMix.toString(), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              'وزن الماء + الدورق (جرام) Net Wt. Of Flask+water (gm)',
              { content: this.asphalt.netWeightOfFlaskWater.toString(), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              'وزن العينة + الماء + الدورق(جرام) Wt. Flask+water+sample (gm)',
              { content: this.asphalt.weightFlaskWaterSample.toString(), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              'الكثافة القصوي للخلطة مزيج الرصف Max. Sp. Gr of Paving mix',
              { content: Number(this.maxSpOfPAvgMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              'متوسط الكثافة القصوي(جرام/سم3) Avg. max Sp. Gr of mix gmm gm/cm3',
              { content: Number(this.maxSpOfPAvgMix).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              ' %الفراغات الهوائية في الخلطة  Air Voids %',
              { content: Number(this.airVoid).toFixed(1), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              ' %الفراغات في الحمصة المتجانسة Voids in mineral Agg. %',
              { content: Number(this.voidMineral).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              ' %الفراغات المملؤة في الخلطة Voids filled with Asp. %',
              { content: Number(this.voidFilled).toFixed(1), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              'الوزن النوعي الفعال للبحص (جم/سم3) Effect. Sp. Gravity of Agg.',
              { content: Number(this.effectiveSpGravityOfAgg).toFixed(3), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              ' %نسبة الاسفلت الممتص بالبحص Absorbed Asp. %',
              { content: Number(this.absorbedAps).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            [
              ' %نسبة الاسفلت الفعالة بالخلطة Effective Asp. Content %',
              { content: Number(this.asphalt.bitumen.percOfBit - (this.absorbedAps / 100) * (100 - this.asphalt.bitumen.percOfBit)).toFixed(2), colSpan: 6, styles: { halign: 'center' } }
            ],
            ['الثبات (كجم) Stability (kg)', this.asphalt.stabilityA, this.asphalt.stabilityB, this.asphalt.stabilityC, this.asphalt.stabilityD, this.asphalt.stabilityE, this.asphalt.stabilityF],
            ['معامل التصحيح Correction factor', this.asphalt.correctionFactorA, this.asphalt.correctionFactorB, this.asphalt.correctionFactorC, this.asphalt.correctionFactorD, this.asphalt.correctionFactorE, this.asphalt.correctionFactorF],
            ['الثبات بعد التصحيح (كجم) Corrected Stability (kg)',
              (this.asphalt.stabilityA * this.asphalt.correctionFactorA).toFixed(0),
              (this.asphalt.stabilityB * this.asphalt.correctionFactorB).toFixed(0),
              (this.asphalt.stabilityC * this.asphalt.correctionFactorC).toFixed(0),
              (this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0),
              (this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0),
              (this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0)],
            [
              'متوسط الثيات بعد 30د (كجم) Stability (kg) for 30 min',
              { content: Number(this.avgStabilityFor30Min).toFixed(0), colSpan: 3, styles: { halign: 'center' } },
              '', '', ''
            ],
            ['متوسط الثبات بعد 24 ساغة(كجم) Stability (kg) for 24 Hrs.', '', '', '', Number(this.asphalt.stabilityD * this.asphalt.correctionFactorD).toFixed(0), Number(this.asphalt.stabilityE * this.asphalt.correctionFactorE).toFixed(0), Number(this.asphalt.stabilityF * this.asphalt.correctionFactorF).toFixed(0)],
            [
              'متوسط الثبات بعد 24 ساغة(كجم) Stability (kg) for 24 Hrs.', 
              '', '', '',
              {content: `${Number(this.avgStabilityFor24Hrs).toFixed(0)}`, colSpan: 3, styles: { halign: 'center' }}
            ],
            [
              ' %قافد الثبات Loss of Stability %',
              {content: `${((this.avgStabilityFor30Min - this.avgStabilityFor24Hrs) / this.avgStabilityFor30Min * 100).toFixed(1)}`, colSpan: 6, styles: { halign: 'center' }}
            ],
            ['الانسياب (مم) Flow (mm)', this.asphalt.flowA, this.asphalt.flowB, this.asphalt.flowC, '', '', ''],
            ['متوسط الاتسياب (مم) Avg. Flow (mm)',
              { content: Number((this.asphalt.flowA + this.asphalt.flowB + this.asphalt.flowC) / 3).toFixed(2), colSpan: 3, styles: { halign: 'center' } },
              '', '', ''
            ],
            ['الوزن النوعي للاسفلت (جم/سم3) Sp. Gravity of Asp. Bit',
              {content: `${this.asphalt.spGravityOfAspBit}`, colSpan: 6, styles: { halign: 'center' }}
            ],
            [
              ' %نسبة البحص في كامل الخلطة Agg. % total wt. of mix',
              {content: `${Number(100 - this.asphalt.bitumen.percOfBit).toFixed(2)}`, colSpan: 6, styles: { halign: 'center' }}
            ],
            [
              'الوزن النوعي الكلي للبحص(جم/سم3) Bulk Sp. Gr. Comb. Agg.',
              {content: `${this.asphalt.bulkSpGrCombAgg}`, colSpan: 6, styles: { halign: 'center' }}
            ],
          ];
          
          autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            startY:64,
            styles: {
              fontSize: 7,
              font: 'Amiri',
              cellPadding: 1.32,
              lineWidth: 0.5,
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0]
            },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: 'bold',
              lineWidth: 0.5,
              lineColor: [0, 0, 0]
            },
            columnStyles: {
              0: { cellWidth: 93 }, 
              1: { cellWidth: 15 }, 
              2: { cellWidth: 15 },
              3: { cellWidth: 15 },
              4: { cellWidth: 15 },
              5: { cellWidth: 15 },
              6: { cellWidth: 15 }
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            margin: { left: 13 }, // Add some left margin like Excel
            showHead: 'everyPage'
          });

          finalY = (doc as any).lastAutoTable.finalY || 100;

          doc.setFontSize(9);
          if (this.asphalt.notes) {
            // doc.line(10, finalY, 190, finalY);
            const splitNotes = doc.splitTextToSize(
              `Remarks: ${this.asphalt.notes || ""}`,
              180
            );
            doc.text(splitNotes, 13, finalY + 4);
            finalY += (splitNotes.length * 7); // 7 is approximate line height
          }

          doc.line(10, 257, 200, 257);

          doc.setFontSize(10);
          doc.text(`Approved by: ${this.asphalt.lastApproveBy || 'N/A'}`, 13, 261);
          doc.text(`Test by: ${this.asphalt.testBy || 'N/A'}`, 80, 261);
          doc.text(`Checked by: ${this.asphalt.adopter || 'N/A'}`, 150, 261);
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

import {Component, OnInit} from '@angular/core';
import {CompressiveStrength} from "../../../../../model/compressive-strength";
import {CompressiveStrengthService} from "../../../../../service/CompressiveStrength/compressive-strength.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgIf} from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
declare let AmiriFont: any;

@Component({
  selector: 'app-compressive-strength-report',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './compressive-strength-report.component.html',
  styleUrl: './compressive-strength-report.component.css'
})

export class CompressiveStrengthReportComponent implements OnInit {

  compressiveStrength: CompressiveStrength = {} as CompressiveStrength;
  id: number = 0;
  protected readonly Math = Math;
  area: number = 0;
  volume: number = 0;
  role: string = '';

  constructor(private authenticationService: AuthenticationService,private service: CompressiveStrengthService, private activatedRoute: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.role = this.authenticationService.getAuthority();
    this.service.findById(this.id).subscribe(res => {
      this.compressiveStrength = res;
      this.area = Number(((this.compressiveStrength.diameter / 2) * (this.compressiveStrength.diameter / 2)) * Math.PI);
      this.volume = this.area * this.compressiveStrength.height;
    })
  }

  generatePDF() {
    const doc = new jsPDF();
    doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont); 
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    const castingDate = new Date(this.compressiveStrength.dataCasting); 
    const testedDays = Number(this.compressiveStrength.dateTested); 

    let reportDate = 'N/A';

    if (!isNaN(castingDate.getTime()) && !isNaN(testedDays)) {
      const report = new Date(castingDate);
      report.setDate(report.getDate() + testedDays);
      reportDate = report.toLocaleDateString('en-GB'); 
    }

    const head = new Image();
    const tail = new Image();
    const qr = new Image();
    head.src = 'assets/head.png';
    tail.src = 'assets/tail.png';
    qr.src = 'assets/barcode.jpg';

    head.onload = () => {
      doc.addImage(head, 'PNG', 0, 0, 210, 33);
      doc.setFontSize(12);
      doc.text(`Portland Cement Concrete Cylinders Compressive Strength Test` , 44 , 34)


      autoTable(doc, {
        startY: 36,
        body: [
          ['Project', this.compressiveStrength.projectName || 'N/A', 'Structure', this.compressiveStrength.structure || 'N/A' , " "],
          ['Company', this.compressiveStrength.company || 'N/A', 'Sample by', this.compressiveStrength.sampleBy || 'N/A' , " "],
          ['Location', this.compressiveStrength.location || 'N/A', 'Slump (mm) ASTM', this.compressiveStrength.slump || 'N/A' , "ASTM C143/C143M"],
          ['Data Casting', this.compressiveStrength.dataCasting || 'N/A', 'Temperature(°C)', this.compressiveStrength.temperature || 'N/A' , "ASTM C1064/C1064M"],
          ['Data Received', this.compressiveStrength.dataReceived || 'N/A', 'Req. Strength for 28 Days (kg/cm2)', this.compressiveStrength.reqstrengthKg || 'N/A'],
          ['Date Tested', this.compressiveStrength.dateTested || 'N/A', 'Req. Strength for 28 Days (Mpa)', Number(this.compressiveStrength.reqstrengthKg / 10.2).toFixed(2)|| 'N/A' , " "],
          ['Report Date', reportDate || 'N/A', 'Sample No.', this.compressiveStrength.sampleNo || 'N/A' , " "],
          ['Lab. Report No.', this.compressiveStrength.labreportNo || 'N/A' , " "],
          ['Type of Sample', this.compressiveStrength.typeofSample || 'N/A' , " "]
        ],
        theme: 'grid',
        styles: { fontSize: 6, cellPadding: 0.5 , font: 'Amiri' },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 55 },
          2: { cellWidth: 35 },
          3: { cellWidth: 55 },
          4: { cellWidth: 20 }
        },
      });


      // autoTable(doc, {
      //   startY: 67,
      //   head: [['Parameter', 'Value', 'Unit', 'Spec', 'Value', 'Unit', 'Value', 'Unit']],
      //   body: [
      //     ['Cement Content', this.compressiveStrength.cementContent, this.compressiveStrength.cementContentType, 'Spec. 28 Days Strength', this.compressiveStrength.specTwintyEightDayStrength, 'kg/cm2', this.compressiveStrength.specTwintyEightDayStrength / 10, 'Mpa'],
      //     ['Diameter', this.compressiveStrength.diameter * 10 , 'mm', 'Area', Number(this.area).toFixed(2), 'cm²'],
      //     ['Height', this.compressiveStrength.height * 10, 'mm', 'Volume', Number(this.volume).toFixed(2), 'cm³'],
      //     ['Environmental Conditions:', '', '', '', '', ''],
      //     ['Date Cast', this.compressiveStrength.dateCast, '', 'Slump', this.compressiveStrength.slump, 'mm'],
      //     ['Date Received', this.compressiveStrength.dateReceived, '', 'Air Temperature', this.compressiveStrength.airTemperature, '°C'],
      //     ['Date Tested', this.compressiveStrength.dateTested, '', 'Concrete Temperature', this.compressiveStrength.concreteTemperature, '°C'],
      //   ],
      //   theme: 'grid',
      //   styles: {fontSize: 8, cellPadding: 1.8},
      //   columnStyles: {0: {cellWidth: 50}, 3: {cellWidth: 50}},
      // });

      let finalY = (doc as any).lastAutoTable.finalY + 3;

      const compStrengthA = (this.compressiveStrength.testLoadkgA * 101.971 /
        (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4));

      const compStrengthB = (this.compressiveStrength.testLoadkgB * 101.971 /
        (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4));

      const compStrengthC = (this.compressiveStrength.testLoadkgC * 101.971 /
        (Number(this.compressiveStrength.diaC) * Number(this.compressiveStrength.diaC) * 3.143 / 4));

      const compStrengthD = (this.compressiveStrength.testLoadkgD * 101.971 /
        (Number(this.compressiveStrength.diaD) * Number(this.compressiveStrength.diaD) * 3.143 / 4));

      const compStrengthE = (this.compressiveStrength.testLoadkgE * 101.971 /
        (Number(this.compressiveStrength.diaE) * Number(this.compressiveStrength.diaE) * 3.143 / 4));

      const compStrengthF = (this.compressiveStrength.testLoadkgF * 101.971 /
        (Number(this.compressiveStrength.diaF) * Number(this.compressiveStrength.diaF) * 3.143 / 4));

      const strengths = [compStrengthA, compStrengthB, compStrengthC, compStrengthD, compStrengthE, compStrengthF]
        .filter(val => !isNaN(val) && val > 0);

      const avgCompStrength = strengths.length > 0 
        ? (strengths.reduce((a, b) => a + b, 0) / strengths.length).toFixed(1)
        : '';

      autoTable(doc, {
        startY: finalY,
        head: [['Sample NO', 'Dia.(cm)', 'Length (cm)', 'Area (cm²)', 'Age in Days', 'Weight Sample (gm)', 'Unit Mass (gm/cc)', 'Test Load (KN)', 'Test Load (KG)', 'Compressive Strength (kg/cm²)', 'Avg. Comp. Strength (kg/cm²)', 'Compressive Strength (Mpa)', 'Avg. Comp. Strength (Mpa) with ezp u k=2']],
        body: [
          [this.compressiveStrength.sampleNOA, Number(this.compressiveStrength.diaA).toFixed(1), Number(this.compressiveStrength.lengthA).toFixed(1), (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4).toFixed(2), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleA, (Number(this.compressiveStrength.weightSampleA) / ((Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4) * Number(this.compressiveStrength.lengthA))).toFixed(3), this.compressiveStrength.testLoadknA, this.compressiveStrength.testLoadkgA * 101.971, (Number(this.compressiveStrength.testLoadkgA) * 101.971 / (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)).toFixed(1), {content: avgCompStrength , rowSpan: 6}, ((Number(this.compressiveStrength.testLoadkgA) * 101.971 /(Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)) / 10.2).toFixed(2), this.compressiveStrength.expAvgA],
          [this.compressiveStrength.sampleNOB, Number(this.compressiveStrength.diaB).toFixed(1), Number(this.compressiveStrength.lengthB).toFixed(1), (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4).toFixed(2), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleB, (Number(this.compressiveStrength.weightSampleB) / ((Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4) * Number(this.compressiveStrength.lengthB))).toFixed(3), this.compressiveStrength.testLoadknB, this.compressiveStrength.testLoadkgB * 101.971, (Number(this.compressiveStrength.testLoadkgB) * 101.971 / (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadkgB) * 101.971 /(Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)) / 10.2).toFixed(2), this.compressiveStrength.expAvgB],
          [this.compressiveStrength.sampleNOC, Number(this.compressiveStrength.diaC).toFixed(1), Number(this.compressiveStrength.lengthC).toFixed(1), (Number(this.compressiveStrength.diaC) * Number(this.compressiveStrength.diaC) * 3.143 / 4).toFixed(2), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleC, (Number(this.compressiveStrength.weightSampleC) / ((Number(this.compressiveStrength.diaC) * Number(this.compressiveStrength.diaC) * 3.143 / 4) * Number(this.compressiveStrength.lengthC))).toFixed(3), this.compressiveStrength.testLoadknC, this.compressiveStrength.testLoadkgC * 101.971, (Number(this.compressiveStrength.testLoadkgC) * 101.971 / (Number(this.compressiveStrength.diaC) * Number(this.compressiveStrength.diaC) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadkgC) * 101.971 /(Number(this.compressiveStrength.diaC) * Number(this.compressiveStrength.diaC) * 3.143 / 4)) / 10.2).toFixed(2), this.compressiveStrength.expAvgC],
          [this.compressiveStrength.sampleNOD, Number(this.compressiveStrength.diaD).toFixed(1), Number(this.compressiveStrength.lengthD).toFixed(1), (Number(this.compressiveStrength.diaD) * Number(this.compressiveStrength.diaD) * 3.143 / 4).toFixed(2), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleD, (Number(this.compressiveStrength.weightSampleD) / ((Number(this.compressiveStrength.diaD) * Number(this.compressiveStrength.diaD) * 3.143 / 4) * Number(this.compressiveStrength.lengthD))).toFixed(3), this.compressiveStrength.testLoadknD, this.compressiveStrength.testLoadkgD * 101.971, (Number(this.compressiveStrength.testLoadkgD) * 101.971 / (Number(this.compressiveStrength.diaD) * Number(this.compressiveStrength.diaD) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadkgD) * 101.971 /(Number(this.compressiveStrength.diaD) * Number(this.compressiveStrength.diaD) * 3.143 / 4)) / 10.2).toFixed(2), this.compressiveStrength.expAvgD],
          [this.compressiveStrength.sampleNOE, Number(this.compressiveStrength.diaE).toFixed(1), Number(this.compressiveStrength.lengthE).toFixed(1), (Number(this.compressiveStrength.diaE) * Number(this.compressiveStrength.diaE) * 3.143 / 4).toFixed(2), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleE, (Number(this.compressiveStrength.weightSampleE) / ((Number(this.compressiveStrength.diaE) * Number(this.compressiveStrength.diaE) * 3.143 / 4) * Number(this.compressiveStrength.lengthE))).toFixed(3), this.compressiveStrength.testLoadknE, this.compressiveStrength.testLoadkgE * 101.971, (Number(this.compressiveStrength.testLoadkgE) * 101.971 / (Number(this.compressiveStrength.diaE) * Number(this.compressiveStrength.diaE) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadkgE) * 101.971 /(Number(this.compressiveStrength.diaE) * Number(this.compressiveStrength.diaE) * 3.143 / 4)) / 10.2).toFixed(2), this.compressiveStrength.expAvgE],
          [this.compressiveStrength.sampleNOF, Number(this.compressiveStrength.diaF).toFixed(1), Number(this.compressiveStrength.lengthF).toFixed(1), (Number(this.compressiveStrength.diaF) * Number(this.compressiveStrength.diaF) * 3.143 / 4).toFixed(2), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleF, (Number(this.compressiveStrength.weightSampleF) / ((Number(this.compressiveStrength.diaF) * Number(this.compressiveStrength.diaF) * 3.143 / 4) * Number(this.compressiveStrength.lengthF))).toFixed(3), this.compressiveStrength.testLoadknF, this.compressiveStrength.testLoadkgF * 101.971, (Number(this.compressiveStrength.testLoadkgF) * 101.971 / (Number(this.compressiveStrength.diaF) * Number(this.compressiveStrength.diaF) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadkgF) * 101.971 /(Number(this.compressiveStrength.diaF) * Number(this.compressiveStrength.diaF) * 3.143 / 4)) / 10.2).toFixed(2), this.compressiveStrength.expAvgF],
        ],
        theme: 'grid',
        styles: {fontSize: 8, cellPadding: 1.8},
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 15},
          2: {cellWidth: 15},
          3: {cellWidth: 15},
          4: {cellWidth: 15},
          5: {cellWidth: 15},
          6: {cellWidth: 15},
          7: {cellWidth: 15},
          8: {cellWidth: 15},
          9: {cellWidth: 15},
          10: {cellWidth: 15},
          11: {cellWidth: 15},
          12: {cellWidth: 15}
        },
      });


      finalY = (doc as any).lastAutoTable.finalY + 3;

      // Create the table, restricted to the left side
      autoTable(doc, {
        startY: finalY,
        margin: {right: 100}, // leave space for the image on the right
        head: [['Type', 'Description']],
        body: [
          ['TYPE 1', 'Less than 1 inch of cracking through caps'],
          ['TYPE 2', 'Vertical cracks running through caps'],
          ['TYPE 3', 'Columnar Vertical Cracking through both ends'],
          ['TYPE 4', 'Diagonal fracture with no cracking through ends'],
          ['TYPE 5', 'Side fractures at top or bottom'],
          ['TYPE 6', 'Similar to type 5 but end of cylinder is pointed'],
        ],
        theme: 'grid',
        styles: {fontSize: 8, cellPadding: 1.8},
        columnStyles: {
          0: {cellWidth: 30},
          1: {cellWidth: 70},
        },
      });

      const tableY = (doc as any).lastAutoTable.finalY;
      doc.addImage('assets/compressiveStrength.png', 'JPEG', 115, finalY, 82, 47);

      finalY = (doc as any).lastAutoTable.finalY + 3;


      doc.setFontSize(8);
      if (this.compressiveStrength.notes) {
        doc.line(10, finalY, 200, finalY);
        const splitNotes = doc.splitTextToSize(
          `Remarks: ${this.compressiveStrength.notes || ""}`,
          180
        );
        doc.text(splitNotes, 13, finalY + 5);
        finalY += (splitNotes.length * 7);
      }

      doc.line(10, finalY - 4 , 200, finalY - 4);
      doc.setFontSize(8);
      doc.text(`Approved by: ${this.compressiveStrength.lastApproveBy || 'N/A'}`, 13, finalY);
      doc.text(`Test by: ${this.compressiveStrength.testBy || 'N/A'}`, 80, finalY);
      doc.text(`Checked by: ${this.compressiveStrength.adopter || 'N/A'}`, 150, finalY);

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

      doc.save(`CompressiveStrengthReport_${this.compressiveStrength.testName}.pdf`);
    };
  }
}

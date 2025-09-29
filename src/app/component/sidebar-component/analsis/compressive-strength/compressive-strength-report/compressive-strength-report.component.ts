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
    const testedDays = new Date(this.compressiveStrength.dateTested); 

    let reportDate = 'N/A';

    if (!isNaN(castingDate.getTime()) && !isNaN(testedDays.getTime())) {
      const report = new Date(castingDate);
      const report2 = new Date(testedDays);

      report.setDate(report.getDate() + report2.getDate());

      const year = report.getFullYear();
      const month = String(report.getMonth() + 1).padStart(2, '0');
      const day = String(report.getDate()).padStart(2, '0');
      reportDate = `${year}-${month}-${day}`;
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
          ['Project', this.compressiveStrength.projectName || 'N/A', 'Structure', this.compressiveStrength.structure || 'N/A' , {content: "" , rowSpan: 2}],
          ['Company', this.compressiveStrength.company || 'N/A', 'Sample by', this.compressiveStrength.sampleBy || 'N/A' ],
          ['Location', this.compressiveStrength.location || 'N/A', 'Slump (mm) ASTM', this.compressiveStrength.slump || 'N/A' , "ASTM C143/C143M"],
          ['Date Casting', this.compressiveStrength.dataCasting || 'N/A', 'Temperature(°C)', this.compressiveStrength.temperature || 'N/A' , "ASTM C1064/C1064M"],
          ['Date Received', this.compressiveStrength.dataReceived || 'N/A', 'Req. Strength for 28 Days (kg/cm2)', this.compressiveStrength.reqstrengthKg || 'N/A' , {content: "" , rowSpan: 5}],
          ['Date Tested', this.compressiveStrength.dateTested || 'N/A', 'Req. Strength for 28 Days (Mpa)', Number(this.compressiveStrength.reqstrengthKg / 10.2).toFixed(2)|| 'N/A'],
          ['Report Date', reportDate || 'N/A', 'Sample No.', this.compressiveStrength.sampleNo || 'N/A'],
          ['Lab. Report No.', this.compressiveStrength.labreportNo || 'N/A' , 'Type of Sample', this.compressiveStrength.typeofSample || 'N/A'],
        ],
        theme: 'grid',
        styles: {
          fontSize:7,
          cellPadding: 0.5,
          font: 'Amiri',
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        tableLineColor: [0, 0, 0],
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 50 },
          4: { cellWidth: 25 }
        },
        
      });


      let finalY = (doc as any).lastAutoTable.finalY;

      const compStrengthA = (this.compressiveStrength.testLoadknA * 101.971 /
        (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4));

      const compStrengthB = (this.compressiveStrength.testLoadknB * 101.971 /
        (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4));

      const compStrengthC = (this.compressiveStrength.testLoadknC * 101.971 /
        (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4));

      const compStrengthD = (this.compressiveStrength.testLoadknD * 101.971 /
        (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4));

      const compStrengthE = (this.compressiveStrength.testLoadknE * 101.971 /
        (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4));

      const compStrengthF = (this.compressiveStrength.testLoadknF * 101.971 /
        (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4));

      const strengthsGroup1 = [compStrengthA, compStrengthB, compStrengthC]
        .filter(val => !isNaN(val) && val > 0);

      const avgCompStrength1 = strengthsGroup1.length > 0
        ? (strengthsGroup1.reduce((a, b) => a + b, 0) / strengthsGroup1.length).toFixed(1)
        : '';

      const strengthsGroup2 = [compStrengthD, compStrengthE, compStrengthF]
        .filter(val => !isNaN(val) && val > 0);

      const avgCompStrength2 = strengthsGroup2.length > 0
        ? (strengthsGroup2.reduce((a, b) => a + b, 0) / strengthsGroup2.length).toFixed(1)
        : '';


      autoTable(doc, {
        startY: finalY,
        head: [['Sample NO', 'Dia.(cm)', 'Length (cm)', 'Area (cm²)', 'Age in Days', 'Weight Sample (gm)', 'Unit Mass (gm/cc)', 'Test Load (KN)', 'Test Load (KG)', 'Compressive Strength (kg/cm²)', 'Avg. Comp. Strength (kg/cm²)', 'Compressive Strength (Mpa)', 'Avg. Comp. Strength (Mpa) with exp u k=2']],
        body: [
          [this.compressiveStrength.sampleNOA, Number(this.compressiveStrength.diaA).toFixed(1), Number(this.compressiveStrength.lengthA).toFixed(1), (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4).toFixed(1), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleA, (Number(this.compressiveStrength.weightSampleA) / ((Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4) * Number(this.compressiveStrength.lengthA))).toFixed(3), this.compressiveStrength.testLoadknA, Number(this.compressiveStrength.testLoadknA * 101.971).toFixed(0), (Number(this.compressiveStrength.testLoadknA) * 101.971 / (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)).toFixed(1), {content: avgCompStrength1 , rowSpan: 3}, ((Number(this.compressiveStrength.testLoadknA) * 101.971 /(Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)) / 10.2).toFixed(2), { content: `± ${this.compressiveStrength.expAvgA}`, rowSpan: 3 }],
          [this.compressiveStrength.sampleNOB, Number(this.compressiveStrength.diaA).toFixed(1), Number(this.compressiveStrength.lengthA).toFixed(1), (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4).toFixed(1), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleB, (Number(this.compressiveStrength.weightSampleB) / ((Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4) * Number(this.compressiveStrength.lengthA))).toFixed(3), this.compressiveStrength.testLoadknB, Number(this.compressiveStrength.testLoadknB * 101.971).toFixed(0), (Number(this.compressiveStrength.testLoadknB) * 101.971 / (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadknB) * 101.971 /(Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)) / 10.2).toFixed(2)],
          [this.compressiveStrength.sampleNOC, Number(this.compressiveStrength.diaA).toFixed(1), Number(this.compressiveStrength.lengthA).toFixed(1), (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4).toFixed(1), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleC, (Number(this.compressiveStrength.weightSampleC) / ((Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4) * Number(this.compressiveStrength.lengthA))).toFixed(3), this.compressiveStrength.testLoadknC, Number(this.compressiveStrength.testLoadknC * 101.971).toFixed(0), (Number(this.compressiveStrength.testLoadknC) * 101.971 / (Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadknC) * 101.971 /(Number(this.compressiveStrength.diaA) * Number(this.compressiveStrength.diaA) * 3.143 / 4)) / 10.2).toFixed(2)],
          [this.compressiveStrength.sampleNOD, Number(this.compressiveStrength.diaB).toFixed(1), Number(this.compressiveStrength.lengthB).toFixed(1), (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4).toFixed(1), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleD, (Number(this.compressiveStrength.weightSampleD) / ((Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4) * Number(this.compressiveStrength.lengthB))).toFixed(3), this.compressiveStrength.testLoadknD, Number(this.compressiveStrength.testLoadknD * 101.971).toFixed(0), (Number(this.compressiveStrength.testLoadknD) * 101.971 / (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)).toFixed(1), { content: avgCompStrength2, rowSpan: 3 }, ((Number(this.compressiveStrength.testLoadknD) * 101.971 /(Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)) / 10.2).toFixed(2), { content: `± ${this.compressiveStrength.expAvgB}`, rowSpan: 3 }],
          [this.compressiveStrength.sampleNOE, Number(this.compressiveStrength.diaB).toFixed(1), Number(this.compressiveStrength.lengthB).toFixed(1), (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4).toFixed(1), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleE, (Number(this.compressiveStrength.weightSampleE) / ((Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4) * Number(this.compressiveStrength.lengthB))).toFixed(3), this.compressiveStrength.testLoadknE, Number(this.compressiveStrength.testLoadknE * 101.971).toFixed(0), (Number(this.compressiveStrength.testLoadknE) * 101.971 / (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadknE) * 101.971 /(Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)) / 10.2).toFixed(2)],
          [this.compressiveStrength.sampleNOF, Number(this.compressiveStrength.diaB).toFixed(1), Number(this.compressiveStrength.lengthB).toFixed(1), (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4).toFixed(1), this.compressiveStrength.dateTested, this.compressiveStrength.weightSampleF, (Number(this.compressiveStrength.weightSampleF) / ((Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4) * Number(this.compressiveStrength.lengthB))).toFixed(3), this.compressiveStrength.testLoadknF, Number(this.compressiveStrength.testLoadknF * 101.971).toFixed(0), (Number(this.compressiveStrength.testLoadknF) * 101.971 / (Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)).toFixed(1), ((Number(this.compressiveStrength.testLoadknF) * 101.971 /(Number(this.compressiveStrength.diaB) * Number(this.compressiveStrength.diaB) * 3.143 / 4)) / 10.2).toFixed(2)],
        ],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 1,
          font: 'Amiri',
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5
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
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 14},
          2: {cellWidth: 14},
          3: {cellWidth: 14},
          4: {cellWidth: 18},
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


      finalY = (doc as any).lastAutoTable.finalY;

      autoTable(doc, {
        startY: finalY,
        margin: {right: 100},
        body: [
          [{content:'Remarks' , rowSpan: 2} , 'Qudorat Laboratory Sample.' ],
          ['Results relate only to the item Tested'],
          ['Type Of Equipment Used' , 'Control/ID CCM-001'],
          ['TYPE 1', 'Less than 1 inch of cracking through caps'],
          ['TYPE 2', 'Vertical cracks running through caps'],
          ['TYPE 3', 'Columnar Vertical Cracking through both ends'],
          ['TYPE 4', 'Diagonal fracture with no cracking through ends'],
          ['TYPE 5', 'Side fractures at top or bottom'],
          ['TYPE 6', 'Similar to type 5 but end of cylinder is pointed'],
        ],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 1,
          font: 'Amiri',
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        tableLineColor: [0, 0, 0],
        columnStyles: {
          0: {cellWidth: 35},
          1: {cellWidth: 70},
        },
      });

      const tableY = (doc as any).lastAutoTable.finalY;

      const pageWidth1 = doc.internal.pageSize.getWidth() + 8;
      const tableWidth1 = 190; 
      const startX1 = (pageWidth1 - tableWidth1) / 2;
      doc.addImage('assets/compressiveStrength.png', 'JPEG', 120.5, finalY + 0.5, 83.5, 43);

      const blockTop1 = finalY;
      const blockBottom1 = 264;
      const blockHeight1 = blockBottom1 - blockTop1;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.6);
      doc.rect(startX1, blockTop1, tableWidth1, blockHeight1);

      finalY = (doc as any).lastAutoTable.finalY ;

        let footerY = finalY;
        doc.setFontSize(8);
        const pageWidth = doc.internal.pageSize.getWidth() + 8;
        const tableWidth = 190; 
        const startX = (pageWidth - tableWidth) / 2;
        const endX = startX + tableWidth;
        const boxWidth = tableWidth;

        let remarksHeight = 0;
        if (this.compressiveStrength.notes) {
          const splitNotes = doc.splitTextToSize(
            `Remarks: ${this.compressiveStrength.notes || ""}`,
            boxWidth - 8
          );

          doc.setFont("Amiri", "bold");
          doc.text(splitNotes, startX + 1, footerY + 3); 

          remarksHeight = splitNotes.length * 5;
          footerY += remarksHeight + 5;
        }

        doc.line(startX, 255, endX, 255);

        doc.setFontSize(6);
        const sectionWidth = tableWidth / 3; 

        doc.text(`Approved by: ${this.compressiveStrength.adopter || " "}`, startX + 1, 260);

        doc.text(`Test by: ${this.compressiveStrength.testBy || " "}`, startX + sectionWidth + 4, 260);

        doc.text(`Checked by: ${this.compressiveStrength.approveBy || " "}`, startX + (sectionWidth * 2) + 4, 260);

        const blockTop = finalY;
        const blockBottom = 264;
        const blockHeight = blockBottom - blockTop;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.6);
        doc.rect(startX, blockTop, tableWidth, blockHeight);

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

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
    doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont); // هذا اسم المتغير في ملف الخط
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
      doc.setFontSize(12);
      doc.text(`Portland Cement Concrete Cylinders Compressive Strength Test` , 38 , 36)


      autoTable(doc, {
        startY: 38,
        body: [
          ['Project', this.compressiveStrength.projectName || 'N/A', 'Test Name', this.compressiveStrength.nameOfTest || 'N/A'],
          ['Client', this.compressiveStrength.clientName || 'N/A', 'Testing Date', this.compressiveStrength.testingDate || 'N/A'],
          ['Sample No', this.compressiveStrength.sampleNo || 'N/A', 'Standard', this.compressiveStrength.classification || 'N/A'],
          ['Sample By', this.compressiveStrength.sampleBy || 'N/A', 'Consultant', this.compressiveStrength.consultant || 'N/A'],
          ['Sampling Date', this.compressiveStrength.sampleDate || 'N/A', 'Owner', this.compressiveStrength.owner || 'N/A'],
        ],
        theme: 'grid',
        styles: { fontSize: 6, cellPadding: 1.5 , font: 'Amiri' },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 60 },
          2: { cellWidth: 30 },
          3: { cellWidth: 60 }
        },
      });


      autoTable(doc, {
        startY: 67,
        head: [['Parameter', 'Value', 'Unit', 'Spec', 'Value', 'Unit', 'Value', 'Unit']],
        body: [
          ['Cement Content', this.compressiveStrength.cementContent, this.compressiveStrength.cementContentType, 'Spec. 28 Days Strength', this.compressiveStrength.specTwintyEightDayStrength, 'kg/cm2', this.compressiveStrength.specTwintyEightDayStrength / 10, 'Mpa'],
          ['Diameter', this.compressiveStrength.diameter * 10 , 'mm', 'Area', Number(this.area).toFixed(2), 'cm²'],
          ['Height', this.compressiveStrength.height * 10, 'mm', 'Volume', Number(this.volume).toFixed(2), 'cm³'],
          ['Environmental Conditions:', '', '', '', '', ''],
          ['Date Cast', this.compressiveStrength.dateCast, '', 'Slump', this.compressiveStrength.slump, 'mm'],
          ['Date Received', this.compressiveStrength.dateReceived, '', 'Air Temperature', this.compressiveStrength.airTemperature, '°C'],
          ['Date Tested', this.compressiveStrength.dateTested, '', 'Concrete Temperature', this.compressiveStrength.concreteTemperature, '°C'],
        ],
        theme: 'grid',
        styles: {fontSize: 8, cellPadding: 1.8},
        columnStyles: {0: {cellWidth: 50}, 3: {cellWidth: 50}},
      });

      let finalY = (doc as any).lastAutoTable.finalY + 3;
      autoTable(doc, {
        startY: finalY,
        head: [['NO', 'Type of Structure', 'Age (day)', 'Weight (gm)', 'Density (gm/cm³)', 'Load (kN)', 'Strength (Kgf/cm²)', 'Strength (Mpa)', 'Fracture Type']],
        body: [
          ['1', '', this.compressiveStrength.sampleAAge, this.compressiveStrength.weightA, Number(this.compressiveStrength.weightA / this.volume).toFixed(3), this.compressiveStrength.loadA, Number(this.compressiveStrength.loadA * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadA * 10 / this.area).toFixed(2), this.compressiveStrength.fractureA],
          ['2', '', this.compressiveStrength.sampleBAge, this.compressiveStrength.weightB, Number(this.compressiveStrength.weightB / this.volume).toFixed(3), this.compressiveStrength.loadB, Number(this.compressiveStrength.loadB * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadB * 10 / this.area).toFixed(2), this.compressiveStrength.fractureB],
          ['3', '', this.compressiveStrength.sampleCAge, this.compressiveStrength.weightC, Number(this.compressiveStrength.weightC / this.volume).toFixed(3), this.compressiveStrength.loadC, Number(this.compressiveStrength.loadC * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadC * 10 / this.area).toFixed(2), this.compressiveStrength.fractureC],
          ['Avg 1-3', '',
            '',
            '',
            '',
            '',
            Number((this.compressiveStrength.loadA + this.compressiveStrength.loadB + this.compressiveStrength.loadC) / 3 * 101.971 / this.area).toFixed(1),
            Number((this.compressiveStrength.loadA + this.compressiveStrength.loadB + this.compressiveStrength.loadC) / 3 * 10 / this.area).toFixed(2),
            '',
          ],
          ['4', '', this.compressiveStrength.sampleDAge, this.compressiveStrength.weightD, Number(this.compressiveStrength.weightD / this.volume).toFixed(3), this.compressiveStrength.loadD, Number(this.compressiveStrength.loadD * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadD * 10 / this.area).toFixed(2), this.compressiveStrength.fractureD],
          ['5', '', this.compressiveStrength.sampleEAge, this.compressiveStrength.weightE, Number(this.compressiveStrength.weightE / this.volume).toFixed(3), this.compressiveStrength.loadE, Number(this.compressiveStrength.loadE * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadE * 10 / this.area).toFixed(2), this.compressiveStrength.fractureE],
          ['6', '', this.compressiveStrength.sampleFAge, this.compressiveStrength.weightF, Number(this.compressiveStrength.weightF / this.volume).toFixed(3), this.compressiveStrength.loadF, Number(this.compressiveStrength.loadF * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadF * 10 / this.area).toFixed(2), this.compressiveStrength.fractureF],
          ['Avg 4-6', '',
            '',
            '',
            '',
            '',
            Number((this.compressiveStrength.loadD + this.compressiveStrength.loadE + this.compressiveStrength.loadF) / 3 * 101.971 / this.area).toFixed(1),
            Number((this.compressiveStrength.loadD + this.compressiveStrength.loadE + this.compressiveStrength.loadF) / 3 * 10 / this.area).toFixed(2),
            '',
          ]
        ],
        theme: 'grid',
        styles: {fontSize: 8, cellPadding: 1.8},
        columnStyles: {
          0: {cellWidth: 20},
          1: {cellWidth: 22},
          2: {cellWidth: 20},
          3: {cellWidth: 20},
          4: {cellWidth: 20},
          5: {cellWidth: 20},
          6: {cellWidth: 20},
          7: {cellWidth: 20},
          8: {cellWidth: 20}
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
      doc.text(`Approved by: ${this.compressiveStrength.adopter || 'N/A'}`, 13, finalY);
      doc.text(`Test by: ${this.compressiveStrength.testBy || 'N/A'}`, 80, finalY);
      doc.text(`Checked by: ${this.compressiveStrength.lastApproveBy || 'N/A'}`, 150, finalY);

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

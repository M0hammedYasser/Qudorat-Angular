import {Component, OnInit} from '@angular/core';
import {CompressiveStrength} from "../../../../../model/compressive-strength";
import {CompressiveStrengthService} from "../../../../../service/CompressiveStrength/compressive-strength.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DecimalPipe} from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-compressive-strength-report',
  standalone: true,
  imports: [
    DecimalPipe
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

  constructor(private service: CompressiveStrengthService, private activatedRoute: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => {
      this.compressiveStrength = res;
      this.area = Number(((this.compressiveStrength.diameter / 2) * (this.compressiveStrength.diameter / 2)) * Math.PI);
      this.volume = this.area * this.compressiveStrength.height;
    })
  }

  generatePDF() {
    const doc = new jsPDF();
    const img = new Image();
    const qr = new Image();

    img.src = 'assets/Q.png';
    qr.src = 'assets/barcode.jpg';

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 5, 20, 20);
      doc.setFontSize(16);
      doc.text('Qudorat Laboratory', 35, 15);
      doc.setFontSize(11);
      doc.text(`Project         ${this.compressiveStrength.projectName || 'N/A'}`, 13, 30);
      doc.text(`Client           ${this.compressiveStrength.clientName || 'N/A'}`, 13, 36);
      doc.addImage(qr, 'PNG', 160, 22, 35 , 30);
      doc.text(`Sample By          ${this.compressiveStrength.sampleBy || 'N/A'}`, 13, 42);
      doc.text(`Sampling Date    ${this.compressiveStrength.sampleDate || 'N/A'}`, 13, 48);
      doc.text(`Testing Date     ${this.compressiveStrength.testingDate || 'N/A'}`, 110, 30);
      doc.text(`Standard    ${this.compressiveStrength.classification || 'N/A'}`, 110, 36);
      doc.line(10, 52, 200, 52);

      // First Table: Cement Content & Environmental Conditions
      autoTable(doc, {
        startY: 55,
        head: [['Parameter', 'Value', '', 'Spec', 'Value', 'Unit']],
        body: [
          ['Cement Content', this.compressiveStrength.cementContent, 'OPC', 'Spec. 28 Days Strength', this.compressiveStrength.specTwintyEightDayStrength, 'Mpa'],
          ['', '', '', 'Spec. 07 Days Strength', this.compressiveStrength.specTwintyEightDayStrength * 0.75, 'Mpa'],
          ['Diameter', this.compressiveStrength.diameter, 'cm', 'Area', this.area, 'cm²'],
          ['Height', this.compressiveStrength.height, 'cm', 'Volume', this.volume, 'cm³'],
          ['Environmental Conditions:', '', '', '', '', ''],
          ['Date Cast', this.compressiveStrength.dateCast, '', 'Slump', this.compressiveStrength.slump, 'mm'],
          ['Date Received', this.compressiveStrength.dateReceived, '', 'Air Temperature', this.compressiveStrength.airTemperature, '°C'],
          ['Date Tested', this.compressiveStrength.dateTested, '', 'Concrete Temperature', this.compressiveStrength.concreteTemperature, '°C'],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 50 }, 3: { cellWidth: 50 } },
      });

      // Get Y position after the first table
      let finalY = (doc as any).lastAutoTable.finalY + 10;

      // Second Table: Sample Test Results
      autoTable(doc, {
        startY: finalY,
        head: [['NO', 'Type of Structure', 'Age (day)', 'Weight (gm)', 'Density (gm/cm³)', 'Load (kN)', 'Strength (Kgf/cm²)', 'Strength (Mpa)', 'Fracture Type']],
        body: [
            ['1', '', this.compressiveStrength.sampleAAge, this.compressiveStrength.weightA, Number(this.compressiveStrength.weightA / this.volume).toFixed(3), this.compressiveStrength.loadA, Number(this.compressiveStrength.loadA * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadA * 10 / this.area).toFixed(2), this.compressiveStrength.fractureA],
            ['2', '', this.compressiveStrength.sampleBAge, this.compressiveStrength.weightB, Number(this.compressiveStrength.weightB / this.volume).toFixed(3), this.compressiveStrength.loadB, Number(this.compressiveStrength.loadB * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadB * 10 / this.area).toFixed(2), this.compressiveStrength.fractureB],
            ['3', '', this.compressiveStrength.sampleCAge, this.compressiveStrength.weightC, Number(this.compressiveStrength.weightC / this.volume).toFixed(3), this.compressiveStrength.loadC, Number(this.compressiveStrength.loadC * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadC * 10 / this.area).toFixed(2), this.compressiveStrength.fractureC],
            ['4', '', this.compressiveStrength.sampleDAge, this.compressiveStrength.weightD, Number(this.compressiveStrength.weightD / this.volume).toFixed(3), this.compressiveStrength.loadD, Number(this.compressiveStrength.loadD * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadD * 10 / this.area).toFixed(2), this.compressiveStrength.fractureD],
            ['5', '', this.compressiveStrength.sampleEAge, this.compressiveStrength.weightE, Number(this.compressiveStrength.weightE / this.volume).toFixed(3), this.compressiveStrength.loadE, Number(this.compressiveStrength.loadE * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadE * 10 / this.area).toFixed(2), this.compressiveStrength.fractureE],
            ['6', '', this.compressiveStrength.sampleFAge, this.compressiveStrength.weightF, Number(this.compressiveStrength.weightF / this.volume).toFixed(3), this.compressiveStrength.loadF, Number(this.compressiveStrength.loadF * 101.971 / this.area).toFixed(1), Number(this.compressiveStrength.loadF * 10 / this.area).toFixed(2), this.compressiveStrength.fractureF]
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 22 }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 }, 4: { cellWidth: 20 }, 5: { cellWidth: 20 }, 6: { cellWidth: 20 }, 7: { cellWidth: 20 }, 8: { cellWidth: 20 } },
      });

      // Get Y position after the second table
      finalY = (doc as any).lastAutoTable.finalY + 10;

      // Remarks Section

      // Fracture Types Table
      autoTable(doc, {
        startY: finalY,
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
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 150 } },
      });

       finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.line(10, finalY + 2, 200, finalY + 2);

      if (this.compressiveStrength.notes) {
        doc.text(`Remarks : ${this.compressiveStrength.notes || ""}`, 13, finalY + 8);
      }

      doc.line(10, finalY + 10, 200, finalY + 10);
      doc.setFontSize(11);
      doc.text(`Approved by: ${this.compressiveStrength.approveBy || 'N/A'}`, 13, finalY + 15);
      doc.text(`Test by: ${this.compressiveStrength.testBy || 'N/A'}`, 80, finalY + 15);
      doc.text(`Checked by: ${this.compressiveStrength.activist || 'N/A'}`, 150, finalY + 15);

      doc.save(`CompressiveStrengthReport_${this.compressiveStrength.testName}.pdf`);
    };
  }





}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from "chart.js/auto";
import {SieveAnalysis} from "../../../../../model/sieve-analysis";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import {ActivatedRoute} from "@angular/router"; // ✅ Import autoTable separately

@Component({
  selector: 'app-sand-report',
  standalone: true,
  imports: [],
  templateUrl: './sand-report.component.html',
  styleUrl: './sand-report.component.css'
})
export class SandReportComponent implements AfterViewInit, OnInit {

  currentDate = new Date().toLocaleDateString();
  chart: any;
  sieveAnalysis: SieveAnalysis = {} as SieveAnalysis;
  id: number = 0;

  constructor(private sieveAnalysisService: SieveAnalysisService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.sieveAnalysisService.findById(this.id).subscribe(res => {
      this.sieveAnalysis = res;
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('invoiceChart') as HTMLCanvasElement;

    this.sieveAnalysisService.findById(this.id).subscribe(res => {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["NO.200", "NO.100", "NO.50", "NO.30", "NO.16", "NO.8", "NO.4", "3/8 in"],
          datasets: [
            {
              label: 'Max',
              data: [res.cvcMaxH, res.cvcMaxG, res.cvcMaxF, res.cvcMaxE, res.cvcMaxD, res.cvcMaxC, res.cvcMaxB, res.cvcMaxA],
              borderColor: 'grey',
              fill: false
            },
            {
              label: 'Gradiation',
              data: [100-res.retainedH, 100-res.retainedG, 100-res.retainedF, 100-res.retainedE, 100-res.retainedD, 100-res.retainedC, 100-res.retainedB, 100-res.retainedA],
              borderColor: 'red',
              fill: false
            },
            {
              label: 'Min',
              data: [res.cvcMinH, res.cvcMinG, res.cvcMinF, res.cvcMinE, res.cvcMinD, res.cvcMinC, res.cvcMinB, res.cvcMinA],
              borderColor: 'grey',
              fill: false
            }
          ]
        }
      });
    })

  }

  generatePDF() {
    if (!this.sieveAnalysis || Object.keys(this.sieveAnalysis).length === 0) {
      console.error("Sieve Analysis data is not available. Please try again later.");
      alert("Data is not yet loaded. Please wait and try again.");
      return;
    }

    const doc = new jsPDF();
    const img = new Image();
    img.src = 'assets/Q.png'; // Update the path based on your actual asset structure

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 5, 20, 20); // X, Y, Width, Height

      doc.setFontSize(16);
      doc.text('Qudorat Laboratory', 35, 15); // Adjust to avoid overlap with image
      doc.setFontSize(12);
      doc.text('Address: ', 35, 25);
      doc.text('Email: ', 35, 35);

      doc.setFontSize(14);
      doc.text(`Project : ${this.sieveAnalysis.projectName}`, 120, 15);
      doc.setFontSize(12);
      doc.text(`Test : ${this.sieveAnalysis.testName}`, 120, 25);
      doc.text(`Adopter: ${this.sieveAnalysis.adopter}`, 120, 35);

      doc.line(10, 40, 200, 40);

      const totalWeight = this.sieveAnalysis.totalWeigh || 0;
      doc.setFontSize(12);
      doc.text(`Total Weight: ${totalWeight} gm`, 14, 50);

      const tableColumn = [
        "Standard", "Mass Retained", "Cummulative Mass Retained", "Retained %", "Passing %", "CVC.Min", "CVC.Max"
      ];
      const tableRows: any[] = [];
      const sieveSizes = ["9.5 mm", "4.75 mm", "2.36 mm", "1.18 mm", "600 µm", "300 µm", "150 µm", "75 µm"];

      const massRetained = [
        this.sieveAnalysis?.massRetainedA, this.sieveAnalysis?.massRetainedB, this.sieveAnalysis?.massRetainedC,
        this.sieveAnalysis?.massRetainedD, this.sieveAnalysis?.massRetainedE, this.sieveAnalysis?.massRetainedF,
        this.sieveAnalysis?.massRetainedG, this.sieveAnalysis?.massRetainedH
      ];

      const massRetainedGm = [
        this.sieveAnalysis?.rmassRetainedA, this.sieveAnalysis?.rmassRetainedB, this.sieveAnalysis?.rmassRetainedC,
        this.sieveAnalysis?.rmassRetainedD, this.sieveAnalysis?.rmassRetainedE, this.sieveAnalysis?.rmassRetainedF,
        this.sieveAnalysis?.rmassRetainedG, this.sieveAnalysis?.rmassRetainedH
      ];

      const retainedPercent = [
        this.sieveAnalysis?.retainedA, this.sieveAnalysis?.retainedB, this.sieveAnalysis?.retainedC,
        this.sieveAnalysis?.retainedD, this.sieveAnalysis?.retainedE, this.sieveAnalysis?.retainedF,
        this.sieveAnalysis?.retainedG, this.sieveAnalysis?.retainedH
      ].map(value => value !== undefined ? Number(value).toFixed(2) : "0");

      const passingPercent = retainedPercent.map(value =>
        value !== "0" ? (100 - parseFloat(value)).toFixed(2) : "100"
      );

      const minValues = [
        this.sieveAnalysis?.cvcMinA, this.sieveAnalysis?.cvcMinB, this.sieveAnalysis?.cvcMinC,
        this.sieveAnalysis?.cvcMinD, this.sieveAnalysis?.cvcMinE, this.sieveAnalysis?.cvcMinF,
        this.sieveAnalysis?.cvcMinG, this.sieveAnalysis?.cvcMinH
      ];

      const maxValues = [
        this.sieveAnalysis?.cvcMaxA, this.sieveAnalysis?.cvcMaxB, this.sieveAnalysis?.cvcMaxC,
        this.sieveAnalysis?.cvcMaxD, this.sieveAnalysis?.cvcMaxE, this.sieveAnalysis?.cvcMaxF,
        this.sieveAnalysis?.cvcMaxG, this.sieveAnalysis?.cvcMaxH
      ];

      const formatValue = (value: any) => value !== undefined && value !== null ? value : "0";
      sieveSizes.forEach((size, index) => {
        tableRows.push([
          size,                                      // Standard
          formatValue(massRetained[index]),          // Mass Retained
          formatValue(massRetainedGm[index]),        // Mass Retained (gm)
          retainedPercent[index],                    // Retained %
          passingPercent[index],                     // Passing %
          formatValue(minValues[index]),             // CVC.Min
          formatValue(maxValues[index])              // CVC.Max
        ]);
      });

      autoTable(doc, {
        startY: 60,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 10 }
      });

      const finalY = (doc as any).lastAutoTable?.finalY ?? 80;
      const actualValue = retainedPercent
        .slice(0, 7) // First 7 retained %
        .reduce((sum, val) => sum + parseFloat(val), 0) / 100;

      doc.setFontSize(12);
      doc.text(`Actual: ${actualValue.toFixed(2)}`, 160, finalY + 10); // Adjust X, Y position

      setTimeout(() => {
        const chartCanvas = document.getElementById('invoiceChart') as HTMLCanvasElement;
        if (chartCanvas) {
          const chartImage = chartCanvas.toDataURL('image/png');
          doc.addImage(chartImage, 'PNG', 10, finalY + 30, 180, 80); // Move chart below "Actual"
          doc.save('Sieve_Analysis_Report.pdf');
        } else {
          console.error("Chart canvas not found!");
        }
      }, 1000);
    };

    img.onerror = () => {
      console.error("Error loading image from assets.");
    };
  }






}

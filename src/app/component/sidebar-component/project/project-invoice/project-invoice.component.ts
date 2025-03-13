import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {Project} from "../../../../model/project";
import {ProjectService} from "../../../../service/project/project.service";
import {ActivatedRoute} from "@angular/router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Test} from "../../../../model/test";

@Component({
  selector: 'app-project-invoice',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './project-invoice.component.html',
  styleUrl: './project-invoice.component.css'
})
export class ProjectInvoiceComponent implements OnInit{

  @ViewChild('invoiceContent', {static: false}) invoiceContent!: ElementRef;

  invoiceNumber = 'INV-2024001';
  invoiceDate = new Date();
  project: Project = {} as Project;
  id : string = '';

  constructor(private projectService: ProjectService , private activatedRoute: ActivatedRoute) {}

  findById(id: string) {
    this.projectService.findById(id).subscribe(project => {this.project = project;});
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.findById(this.id);
  }

  getTotal() {
    return this.project.tests
      .filter(test => !test.paid) // Filter only unpaid tests
      .reduce((total, test) => total + test.price, 0); // Sum up the prices
  }

  downloadPDF() {
    const element = this.invoiceContent.nativeElement;
    const button = element.querySelector('.download-btn'); // Get the button

    if (button) {
      button.style.display = 'none'; // Hide the button
    }

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Invoice_${this.invoiceNumber}.pdf`);

      if (button) {
        button.style.display = 'block'; // Show the button again
      }
    });
  }


}

import {Component} from '@angular/core';
import {SearchComponent} from "../../shared/search/search.component";
import {SearchPipe} from "../../../pipe/search.pipe";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Client} from "../../../model/client";
import {ClientService} from "../../../service/client/client.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-test-report',
  standalone: true,
  imports: [
    SearchComponent,
    SearchPipe,
    NgForOf,
    NgClass,
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './test-report.component.html',
  styleUrl: './test-report.component.css'
})
export class TestReportComponent {



}

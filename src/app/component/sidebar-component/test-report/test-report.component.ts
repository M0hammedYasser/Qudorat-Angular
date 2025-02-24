import {Component} from '@angular/core';
import {SearchComponent} from "../../shared/search/search.component";
import {SearchPipe} from "../../../pipe/search.pipe";
import {NgClass, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Client} from "../../../model/client";
import {ClientService} from "../../../service/client/client.service";

@Component({
  selector: 'app-test-report',
  standalone: true,
    imports: [
        SearchComponent,
        SearchPipe,
        NgForOf,
        NgClass,
        RouterLink
    ],
  templateUrl: './test-report.component.html',
  styleUrl: './test-report.component.css'
})
export class TestReportComponent {

  reports = [
    {no: 1, name: 'John Doe', clientCode: 'C001', testName: 'Blood Test', status: 'Completed', date: '2024-02-09'},
    {no: 2, name: 'Jane Smith', clientCode: 'C002', testName: 'X-Ray', status: 'Pending', date: '2024-02-08'},
    {no: 3, name: 'Mark Wilson', clientCode: 'C003', testName: 'MRI Scan', status: 'In Progress', date: '2024-02-07'}];

  searchText: string = '';

  onSearchTextEntered(searchValue: any) {
    this.searchText = searchValue
  }

  delete(id : number){}




}

import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SearchComponent} from "../../../shared/search/search.component";
import {SearchPipe} from "../../../../pipe/search.pipe";
import {Test} from "../../../../model/test";
import {TestService} from "../../../../service/test/test.service";

@Component({
  selector: 'app-test',
  standalone: true,
    imports: [
        NgForOf,
        RouterLink,
        SearchComponent,
        SearchPipe
    ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit{

  tests: Test[] = [];
  searchText: string = '';

  constructor(private service: TestService) {
  }

  ngOnInit() {
    this.findAll();
  }

  findAll(){
    this.service.findAll().subscribe(res => this.tests = res);
  }

  onSearchTextEntered(searchValue: any) {
    this.searchText = searchValue
  }

  delete(id : number) {
    this.service.delete(id).subscribe();
    this.findAll();
    window.location.reload();
  }

}

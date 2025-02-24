import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SearchComponent} from "../../../shared/search/search.component";
import {SearchPipe} from "../../../../pipe/search.pipe";
import {Client} from "../../../../model/client";
import {ClientService} from "../../../../service/client/client.service";
import {Project} from "../../../../model/project";
import {ProjectService} from "../../../../service/project/project.service";

@Component({
  selector: 'app-show-project',
  standalone: true,
    imports: [
        NgForOf,
        RouterLink,
        SearchComponent,
        SearchPipe
    ],
  templateUrl: './show-project.component.html',
  styleUrl: './show-project.component.css'
})
export class ShowProjectComponent implements OnInit{

  projects : Project[] = [];
  searchText: string = '';

  constructor(private service: ProjectService) {
  }

  ngOnInit() {
    this.findAll();
  }

  findAll(){
    this.service.findAll().subscribe(res => this.projects = res);
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

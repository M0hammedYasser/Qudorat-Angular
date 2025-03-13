import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SearchComponent} from "../../../shared/search/search.component";
import {SearchPipe} from "../../../../pipe/search.pipe";
import {Project} from "../../../../model/project";
import {ProjectService} from "../../../../service/project/project.service";
import {AuthenticationService} from "../../../../service/authentication/authentication.service";

@Component({
  selector: 'app-show-project',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    SearchComponent,
    SearchPipe,
    NgIf
  ],
  templateUrl: './show-project.component.html',
  styleUrl: './show-project.component.css'
})
export class ShowProjectComponent implements OnInit {

  projects: Project[] = [];
  searchText: string = '';
  role: string = '';

  constructor(private service: ProjectService , private authService :AuthenticationService) {
  }

  ngOnInit() {
    this.findAll();
    this.role = this.authService.getAuthority();
  }

  findAll() {
    this.service.findAll().subscribe(res => this.projects = res);
  }

  onSearchTextEntered(searchValue: any) {
    this.searchText = searchValue
  }

  delete(id: string) {
    this.service.delete(id).subscribe();
    this.findAll();
    window.location.reload();
  }

}

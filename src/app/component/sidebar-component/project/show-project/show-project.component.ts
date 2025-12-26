import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SearchComponent } from "../../../shared/search/search.component";
import { SearchPipe } from "../../../../pipe/search.pipe";
import { Project } from "../../../../model/project";
import { ProjectService } from "../../../../service/project/project.service";
import { AuthenticationService } from "../../../../service/authentication/authentication.service";
import Swal from 'sweetalert2';
import { InsertProjectComponent } from "../insert-project/insert-project.component";
import { UpdateProjectComponent } from "../update-project/update-project.component";

@Component({
  selector: 'app-show-project',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    SearchComponent,
    SearchPipe,
    NgIf,
    InsertProjectComponent,
    UpdateProjectComponent
  ],
  templateUrl: './show-project.component.html',
  styleUrl: './show-project.component.css'
})
export class ShowProjectComponent implements OnInit {

  projects: Project[] = [];
  searchText: string = '';
  role: string = '';
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  selectedProjectId: any;

  constructor(private service: ProjectService, private authService: AuthenticationService) {
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Project has been deleted.',
            'success'
          );
          this.findAll();
        });
      }
    });
  }

  openNewProjectModal() {
    this.showModal = true;
  }

  closeNewProjectModal() {
    this.showModal = false;
    this.findAll();
  }

  openUpdateProjectModal(id: any) {
    this.selectedProjectId = id;
    this.showUpdateModal = true;
  }

  closeUpdateProjectModal() {
    this.showUpdateModal = false;
    this.selectedProjectId = null;
    this.findAll();
  }

}

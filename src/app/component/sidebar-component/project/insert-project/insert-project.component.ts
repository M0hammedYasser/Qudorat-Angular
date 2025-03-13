import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ClientService} from "../../../../service/client/client.service";
import {Client} from "../../../../model/client";
import {Project} from "../../../../model/project";
import {ProjectService} from "../../../../service/project/project.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-insert-project',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
  ],
  templateUrl: './insert-project.component.html',
  styleUrl: './insert-project.component.css'
})
export class InsertProjectComponent implements OnInit{

  project : Project = {client : {} as Client} as Project;
  clients : Client[] = [];

  constructor(private service : ProjectService,private clientService:ClientService , private router : Router) {
  }

  ngOnInit() {
    this.clientService.findAll().subscribe(res=> this.clients = res);
  }

  insert() {
    this.service.insert(this.project).subscribe({
      next: () => {
        this.router.navigateByUrl('/projects');
      },
      error: (err) => {
        this.router.navigateByUrl('/projects');
      }
    });
  }


}

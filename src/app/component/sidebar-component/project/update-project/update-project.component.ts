import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Project} from "../../../../model/project";
import {Client} from "../../../../model/client";
import {ProjectService} from "../../../../service/project/project.service";
import {ClientService} from "../../../../service/client/client.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-project',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css'
})
export class UpdateProjectComponent implements OnInit {

  project : Project = {client : {} as Client} as Project;
  clients : Client[] = [];
  id : number = 0 ;

  constructor(private service : ProjectService,private clientService:ClientService , private router : Router , private route : ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res=> this.project = res);
    this.clientService.findAll().subscribe(res=> this.clients = res);
  }

  insert() {
    this.service.update(this.project , this.id).subscribe(()=>
      this.router.navigateByUrl('/projects')
    )
  }

}

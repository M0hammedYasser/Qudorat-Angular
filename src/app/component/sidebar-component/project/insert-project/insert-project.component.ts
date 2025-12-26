import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { ClientService } from "../../../../service/client/client.service";
import { Client } from "../../../../model/client";
import { Project } from "../../../../model/project";
import { ProjectService } from "../../../../service/project/project.service";
import Swal from 'sweetalert2';

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
export class InsertProjectComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  project: Project = { client: {} as Client } as Project;
  clients: Client[] = [];

  constructor(private service: ProjectService, private clientService: ClientService) {
  }

  ngOnInit() {
    this.clientService.findAll().subscribe(res => this.clients = res);
  }

  insert() {
    this.service.insert(this.project).subscribe({
      next: () => {
        Swal.fire({
          title: "Success",
          text: "Project added successfully",
          icon: "success"
        });
        this.close.emit();
      },
      error: (err) => {
        this.close.emit();
      }
    });
  }


}

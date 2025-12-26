import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { ClientService } from "../../../../service/client/client.service";
import { Client } from "../../../../model/client";
import { Project } from "../../../../model/project";
import { ProjectService } from "../../../../service/project/project.service";

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
        this.close.emit();
      },
      error: (err) => {
        // Handle error if needed, for now just close or keep open? 
        // Original code navigated away even on error? No, original had error: this.router.navigate...
        // Let's assume we close on success. On error we probably shouldn't close but user UX might differ.
        // For now, let's close to match previous behavior of leaving the page.
        this.close.emit();
      }
    });
  }


}

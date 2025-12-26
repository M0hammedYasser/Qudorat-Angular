import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SearchComponent } from "../../../shared/search/search.component";
import { SearchPipe } from "../../../../pipe/search.pipe";
import { Client } from "../../../../model/client";
import { ClientService } from "../../../../service/client/client.service";
import { AuthenticationService } from "../../../../service/authentication/authentication.service";
import { InsertClientComponent } from "../insert-client/insert-client.component";
import { UpdateClientComponent } from "../update-client/update-client.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    RouterLink,
    SearchComponent,
    SearchPipe,
    NgIf,
    InsertClientComponent,
    UpdateClientComponent
  ],
  templateUrl: './show-client.component.html',
  styleUrl: './show-client.component.css'
})
export class ShowClientComponent implements OnInit {


  clients: Client[] = [];
  searchText: string = '';
  role: string = '';
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  selectedClientId: any;

  constructor(private service: ClientService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.findAll();
    this.role = this.authService.getAuthority();
  }

  findAll() {
    this.service.findAll().subscribe(res => this.clients = res);
  }

  onSearchTextEntered(searchValue: any) {
    this.searchText = searchValue
  }

  delete(id: number) {
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
            'Client has been deleted.',
            'success'
          );
          this.findAll();
        });
      }
    });
  }

  openNewClientModal() {
    this.showModal = true;
  }

  closeNewClientModal() {
    this.showModal = false;
    this.findAll();
  }

  openUpdateClientModal(id: any) {
    this.selectedClientId = id;
    this.showUpdateModal = true;
  }

  closeUpdateClientModal() {
    this.showUpdateModal = false;
    this.selectedClientId = null;
    this.findAll();
  }

}

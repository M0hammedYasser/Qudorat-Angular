import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SearchComponent} from "../../../shared/search/search.component";
import {SearchPipe} from "../../../../pipe/search.pipe";
import {Client} from "../../../../model/client";
import {ClientService} from "../../../../service/client/client.service";
import {AuthenticationService} from "../../../../service/authentication/authentication.service";

@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    RouterLink,
    SearchComponent,
    SearchPipe,
    NgIf
  ],
  templateUrl: './show-client.component.html',
  styleUrl: './show-client.component.css'
})
export class ShowClientComponent implements OnInit {


  clients: Client[] = [];
  searchText: string = '';
  role: string = '';

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
    this.service.delete(id).subscribe();
    this.findAll();
    window.location.reload();
  }

}

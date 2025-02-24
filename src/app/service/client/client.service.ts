import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Client} from "../../model/client";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Client[]>(`${environment.url}client`)
  }

  findById(id: number) {
    return this.http.get<Client>(`${environment.url}client/${id}`)
  }

  count(){
    return this.http.get<number>(`${environment.url}client/count`)
  }

  insert(client: Client) {
    return this.http.post<Client>(`${environment.url}client`, client)
  }

  update(client: Client , id: number) {
    return this.http.put<Client>(`${environment.url}client/${id}`, client)
  }

  delete(id: number) {
    return this.http.delete<Client>(`${environment.url}client/${id}`)
  }
}

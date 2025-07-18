import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<any>(`${environment.url}notification`);
  }
}

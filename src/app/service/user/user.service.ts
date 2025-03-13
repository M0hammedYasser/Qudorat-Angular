import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../../model/user";
import {Authority} from "../../model/authority";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<User[]>(`${environment.url}users`);
  }

  findAllAuthority(){
    return this.http.get<Authority[]>(`${environment.url}authority`);
  }

  findById(id: number) {
    return this.http.get<User>(`${environment.url}users/${id}`);
  }

  insert(user: User) {
    return this.http.post<User>(`${environment.url}users`, user);
  }

  active(id: number) {
    return this.http.post(`${environment.url}users/${id}` , null);
  }

  update(user: User , id: number) {
    return this.http.put<User>(`${environment.url}users/${id}`, user);
  }

  updateUsername(id:number ,name: string , username: string) {
    return this.http.put<User>(`${environment.url}users/update/${id}/${name}/${username}`, null);
  }

  updatePassword(id:number ,password: string) {
    return this.http.put<User>(`${environment.url}users/update/password/${id}/${password}`, null);
  }

  upload(id: number) {
    return this.http.post<User>(`${environment.url}image/upload?pathType=img&userId=${id}` , null);
  }


}

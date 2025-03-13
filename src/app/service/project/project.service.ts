import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Client} from "../../model/client";
import {environment} from "../../../environments/environment";
import {Project} from "../../model/project";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Project[]>(`${environment.url}project`)
  }

  findById(id: string) {
    return this.http.get<Project>(`${environment.url}project/${id}`)
  }

  count(){
    return this.http.get<number>(`${environment.url}project/count`)
  }

  insert(project: Project) {
    return this.http.post<Project>(`${environment.url}project`, project)
  }

  update(project: Project , id: string) {
    return this.http.put<Project>(`${environment.url}project/${id}`, project)
  }

  delete(id: string) {
    return this.http.delete<Project>(`${environment.url}project/${id}`)
  }
}

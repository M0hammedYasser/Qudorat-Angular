import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Test} from "../../model/test";
import {environment} from "../../../environments/environment";
import {Project} from "../../model/project";
import {TestManager} from "../../model/test-manager";

@Injectable({
  providedIn: 'root'
})
export class TestManagerService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<TestManager[]>(`${environment.url}test-manager`);
  }

  findById(id: number) {
    return this.http.get<TestManager>(`${environment.url}test-manager/${id}`);
  }

  insert(testManager: TestManager) {
    return this.http.post<TestManager>(`${environment.url}test-manager`, testManager);
  }

  update(testManager: TestManager , id: number) {
    return this.http.put<TestManager>(`${environment.url}test-manager/${id}`, testManager);
  }

  delete(id: number) {
    return this.http.delete<TestManager>(`${environment.url}test-manager/${id}`);
  }
}

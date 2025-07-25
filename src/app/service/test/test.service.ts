import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Project} from "../../model/project";
import {environment} from "../../../environments/environment";
import {Test} from "../../model/test";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<Test[]>(`${environment.url}test`);
  }

  findById(id: number) {
    return this.http.get<Test>(`${environment.url}test/${id}`);
  }

  findOne(id: string) {
    return this.http.get<Test>(`${environment.url}test/${id}`);
  }

  count() {
    return this.http.get<number>(`${environment.url}test/count`);
  }

  insert(test: Test) {
    return this.http.post<Project>(`${environment.url}test`, test);
  }

  update(test: Test, id: number) {
    return this.http.put<Project>(`${environment.url}test/${id}`, test);
  }

  delete(id: number) {
    return this.http.delete<Project>(`${environment.url}test/${id}`);
  }

  changeActive(id: number , name:string) {
    return this.http.post(`${environment.url}test/change-active?id=${id}&name=${name}`, null);
  }

  adopt(id: number, name: string) {
    return this.http.put(`${environment.url}test/adopt?id=${id}&name=${name}`, null);
  }

  approve(id: number, name: string) {
  return this.http.put(`${environment.url}test/approve?id=${id}&name=${name}` , null);
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Test} from "../../model/test";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  findTestDashboard() {
    return this.http.get<Test[]>(`${environment.url}dashboard/tests`);
  }

  totalCost(){
    return this.http.get<number>(`${environment.url}dashboard/total-cost`);
  }

  totalSamples(){
    return this.http.get<number>(`${environment.url}dashboard/total-samples`);
  }

  completeSample(){
    return this.http.get<number>(`${environment.url}dashboard/complete-samples`);
  }

  processSample(){
    return this.http.get<number>(`${environment.url}dashboard/processing-samples`);
  }

  notCompleteSample() {
    return this.http.get<number>(`${environment.url}dashboard/not-complete-samples`);
  }
}

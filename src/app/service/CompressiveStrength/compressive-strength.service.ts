import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Client} from "../../model/client";
import {environment} from "../../../environments/environment";
import {CompressiveStrength} from "../../model/compressive-strength";

@Injectable({
  providedIn: 'root'
})
export class CompressiveStrengthService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<CompressiveStrength[]>(`${environment.url}compressive-strength`)
  }

  findById(id: number) {
    return this.http.get<CompressiveStrength>(`${environment.url}compressive-strength/${id}`)
  }

  insert(compressiveStrength: CompressiveStrength) {
    return this.http.post<CompressiveStrength>(`${environment.url}compressive-strength`, compressiveStrength)
  }

  update(compressiveStrength: CompressiveStrength , id: number) {
    return this.http.put<CompressiveStrength>(`${environment.url}compressive-strength/${id}`, compressiveStrength)
  }

  delete(id: number) {
    return this.http.delete<CompressiveStrength>(`${environment.url}compressive-strength/${id}`)
  }
}

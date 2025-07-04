import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MoistureDensityRelationship} from "../../model/moisture-density-relationship";

@Injectable({
  providedIn: 'root'
})
export class MoistureDensityRelationshipService {

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<MoistureDensityRelationship[]>(`${environment.url}moisture-density-relationship`)
  }

  findById(id: number) {
    return this.http.get<MoistureDensityRelationship>(`${environment.url}moisture-density-relationship/${id}`)
  }


  insert(moistureDensityRelationship: MoistureDensityRelationship) {
    return this.http.post<MoistureDensityRelationship>(`${environment.url}moisture-density-relationship`, moistureDensityRelationship)
  }

  update(moistureDensityRelationship: MoistureDensityRelationship, id: number) {
    return this.http.put<MoistureDensityRelationship>(`${environment.url}moisture-density-relationship/${id}`, moistureDensityRelationship)
  }

  delete(id: number) {
    return this.http.delete<MoistureDensityRelationship>(`${environment.url}moisture-density-relationship/${id}`)
  }
}

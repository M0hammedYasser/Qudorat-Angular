import {Injectable} from '@angular/core';
import {Asphalt} from "../../model/asphalt";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AtterbergLimits} from "../../model/atterberg-limits";

@Injectable({
  providedIn: 'root'
})
export class AtterbergLimitsService {

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<AtterbergLimits[]>(`${environment.url}atterberg`);
  }

  findById(id: number) {
    return this.http.get<AtterbergLimits>(`${environment.url}atterberg/${id}`);
  }

  insert(atterbergLimits: AtterbergLimits) {
    return this.http.post<Asphalt>(`${environment.url}atterberg`, atterbergLimits);
  }

  update(atterbergLimits: AtterbergLimits, id: number) {
    return this.http.put<AtterbergLimits>(`${environment.url}atterberg/${id}`, atterbergLimits);
  }

  delete(id: number) {
    return this.http.delete<AtterbergLimits>(`${environment.url}atterberg/${id}`);
  }
}

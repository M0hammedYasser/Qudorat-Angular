import { Injectable } from '@angular/core';
import {AuthenticationRequest} from "../../model/authentication-request";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.isLoggedIn.next(true);
    }
  }

  signIn(request: AuthenticationRequest) {
    return this.http.post<any>(`${environment.url}login`, request)
  }

  login(token: string) {
    sessionStorage.setItem('token', token);
    this.isLoggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.isLoggedIn.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  getToken() :string{
    return sessionStorage.getItem("token") || "";
  }

  decodeToken() {
    return jwtDecode(this.getToken());
  }


  getUserName() {
    return this.decodeToken().sub || '';
  }

  getName() {
    return this.decodeToken().name || '';
  }

  getUserId (){
    return this.decodeToken().id || '';
  }

  getAuthority(){
    return this.decodeToken().authority || '';
  }

  getImagesPath(){
    return this.decodeToken().imagePath || '';
  }

}

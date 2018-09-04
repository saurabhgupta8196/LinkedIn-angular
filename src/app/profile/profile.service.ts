import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  public profileURL = 'http://10.102.55.85:8080/rest-api/users/get/';

  public getUserDetails(userName):Observable<any[]>{
    return this.http.get<any[]>(this.profileURL+userName);
  }

}

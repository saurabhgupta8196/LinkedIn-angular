import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSearchResults(query: string): Observable<any[]> {
    return this.http.patch<any[]>("http://localhost:8080/rest-api/users/search/people", {
      "query": query
    });
  }

  getProfile(userName: string): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/rest-api/users/get/"+userName);
  }
}
import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  query: string
  result = [];
  search() {
    this.searchService.getSearchResults(this.query).subscribe(d => this.result = d);
  }

  getProfile(i){
    this.searchService.getProfile(this.result[i].userName).subscribe(d => console.log(d));
  }
}
import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
//import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private profile:ProfileService, private auth:AuthService) { }

  public userData = [];

  ngOnInit() {
    this.profile.getUserDetails(this.auth.getUser()).subscribe(data=>this.userData = data);
  }

}

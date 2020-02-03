import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
  './app.component.scss',
  ]
})
export class AppComponent {
  public title = 'MP-Music';
  public user: User;
  public identity;
  public token;

  constructor(){
  	this.user = new User('','','','','','ROLE_USER','');
  }
}

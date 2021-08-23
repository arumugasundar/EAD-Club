import { Component, OnInit } from '@angular/core';
import {Service} from "../data.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService:Service ) { }
  title = "SPORTIFY";
  ngOnInit(): void {
  }

}

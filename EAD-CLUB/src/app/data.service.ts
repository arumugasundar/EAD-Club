import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Detail } from './data.model';
import { Router } from '@angular/router';


@Injectable({providedIn:'root'})
export class Service{

  constructor(private http: HttpClient,private _router:Router){}

  loggedIn(){
    return !!localStorage.getItem('token')
  }

  addDetails(name: string,email: string,password: string){
    const record: Detail = { id: "", name: name, email: email, password: password};
    return this.http.post<{message:string,id:string,token:string}>('http://localhost:3000/api/data/signup',record)
  }
  getToken()
  {
    return localStorage.getItem('token')
  }

  login( user : any ){
     return this.http.post<{token: string}>('http://localhost:3000/api/data/login',user);
  }
  logoutUser(){
    localStorage.removeItem('token')
    localStorage.removeItem('mail')
    this._router.navigate(['/login']).then(() => {
      console.log("Navigated to Login Page!")
    });
  }
}

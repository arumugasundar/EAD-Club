import { Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from "@angular/common/http";
import { Router } from '@angular/router';
import {FormControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient,private router:Router) { }

  getProfile(email: any){
    return this.http.get<
      {
        id: number,
        name: string,
        email: string,
        image: any,
        imageType: string,
        dob: string,
        gender: string,
        country: string,
        interests: string,
        subscribe: boolean
      }>('http://localhost:3000/api/data/getProfile/' + email);
  }

  updateProfile(name: string,email: string,dob: Date,image: File,gender: string,country: string,interests: string,subscribe: string) {
    console.log('In services',image);
    const record = new FormData();
    record.append('name',name);
    record.append('email',email);
    record.append('dob',dob.toString());
    if(image!=null)
      record.append('image',image,name);
    record.append('gender',gender);
    record.append('country',country);
    record.append('interests',interests);
    record.append('subscribe',subscribe);
    return this.http.post('http://localhost:3000/api/data/setProfile', record);
  }

  deleteProfile(email: any){
    return this.http.get('http://localhost:3000/api/data/deleteAccount/' + email);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient , HttpErrorResponse} from "@angular/common/http";
import {Observable , throwError} from "rxjs";
import { Iarticle } from "./article";
import { catchError } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor( private http : HttpClient ) { }
  private _recent = "http://localhost:3000/api/news/recent"

  errorHandler( error : HttpErrorResponse )
  {
    return throwError( error.message || "Server Error")
  }
  getRecent():Observable<Iarticle[]>{
    console.log("Recent articles")
    return this.http.get<any>( this._recent )
      .pipe( catchError( this.errorHandler ));
  }
}

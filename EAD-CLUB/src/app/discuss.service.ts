import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable , throwError} from "rxjs";
import { catchError } from "rxjs/operators";
import {Iarticle} from "./article";
@Injectable({
  providedIn: 'root'
})
export class DiscussService {

  constructor( private http : HttpClient ) { }
  private _discussAdd = "http://localhost:3000/api/discuss/discuss"
  private _discussedFetch = "http://localhost:3000/api/discuss/discussed"
  private _upvoteInc = "http://localhost:3000/api/discuss/upvoteIncrement"
  private _downvoteInc = "http://localhost:3000/api/discuss/downvoteIncrement"
  errorHandler( error : HttpErrorResponse )
  {
    return throwError( error.message || "Server Error")
  }
  getDiscussed( obj1 : any ):Observable<any>{
    return this.http.post<any>( this._discussedFetch ,  obj1 )
     .pipe( catchError( this.errorHandler ));
  }
  putDiscussed( obj : any ):Observable<any>  {
    console.log("Service article One : " + obj )
    return this.http.post<any>( this._discussAdd , obj )
      .pipe( catchError( this.errorHandler ));
  }
  upvoteIncrement( obj : any ):Observable<any>  {
    console.log("Service article One : " + obj )
    return this.http.post<any>( this._upvoteInc , obj )
      .pipe( catchError( this.errorHandler ));
  }
  downvoteIncrement( obj : any ):Observable<any>  {
    console.log("Service article One : " + obj )
    return this.http.post<any>( this._downvoteInc , obj )
      .pipe( catchError( this.errorHandler ));
  }
}

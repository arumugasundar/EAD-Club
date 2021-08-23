import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable , throwError} from "rxjs";
import { catchError } from "rxjs/operators";
import {Iarticle} from "./article";
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor( private http : HttpClient ) { }
  private _articleUrl = "http://localhost:3000/api/articles/articles"
  private _articleOneUrl = "http://localhost:3000/api/articles/articlesOne"
  errorHandler( error : HttpErrorResponse )
  {
    return throwError( error.message || "Server Error")
  }
  getArticles(){
    console.log("Service for articles")
    return this.http.get<any>( this._articleUrl )
  }
  getOneArticle( obj : any ):Observable<any>  {
    console.log("Service article One : " + obj )

    return this.http.post<any>( this._articleOneUrl , obj )
      .pipe( catchError( this.errorHandler ));
  }
}

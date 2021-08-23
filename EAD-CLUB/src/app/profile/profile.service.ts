import { Injectable} from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { ProfileDetail } from "./profile.model"

const apiUrl = 'http://localhost:3000/profile'
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): any{
    if(error.error instanceof ErrorEvent)
      console.error('An error occurred :', error.error.message);
    else
      console.error(`Backend returned code ${error.status},` + `body was: ${error.error}`);
    return throwError('Something bad happened; please try again later.');
  }


}

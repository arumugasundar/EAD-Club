import { Injectable , Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import {Service} from "./data.service";
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(  private _injector : Injector ) { }

  intercept(req : any, next : any ) {
    let authService = this._injector.get( Service )
    let tokenizedReq = req.clone({
      setHeaders : {
        Authorization : `Bearer ${ authService.getToken() }`
      }
    })
    return next.handle( tokenizedReq )
  }
}

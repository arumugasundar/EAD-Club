import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {HttpErrorResponse } from '@angular/common/http'
import { NewsService} from "../news.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(private _service: NewsService, private _router: Router) {
  }
  public contents : any = [];
  public recent = [] as any
  public featured : any = []
  public usual : any = []
  public test : boolean = false;
  ngOnInit(): void {

    /* We could use this if any veriification is needed when verifying only when users logged in could use news*/
    this._service.getRecent().subscribe((res: any) => {
        this.recent = res[0];
        this.featured = res[1];
        this.usual = res[2];
        this.contents = res;
        console.log(" Recent in Component : " , this.recent , res )
      this.test = true;
      } ,
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this._router.navigate(['/login'] )
          }
        }
      })
  }
  goToArticle( type : any ){
      this._router.navigate(['news/articles',type.aid] )
  }

  initr(){
    /* call for recent news */
    this._service.getRecent().subscribe((res: any) => {
        this.recent = res[0];
        //this.isDataAvailable = false
        console.log(" Recent in Component : " , this.recent , res )
        //return true
        /* call for featured news */

      } ,
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this._router.navigate(['/login'] )
          }
        }
      })
    /* call for recent news Ends*/
    /*this._service.getFeatured().subscribe(
      (res: any)=>{this.featured = res
        /* call for usual news
        this._service.getUsual().subscribe(
          (res: any)=>{
            this.usual = res
            this.isDataAvailable = true;
          },
          (err : any) => {
            if( err instanceof HttpErrorResponse ){
              if( err.status === 401 )
              {
                this._router.navigate(['/login'] )
              }
            }
          })
        /* call for usual news ends
      },
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this._router.navigate(['/login'] )
          }
        }
      })
    /* call for featured news ends */
  }

}

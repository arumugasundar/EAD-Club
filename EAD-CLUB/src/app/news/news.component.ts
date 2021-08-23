import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {HttpErrorResponse } from '@angular/common/http'
import { NewsService} from "../news.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(private _service: NewsService, private _router: Router,public sanitizer: DomSanitizer) {
  }
  public contents : any = [];
  public recent = [] as any
  public featured : any = []
  public usual : any = []
  public test : boolean = false;
  public imageUrl = [] as any;
  ngOnInit(): void {

    /* We could use this if any verification is needed when
    verifying only when users logged in could use news*/
    this._service.getRecent().subscribe((res: any) => {
        this.recent = res[0];
        this.featured = res[1];
        this.usual = res[2];
        this.contents = res;
        console.log(" Recent in Component : " , this.recent , res )
        this.test = true;

        if(this.contents){
          /*for(let i=0;i<this.contents.length;i++){
            let TYPED_ARRAY = new Uint8Array(this.contents[i][0].image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');
            let base64String = btoa(STRING_CHAR);
            this.imageUrl.push(this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String))
          }*/

          let TYPED_ARRAY = new Uint8Array(this.featured[0].image.data);
          let STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR);
          this.imageUrl.push(this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String))

          TYPED_ARRAY = new Uint8Array(this.usual[0].image.data);
          STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
          }, '');
          base64String = btoa(STRING_CHAR);
          this.imageUrl.push(this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String))
        }
      } ,
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this._router.navigate(['/login'] )
          }
        }
      });
  }
  goToArticle( type : any ){
      this._router.navigate(['news/articles',type.aid] )
  }

  /*initr(){
    // call for recent news
    this._service.getRecent().subscribe((res: any) => {
        this.recent = res[0];
        //this.isDataAvailable = false
        console.log(" Recent in Component : " , this.recent , res )
        //return true
        // call for featured news

      } ,
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this._router.navigate(['/login'] )
          }
        }
      })*/
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
  //}

}

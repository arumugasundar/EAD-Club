import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {HttpErrorResponse } from '@angular/common/http'
import { ArticleService } from "../article.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  constructor(private _eventsService : ArticleService , private _router : Router, public sanitizer: DomSanitizer) { }
  specialEvents : any = []
  public imageUrl = [] as any;
  ngOnInit(): void {
    this._eventsService.getArticles().subscribe(
      (res: any)=>{
        this.specialEvents = res
        for(let i=0;i<res.length;i++){
          console.log("Hey !",res[i].image.data);
          let TYPED_ARRAY = new Uint8Array(res[i].image.data);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR);
          this.imageUrl.push(this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String))
        }
    } ,
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this._router.navigate(['/home'] )
          }
        }
      }
    )
    console.log(" The fetched are "+this.specialEvents)
  }
  onSelect( event : any ){
    this._router.navigate(['news/articles',event.aid])
  }
}

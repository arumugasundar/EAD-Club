import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap , Router} from "@angular/router";
import {ArticleService} from "../article.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DiscussService} from "../discuss.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  constructor( private route : ActivatedRoute
               , private router:Router
               , private _article : ArticleService
               , private _discuss : DiscussService
               , public sanitizer: DomSanitizer) { }
  public article_id : any;
  public obj : any = {};
  public article : any = [];
  public author : any = [];
  public loaded : boolean = false
  public discuss : any = []
  public discussFlag : boolean = false
  public formComment : any;
  public ArticleUrl = [] as any;
  public AuthorUrl = [] as any;
  public singleImageUrl: any;
  specialEvents : any = []
  ngOnInit(): void {
    this.route.paramMap.subscribe( (params : ParamMap) =>{
      this.article_id = parseInt( <string>params.get('id'))
      this.getOneArticle( this.article_id )
    })
    this._article.getArticles().subscribe(
      (res: any)=>{
        if(res.length>3)
          this.specialEvents = res.slice(0,4);
        else
          this.specialEvents = res;
        console.log("Hey! In component",res);
      },
      (err : any) => {
        if( err instanceof HttpErrorResponse ){
          if( err.status === 401 )
          {
            this.router.navigate(['/home'] )
          }
        }
      }
    )

  }
  addComment(   ){
    let obj = {
      aid : this.article_id,
      comment : this.formComment
    }
    console.log("Values in Front end :" + obj.aid + obj.comment )
    this._discuss.putDiscussed( obj ).subscribe(
      (res: any) => {
        this.discuss = res
        console.log("The comments are : " + res[0].values )
        this.discussFlag = true
      },
      (err: any) => {
        console.log("Could not fetch One Article " + err.error )
        this.router.navigate(['notfound'])
      }
    )
  }
  /* upvote and Downvote begins */
  upvoteIncrement( ob : any ){
      let obj = {
        aid : ob.aid,
        cid : ob.values.cid
      }
      //console.log("Values in Front end :" + obj.aid + obj.cid )
      this._discuss.upvoteIncrement( obj ).subscribe(
        (res: any) => {
          this.discussFlag = true
          this.getDiscussed()
        },
        (err: any) => {
          console.log("Could not fetch One Article " + err.error )
          this.router.navigate(['notfound'])
        }
      )
  }
  downvoteIncrement( ob : any ){
    let obj = {
      aid : ob.aid,
      cid : ob.values.cid
    }
    //console.log("Values in Front end :" + obj.aid + obj.cid )
    this._discuss.downvoteIncrement( obj ).subscribe(
      (res: any) => {
        this.discuss = res
      //  console.log("The comments are : " + res[0].values )
        this.discussFlag = true
        this.getDiscussed()
      },
      (err: any) => {
        console.log("Could not fetch One Article " + err.error )
        this.router.navigate(['notfound'])
      }
    )
  }
  /* upvote and Downvote ends */
  getDiscussed(  ){
    let obj1 = {
      aid : this.article_id
    }
    this._discuss.getDiscussed( obj1 ).subscribe(
      (res: any) => {
        this.discuss = res
        console.log("The comments are : " + res[0].values )
        this.discussFlag = true
      },
      (err: any) => {
        console.log("Could not fetch One Article " + err.error )
        this.router.navigate(['notfound'])
      }
    )
  }
  getOneArticle( id : Number ){
    let obj1 = {
      aid : id
    }
    this._article.getOneArticle(  obj1  ).subscribe(
      (res: any) => {
          this.article = res[0]
          this.author = res[1]
          //console.log("The article and auth are : " + res + res[0] + res[1] + res[0][0] );

        let TYPED_ARRAY = new Uint8Array(this.article[0].image.data);
        let STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        this.ArticleUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);

        //console.log("In component ",this.author);
        TYPED_ARRAY = new Uint8Array(this.author[0].image.data);
        STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
        }, '');
        base64String = btoa(STRING_CHAR);
        this.AuthorUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);

        this.loaded = true;
      },
      (err: any) => {
        console.log("Could not fetch One Article " + err.error )
        this.router.navigate(['notfound'])
      }
    )
  }
  goToTag( event : any ){
    this.router.navigate(['news/articles',event.aid])
  }
  goPrevious(){
    let previousId = this.article_id - 1
    if( previousId >= 0 ){
      this.discussFlag = false
      this.loaded = false;

      this.router.navigate(['../' , previousId ],{relativeTo:this.route})
    }
  }
  goNext(){
    let nextId = this.article_id + 1
    this.discussFlag = false
    this.loaded = false;
    this.router.navigate(['../' , nextId ],{relativeTo:this.route})
  }
}

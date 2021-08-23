import { Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CreateArticleService{
  constructor(private http: HttpClient) { }

  createNewArticle(title: string,tag: string,description: string,image: any,quote: string,auid: any){
    const record = new FormData();
    record.append('title',title);
    record.append('tag',tag);
    record.append('description',description);
    record.append('image',image,title);
    record.append('quote',quote);
    record.append('auid',auid);
    console.log("In Service ",record);
    return this.http.post('http://localhost:3000/api/articles/articlesInsert', record);
  }
}

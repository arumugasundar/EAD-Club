import { Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CreateAuthorService{
  constructor(private http: HttpClient) { }

  createNewAuthor(name: any,description: any,image: any){
    const record = new FormData();
    record.append('name',name);
    record.append('description',description);
    record.append('image',image,name);
    console.log("In Service ",record,name,description,image);
    return this.http.post('http://localhost:3000/api/admin/createAuthor', record);
  }
}

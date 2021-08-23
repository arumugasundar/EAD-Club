import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SafeUrl} from "@angular/platform-browser";
import {CreateArticleService} from "../create-article/create-article.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

  form: FormGroup;
  imageUrl : SafeUrl | undefined;

  constructor(public service:CreateArticleService,private _snackBar: MatSnackBar,private _router : Router) {
    this.form = new FormGroup({
      'title': new FormControl(null,{validators: [Validators.required]}),
      'tag': new FormControl(null,{validators: [Validators.required]}),
      'author': new FormControl(null,{validators: [Validators.required]}),
      'description': new FormControl(null,{validators: [Validators.required]}),
      'image': new FormControl(null,{validators: [Validators.required]}),
      'quote': new FormControl(null,{validators: [Validators.required]}),
    });
  }

  onImageChange(event: Event){
    let img: FileList | null;
    img = (event.target as HTMLInputElement).files;
    if (img) {
      this.form?.get('image')?.setValue(img[0],{emitModelToViewChange: false});
      this.form.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () =>{
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(img[0]);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  CreateArticle(){
    if(this.form != null){
      if(this.form.invalid){
        this.openSnackBar("Invalid Credentials!!!", "Ok");
      }
      else{
        console.log("In component ",this.form.value , this.form.value.author );
        this.service.createNewArticle(
          this.form.value.title,
          this.form.value.tag,
          this.form.value.description,
          this.form.value.image,
          this.form.value.quote,
          this.form.value.author
        ).subscribe( result => {
          this.openSnackBar(result as string, "Ok");
          this._router.navigate(['/admin']).then(() => { console.log("navigated to admin page")})
        });
      }
    }
  }

  ngOnInit(): void {
  }

}

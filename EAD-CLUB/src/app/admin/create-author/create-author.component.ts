import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import { CreateAuthorService } from "./create-author.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {SafeUrl} from "@angular/platform-browser";
import {Router} from '@angular/router'

@Component({
  selector: 'app-create-author',
  templateUrl: './create-author.component.html',
  styleUrls: ['./create-author.component.css']
})
export class CreateAuthorComponent implements OnInit {

  form: FormGroup;
  imageUrl : SafeUrl | undefined;

  constructor(public service:CreateAuthorService,private _snackBar: MatSnackBar,private _router : Router) {
    this.form = new FormGroup({
      'name': new FormControl(null,{validators: [Validators.required]}),
      'description': new FormControl(null,{validators: [Validators.required]}),
      'image': new FormControl(null,{validators: [Validators.required]})
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

  CreateAuthor(){
    if(this.form != null){
      if(this.form.invalid){
        this.openSnackBar("Invalid Credentials!!!", "Ok");
      }
      else{
        console.log("In component ",this.form.value);
        this.service.createNewAuthor(
          this.form.value.name,
          this.form.value.description,
          this.form.value.image
        ).subscribe(result => {
          this.openSnackBar(result as string, "Ok");
          this._router.navigate(['/admin']).then(() => { console.log("navigated to admin page")})
        });
      }
    }
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl , Validators } from "@angular/forms";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileFormGroup : FormGroup;
  imageUrl : string | undefined;

  constructor() {
    console.log(localStorage.getItem('email'))
    this.profileFormGroup = new FormGroup({
      'name': new FormControl(null,{validators: [Validators.required]}),
      'email': new FormControl(null,{}),
      'image': new FormControl(null,{asyncValidators: [mimeType]}),
      'dob': new FormControl(null,{}),
      'gender': new FormControl(null,{}),
      'country': new FormControl(null,{}),
      'interests': new FormControl(null,{}),
      'subscribe': new FormControl(null,{})
    })
  }

  ngOnInit(): void {

  }

  onImageChange(event: Event) {
    let img: FileList | null;
    img = (event.target as HTMLInputElement).files;
    if (img) {
      this.profileFormGroup?.get('image')?.setValue(img[0],{emitModelToViewChange: false});
      this.profileFormGroup.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () =>{
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(img[0]);
    }
  }
}

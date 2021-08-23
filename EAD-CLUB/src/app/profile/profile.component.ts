import { Component, OnInit, OnDestroy,Inject } from '@angular/core';
import { FormGroup, FormControl , Validators } from "@angular/forms";
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import { mimeType } from "./mime-type.validator";

import { ProfileDetail } from "./profile.model"
import { ProfileService } from "./profile.service"
import {Router} from "@angular/router";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileFormGroup: FormGroup;
  imageUrl : SafeUrl | undefined;
  detail: ProfileDetail | undefined;
  myControl = new FormControl();
  options: string[] = ['India', 'China', 'America', 'Russia'];
  filteredOptions: Observable<string[]> | undefined;

  constructor(public service: ProfileService, private _snackBar: MatSnackBar,public sanitizer: DomSanitizer,private _router : Router) {
    this.profileFormGroup = new FormGroup({
      'name': new FormControl(null,{validators: [Validators.required]}),
      'email': new FormControl(null,{}),
      'image': new FormControl(null,{/*asyncValidators: [mimeType]*/}),
      'dob': new FormControl(null,{}),
      'gender': new FormControl(null,{}),
      'country': new FormControl(null,{}),
      'interests': new FormControl(null,{}),
      'subscribe': new FormControl(null,{})
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

  onSaveChanges(){
    if(this.profileFormGroup != null)
      if (this.profileFormGroup.invalid)
        this.openSnackBar("Invalid Credentials!!!", "Ok");
      else{
        console.log('In component',this.profileFormGroup.value.name, this.profileFormGroup.value.email);
        this.service.updateProfile(
          this.profileFormGroup.value.name,
          this.profileFormGroup.value.email,
          this.profileFormGroup.value.dob,
          this.profileFormGroup.value.image,
          this.profileFormGroup.value.gender,
          this.profileFormGroup.value.country,
          this.profileFormGroup.value.interests,
          this.profileFormGroup.value.subscribe
        ).subscribe(
          (response) => { this.openSnackBar(response.toString(),"ok") },
          (error) => { this.openSnackBar(error.toString(),"ok") }
        );
        this._router.navigate(['/profile']).then(() => {
          window.location.reload();
        });
      }
  }

  deleteAccount(): void{
      if(confirm("Are you sure to delete?")) {
        let email = localStorage.getItem('email');
        this.service.deleteProfile(email).subscribe(
          (response) => { this.openSnackBar(response.toString(),"ok") },
          (error) => { this.openSnackBar(error.toString(),"ok") }
        );
        this.openSnackBar("Account Deleted!!!", "Ok");
        this._router.navigate(['/signup']).then(() => {
          console.log("Navigated to Sign Up Page!")
        });
      }
  }

  ngOnInit(): void {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    let email = localStorage.getItem('email');
    this.service.getProfile(email).subscribe( profile => {
      this.detail = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
        imageType: profile.imageType,
        dob: profile.dob,
        gender: profile.gender,
        country: profile.country,
        interests: profile.interests,
        subscribe: profile.subscribe
      };
      if(this.detail.image){
        let TYPED_ARRAY = new Uint8Array(this.detail.image.data);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
      }
      this.profileFormGroup.patchValue({'name':this.detail.name});
      this.profileFormGroup.patchValue({'email':this.detail.email});
      this.profileFormGroup.patchValue({'dob':new Date(this.detail.dob)});
      this.profileFormGroup.patchValue({'gender':this.detail.gender});
      if(this.detail.country!=null)
        this.profileFormGroup.patchValue({'country':this.detail.country});
      if(this.detail.subscribe==true)
        this.profileFormGroup.patchValue({'subscribe':"true"});
      if(this.detail.subscribe==false)
        this.profileFormGroup.patchValue({'subscribe':"false"});
      this.profileFormGroup.patchValue({'interests':this.detail.interests});
    });
  }
}

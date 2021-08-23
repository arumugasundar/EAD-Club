import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Service } from '../data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router'
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpFormGroup: FormGroup | undefined; // Container to store actual form details
  hide = true; //used to toggle between hide and visible in password field

  constructor(private formBuilder: FormBuilder,public service: Service,private _snackBar: MatSnackBar,private _router : Router) {
    /* To Instantiate the form with controls */
    this.signUpFormGroup = this.formBuilder.group({
      name: ['', [Validators.required,Validators.pattern("[A-Za-z ]{3,32}")]],
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.pattern("(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$")]],
      confirmPassword: ['', [Validators.required,Validators.pattern("(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$")]]
    });
  }

  /* To get values to frontend for validation purpose */
  get f() {
    if(this.signUpFormGroup!=null)
      return this.signUpFormGroup.controls;
    return;
  }

  /* To display alert messages */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  /* To check the form validity and call backend to store data */
  onSaveDetails(){
    if(this.signUpFormGroup != null)
      if (this.signUpFormGroup.invalid)
        this.openSnackBar("Invalid Credentials!!!", "Ok");
      else if (this.signUpFormGroup.value.password != this.signUpFormGroup.value.confirmPassword)
        this.openSnackBar("Password Mismatched!!!", "Ok");
      else {
        let email = this.signUpFormGroup.value.email;
        this.service.addDetails(
          this.signUpFormGroup.value.name,
          this.signUpFormGroup.value.email,
          this.signUpFormGroup.value.password
        ).subscribe((response) => {
            localStorage.setItem('token', response.token)
            localStorage.setItem('email',email)
            this._router.navigate(['/news']).then(() => {
              console.log("Navigated to News Page!")
            });
          }, (err: any) => {
            if (err instanceof HttpErrorResponse)
              if (err.status === 401)
                this.openSnackBar("Email Id Already Registered!!!", "Ok");
          }
        );
      }
  }

  ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Service} from "../data.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router'
import {HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginUserData : any = {}

  constructor(public service: Service , private _router : Router, private _snackBar: MatSnackBar ) {

  }

  /* To display alert messages */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onLoggingIn(form : NgForm){
    if(form.invalid)
      return;
    else if(this.loginUserData.email=="admin@gmail.com" && this.loginUserData.password=="qwerty1Q"){
      this._router.navigate(['/admin']).then(() => { console.log("navigated to admin page")})
    }
    else{
      this.service.login(this.loginUserData)
        .subscribe(
          (res: any) => {
            console.log(res);
            localStorage.setItem( 'token' , res.token )
            localStorage.setItem( 'email' , this.loginUserData.email )
            this._router.navigate(['/news']).then(() => { console.log("navigated to news page")})
          },
          (err: any) => {
            if( err instanceof HttpErrorResponse )
              if( err.status === 401 )
                this.openSnackBar(err.error, "Ok");
          }
        );
    }
  }

  ngOnInit() { }
}

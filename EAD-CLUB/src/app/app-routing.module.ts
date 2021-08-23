import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {NewsComponent} from "./news/news.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component"
import { ArticleComponent } from './article/article.component';
import {AuthGuard} from "./auth.guard";
import {ProfileComponent} from "./profile/profile.component";
const routes: Routes = [
  { path:'', redirectTo:'/home',pathMatch:'full'},
  { path:'home', component: HomeComponent},
  { path:'about', component: AboutComponent},
  { path:'news', component: NewsComponent,canActivate:[AuthGuard]},
  { path:'login', component: LoginComponent},
  { path:'signup', component: SignupComponent},
  { path:'profile', component: ProfileComponent},
  { path: 'news/:id', component: ArticleComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

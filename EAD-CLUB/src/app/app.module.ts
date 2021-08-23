import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule , HTTP_INTERCEPTORS } from "@angular/common/http";

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatIconModule } from  '@angular/material/icon';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatListModule } from  '@angular/material/list';
import { MatButtonModule } from  '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from "@angular/material/radio";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatDialogModule} from '@angular/material/dialog';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NewsComponent } from './news/news.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ArticleComponent } from './article/article.component';
import {AuthGuard} from "./auth.guard";
import {TokenInterceptorService} from "./token-interceptor.service";
import {PartnersComponent} from "./partners/partners.component";
import { CarouselComponent } from './carousel/carousel.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { CreateAuthorComponent } from './admin/create-author/create-author.component';
import { CreateArticleComponent } from './admin/create-article/create-article.component';
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    NewsComponent,
    LoginComponent,
    SignupComponent,
    ArticleComponent,
    PartnersComponent,
    CarouselComponent,
    ActivitiesComponent,
    ProfileComponent,
    ArticleListComponent,
    AdminComponent,
    CreateAuthorComponent,
    CreateArticleComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatCardModule,
        MatMenuModule,
        FlexLayoutModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatDialogModule,
        MatSelectModule
    ],
  providers: [ AuthGuard ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass : TokenInterceptorService,
      multi : true
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

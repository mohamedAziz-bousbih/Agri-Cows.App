import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { CowsListComponent } from './components/cows/cows-list.component';
import { CowFormComponent } from './components/cows/cow-form.component';
import { CowDetailComponent } from './components/cows/cow-detail.component';
import { MilkListComponent } from './components/milk/milk-list.component';
import { MilkFormComponent } from './components/milk/milk-form.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CowsListComponent,
    CowFormComponent,
    CowDetailComponent,
    MilkListComponent,
    MilkFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

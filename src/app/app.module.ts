import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ContainerPrincipalComponent } from './commons/components/container-principal/container-principal.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './commons/interceptors/api.interceptor';
import { ModalComponent } from './commons/components/modal/modal.component';
import { SkeletonComponent } from './commons/components/skeleton/skeleton.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ContainerPrincipalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalComponent,
    SkeletonComponent

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

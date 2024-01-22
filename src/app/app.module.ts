import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LightboxModule } from 'ngx-lightbox';
import { LightgalleryModule } from 'lightgallery/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FeaturesComponent } from './features/features.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PricesComponent } from './prices/prices.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventListComponent } from './event-list/event-list.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UploadComponent } from './upload/upload.component';
import { ProgressBarPopupComponent } from './progress-bar-popup/progress-bar-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {  MatCardModule} from '@angular/material/card';
import { WhatsappShareButtonComponent } from './whatsapp-share-button/whatsapp-share-button.component';
import { UserEventRegisteredComponent } from './user-event-registered/user-event-registered.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ToastComponent } from './toast/toast.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    FeaturesComponent,
    PricesComponent,
    RegisterationComponent,
    CustomerReviewComponent,
    FooterComponent,
    DashboardComponent,
    EventListComponent,
    CreateEventComponent,
    UploadComponent,
    ProgressBarPopupComponent,
    WhatsappShareButtonComponent,
    UserEventRegisteredComponent,
    SideBarComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDialogModule,
    MatCardModule,
    LightboxModule,
    LightgalleryModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

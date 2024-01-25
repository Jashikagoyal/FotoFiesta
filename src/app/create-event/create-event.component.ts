import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EventListComponent } from '../event-list/event-list.component';
import { EventListService } from '../Services/event-list.service';
import { UsersDataService } from '../Services/users-data.service';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {

  create_event = false;
  event_limit_dialouge = false;
  create_event_success = false;
  isLoading: boolean = true;

  eventForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private app_component: AppComponent,
    private eventListService: EventListService,
    private userDataService: UsersDataService,
  ) {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventHashtag: ['', Validators.required],
    });
  }
  noOfEvents: any
  eventLimit: any
  ngOnInit(): void {
    console.log("create event page");
  
    // Combine the observables to wait for both to emit values
    this.eventListService.eventList();
    this.userDataService.userData();
    combineLatest([this.eventListService.eventList$, this.userDataService.activeSubscription$]).subscribe(([eventList, activeSubscription]) => {
      console.log('el',eventList)
      this.noOfEvents = eventList.length;
  
      // Check if the array is not empty
      if (activeSubscription.length > 0) {
        this.eventLimit = activeSubscription[0].event_limit;
        console.log("eventLimit:", this.eventLimit);
      }

      console.log("eventLimit:", this.eventLimit);
      console.log("noOfEvents:", this.noOfEvents);

      if (this.eventLimit !== undefined && this.noOfEvents !== undefined && this.eventLimit > this.noOfEvents) {
        this.create_event = true;
        this.isLoading = false;
        console.log("create_event set to true");
      }
      if (this.eventLimit !== undefined && this.noOfEvents !== undefined && this.eventLimit <= this.noOfEvents) {
        this.event_limit_dialouge = true;
        this.isLoading = false;
      }
    });
  }
  onSubmit() {
    if (this.eventForm.valid) {
      // Handle form submission here
      console.log(this.eventForm.value);
      var data = {
        title: this.eventForm.value.eventName,
        is_published: true,
        date: this.eventForm.value.eventDate,
        venue: this.eventForm.value.eventLocation,
        event_id: this.eventForm.value.eventHashtag,
        last_updated_time: Date.now(),
        images: 0,
        app_id: this.app_component.APP_NAME,
        status: 'Event Created SuccessFully',
      };
      console.log(data);
      const requestOptions = GetHeaders();

      this.httpClient
        .post(
          this.app_component.base_url + 'Eventdetails',
          data,
          requestOptions
        )
        .subscribe(
          (response) => {
            // this.isLoading = false;
            if (response) {
              var response_data: any;
              response_data = response;
              var status_code = response_data.statusCode;

              if (status_code == 200) {
                // alert(response_data.data);
                // console.log(response)
                this.create_event_success = true;
                this.eventForm.reset();
              }
            }
            // Handle the server's response
          },
          (error) => {
            // Handle any errors
          }
        );
    }
  }

}
function GetHeaders() {
  const headerDict = {
    Authorization: 'Token ' + localStorage.getItem('authToken'),
  };

  const requestOptions = {
    headers: new HttpHeaders(headerDict),
  };
  return requestOptions;
}
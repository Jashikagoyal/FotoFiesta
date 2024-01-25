import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventListService } from '../Services/event-list.service';
import { AppComponent } from '../app.component';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { UsersDataService } from '../Services/users-data.service';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  filterWithTag(tag: string): void {
    // console.log('Selected Tag:', tag);
    // Add your logic to filter with the selected tag
    this.filtered_images = this.image_list.filter(image => image.tag === tag);
  }

  faUsers = faUsers
  _albums: any = [];
  constructor(
    private route: ActivatedRoute, private router: Router,
    private httpClient: HttpClient, private eventListService: EventListService,
    private app_component: AppComponent, private _lightbox: Lightbox
  ) { }

  productId: any;
  image: any;
  image_list: any[] = [];
  tag_list: any[] = [];
  filtered_images: any[] = [];

  listOfEvent: any[] = [];
  eventData: any;
  isLoading: boolean = true;
  mobileNumber = localStorage.getItem('Mobile_Number');

  ngOnInit(): void {
    this.image_list = [];
    this.tag_list = [];

    this.route.params.subscribe((params) => {

      this.productId = params['event_id'] || null; // Access the 'id' route parameter
      if (this.route.snapshot.url.length == 1) {

        this.eventListService.eventList();
        // this.listOfEvent = this.userDataService.event_list;
        // console.log(this.userDataService.event_list)
        // this.eventData = true;
        this.isLoading = false;
        this.eventListService.eventList$.subscribe((eventList) => {
          this.listOfEvent = eventList;
        });
        this.eventListService.event$.subscribe((event) => {
          this.eventData = event;
        });
      } else {
        // this.eventData = false;
        this.downloadFiles(this.productId);
      }
    });
  }


  downloadFiles(event_name: string) {
    const data = { folder_name: event_name, user_id: '8000802034' };
    const requestOptions = GetHeaders();

    this.httpClient
      .post(
        // 'https://helpful-range-403908.el.r.appspot.com/downloadFroms3/',
        this.app_component.base_url + 'downloadFroms3/',
        data,
        requestOptions
      )
      .subscribe(
        (response) => {
          if (response) {
            this.image = response;
            this.image_list = this.image.data;
            this.tag_list = this.image.tags_list;
            this.isLoading = false;
            this.filtered_images = [...this.image_list];
            this.lightbox()
          }
          // Handle the server's response
        },
        (error) => {
          // Handle any errors
        }
      );
  }

  // Light Box Code for images

  lightbox() {
    console.log(this.filtered_images.length)
    for (let i = 0; i < this.filtered_images.length; i++) {
      const index = this.filtered_images.at(i)
      const imageUrl = index.image_url
      const caption = 'Image ' + i + ' caption here';
      const src = imageUrl
      const thumb = imageUrl
      const album = {
        src: src,
        thumb: thumb
      };

      this._albums.push(album);
    }
  }

  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }

  close(): void {
    this._lightbox.close();
  }

  convertEpochToDateTime(epochTimestamp: number): string {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const diff = now - epochTimestamp;

    if (diff < 60) {
      return `${diff} second${diff > 1 ? 's' : ''} ago`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 2592000) {
      // 30 days, less than one month
      const days = Math.floor(diff / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diff / 2592000); // 30 days per month
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  getMessageLink() {
    return (
      'Please *Click On the below link to access your ' +
      this.productId +
      '*  \n https://helpful-range-403908.el.r.appspot.com/users/create-user-and-grant-permission/?APP_NAME=' +
      this.app_component.APP_NAME +
      '&event_name=' +
      this.productId +
      '&permission=view   \n *Enter Mobile Number* \n AND  *Download The App*'
    );
  }

  navigateToUsersEventList() {
    this.router.navigate(['/admin/dashboard/event_list/' + this.productId + '/user_event_registered'])
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
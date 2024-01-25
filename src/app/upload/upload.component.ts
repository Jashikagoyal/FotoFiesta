import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBarPopupComponent } from '../progress-bar-popup/progress-bar-popup.component';
import { EventListService } from '../Services/event-list.service';
import { ActivatedRoute } from '@angular/router';
import { UsersDataService } from '../Services/users-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  listOfEvent: any[] = [];
  eventimage: any
  imageLength: number = 0;
  uploadForm: FormGroup;

  uploadProgress: number = 0;
  selectedFiles: File[] = [];
  title = 'photo-uploader';
  event_id = ""
  tag = ""
  appname = this.app_component.APP_NAME
  file_uploaded = 0

  errorText: string | null = null;

  constructor(private route: ActivatedRoute,private httpClient: HttpClient , 
    private dialog: MatDialog, private app_component: AppComponent, 
    private eventListService: EventListService,
    private userDataService: UsersDataService, private fb: FormBuilder,
    ) {
    // eventService.eventList()

    this.uploadForm = this.fb.group({
      eventId: ['', Validators.required],
      tag: ['', Validators.required],
      file: ['']
    });
  }
  imagePerEventLimit: any
  ngOnInit(): void {
    // this.eventService.eventList$.subscribe((eventList) => {
    //   this.listOfEvent = eventList;
    // });
    this.eventListService.eventList();
    this.userDataService.userData();
    combineLatest([this.eventListService.eventList$, this.userDataService.activeSubscription$]).subscribe(([eventList, activeSubscription]) => {
      console.log('el',eventList)
      this.listOfEvent = eventList;
      // Check if the array is not empty
      if (activeSubscription.length > 0) {
        this.imagePerEventLimit = activeSubscription[0].images_per_event_limit;
        console.log("eventLimit:", this.imagePerEventLimit);
      }
  
      console.log("eventLimit:", this.imagePerEventLimit);
    });
    console.log("imageLentgh now : ",this.imageLength)
    
  }

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: string = '';

  // Function to show the toast
  showToastMessage(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = []
    for (let i = 0; i < files.length; i++) {
      const file = event.target.files[i];
      this.previewFile(file);
      file.url = "";
      this.selectedFiles.push(file);
    }
  }
   
  imageSubscription(event_name: string) {
    const data = { folder_name: event_name};
    this.httpClient
      .post(
        // 'https://helpful-range-403908.el.r.appspot.com/downloadFroms3/',
        this.app_component.base_url + 'imageLength/',
        data,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.eventimage = response;
            this.imageLength = this.eventimage
            console.log("imagelentght : ", this.imageLength)
          }
          // Handle the server's response
        },
        (error) => {
          // Handle any errors
        }
      );
  }

  // imageCanUpload = this.imagePerEventLimit - this.imageLength

  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      // file.url = event.target!.result as string;
    };
  }

  openProgressBarDialog(fileIndex: number) {
    const dialogRef = this.dialog.open(ProgressBarPopupComponent, {
      data: { fileIndex },
      width: '300px',
      disableClose: true,
    });

    // Subscribe to the dialog's afterClosed event to handle when the dialog is closed.
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'cancel') {
        // Handle cancellation if needed
      }
    });
  }


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async uploadFiles() {
    // if (this.selectedFiles.length === 0) {
    //   alert("Please select any FIles")
    //   return;
    // } else if (this.selectedFiles.length > (this.imagePerEventLimit - this.imageLength)){
    //   alert("You are attempting to upload more images")
    //   return
    // }
    if (this.event_id.length <= 0) {
      this.errorText = "Please select Event ID";
      return
    }
    else if (this.selectedFiles.length === 0) {
      this.errorText = "Please select atleast one file";
      return
    } else if (this.selectedFiles.length > this.imagePerEventLimit - this.imageLength) {
      this.errorText = "You are attempting to upload more images than your subscription limit allows";
      return
    } else {
      this.errorText = null; 
    }
    var uploadingfiles: File[] = [];
    var count = 0;
    var current_size = 0;
    const maxSize = 3*1024*1024
    this.showToastMessage("Images Uploaded Successfully","success");
    // alert("form is submitted")
    for (let i = 0; i < this.selectedFiles.length; i++) {
      var file = this.selectedFiles[i];
      console.log("cuurentSize",current_size)
      console.log("maxSize",maxSize)
      if(current_size >= maxSize)
      {
        console.log("file Uploading")
        await this.upload_photos_to_s3( uploadingfiles, i)
        await this.delay(1500)
        uploadingfiles =[]
        current_size =0
      }
    
      uploadingfiles.push(file)
      current_size = current_size+file.size
    
    }
    if (uploadingfiles.length)
    {
      await this.upload_photos_to_s3( uploadingfiles, this.selectedFiles.length)
    }
    
  }


  async upload_photos_to_s3( uploadingfilelist: File[], index: number) {
    var formData =  new FormData()
    uploadingfilelist.forEach((file,index) =>
    {
      formData.append('file', file);
    });

    formData.append('event', this.event_id);
    formData.append('tag', this.tag);
    formData.append('app', this.appname);
    await this.delay(500)
    console.log(formData)
    this.httpClient.post(this.app_component.base_url+'bulkupload/', formData).subscribe(
      (response) => {
        if (response) {
          if(index > this.file_uploaded)
          {
            this.file_uploaded = index
          }
          this.uploadProgress = Math.round(100 * (this.file_uploaded + 1) / this.selectedFiles.length);
          console.log(`File ${index + 1} uploaded successfully:`);

        }
        // Handle the server's response
      },
      (error) => {
        // Handle any errors
      }
    );
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

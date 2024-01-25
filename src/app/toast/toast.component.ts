import { Component, Input } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() message: string | undefined;
  @Input() toastType: string | undefined;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.showToast()
  }
  showToast() {
    const toastrConfig: Partial<IndividualConfig> = {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      // toastClass: 'yourclass ngx-toastr yourclass',
      // toastClass: 'custom-toastr',
      // other configuration options...
    };
    if (this.toastType=="success"){
      this.toastr.success(this.message, '', toastrConfig);
    }
    else if(this.toastType=="error"){
      this.toastr.error(this.message, '', toastrConfig);
    }
    else if(this.toastType=="info"){
      this.toastr.info(this.message, '', toastrConfig);
    }
    else if(this.toastType=="warning"){
      this.toastr.warning(this.message, '', toastrConfig);
    }
    else{
      this.toastr.show(this.message, '', toastrConfig);
    }
    
  }

  // showSuccess() {
  //   this.toastr.success(this.message);
  //   this.toastr.show()
  // }
}

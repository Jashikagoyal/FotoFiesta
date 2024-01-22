import { Component, Input } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() message: string | undefined;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.showSuccess()
  }

  showSuccess() {
    const toastrConfig: Partial<IndividualConfig> = {
      closeButton: true,
      progressBar: true,
      timeOut: 10000,
      toastClass: 'ngx-toastr custom-toastr'
      // toastClass: 'custom-toastr',
      // other configuration options...
    };

    this.toastr.success(this.message, 'Your title', toastrConfig);
  }

  // showSuccess() {
  //   this.toastr.success(this.message);
  //   this.toastr.show()
  // }
}

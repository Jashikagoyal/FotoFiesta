import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { UsersDataService } from '../Services/users-data.service';
import { AuthenticationService } from '../Services/auth.service';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent {


  loginForm: FormGroup;
  registrationForm: FormGroup

  constructor(private httpClient: HttpClient, private router: Router, private formBuilder: FormBuilder,
    private appComponent: AppComponent, private userDataService: UsersDataService,
    private authService: AuthenticationService) {

    this.loginForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });
    this.registrationForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required]
    });

  }
  isAuthenticated = this.authService.isLoggedIn
  isRightPanelActive: boolean = false;
  // email: string = "";
  mobileNumber: string = '';
  otp: string = '';
  showOTPField: boolean = false;
  response_data: any;
  message: string = ''
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: string = "";

  // Function to show the toast
  showToastMessage(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  onRegistration() {
    // Handle the registration submission here
    const mobileNumberValue = this.loginForm.get('mobileNumber')?.value;

    const data = {
      "Mobile": this.registrationForm.get('mobileNumber')?.value,
      "appString": "checkdvn",
      "userName": this.registrationForm.get('userName')?.value,
      "email": this.registrationForm.get('email')?.value,
    }
    console.log(data)
    this.showOTPField = true;
    this.httpClient.post(this.appComponent.base_url + 'users/register_user', data).subscribe(
      (response) => {
        if (response) {
          this.response_data = response;
        }
        // Handle the server's response

      },
      (error: HttpErrorResponse) => {
        // Handle the error case here
        if (error.status === 409) {
          console.log('User already exist');
          // alert(" User already exist Please Login")
          this.showToastMessage("User already exist Please Login", "error")
          this.showOTPField = false;
          this.onSignInClick();
          // Handle the case where the user is not found
        } else {
          // Handle other errors
          console.error('Unexpected error:', error);
        }
      }
    );
  }

  checkOtp() {
    console.log(" response data : ", this.response_data)
    if (this.otp && this.otp != '') {
      if (this.otp == this.response_data.otp) {
        this.userDataService.setUserDataInitial = this.response_data;
        // alert('congratulations');
        this.showToastMessage("Login Successful", "success");
        localStorage.setItem('authToken', this.response_data.auth_token);
        localStorage.setItem('Mobile_Number', this.response_data.mobile);
        setTimeout(() => {
          this.router.navigate(['admin/dashboard/event_list']);
        }, 1);
      } else if (this.otp.length < 6) {
        this.showToastMessage('please enter 6 digit otp', "info")
        // alert('please enter 6 digit otp')
      } else {
        // alert('please enter correct otp');
        this.showToastMessage('please enter correct otp', "info")
      }
    }
  }

  onLogin() {
    // Handle the login submission here
    const mobileNumberValue = this.loginForm.get('mobileNumber')?.value;
    console.log('Mobile Number:', mobileNumberValue);
    if (this.loginForm.valid) {
      this.message = ""
      console.log('Valid form submission');
    } else {
      // Handle invalid form submission or display error messages
      this.message = "Invalid Phone Number"
      console.log('Invalid form submission');
      return;
    }
    const data = {
      "Mobile": mobileNumberValue,
      "appString": "checkdvn"
    }
    console.log(data)
    this.showOTPField = true;
    this.httpClient.post(this.appComponent.base_url + 'users/mobile_number_check', data).subscribe(
      (response) => {
        if (response) {
          this.response_data = response;
        }
        // Handle the server's response

      },
      (error: HttpErrorResponse) => {
        // Handle the error case here
        console.log(error)
        if (error.status === 404) {
          console.log('User not found');
          this.showToastMessage("User not registered", "error")
          // alert("User not registered")
          this.onSignUpClick()
          this.showOTPField = false;
          // Handle the case where the user is not found
        } else {
          // Handle other errors
          console.error('Unexpected error:', error);
        }
      }
    );
    // Add your authentication logic here
  }

  onSignUpClick() {
    this.isRightPanelActive = true;
  }

  onSignInClick() {
    this.isRightPanelActive = false;
  }
}

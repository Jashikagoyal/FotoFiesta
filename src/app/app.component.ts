import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor (){}

  title = 'FotoFiesta';
  APP_NAME = 'PHOTOPHACTORYSTUDIOS';
  base_url = 'http://localhost:8000/'
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThingieUploaderComponent} from './thingie-uploader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThingieUploaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bigishThings';
}

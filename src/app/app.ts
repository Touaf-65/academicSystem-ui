import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResponsiveHelperComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('academicSystem');
}

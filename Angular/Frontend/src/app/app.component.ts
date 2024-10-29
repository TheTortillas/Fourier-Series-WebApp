import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvaComponent } from "./pages/canva/canva.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CanvaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Frontend';
}

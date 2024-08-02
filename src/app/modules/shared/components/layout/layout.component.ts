import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <main class="h-screen flex flex-col-reverse sm:flex-row">
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
    </main>
  `
})
export class LayoutComponent {

}

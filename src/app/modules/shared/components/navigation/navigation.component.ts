import { Component, WritableSignal, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  isDarkMode: WritableSignal<boolean>;

  constructor() {
    this.isDarkMode = signal(this.validateTheme());
    this.toggleTheme();
  }

  validateTheme(): boolean {
    return window.localStorage['theme'] === 'dark';
  }

  toggleTheme() {
    this.isDarkMode.update(prevStatus => !prevStatus);

    if (this.isDarkMode()) {
      window.localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      window.localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }
}

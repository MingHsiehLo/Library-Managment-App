import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  loading = false;

  constructor(private router: Router) {
    this.router.events.subscribe({
      next: (event: Event) => this.handleEvent(event)
    });
  }

  handleEvent(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }

    if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
      this.loading = false;
    }
  }
}

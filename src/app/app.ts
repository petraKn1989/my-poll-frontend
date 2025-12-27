import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Seo } from './seo/seo';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Seo, CommonModule],  // ← NgIf je nutné přidat
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('anketa-app');
  isHomePage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let path = this.router.url;

        if (path.includes('#')) {
          path = path.split('#')[1]; 
        }

        this.isHomePage = !path || path === '/';
      });
  }
}

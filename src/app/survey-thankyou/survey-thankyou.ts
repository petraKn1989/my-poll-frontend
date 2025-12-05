import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-thankyou',
  imports: [],
  templateUrl: './survey-thankyou.html',
  styleUrl: './survey-thankyou.css',
})
export class SurveyThankyou {

constructor(private router: Router) { }

  goToCreatePoll() {
    // přesměruje uživatele na stránku tvorby nové ankety
    this.router.navigate(['']);
  }

}

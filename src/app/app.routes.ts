import { Routes } from '@angular/router';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { PollCreatedComponent } from './poll-created/poll-created.component';
import { FillPollComponent } from './fill-poll/fill-poll.component';
import { SurveyThankyou } from './survey-thankyou/survey-thankyou';

export const routes: Routes = [
  { path: '', component: CreatePollComponent },
  { path: 'poll-created', component: PollCreatedComponent },
   { path: 'fill-poll/:id', component: FillPollComponent }, // parametr id
   { path: 'survey-thank-you', component: SurveyThankyou }
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollStoreService } from '../services/poll-store';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-created',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poll-created.component.html',
  styleUrls: ['./poll-created.component.css'],
})
export class PollCreatedComponent implements OnInit {
  pollId: number | null = null;
  appUrl = environment.appUrl;

  constructor(private pollStore: PollStoreService, private router: Router) {}


  ngOnInit(): void {
    this.pollId = this.pollStore.getPollId(); // načteme ID z služby
  }

  getPollLink(): string {
  return `${this.appUrl.replace(/\/+$/, '')}/fill-poll/${this.pollId}`;
}

goToResults() {
  this.router.navigate(['/poll-results', this.pollId]);
}

  copyPollLink() {
  const link = `${this.appUrl}/fill-poll/${this.pollId}`;
  navigator.clipboard.writeText(link)
    .then(() => {
      alert('Odkaz byl zkopírován do schránky!');
    })
    .catch(err => {
      console.error('Chyba při kopírování odkazu:', err);
    });
}

}

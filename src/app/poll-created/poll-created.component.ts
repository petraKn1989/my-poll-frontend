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

  // Vrátí bezpečný odkaz na vyplnění ankety
  getPollLink(): string {
    if (!this.pollId) return '#';
    return `${this.appUrl.replace(/\/+$/, '')}/fill-poll/${this.pollId}`;
  }

  // Navigace na výsledky ankety – jen při kliknutí uživatele
  getResultsLink(): string {
  if (!this.pollId) return '#';
  return `${this.appUrl.replace(/\/+$/, '')}/poll-results/${this.pollId}`;
}

  // Kopírování odkazu do schránky
  copyPollLink() {
    const link = this.getPollLink();
    if (!link || link === '#') {
      alert('Odkaz není dostupný');
      return;
    }

    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Odkaz byl zkopírován do schránky!');
      })
      .catch(err => {
        console.error('Chyba při kopírování odkazu:', err);
      });
  }
}

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
  appUrl = environment.appUrl;

  constructor(private pollStore: PollStoreService) {}

  ngOnInit(): void {
    console.log('UIID je tady:', this.pollStore.getPollUuid());
  }

  // Odkaz na vyplnění ankety
  getPollLink(): string {
    return `${this.appUrl.replace(/\/+$/, '')}/fill-poll/${this.pollStore.getPollUuid()}`;
  }

  // Odkaz na výsledky ankety
  getResultsLink(): string {
    return `${this.appUrl.replace(/\/+$/, '')}/poll-results/${this.pollStore.getPollUuid()}`;
  }

  // Kopírování odkazu do schránky (volitelné: lze předat link)
  copyLink(link: string) {
    if (!link) {
      alert('Odkaz není dostupný');
      return;
    }

    navigator.clipboard.writeText(link)
      .then(() => alert('Odkaz byl zkopírován do schránky!'))
      .catch(err => console.error('Chyba při kopírování odkazu:', err));
  }
}

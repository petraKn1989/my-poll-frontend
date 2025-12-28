// src/app/poll-created/poll-created.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PollStoreService } from '../services/poll-store';
import QRCode from 'qrcode';

@Component({
  selector: 'app-poll-created',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './poll-created.component.html',
  styleUrls: ['./poll-created.component.css'],
})
export class PollCreatedComponent implements OnInit {
  showCopyToast = false;
  pollUuid: string | null = null;
  fullFillPollLink: string = '';
  fullResultsLink: string = '';
  qrDataUrl: string | null = null;
  qrDataUrlResult: string | null = null;

  constructor(public pollStore: PollStoreService) {}

  ngOnInit(): void {
    this.pollUuid = this.pollStore.getPollUuid();

    if (this.pollUuid) {
      const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
      this.fullFillPollLink = `${location.origin}${baseHref}#/fill-poll/${this.pollUuid}`;
      this.fullResultsLink = `${location.origin}${baseHref}#/poll-results/${this.pollUuid}`;

      // Generování QR kódu
      QRCode.toDataURL(this.fullFillPollLink)
        .then(url => this.qrDataUrl = url)
        .catch(err => console.error('Chyba při generování QR kódu:', err));

        QRCode.toDataURL(this.fullResultsLink)
        .then(url => this.qrDataUrlResult = url)
        .catch(err => console.error('Chyba při generování QR kódu:', err));
    }
  }

  copyPollLink() {
    if (!this.fullFillPollLink) return;
    navigator.clipboard.writeText(this.fullFillPollLink).then(() => this.showToast());
  }

  copyResultsLink() {
    if (!this.fullResultsLink) return;
    navigator.clipboard.writeText(this.fullResultsLink).then(() => this.showToast());
  }

  private showToast() {
    this.showCopyToast = true;
    setTimeout(() => (this.showCopyToast = false), 3000);
  }
}

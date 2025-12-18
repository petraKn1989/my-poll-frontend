import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PollStoreService } from '../services/poll-store';

@Component({
  selector: 'app-poll-created',
  standalone: true,
  imports: [CommonModule, RouterModule], // RouterModule pro [routerLink]
  templateUrl: './poll-created.component.html',
  styleUrls: ['./poll-created.component.css'],
})
export class PollCreatedComponent implements OnInit {
  showCopyToast = false;
  pollUuid: string | null = null;
  fullFillPollLink: string = '';
  fullResultsLink: string = '';

  constructor(public pollStore: PollStoreService) {}

  ngOnInit(): void {
    this.pollUuid = this.pollStore.getPollUuid();

    if (this.pollUuid) {
      const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
      this.fullFillPollLink = `${location.origin}${baseHref}#/fill-poll/${this.pollUuid}`;
      this.fullResultsLink = `${location.origin}${baseHref}#/poll-results/${this.pollUuid}`;
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


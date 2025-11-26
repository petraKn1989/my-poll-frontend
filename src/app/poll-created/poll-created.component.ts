import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollStoreService } from '../services/poll-store';
import { environment } from '../../environments/environment';

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

  constructor(private pollStore: PollStoreService) {}

  ngOnInit(): void {
    this.pollId = this.pollStore.getPollId(); // načteme ID z služby
  }
}

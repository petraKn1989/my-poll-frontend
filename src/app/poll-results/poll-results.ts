
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollService } from '../services/pollServices';
import { Poll } from '../../model/Poll';

@Component({
  selector: 'app-poll-results',
  standalone: true,
  imports: [CommonModule], // <- musíte sem přidat CommonModule

  templateUrl: './poll-results.html',
  styleUrls: ['./poll-results.css']
})
export class PollResults implements OnInit {

  pollId!: number;
  pollData!: Poll;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService
  ) {}

  ngOnInit(): void {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));

    // Používáme existující getPoll, protože tam už jsou votes
    this.pollService.getPoll(this.pollId).subscribe({
      next: (data) => {
        this.pollData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Chyba při načítání výsledků', err);
        this.isLoading = false;
      }
    });
  }

  getPercentage(optionVotes: number): string {
  const total = this.pollData?.totalVotes ?? 0; // pokud undefined, použije 0
  if (total === 0) return '0%';
  return Math.round((optionVotes / total) * 100) + '%';
}

}

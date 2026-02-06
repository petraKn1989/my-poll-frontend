
import { Component, OnChanges, OnInit, SimpleChanges, Output, EventEmitter
  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollService } from '../services/pollServices';
import { Poll } from '../../model/Poll';
import { SurveyActions } from "../survey-actions/survey-actions";
import { PollStoreService } from '../services/poll-store';

@Component({
  selector: 'app-poll-results',
  standalone: true,
  imports: [CommonModule, SurveyActions], // <- musíte sem přidat CommonModule

  templateUrl: './poll-results.html',
  styleUrls: ['./poll-results.css']
})
export class PollResults implements OnInit, OnChanges {
 

 // pollId!: number;
 pollData: Poll = {
  id: undefined,
  createdAt: new Date().toISOString(),
  questions: [],
  totalVotes: 0,
  slug: '',
  status: 'active'   // defaultní status
};
  isLoading = true;
  isDeleted = false;
  slug!: string;
 

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private pollStore: PollStoreService, 
    private router: Router
  ) {}

  ngOnInit(): void {
   // this.pollId = Number(this.route.snapshot.paramMap.get('id'));
 
    this.slug = this.route.snapshot.paramMap.get('slug')!;

    // Používáme existující getPoll, protože tam už jsou votes
    this.pollService.getPollbyUIID(this.slug).subscribe({
      
      next: (data) => {
 
        this.pollData = data;
        this.isLoading = false;
        if (data.id) this.pollStore.setPollId(data.id);

      },
      error: (err) => {
        console.error('Chyba při načítání výsledků', err);
        this.isLoading = false;
      }
    });
  }

   ngOnChanges(changes: SimpleChanges) {
    if (changes['pollStatus']) {
  
      // tady můžeš aktualizovat logiku tabulky
    }
  }

  onStatusChanged(newStatus: string) {

  this.pollData.status = newStatus; // aktualizujeme pollData.status
}

goToDetail() {
  this.router.navigate(['/poll-results-detail']);
}

  getPercentage(optionVotes: number): string {
  const total = this.pollData?.totalVotes ?? 0; // pokud undefined, použije 0
  if (total === 0) return '0%';
  return Math.round((optionVotes / total) * 100) + '%';
}

deletePoll() {
  const confirmed = confirm(
    "Pozor!\nSmazáním této ankety budou odstraněny všechny otázky i výsledky hlasování.\nTato akce je nevratná.\nOpravdu chcete pokračovat?"
  );

  let id = this.pollData.id as number;

  this.pollService.deletePoll(id).subscribe({
    next: () => {
      alert('Anketa byla smazána');
      this.isDeleted = true; // zablokuje tlačítko
    },
    error: (err) => {
      console.error(err);
      alert('Nepodařilo se smazat anketu');
    }
  });
}




}

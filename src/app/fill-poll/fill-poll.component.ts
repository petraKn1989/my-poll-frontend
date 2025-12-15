import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { PollService } from '../services/pollServices';
import { CommonModule } from '@angular/common';
import { AnswerItem, AnswerRequest } from '../../model/Poll';

@Component({
  selector: 'app-fill-poll',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './fill-poll.component.html',
  styleUrls: ['./fill-poll.component.css']
})
export class FillPollComponent implements OnInit {

  @ViewChild('surveyForm') surveyForm!: NgForm;

 // pollId!: number;
  pollData: any;
  isSubmitting = false; // ⬅ proměnná pro zabránění dvojitého odeslání
  slug!: string;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private router: Router
  ) {}

  ngOnInit(): void {
   // this.pollId = Number(this.route.snapshot.paramMap.get('id'));
    this.slug = this.route.snapshot.paramMap.get('slug')!;

  

    this.pollService.getPollbyUIID(this.slug).subscribe(data => {
      this.pollData = data;

 
    // Zkus všechny varianty jednu po druhé
    // this.pollData.status = 'active';
  // this.pollData.status = 'deleted';
    // this.pollData.status = 'paused';
  // this.pollData.status = 'finished_hidden';
//this.pollData.status = 'finished_published';

      console.log("Načtená anketa:", this.pollData);

      // Inicializace polí pro radio a checkboxy
      this.pollData.questions.forEach((q: any) => {
        if (!q.allowMultiple) {
          q.selectedOptionId = null;       // pro radio
        } else {
          q.selectedOptions = {};          // pro checkboxy
          q.options.forEach((opt: any) => {
            q.selectedOptions[opt.id] = false;
          });
        }
      });
    });
  }

 submitSurvey() {
  if (this.isSubmitting) return; // prevence dvojího odeslání

  this.isSubmitting = true;

  const resultPayload: AnswerRequest = this.transformFormToResult();

  console.log("ODESÍLANÉ ODPOVĚDI (JSON):", resultPayload);

  this.pollService.sendAnswers(resultPayload).subscribe({
    next: (res) => {
      console.log("Odpovědi uloženy", res);
      this.router.navigate(['/survey-thank-you']);
    },
    error: (err) => {
      console.error("Chyba při ukládání", err);
      this.isSubmitting = false;
      alert('Odeslání se nezdařilo. Zkuste to prosím znovu.');
    }
  });
}

  // Pomocná funkce – převede Angular form na JSON vhodný pro backend
  private transformFormToResult(): AnswerRequest {
    const result: AnswerItem[] = [];

    for (let q of this.pollData.questions) {
      const selectedIds = q.allowMultiple
        ? Object.keys(q.selectedOptions)
            .filter(k => q.selectedOptions[k])
            .map(k => Number(k))
        : [q.selectedOptionId];

      result.push({
        questionId: q.id,
        selectedOptionIds: selectedIds
      });
    }

    return {
      pollId: this.pollData.id,
      answers: result
    };
  }

  getPercentage(votes: number): string {
    if (!this.pollData || !this.pollData.totalVotes || this.pollData.totalVotes === 0) {
      return '0 %';
    }
    const percent = (votes / this.pollData.totalVotes) * 100;
    return percent.toFixed(1) + ' %'; // 1 desetinné místo
  }


}

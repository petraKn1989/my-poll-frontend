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
  styleUrls: ['./fill-poll.component.css'],
})
export class FillPollComponent implements OnInit {
  @ViewChild('surveyForm') surveyForm!: NgForm;

  pollData: any;
  isSubmitting = false;
  slug!: string;
  showErrorModal = false;
  errorMessageModal = '';
  showConfirmModal = false;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const urlSlug = params.get('slug');
      if (!urlSlug) {
        console.warn('Slug není definován, přesměrovávám na index.');
        this.router.navigate(['']);
        return;
      }
      this.slug = urlSlug;
      this.loadPoll();
    });
  }

  private loadPoll() {
    this.pollService.getPollbyUIID(this.slug).subscribe({
      next: (data) => {
        this.pollData = data;

        // Inicializace polí pro radio a checkboxy
        this.pollData.questions.forEach((q: any) => {
          if (!q.allowMultiple) {
            q.selectedOptionId = null;
          } else {
            q.selectedOptions = {};
            q.options.forEach((opt: any) => {
              q.selectedOptions[opt.id] = false;
            });
          }
        });
      },
      error: (err) => {
        console.error('Chyba při načítání ankety:', err);
        this.errorMessageModal = 'Nepodařilo se načíst anketu.';
        this.showErrorModal = true;
      },
    });
  }

  submitSurvey() {
    if (this.isSubmitting) return;

    // Zkontrolovat, zda jsou všechny otázky vyplněné
    const unanswered = this.pollData.questions.some((q: any) => {
      if (q.allowMultiple) {
        return !Object.values(q.selectedOptions).some(v => v);
      } else {
        return q.selectedOptionId == null;
      }
    });

    if (unanswered) {
      // Zobrazit potvrzovací modal
      this.showConfirmModal = true;
      return;
    }

    // Odeslat přímo
    this.sendSurvey();
  }

  confirmSend() {
    this.showConfirmModal = false;
    this.sendSurvey();
  }

  cancelSend() {
    this.showConfirmModal = false;
  }

  private sendSurvey() {
    this.isSubmitting = true;
    const resultPayload: AnswerRequest = this.transformFormToResult();

    this.pollService.sendAnswers(resultPayload).subscribe({
      next: (res) => {
        if (!res.allowVote) {
          this.isSubmitting = false;
          this.errorMessageModal =
            'Už jste hlasovali, další hlasování není možné.';
          this.showErrorModal = true;
          return;
        }
        this.router.navigate(['/survey-thank-you']);
      },
      error: (err) => {
        console.error('Chyba při ukládání', err);
        this.isSubmitting = false;
        this.errorMessageModal = 'Odeslání se nezdařilo.';
        this.showErrorModal = true;
      },
    });
  }

  private transformFormToResult(): AnswerRequest {
  const result: AnswerItem[] = [];

  for (let q of this.pollData.questions) {
    let selectedIds: number[] = [];

    if (q.allowMultiple) {
      selectedIds = Object.keys(q.selectedOptions)
        .filter(k => q.selectedOptions[k])
        .map(k => Number(k));
    } else {
      if (q.selectedOptionId != null) {
        selectedIds = [q.selectedOptionId];
      }
    }

    // Pokud nezodpovězeno, pošleme prázdné pole []
    result.push({
      questionId: q.id,
      selectedOptionIds: selectedIds,
    });
  }

  return {
    pollId: this.pollData.id,
    answers: result,
  };
}


  getPercentage(votes: number): string {
    if (!this.pollData || !this.pollData.totalVotes || this.pollData.totalVotes === 0) {
      return '0 %';
    }
    const percent = (votes / this.pollData.totalVotes) * 100;
    return percent.toFixed(1) + ' %';
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}

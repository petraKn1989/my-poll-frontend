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

  pollId!: number;
  pollData: any;
  isSubmitting = false; // ⬅ proměnná pro zabránění dvojitého odeslání

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));

    this.pollService.getPoll(this.pollId).subscribe(data => {
      this.pollData = data;
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
    if (this.surveyForm.invalid || this.isSubmitting) {
      return; // neodesílat, pokud je formulář neplatný nebo už se odesílá
    }

    this.isSubmitting = true; // deaktivujeme tlačítko

    const resultPayload: AnswerRequest = this.transformFormToResult();

    console.log("ODESÍLANÉ ODPOVĚDI (finální JSON):", resultPayload);

    this.pollService.sendAnswers(resultPayload).subscribe({
      next: (res) => {
        console.log("Odpovědi uloženy", res);
        this.router.navigate(['/survey-thank-you']);
      },
      error: (err) => {
        console.error("Chyba při ukládání", err);
        this.isSubmitting = false; // znovu povolíme tlačítko při chybě
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
      pollId: this.pollId,
      answers: result
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollStoreService } from '../services/poll-store';
import { PollService } from '../services/pollServices';
import { CreatePollDto } from '../../model/Poll';


@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css'],
})
export class CreatePollComponent  {
  title: string = '';
  questions = [{ text: '', allowMultiple: false, options: ['', ''] }];
  invalidQuestions: { text: boolean; options: boolean[] }[] = [];
  showResults: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  infoMessage: string = '';
  hasSubmitted: boolean = false;


  constructor(
    private pollService: PollService,
    private pollStore: PollStoreService,
    private router: Router
 
  ) {}



  isQuestionOptionsInvalid(qIndex: number): boolean {
    const q = this.invalidQuestions[qIndex];
    if (!q || !q.options) return false;
    const filledCount = q.options.filter((v) => !v).length;
    return filledCount > q.options.length - 2;
  }

  // Správa otázek a možností
  addQuestion() {
    this.questions.push({ text: '', allowMultiple: false, options: ['', ''] });
    this.invalidQuestions.push({ text: false, options: ['', ''].map(() => false) });
  }

  removeQuestion(index: number) {
    if (this.questions.length <= 1) return; // bezpečné mazání
    this.questions.splice(index, 1);
    this.invalidQuestions.splice(index, 1);
  }

  addOption(qIndex: number) {
    this.questions[qIndex].options.push('');
    this.invalidQuestions[qIndex].options.push(false);
  }

  removeOption(qIndex: number, oIndex: number) {
    if (this.questions[qIndex].options.length <= 2) return; // bezpečné mazání
    this.questions[qIndex].options.splice(oIndex, 1);
    this.invalidQuestions[qIndex].options.splice(oIndex, 1);
  }

  trackByIndex(index: number) {
    return index;
  }

  private validateQuestions(): boolean {
    if (this.questions.length === 0) return false;

    let isValid = true;

    this.invalidQuestions = this.questions.map((q) => {
      const emptyOptions = q.options.map((opt) => !opt || opt.trim() === '');
      const filledOptionsCount = q.options.length - emptyOptions.filter((v) => v).length;

      const textInvalid = !q.text || q.text.trim() === '';
      const optionsInvalid = filledOptionsCount < 2;

      if (textInvalid || optionsInvalid) isValid = false;

      return {
        text: textInvalid,
        options: emptyOptions,
      };
    });

    return isValid;
  }

  private validateTitle(): boolean {
    return !!this.title && this.title.trim().length >= 3;
  }

  // Odeslání ankety
  createPoll() {
    if (this.isSubmitting) return;

    this.errorMessage = '';
    this.hasSubmitted = true;

    // Validace názvu ankety
    if (!this.validateTitle()) {
      this.errorMessage = 'Název ankety musí mít alespoň 3 znaky.';
      return;
    }

    if (!this.validateQuestions()) {
      this.errorMessage = 'Každá otázka musí mít vyplněný text a alespoň 2 možnosti!';
      return;
    }

    this.infoMessage = 'Čekejte prosím, data se odesílají…';
    this.isSubmitting = true;

    const now = new Date();
    const formatted = now.toISOString().slice(0, 19); // odstraní Z a milisekundy

    const payload: CreatePollDto = {
      createdAt: formatted,
      title: this.title.trim(),
      showResults: this.showResults,
      questions: this.questions.map((q) => ({
        text: q.text.trim(),
        allowMultiple: q.allowMultiple,
        options: q.options.map((opt) => opt.trim()),
      })),
    };

    this.pollService.submitSurvey(payload).subscribe({
      next: (resp) => {
        this.isSubmitting = false;
        this.infoMessage = '';
        if (resp.id) this.pollStore.setPollId(resp.id);
        if (resp.slug) this.pollStore.setPollUuid(resp.slug);

        // Reset formuláře po úspěšném odeslání
        this.title = '';
        this.questions = [{ text: '', allowMultiple: false, options: ['', ''] }];
        this.showResults = false;
      //  this.resetInvalidQuestions();
        this.hasSubmitted = false;

       

        this.router.navigate(['/poll-created'], { replaceUrl: true });
      },
      error: () => {
        this.isSubmitting = false;
        this.infoMessage = '';
        alert('Došlo k chybě při vytváření ankety.');
      },
    });
  }
}

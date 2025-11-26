import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { PollStoreService } from "../services/poll-store";
import { PollService } from "../services/pollServices";
import { CreatePollDto, Poll } from "../../model/Poll";

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent {
  questions = [
    { text: '', allowMultiple: false, options: ['', ''] }
  ];

  constructor(
    private pollService: PollService,
    private pollStore: PollStoreService,
    private router: Router
  ) {}

  addQuestion() {
    this.questions.push({ text: '', allowMultiple: false, options: ['', ''] });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addOption(qIndex: number) {
    this.questions[qIndex].options.push('');
  }

  removeOption(qIndex: number, oIndex: number) {
    this.questions[qIndex].options.splice(oIndex, 1);
  }

  trackByIndex(index: number) {
    return index;
  }

  createPoll() {
  const payload: CreatePollDto = {
    createdAt: new Date().toISOString(),
    questions: this.questions.map(q => ({
      text: q.text,
      allowMultiple: q.allowMultiple,
      options: q.options // string[] pro backend
    }))
  };

  this.pollService.submitSurvey(payload).subscribe({
    next: (resp) => {
      if (resp.id) this.pollStore.setPollId(resp.id);
      this.router.navigate(['/poll-created'], { replaceUrl: true });
    },
    error: (_) => alert("Došlo k chybě při vytváření ankety.")
  });
}

}

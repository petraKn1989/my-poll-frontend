import { Component, OnInit } from '@angular/core';
import { Submission } from '../../model/Poll';
import { PollService } from '../services/pollServices';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PollStoreService } from '../services/poll-store';

@Component({
  selector: 'app-result-detail',

  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './result-detail.html',
  styleUrl: './result-detail.css',
})
export class ResultDetail implements OnInit {

  submissions: Submission[] = [];

  constructor(private pollService: PollService, private pollStoreService: PollStoreService) { }

  ngOnInit(): void {

    const id = this.pollStoreService.getPollId();

    if (id) {
    
    
    this.pollService.getPollResultsDetail(id).subscribe(data => {
      console.log("tady get to id tady je submission:  " , data);
    this.submissions = data;
  });

    }

   
   }

   groupAnswers(answers: any[]) {
  const grouped: { questionText: string; options: string[] }[] = [];

  answers.forEach(ans => {
    let existing = grouped.find(g => g.questionText === ans.questionText);

    if (existing) {
      existing.options.push(ans.optionText);
    } else {
      grouped.push({
        questionText: ans.questionText,
        options: [ans.optionText]
      });
    }
  });

  return grouped;
}


}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollStoreService } from '../services/poll-store';
import { PollService } from '../services/pollServices';
import { CreatePollDto } from '../../model/Poll';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css'],
})
export class CreatePollComponent implements OnInit {
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
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.setPage(
      'Vytvořit anketu zdarma | Online dotazník',
      'Vytvořte si vlastní anketu, dotazník nebo průzkum online zdarma. Sdílejte s přáteli, kolegy nebo studenty.',
      this.seo['keywordPool']
    );
    this.addJsonLdSchema();
    this.updateSocialMeta();
    this.resetInvalidQuestions();
  }

  private addJsonLdSchema() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Vytvořit anketu zdarma',
      description: 'Vytvořte si vlastní online dotazník zdarma. Klíčová slova: ' + this.seo['keywordPool'].join(', '),
      url: window.location.href,
      mainEntity: {
        '@type': 'Survey',
        name: 'Vytvořit anketu zdarma',
        description: 'Vytvořte si vlastní online dotazník zdarma. Klíčová slova: ' + this.seo['keywordPool'].join(', '),
      },
    });
    document.head.appendChild(script);
  }

  private updateSocialMeta() {
    const url = window.location.href;
    const title = 'Vytvořit anketu zdarma | Online dotazník';
    const description = 'Vytvořte si vlastní anketu nebo průzkum online zdarma. Klíčová slova: ' + this.seo['keywordPool'].join(', ');
    const image = 'https://www.example.com/assets/preview-image.png';

    // Open Graph
    this.seo['metaService'].updateTag({ property: 'og:title', content: title });
    this.seo['metaService'].updateTag({ property: 'og:description', content: description });
    this.seo['metaService'].updateTag({ property: 'og:type', content: 'website' });
    this.seo['metaService'].updateTag({ property: 'og:url', content: url });
    this.seo['metaService'].updateTag({ property: 'og:image', content: image });

    // Twitter Card
    this.seo['metaService'].updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.seo['metaService'].updateTag({ name: 'twitter:title', content: title });
    this.seo['metaService'].updateTag({ name: 'twitter:description', content: description });
    this.seo['metaService'].updateTag({ name: 'twitter:image', content: image });
  }

  private resetInvalidQuestions() {
    this.invalidQuestions = this.questions.map(q => ({
      text: false,
      options: q.options.map(() => false),
    }));
  }

  isQuestionOptionsInvalid(qIndex: number): boolean {
    const q = this.invalidQuestions[qIndex];
    if (!q || !q.options) return false;
    const filledCount = q.options.filter(v => !v).length;
    return filledCount > q.options.length - 2;
  }

  // Správa otázek a možností
  addQuestion() {
    this.questions.push({ text: '', allowMultiple: false, options: ['', ''] });
    this.invalidQuestions.push({ text: false, options: ['', ''].map(() => false) });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
    this.invalidQuestions.splice(index, 1);
  }

  addOption(qIndex: number) {
    this.questions[qIndex].options.push('');
    this.invalidQuestions[qIndex].options.push(false);
  }

  removeOption(qIndex: number, oIndex: number) {
    this.questions[qIndex].options.splice(oIndex, 1);
    this.invalidQuestions[qIndex].options.splice(oIndex, 1);
  }

  trackByIndex(index: number) {
    return index;
  }

private validateQuestions(): boolean {
  if (this.questions.length === 0) return false;

  let isValid = true;

  this.invalidQuestions = this.questions.map(q => {
    const emptyOptions = q.options.map(opt => !opt || opt.trim() === '');
    const filledOptionsCount = q.options.length - emptyOptions.filter(v => v).length;

    const textInvalid = !q.text || q.text.trim() === '';
    const optionsInvalid = filledOptionsCount < 2;

    if (textInvalid || optionsInvalid) isValid = false;

    return {
      text: textInvalid,
      options: emptyOptions
    };
  });

  return isValid;
}


  // Odeslání ankety
  createPoll() {
    if (this.isSubmitting) return;


    this.errorMessage = '';
    this.hasSubmitted = true;

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
      title: this.title,
      showResults: this.showResults,
      questions: this.questions.map(q => ({
        text: q.text,
        allowMultiple: q.allowMultiple,
        options: q.options,
      })),
    };

    this.pollService.submitSurvey(payload).subscribe({
      next: resp => {
        this.isSubmitting = false;
        this.infoMessage = '';
        if (resp.id) this.pollStore.setPollId(resp.id);
        if (resp.slug) this.pollStore.setPollUuid(resp.slug);
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

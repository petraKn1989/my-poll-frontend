import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { PollStoreService } from "../services/poll-store";
import { PollService } from "../services/pollServices";
import { CreatePollDto } from "../../model/Poll";
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  questions = [
    { text: '', allowMultiple: false, options: ['', ''] }
  ];

  errorMessage: string = '';
  infoMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private pollService: PollService,
    private pollStore: PollStoreService,
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    // -----------------------------
    // SEO a JSON-LD
    // -----------------------------
    this.seo.setPage(
      'Vytvořit anketu zdarma | Online dotazník',
      'Vytvořte si vlastní anketu, dotazník nebo průzkum online zdarma. Sdílejte s přáteli, kolegy nebo studenty.',
      this.seo['keywordPool'] // všechna klíčová slova
    );

    this.addJsonLdSchema();
    this.updateSocialMeta();
  }

  private addJsonLdSchema() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Vytvořit anketu zdarma",
      "description": "Vytvořte si vlastní online dotazník zdarma. Klíčová slova: " + this.seo['keywordPool'].join(', '),
      "url": window.location.href,
      "mainEntity": {
        "@type": "Survey",
        "name": "Vytvořit anketu zdarma",
        "description": "Vytvořte si vlastní online dotazník zdarma. Klíčová slova: " + this.seo['keywordPool'].join(', ')
      }
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

  // -----------------------------
  // Správa otázek a možností
  // -----------------------------
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

  private isFirstQuestionValid(): boolean {
    const firstQ = this.questions[0];
    if (!firstQ) return false;

    const textFilled: boolean = !!firstQ.text && firstQ.text.trim() !== '';
    const optionsFilled: boolean =
      firstQ.options.filter(opt => opt && opt.trim() !== '').length >= 2;

    return textFilled && optionsFilled;
  }

  // -----------------------------
  // Odeslání ankety
  // -----------------------------
  createPoll() {
    if (this.isSubmitting) return;

    if (!this.isFirstQuestionValid()) {
      this.errorMessage =
        "První otázka musí být vyplněná a obsahovat alespoň 2 možnosti.";
      return;
    }

    this.errorMessage = '';
    this.infoMessage = 'Čekejte prosím, data se odesílají…';
    this.isSubmitting = true;

    const payload: CreatePollDto = {
      createdAt: new Date().toISOString(),
      questions: this.questions.map(q => ({
        text: q.text,
        allowMultiple: q.allowMultiple,
        options: q.options
      }))
    };

    this.pollService.submitSurvey(payload).subscribe({
      next: (resp) => {
        this.isSubmitting = false;
        this.infoMessage = '';
        if (resp.id) this.pollStore.setPollId(resp.id);
        this.router.navigate(['/poll-created'], { replaceUrl: true });
      },
      error: (_) => {
        this.isSubmitting = false;
        this.infoMessage = '';
        alert("Došlo k chybě při vytváření ankety.");
      }
    });
  }

}

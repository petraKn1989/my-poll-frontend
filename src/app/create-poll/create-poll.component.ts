import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { PollStoreService } from "../services/poll-store";
import { PollService } from "../services/pollServices";
import { CreatePollDto, Poll } from "../../model/Poll";
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

  constructor(
    private pollService: PollService,
    private pollStore: PollStoreService,
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    // ✅ Nastavení SEO základních meta tagů
    this.seo.setPage(
      'Vytvořit anketu zdarma | Online dotazník',
      'Vytvořte si vlastní anketu, dotazník nebo průzkum online zdarma. Sdílejte s přáteli, kolegy nebo studenty.',
      undefined // necháme SEO službu vybrat 15 klíčových slov z poolu
    );

    // ✅ JSON-LD schema.org pro WebPage / Survey
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Vytvořit anketu zdarma",
      "description": "Vytvořte si vlastní online dotazník zdarma a sledujte výsledky hlasování online.",
      "url": window.location.href
    });
    document.head.appendChild(script);

    // ✅ Open Graph & Twitter meta tagy
    this.updateSocialMeta();
  }

  private updateSocialMeta() {
    const url = window.location.href;
    const title = 'Vytvořit anketu zdarma | Online dotazník';
    const description = 'Vytvořte si vlastní anketu, dotazník nebo průzkum online zdarma. Sdílejte s přáteli, kolegy nebo studenty.';
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

  // ================== Funkce pro formulář ankety ==================
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

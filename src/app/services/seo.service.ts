import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private keywordPool = [
    'vytvořit anketu', 'vytvořit dotazník', 'vytvořit průzkum',
    'vytvořit anketu zdarma', 'vytvořit dotazník zdarma', 'online anketa zdarma',
    'hlasování online', 'rychlá anketa', 'bezplatný dotazník', 'vlastní průzkum',
    'vytvořit online průzkum', 'rychlý dotazník', 'hlasování zdarma',
    'anketa pro studenty', 'anketa pro firmu', 'dotazník pro zaměstnance',
    'online průzkum zdarma', 'vlastní anketa online', 'online hlasování',
    'interaktivní dotazník', 'hlasovací formulář', 'rychlá online anketa',
    'bezplatná anketa', 'online dotazník zdarma'
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  setPage(title: string, description: string, keywords?: string[], imageUrl?: string) {
    // Title
    this.titleService.setTitle(title);

    // Meta description
    this.metaService.updateTag({ name: 'description', content: description });

    // Keywords
    if (!keywords) {
      keywords = this.shuffleArray(this.keywordPool).slice(0, 15);
    }
    this.metaService.updateTag({ name: 'keywords', content: keywords.join(', ') });

    // Canonical link (správně jako <link>)
    const existingCanonical = document.querySelector("link[rel='canonical']");
    if (existingCanonical) existingCanonical.remove();
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.href;
    document.head.appendChild(link);

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: window.location.href });
    if (imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    }

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    if (imageUrl) {
      this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    }

    // JSON-LD Schema pro WebPage a Survey
    const existingScript = document.getElementById('json-ld-seo');
    if (existingScript) existingScript.remove();
    const script = document.createElement('script');
    script.id = 'json-ld-seo';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": window.location.href,
      "mainEntity": {
        "@type": "Survey",
        "name": title,
        "description": description
      }
    });
    document.head.appendChild(script);
  }

  private shuffleArray(arr: string[]): string[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

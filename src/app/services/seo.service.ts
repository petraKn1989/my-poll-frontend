import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private keywordPool = [
    'anketa zdarma bez registrace',
    'vytvořit online dotazník zdarma',
    'hlasování online bez přihlášení',
    'rychlý průzkum zdarma',
    'online hlasování pro studenty',
    'vytvořit anketu zdarma',
    'vytvořit dotazník zdarma',
    'hlasování online',
    'rychlá anketa',
    'bezplatný dotazník',
    'vlastní průzkum',
    'interaktivní dotazník',
    'hlasovací formulář',
    'rychlá online anketa',
    'bezplatná anketa'
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  setPage(title: string, description: string, keywords?: string[], imageUrl?: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    if (!keywords) {
      keywords = this.keywordPool;
    }
    this.metaService.updateTag({ name: 'keywords', content: keywords.join(', ') });

    // Canonical
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
    if (imageUrl) this.metaService.updateTag({ property: 'og:image', content: imageUrl });

    // Twitter
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    if (imageUrl) this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });

    // JSON-LD
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
      "keywords": keywords.join(', '),
      "url": window.location.href,
      "mainEntity": {
        "@type": "Survey",
        "name": title,
        "description": description
      }
    });
    document.head.appendChild(script);
  }
}

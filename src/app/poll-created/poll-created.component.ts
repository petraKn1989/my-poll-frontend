// src/app/poll-created/poll-created.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PollStoreService } from '../services/poll-store';
import QRCode from 'qrcode';
import emailjs from '@emailjs/browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll-created',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './poll-created.component.html',
  styleUrls: ['./poll-created.component.css'],
})
export class PollCreatedComponent implements OnInit {
  showCopyToast = false;
  pollUuid: string | null = null;
  fullFillPollLink: string = '';
  fullResultsLink: string = '';
  qrDataUrl: string | null = null;
  qrDataUrlResult: string | null = null;
  recipientEmail: string = '';

    // ---- STAVY ----
  isSendingEmail = false;
  emailSent = false;
  emailError = false;
  sendFillLink: boolean = true;    // defaultně zaškrtnuto
sendResultsLink: boolean = false; // defaultně nezaškrtnuto


  // ---- TOAST ----
  showToastEmail = false;
  toastMessage = '';

  constructor(public pollStore: PollStoreService) {}

  ngOnInit(): void {
    this.pollUuid = this.pollStore.getPollUuid();

    if (this.pollUuid) {
      const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
      this.fullFillPollLink = `${location.origin}${baseHref}#/fill-poll/${this.pollUuid}`;
      this.fullResultsLink = `${location.origin}${baseHref}#/poll-results/${this.pollUuid}`;

      // Generování QR kódu
      QRCode.toDataURL(this.fullFillPollLink)
        .then(url => this.qrDataUrl = url)
        .catch(err => console.error('Chyba při generování QR kódu:', err));

        QRCode.toDataURL(this.fullResultsLink)
        .then(url => this.qrDataUrlResult = url)
        .catch(err => console.error('Chyba při generování QR kódu:', err));
    }
  }

  copyPollLink() {
    if (!this.fullFillPollLink) return;
    navigator.clipboard.writeText(this.fullFillPollLink).then(() => this.showToast());
  }

  copyResultsLink() {
    if (!this.fullResultsLink) return;
    navigator.clipboard.writeText(this.fullResultsLink).then(() => this.showToast());
  }

  private showToast() {
    this.showCopyToast = true;
    setTimeout(() => (this.showCopyToast = false), 3000);
  }

 sendEmail(): void {
     if (!this.isValidEmail(this.recipientEmail)) {
    this.emailError = true;
    this.showToastMessage('Zadejte platnou e-mailovou adresu.');
    return;
  }

  if (!this.sendFillLink && !this.sendResultsLink) {
    this.emailError = true;
    this.showToastMessage('Vyberte alespoň jednu možnost k odeslání.');
    return;
  }

  this.isSendingEmail = true;
  this.emailSent = false;
  this.emailError = false;

  // Funkce pro odeslání e-mailu jako Promise
  const sendMailPoll = (params: any) => {
    return emailjs.send('service_h2of48k', 'template_3e9s5kh', params, 'lXnlPSTG_N5FPvYdC');
  };

  const sendMailResult = (params: any) => {
    return emailjs.send('service_h2of48k', 'template_g9zo6ir', params, 'lXnlPSTG_N5FPvYdC');
  };

  // Pole Promisů podle toho, co chceme poslat
  const promises: Promise<any>[] = [];

  if (this.sendFillLink) {
    const fillParams = {
      subject: "Odkaz na vyplnění ankety a QR kód",
      to_email: this.recipientEmail,
      fullFillPollLink: this.fullFillPollLink,
      qrLink: this.qrDataUrl,
    };
    promises.push(sendMailPoll(fillParams));
  }

  if (this.sendResultsLink) {
    const resultsParams = {
      to_email: this.recipientEmail,
      fullResultsLink: this.fullResultsLink,
   
    };
    promises.push(sendMailResult(resultsParams));
  }

  // Pošleme všechny Promisy (tj. všechny vybrané e-maily)
  Promise.all(promises)
    .then(() => {
      this.emailSent = true;
      this.showToastMessage('E-mail(y) byly úspěšně odeslány.');
      this.recipientEmail = '';
    })
    .catch(err => {
      console.error('Email chyba:', err);
      this.emailError = true;
      this.showToastMessage('E-mail(y) se nepodařilo odeslat.');
    })
    .finally(() => {
      this.isSendingEmail = false;
    });
  }

  // ---------------- UTIL ----------------
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToastEmail = true;
    setTimeout(() => (this.showToastEmail = false), 3000);
  }
}





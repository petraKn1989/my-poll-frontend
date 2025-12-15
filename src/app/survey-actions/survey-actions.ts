import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; // <-- přidat Output a EventEmitter
import { FormsModule } from '@angular/forms';
import { PollService } from '../services/pollServices';
import { PollStoreService } from '../services/poll-store';
import { ActivatedRoute } from '@angular/router';

interface SurveyAction {
  id: number;
  title: string;
  userView: string;

  colorClass: string;
  status: string;
}

@Component({
  selector: 'app-survey-actions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './survey-actions.html',
  styleUrls: ['./survey-actions.css'],
})
export class SurveyActions implements OnInit {


  // survey-actions.ts
@Input() pollId!: number;   // přidat


  @Input() pollStatus: string = 'active'; // input od rodiče
  @Output() statusChanged = new EventEmitter<string>(); // <-- tady je Output

  actionSelected: boolean = false;
  selectedActionText: string = '';

  toastMessage: string | null = null;
  toastClass: string = 'toast-success'; // výchozí barva

  actions: SurveyAction[] = [
    { id: 0, title: 'Obnovit hlasování', userView: 'K dispozici je opět formulář pro hlasování', colorClass: 'opt-blue', status: 'active' },
    { id: 1, title: 'Ukončit hlasování a zveřejnit výsledky', userView: 'Zobrazí se informační hláška „Hlasování bylo ukončeno“ a výsledky hlasování ', colorClass: 'opt-blue', status: 'finished_published' },
    { id: 2, title: 'Ukončit hlasování bez zveřejnění', userView: 'Zobrazí se hláška „Hlasování bylo ukončeno a pod ní je vidět neaktivní formulář“', colorClass: 'opt-blue', status: 'finished_hidden' },
    { id: 3, title: 'Smazat anketu', userView: 'Zobrazí se pouze hláška, že anketa byla smazaná', colorClass: 'opt-red', status: 'deleted' },
    { id: 4, title: 'Pozastavit hlasování', userView: '„Zobrazí se hláška hlasování je dočasně pozastaveno“ a formulář je neaktivní', colorClass: 'opt-blue', status: 'paused' },
  ];

  constructor(
    private pollService: PollService,
    private pollStore: PollStoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pollId = Number(id);
      }
    });
  }

   showToast(message: string, type: 'success' | 'warning' | 'error' = 'success', duration: number = 3000) {
    this.toastMessage = message;
    switch (type) {
      case 'success': this.toastClass = 'toast-success'; break;
      case 'warning': this.toastClass = 'toast-warning'; break;
      case 'error': this.toastClass = 'toast-error'; break;
    }
    setTimeout(() => {
      this.toastMessage = null;
    }, duration);
  }

  selectAction(action: SurveyAction) {

    if (!this.pollId) return;

    this.pollService.updateStatus(this.pollId, action.status).subscribe({
     
      next: (res) => {
  
        this.selectedActionText = `Status ankety změněn na: ${res.status}`;
        this.actionSelected = true;
        this.pollStatus = res.status; // aktualizujeme status pro okamžité zobrazení změn

        // ⚡ emitujeme ven rodiči
        this.statusChanged.emit(res.status);

           // Toast s různou barvou podle akce
        switch(action.id) {
          case 0: this.showToast('Hlasování bylo obnoveno', 'success'); break;
          case 1: this.showToast('Hlasování bylo ukončeno a výsledky jsou zveřejněny', 'success'); break;
          case 2: this.showToast('Hlasování bylo ukončeno (výsledky skryté)', 'warning'); break;
          case 3: this.showToast('Anketa byla smazána', 'error'); break;
          case 4: this.showToast('Hlasování je dočasně pozastaveno', 'warning'); break;
        }
      },
      error: (err) => {
        this.selectedActionText = `Chyba při změně statusu: ${err.message}`;
        this.actionSelected = true;
      }
    });
  }
}

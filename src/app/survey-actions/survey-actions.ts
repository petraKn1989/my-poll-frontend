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

  selectAction(action: SurveyAction) {
    console.log("select action");
    console.log("selectAction voláno, pollId:", this.pollId, "status:", action.status);
    if (!this.pollId) return;

    this.pollService.updateStatus(this.pollId, action.status).subscribe({
     
      next: (res) => {
         console.log("co to děla" + this.pollId);
        this.selectedActionText = `Status ankety změněn na: ${res.status}`;
        this.actionSelected = true;
        this.pollStatus = res.status; // aktualizujeme status pro okamžité zobrazení změn

        // ⚡ emitujeme ven rodiči
        this.statusChanged.emit(res.status);
      },
      error: (err) => {
        this.selectedActionText = `Chyba při změně statusu: ${err.message}`;
        this.actionSelected = true;
      }
    });
  }
}

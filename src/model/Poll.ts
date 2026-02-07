// Každá možnost otázky
export interface Option {
  id?: number;       // unikátní ID možnosti
  text: string;     // text možnosti
  votes?: number;    // počet hlasů pro tuto možnost
}

// Jedna otázka v anketě
export interface Question {
  id?: number;               // unikátní ID otázky
  text: string;             // text otázky
  allowMultiple: boolean;   // zda je povoleno více odpovědí
  options: Option[];        // pole možností
  totalVotes?: number;       // celkový počet hlasů u otázky
}

// Celá anketa
export interface Poll {
  id?: number;               // ID ankety
  createdAt: string;        // datum vytvoření (string z backendu)
  questions: Question[];    // pole otázek
  totalVotes?: number;       // celkový počet hlasů ve všech otázkách
  slug: string;
  status: string;
}

// Pro odesílání odpovědí uživatele
export interface AnswerRequest {
  pollId: number;           // ID ankety
  answers: AnswerItem[];    // pole odpovědí
  note?: string;
}

export interface AnswerItem {
  questionId: number;       // ID otázky
  selectedOptionIds: number[]; // vybrané ID možností
}

export interface CreateQuestionDto {
  text: string;
  allowMultiple: boolean;
  options: string[];
}

export interface CreatePollDto {
  createdAt: string;
  showResults: boolean,
  title: string 
  questions: CreateQuestionDto[];
}

export interface AnswerDetail {
  questionText: string;
  optionText: string;
}

export interface Submission {
  submissionId: string;
  note?: string;
  answers: AnswerDetail[];
  createdAt: string;
}


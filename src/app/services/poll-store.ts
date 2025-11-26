import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PollStoreService {
  private pollId: number | null = null;

  constructor() { }

  setPollId(id: number) {
    this.pollId = id;
  }

  getPollId(): number | null {
    return this.pollId;
  }

  clearPollId() {
    this.pollId = null;
  }
}

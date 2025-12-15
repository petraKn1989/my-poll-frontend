import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PollStoreService {
  private pollId: number | null = null;
  private pollUuid: string = '';

  constructor() {}

  setPollId(id: number) {
    this.pollId = id;
  }

  getPollId(): number | null {
    return this.pollId;
  }

  clearPollId() {
    this.pollId = null;
  }

  setPollUuid(uuid: string) {
    this.pollUuid = uuid;
  }
  getPollUuid(): string {
    return this.pollUuid;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnswerRequest, CreatePollDto, Poll, Submission } from '../../model/Poll'; 
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitSurvey(data: CreatePollDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/poll`, data);
  }

  getPoll(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.baseUrl}/polls/${id}`);
  }
  getPollbyUIID(slug: string): Observable<Poll> {
    return this.http.get<Poll>(`${this.baseUrl}/api/polls/${slug}`);
  }

  sendAnswers(data: AnswerRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/answers`, data);
  }

deletePoll(id: number) {
  return this.http.delete(`${this.baseUrl}/poll/${id}`);
}
updateStatus(pollId: number, status: string): Observable<{status: string}> {
  return this.http.patch<{status: string}>(`${this.baseUrl}/poll/${pollId}/status`, { status });
}


 getPollResultsDetail(pollId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.baseUrl}/api/submissions/${pollId}`);
  }



}

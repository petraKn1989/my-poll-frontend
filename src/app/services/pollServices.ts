import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnswerRequest, CreatePollDto, Poll } from '../../model/Poll'; 
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

  sendAnswers(data: AnswerRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/answers`, data);
  }


}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ScoreMetricRequest {
  resumeMarkdown: string;
  jobDescription: string;
}

export interface ScoreMetricResponse {
  internal_reasoning: {
    skills_logic: string;
    experience_logic: string;
    gap_analysis: string;
  };
  scores: {
    functional_alignment: number;
    seniority_impact: number;
    education_merit: number;
  };
  fit_status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScoreMetricApi {
  private http = inject(HttpClient);

  private readonly endpoint = '/api/score-metric';

  analyze(data: ScoreMetricRequest): Observable<ScoreMetricResponse> {
    return this.http.post<ScoreMetricResponse>(this.endpoint, data);
  }
}

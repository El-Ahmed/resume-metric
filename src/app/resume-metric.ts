import { computed, inject, Injectable, signal } from '@angular/core';
import { ResumeWorkflow } from './resume-workflow';
import { rxResource } from '@angular/core/rxjs-interop';
import { ScoreMetricApi, ScoreMetricRequest } from './score-metric-api';

@Injectable({
  providedIn: 'root',
})
export class ResumeMetric {
  private resumeWorkflow = inject(ResumeWorkflow);
  private scoreMetricApi = inject(ScoreMetricApi);

  private apiParams = signal<ScoreMetricRequest | undefined>(undefined);

  private scoreResource = rxResource({
    params: () => this.apiParams(),
    stream: ({ params }) => {
      return this.scoreMetricApi.analyze(params);
    },
  });

  score = computed(() => this.scoreResource.value());
  isScoreLoading = computed(() => this.scoreResource.isLoading());

  getScore() {
    const resumeMarkdown = this.resumeWorkflow.redactedText();
    const jobDescription = this.resumeWorkflow.jobDescription();
    if (!resumeMarkdown || !jobDescription) return;
    this.apiParams.set({
      resumeMarkdown,
      jobDescription,
    });
  }
}

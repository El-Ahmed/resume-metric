import { Component, computed, inject, signal } from '@angular/core';
import { ResumeSelector } from '../resume-selector/resume-selector';
import { ResumeWorkflow } from '../resume-workflow';
import { TextRedactor } from '../text-redactor/text-redactor';
import { FormsModule } from '@angular/forms';
import { ResumeMetric } from '../resume-metric';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { ScoreResult } from '../score-result/score-result';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-resume-metric-workflow',
  imports: [
    ResumeSelector,
    TextRedactor,
    FormsModule,
    HlmButtonImports,
    HlmTypographyImports,
    HlmProgressImports,
    HlmInputImports,
    ScoreResult,
    HlmSpinnerImports,
  ],
  templateUrl: './resume-metric-workflow.html',
  styleUrl: './resume-metric-workflow.css',
})
export class ResumeMetricWorkflow {
  resumeWorkflow = inject(ResumeWorkflow);
  resumeMetric = inject(ResumeMetric);
  currentStep = signal(1);

  prevStep() {
    this.currentStep.update((s) => Math.max(1, s - 1));
  }
  nextStep() {
    if (this.currentStep() === 2) {
      this.resumeMetric.getScore();
    }
    this.currentStep.update((s) => Math.min(3, s + 1));
  }
  isNextDisabled = computed(() => {
    const step = this.currentStep();
    switch (step) {
      case 1:
        return !this.resumeWorkflow.redactedText();

      case 2:
        return !this.resumeWorkflow.jobDescription();

      case 3:
        return !this.resumeMetric.score();
    }
    return true;
  });
  stepTitles = ['Resume & Redact', 'Job Description', 'Analysis Results'];
}

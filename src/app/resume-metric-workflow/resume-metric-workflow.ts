import { Component, inject } from '@angular/core';
import { ResumeSelector } from '../resume-selector/resume-selector';
import { ResumeWorkflow } from '../resume-workflow';
import { TextRedactor } from '../text-redactor/text-redactor';

@Component({
  selector: 'app-resume-metric-workflow',
  imports: [ResumeSelector, TextRedactor],
  templateUrl: './resume-metric-workflow.html',
  styleUrl: './resume-metric-workflow.css',
})
export class ResumeMetricWorkflow {
  resumeWorkflow = inject(ResumeWorkflow);
}

import { Component, inject } from '@angular/core';
import { ResumeSelector } from '../resume-selector/resume-selector';
import { ResumeWorkflow } from '../resume-workflow';
import { TextRedactor } from '../text-redactor/text-redactor';
import { FormsModule } from '@angular/forms';
import { ResumeMetric } from '../resume-metric';

@Component({
  selector: 'app-resume-metric-workflow',
  imports: [ResumeSelector, TextRedactor, FormsModule],
  templateUrl: './resume-metric-workflow.html',
  styleUrl: './resume-metric-workflow.css',
})
export class ResumeMetricWorkflow {
  resumeWorkflow = inject(ResumeWorkflow);
  resumeMetric = inject(ResumeMetric);
}

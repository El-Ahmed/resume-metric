import { Component, input } from '@angular/core';
import { ScoreMetricResponse } from '../score-metric-api';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle, lucideBriefcase, lucideCpu } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-score-result',
  imports: [HlmTypographyImports, HlmProgressImports, NgIcon, HlmIcon, HlmCardImports],
  providers: [provideIcons({ lucideBriefcase, lucideCpu, lucideAlertTriangle })],
  templateUrl: './score-result.html',
  styleUrl: './score-result.css',
})
export class ScoreResult {
  resumeScore = input<ScoreMetricResponse>();
}

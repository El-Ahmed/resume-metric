import { TestBed } from '@angular/core/testing';

import { ResumeMetric } from './resume-metric';
import { ResumeWorkflow } from './resume-workflow';
import { ScoreMetricApi } from './score-metric-api';
import { of } from 'rxjs';

describe('ResumeMetric', () => {
  let service: ResumeMetric;
  const resumeWorkflow = {
    redactedText: vi.fn(),
    jobDescription: vi.fn(),
  };
  const scoreMetricApi = {
    analyze: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ResumeWorkflow, useValue: resumeWorkflow },
        { provide: ScoreMetricApi, useValue: scoreMetricApi },
      ],
    });
    service = TestBed.inject(ResumeMetric);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api with the data from workflow service', async () => {
    const resumeMarkdown = 'resume';
    const jobDescription = 'job description';

    resumeWorkflow.redactedText.mockReturnValue(resumeMarkdown);
    resumeWorkflow.jobDescription.mockReturnValue(jobDescription);
    service.getScore();

    await vi.waitFor(() => {
      expect(scoreMetricApi.analyze).toHaveBeenCalledWith({ resumeMarkdown, jobDescription });
    });
  });

  it('should show loading while calling api and then stop loading and return result', async () => {
    resumeWorkflow.redactedText.mockReturnValue('resume');
    resumeWorkflow.jobDescription.mockReturnValue('job');
    service.getScore();

    await vi.waitFor(() => {
      expect(service.isScoreLoading()).toBe(true);
    });

    const result = {
      internal_reasoning: {
        skills_logic: 'good skills',
        experience_logic: 'good experience',
        gap_analysis: '',
      },
      scores: {
        functional_alignment: 4,
        seniority_impact: 3,
        education_merit: 2,
        structural_quality: 1,
      },
      fit_status: 'fit',
    };
    scoreMetricApi.analyze.mockReturnValue(of(result));
    await vi.waitFor(() => {
      expect(service.isScoreLoading()).toBe(false);
      expect(service.score()).toEqual(result);
    });
  });
});

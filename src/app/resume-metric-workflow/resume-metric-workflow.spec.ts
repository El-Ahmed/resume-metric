import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeMetricWorkflow } from './resume-metric-workflow';

describe('ResumeMetricWorkflow', () => {
  let component: ResumeMetricWorkflow;
  let fixture: ComponentFixture<ResumeMetricWorkflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeMetricWorkflow],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeMetricWorkflow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

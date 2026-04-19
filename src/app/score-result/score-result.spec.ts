import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreResult } from './score-result';

describe('ScoreResult', () => {
  let component: ScoreResult;
  let fixture: ComponentFixture<ScoreResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreResult],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

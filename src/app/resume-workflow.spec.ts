import { TestBed } from '@angular/core/testing';

import { ResumeWorkflow } from './resume-workflow';
import { Parser } from './parser';

const parserMock = {
  parse: vi.fn(),
};

describe('ResumeWorkflow', () => {
  let service: ResumeWorkflow;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Parser,
          useValue: parserMock,
        },
      ],
    });
    service = TestBed.inject(ResumeWorkflow);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show loading while parsing and then stop loading and return result', async () => {
    let resolve!: (v: string) => void;
    const p = new Promise<string>((r) => (resolve = r));
    parserMock.parse.mockReturnValue(p);

    await vi.waitFor(() => {
      expect(service.isResumeFileLoading()).toBe(false);
    });

    service.loadResumeFile(new File(['test'], 'test.pdf'));

    await vi.waitFor(() => {
      expect(service.isResumeFileLoading()).toBe(true);
    });

    resolve('parsed text');
    await vi.waitFor(() => {
      expect(service.isResumeFileLoading()).toBe(false);
    });
    expect(service.markdownResume()).toBe('parsed text');
  });

  it('should clear redacted text when a new resume is selected', () => {
    const text = 'this [redacted] is important';
    service.loadRedactedText(text);
    expect(service.redactedText()).toEqual(text);
    service.loadResumeFile(new File(['test'], 'test.pdf'));
    expect(service.redactedText()).toEqual(null);
  });
});

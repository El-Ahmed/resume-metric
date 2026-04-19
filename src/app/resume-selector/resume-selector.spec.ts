import { ResumeSelector } from './resume-selector';
import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

@Component({
  selector: 'app-test-resume-selector',
  imports: [ResumeSelector],
  template: `<app-resume-selector (resumeFile)="resumeFile = $event" [isLoading]="isLoading" />`,
})
export class HostComponent {
  resumeFile: File | null = null;
  isLoading = false;
}

describe('ResumeSelector', () => {
  it('should send the pdf file to the parent', async () => {
    const user = userEvent.setup();

    const { fixture } = await render(HostComponent);

    const input = screen.getByTestId('inputFile');

    const file = new File(['test'], 'test.pdf', {
      type: 'application/pdf',
    });

    await user.upload(input, file);

    expect(fixture.componentInstance.resumeFile).toBe(file);
  });

  it('should hide the select button if it is loading', async () => {
    const { fixture, detectChanges } = await render(HostComponent);
    expect(screen.queryByTestId('selectButton')).toBeInTheDocument();
    fixture.componentInstance.isLoading = true;
    detectChanges();
    expect(screen.queryByTestId('selectButton')).not.toBeInTheDocument();
  });
});

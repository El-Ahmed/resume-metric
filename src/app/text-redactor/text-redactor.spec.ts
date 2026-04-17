import { TextRedactor } from './text-redactor';
import { Component } from '@angular/core';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';

@Component({
  selector: 'app-test-text-redactor',
  imports: [TextRedactor],
  template: `<app-text-redactor [text]="text" (redactedText)="redactedText = $event" />`,
})
export class HostComponent {
  text = 'Hello world!';
  redactedText = '';
}

describe('TextRedactor', () => {
  it('should allow user to tap to redact or undo redaction', async () => {
    //when user tap a word it should have a class that will take care of visibility
    const user = userEvent.setup();

    const text = `Hello world, this is a long text.\n## Not that long but long enough.`;
    await render(HostComponent, {
      componentProperties: {
        text: text,
      },
    });

    const word = screen.getByText('Not');
    expect(word).not.toHaveClass('redacted');

    await user.click(word);
    expect(word).toHaveClass('redacted');

    await user.click(word);
    expect(word).not.toHaveClass('redacted');
  });
  it('should not affect a whole text', async () => {
    const user = userEvent.setup();
    const text = `Hello world, this is a long text.\n## Not that long but long enough.`;
    const { container } = await render(HostComponent, {
      componentProperties: {
        text: text,
      },
    });
    const paragraph = container.querySelector('p');
    expect(paragraph).not.toBeNull();
    if (!paragraph) return;
    expect(paragraph).not.toHaveClass('redacted');
    await user.click(paragraph);
    expect(paragraph).not.toHaveClass('redacted');
  });

  it('should output a text with [redacted] for every redacted word', async () => {
    const user = userEvent.setup();
    const text = 'Hello world, this is a long text.\n## Not that long but long enough.';

    const { fixture } = await render(HostComponent, {
      componentProperties: {
        text: text,
      },
    });
    expect(fixture.componentInstance.redactedText).toEqual(text);

    const word = screen.getByText('that');
    await user.click(word);

    await user.click(screen.getByText('world,'));
    await user.click(screen.getByText('Not'));
    screen
      .getAllByText('long')
      .slice(0, -1)
      .forEach((word) => user.click(word));

    await user.click(word);

    const redactedText =
      'Hello [redacted] this is a [redacted] text.\n## [redacted] that [redacted] but long enough.';
    expect(fixture.componentInstance.redactedText).toEqual(redactedText);
  });

  it('should not show emails as clickable', async () => {
    const text = `Hello my mail is myname@email.com don't link to it.`;
    const { container } = await render(HostComponent, {
      componentProperties: {
        text: text,
      },
    });
    const link = container.querySelector('a');
    expect(link).toBeNull();
  });
});

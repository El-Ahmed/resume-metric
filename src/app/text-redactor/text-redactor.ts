import { Component, computed, effect, ElementRef, input, output, viewChild } from '@angular/core';
import {
  MarkdownModule,
  MARKED_OPTIONS,
  MarkedOptions,
  MarkedRenderer,
  provideMarkdown,
} from 'ngx-markdown';
import { Parser } from 'marked';

function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.paragraph = ({ tokens }) => {
    const html = Parser.parseInline(tokens);

    const doc = new DOMParser().parseFromString(html, 'text/html');

    const wrapWords = (node: Node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const span = doc.createElement('span');

          span.innerHTML =
            child.textContent?.replace(/(\S+)/g, '<span class="word">$1</span>') ?? '';

          child.replaceWith(span);
        } else {
          wrapWords(child);
        }
      });
    };

    wrapWords(doc.body);

    return `<p>${doc.body.innerHTML}</p>`;
  };

  renderer.heading = ({ tokens, depth }) => {
    const text = Parser.parseInline(tokens);
    const wrapped = text.replace(/(\S+)/g, '<span class="word">$1</span>');
    return `<h${depth}>${wrapped}</h${depth}>`;
  };

  return { renderer };
}

@Component({
  selector: 'app-text-redactor',
  imports: [MarkdownModule],
  templateUrl: './text-redactor.html',
  styleUrl: './text-redactor.css',
  providers: [
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
      },
    }),
  ],
})
export class TextRedactor {
  text = input<string>('');
  redactedText = output<string>();
  markdownContainer = viewChild.required<ElementRef<HTMLDivElement>>('markdownContainer');

  constructor() {
    effect(() => {
      this.redactedText.emit(this.text());
    });
  }

  toggleWordRedaction(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('word')) return;
    target.classList.toggle('redacted');
    this.generateRedactedText();
  }
  generateRedactedText() {
    const words = Array.from(this.markdownContainer().nativeElement.querySelectorAll('.word'));
    const redactedWords = words.filter((word) => word.classList.contains('redacted'));
    const redactedWordsOcc = redactedWords.map((redactedWord) => {
      const sameWordList = words.filter((word) => word.textContent === redactedWord.textContent);
      return {
        index: sameWordList.findIndex((word) => word === redactedWord),
        word: redactedWord.textContent,
      };
    });
    const redactedText = this.redactWords(this.text(), redactedWordsOcc);
    this.redactedText.emit(redactedText);
  }

  redactWords(text: string, wordList: { word: string; index: number }[]) {
    const groupedWordList: Record<string, number[]> = wordList.reduce((prev: any, curr) => {
      const grouped = { ...prev };
      if (!grouped[curr.word]) {
        grouped[curr.word] = [];
      }
      grouped[curr.word].push(curr.index);
      return grouped;
    }, {});

    let redactedText = text;
    for (const [word, indexes] of Object.entries(groupedWordList)) {
      let count = 0;
      redactedText = redactedText.replace(/\S+/g, (currentWord) => {
        if (currentWord === word && indexes.includes(count++)) {
          return '[redacted]';
        }
        return currentWord;
      });
    }

    return redactedText;
  }
}

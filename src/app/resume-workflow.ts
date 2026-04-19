import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Parser } from './parser';

@Injectable({
  providedIn: 'root',
})
export class ResumeWorkflow {
  private parser = inject(Parser);
  resumeFile = signal<File | null>(null);
  private loader = async (file: File | null) => {
    if (!file) return '';
    return await this.parser.parse(file);
  };

  private resumeResource = resource({
    params: () => ({ resumeFile: this.resumeFile() }),
    loader: ({ params }) => {
      return this.loader(params.resumeFile);
    },
  });

  markdownResume = computed(() => this.resumeResource.value());
  isResumeFileLoading = computed(() => this.resumeResource.isLoading());

  loadResumeFile(resumePdf: File) {
    this.redactedTextValue.set(null);
    this.resumeFile.set(resumePdf);
  }

  private redactedTextValue = signal<string | null>(null);
  loadRedactedText(redactedText: string) {
    this.redactedTextValue.set(redactedText);
  }
  redactedText = computed(() => this.redactedTextValue());

  jobDescription = signal<string | null>(null);

  resetWorkflow() {
    this.jobDescription.set(null);
    this.redactedTextValue.set(null);
    this.resumeFile.set(null);
  }
}

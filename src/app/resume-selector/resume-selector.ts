import { Component, input, output } from '@angular/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileUp } from '@ng-icons/lucide';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-resume-selector',
  imports: [NgIcon, HlmIcon, HlmSpinnerImports, HlmTypographyImports, HlmButtonImports],
  providers: [provideIcons({ lucideFileUp })],
  templateUrl: './resume-selector.html',
  styleUrl: './resume-selector.css',
})
export class ResumeSelector {
  resumeFile = output<File>();
  isLoading = input<boolean>(false);
  selectedResume = input<File | null>();

  onFileSelected = ($event: Event) => {
    const input = $event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.resumeFile.emit(file);
  };
}

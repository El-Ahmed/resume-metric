import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-resume-selector',
  imports: [],
  templateUrl: './resume-selector.html',
  styleUrl: './resume-selector.css',
})
export class ResumeSelector {
  resumeFile = output<File>();
  isLoading = input<boolean>(false);

  onFileSelected = ($event: Event) => {
    const input = $event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.resumeFile.emit(file);
  };
}

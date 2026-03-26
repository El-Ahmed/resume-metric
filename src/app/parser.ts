import { Injectable } from '@angular/core';
import pdf2md from '@opendocsg/pdf2md';

@Injectable({
  providedIn: 'root',
})
export class Parser {
  async parse(file: File | null): Promise<string> {
    if (!file) return '';
    const buffer = await file.arrayBuffer();
    return await pdf2md(buffer);
  }
}

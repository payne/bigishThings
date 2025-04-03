// thingie-uploader.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FileProcessorService } from './file-processor.service';
import { ThingieService } from './thingie.service';

@Component({
  selector: 'app-thingie-uploader',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [
    ThingieService,
    FileProcessorService
  ],
  templateUrl: './thingie-uploader.component.html',
  styleUrls: ['./thingie-uploader.component.scss']
})
export class ThingieUploaderComponent {
  isUploading = false;
  progress = 0;
  currentItem = 0;
  totalItems = 0;
  processingError: string | null = null;

  constructor(private fileProcessorService: FileProcessorService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/json') {
        this.processFile(file);
      } else {
        this.processingError = 'Please select a JSON file';
      }
    }
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  processFile(file: File): void {
    this.isUploading = true;
    this.progress = 0;
    this.currentItem = 0;
    this.totalItems = 0;
    this.processingError = null;

    this.fileProcessorService.processJsonFile(file).subscribe({
      next: (status) => {
        this.progress = status.progress;
        this.currentItem = status.currentItem;
        this.totalItems = status.totalItems;
      },
      error: (err) => {
        this.isUploading = false;
        this.processingError = `Error processing file: ${err.message}`;
        console.error('Error processing file:', err);
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }
}



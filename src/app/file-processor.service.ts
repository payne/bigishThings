// file-processor.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, concatMap, of } from 'rxjs';
import { ThingieService } from './thingie.service';
import { Thingie } from './thingie.model';

@Injectable({
  providedIn: 'root'
})
export class FileProcessorService {
  constructor(private thingieService: ThingieService) {}

  processJsonFile(file: File, chunkSize: number = 100): Observable<any> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        try {
          const jsonData: Thingie[] = JSON.parse(event.target.result);
          const totalThingies = jsonData.length;
          let processedCount = 0;

          // Process in chunks
          const processChunk = (startIndex: number) => {
            const endIndex = Math.min(startIndex + chunkSize, totalThingies);
            const chunk = jsonData.slice(startIndex, endIndex);

            // Process each Thingie in the chunk one at a time
            from(chunk).pipe(
              concatMap(thingie => this.thingieService.processThingie(thingie))
            ).subscribe({
              next: (response) => {
                processedCount++;
                observer.next({
                  progress: (processedCount / totalThingies) * 100,
                  currentItem: processedCount,
                  totalItems: totalThingies,
                  response
                });
              },
              error: (err) => observer.error(err),
              complete: () => {
                if (endIndex < totalThingies) {
                  // Process next chunk
                  processChunk(endIndex);
                } else {
                  // All chunks processed
                  observer.complete();
                }
              }
            });
          };

          // Start processing from the first chunk
          processChunk(0);
        } catch (error) {
          observer.error(error);
        }
      };

      reader.onerror = (error) => observer.error(error);

      // Read the file as text
      reader.readAsText(file);
    });
  }
}


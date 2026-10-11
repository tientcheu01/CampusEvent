import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileNames',
  standalone: true
})
export class FileNamesPipe implements PipeTransform {
  transform(files: File[] | null): string {
    if (!files || files.length === 0) return '';
    return files.map(f => f.name).join(', ');
  }
}

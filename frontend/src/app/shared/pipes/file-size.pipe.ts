import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalSize',
  standalone: true
})
export class TotalSizePipe implements PipeTransform {
  transform(files: File[] | null): string {
    if (!files || files.length === 0) return '0.00';
    const total = files.reduce((sum, f) => sum + f.size, 0);
    return (total / (1024 * 1024)).toFixed(2);
  }
}

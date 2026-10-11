import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const toFiles = (v: unknown): File[] => (Array.isArray(v) ? v : v instanceof File ? [v] : []);

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`;
}

export const maxFileSize =
  (mb: number): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null =>
    toFiles(c.value).some((f) => f.size > mb * 1024 * 1024) ? { fileSize: { mb } } : null;

/** extensions : ['pdf'], ['mp4'], ['jpg', 'jpeg', 'png', 'webp'] */
export const fileExtensions =
  (extensions: string[]): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null =>
    toFiles(c.value).some((f) => !extensions.includes(f.name.split('.').pop()?.toLowerCase() ?? '')) ? { fileType: { extensions } } : null;

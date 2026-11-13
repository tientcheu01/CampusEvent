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
    toFiles(c.value).some((f) => f && f.size > mb * 1024 * 1024) ? { fileSize: { mb } } : null;

/**
 * Valide les extensions autorisées.
 * Pour les images, accepte automatiquement tout type MIME image/* ainsi que les variantes courantes.
 */
export const fileExtensions =
  (extensions: string[]): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null => {
    const files = toFiles(c.value);
    if (!files.length) return null;

    const allowed = extensions.map((e) => e.toLowerCase().trim());
    const isImageRule = allowed.some((e) => ['jpg', 'jpeg', 'png', 'webp'].includes(e));

    const invalid = files.some((f) => {
      if (!f || !f.name) return false;
      const parts = f.name.split('.');
      const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase().trim() : '';

      if (allowed.includes(ext)) return false;

      // Si c'est une règle d'image, accepter les formats d'image standards du web et mobiles
      if (isImageRule) {
        if (f.type && f.type.startsWith('image/')) return false;
        if (['jpg', 'jpeg', 'jpe', 'png', 'webp', 'gif', 'svg', 'avif', 'heic', 'heif', 'bmp', 'jfif', 'ico'].includes(ext)) {
          return false;
        }
      }

      return true;
    });

    return invalid ? { fileType: { extensions } } : null;
  };

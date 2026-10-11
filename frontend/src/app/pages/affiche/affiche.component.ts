import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { SITE_URL } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button.component';

const FONTS: { family: string; file: string; weight: string }[] = [
  { family: 'Bricolage Grotesque', file: 'BricolageGrotesque-Variable.woff2', weight: '200 800' },
  { family: 'Satoshi', file: 'Satoshi-400.woff2', weight: '400' },
  { family: 'JetBrains Mono', file: 'JetBrainsMono-400.woff2', weight: '400' },
];

const toBase64 = (buf: ArrayBuffer): string => {
  let s = '';
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
};

/** /affiche : l'affiche officielle en SVG animé, partageable, téléchargeable en PNG et imprimable. */
@Component({
  selector: 'sji-affiche',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './affiche.component.html',
  styleUrl: './affiche.component.scss',
})
export class AfficheComponent {
  private readonly poster = viewChild.required<ElementRef<SVGSVGElement>>('poster');
  protected readonly busy = signal(false);
  protected readonly message = signal('');

  async downloadPng(): Promise<void> {
    this.busy.set(true);
    try {
      const svg = this.poster().nativeElement.cloneNode(true) as SVGSVGElement;
      svg.setAttribute('width', '1080');
      svg.setAttribute('height', '1530');
      // Une image SVG ne charge pas les polices de la page : on les embarque en base64.
      const css = (
        await Promise.all(
          FONTS.map(async (f) => {
            const data = toBase64(await (await fetch(`/assets/fonts/${f.file}`)).arrayBuffer());
            return `@font-face{font-family:'${f.family}';font-weight:${f.weight};src:url(data:font/woff2;base64,${data}) format('woff2')}`;
          }),
        )
      ).join('');
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = `${css}.t-disp{font-family:'Bricolage Grotesque';font-weight:800}.t-body{font-family:'Satoshi'}.t-mono{font-family:'JetBrains Mono'}`;
      svg.prepend(style);

      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      await new Promise<void>((ok, ko) => {
        img.onload = () => ok();
        img.onerror = () => ko(new Error('image'));
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = 1620; // 1,5× pour une impression correcte
      canvas.height = 2295;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/png'));
      if (!blob) throw new Error('png');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'affiche-sji-innova-2027.png';
      a.click();
      URL.revokeObjectURL(a.href);
      this.message.set('Affiche téléchargée.');
    } catch {
      this.message.set('Le téléchargement a échoué. Faites une capture d’écran ou imprimez la page.');
    } finally {
      this.busy.set(false);
    }
  }

  async share(): Promise<void> {
    const data = { title: 'SJI INNOVA 2027', text: "Imaginez. Innover. Construire demain. Le concours d'innovation étudiante de Saint Jean Ingénieur.", url: `${SITE_URL}/affiche` };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* partage annulé */
      }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, '_blank', 'noopener');
  }

  print(): void {
    window.print();
  }
}

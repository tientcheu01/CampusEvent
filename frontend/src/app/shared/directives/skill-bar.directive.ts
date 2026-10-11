import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSkillBar]',
  standalone: true
})
export class SkillBarDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const percentage = this.el.nativeElement.getAttribute('data-percentage');
          const line = this.el.nativeElement.querySelector('.line') as HTMLElement | null;
          if (line && percentage) {
            this.renderer.setStyle(line, '--width', `${percentage}%`);
            this.renderer.setAttribute(line, 'data-percentage', `${percentage}%`);
          }
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

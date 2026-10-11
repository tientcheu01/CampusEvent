import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderLink } from '../../shared/components/header/header.component';

interface ConfettiPiece {
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  speed: number;
  angle: number;
  oscillationSpeed: number;
}

@Component({
  selector: 'app-merci',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './merci.component.html',
  styleUrl: './merci.component.scss'
})
export class MerciComponent implements OnInit, OnDestroy {
  @ViewChild('confettiCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  headerLinks: HeaderLink[] = [
    { label: 'Accueil', route: ['/'] },
    { label: 'Nouvelle Inscription', route: ['/inscription'], isButton: true }
  ];

  private ctx!: CanvasRenderingContext2D;
  private confetti: ConfettiPiece[] = [];
  private animationId = 0;
  private width = 0;
  private height = 0;
  private readonly colors = ['#0D3B66', '#EE6C4D', '#F4D35E', '#FAF0CA'];

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initConfetti();
    this.animate();
    window.addEventListener('resize', this.resize);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
  }

  private readonly resize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
  };

  private initConfetti(): void {
    for (let i = 0; i < 100; i++) {
      this.confetti.push(this.createPiece());
    }
  }

  private createPiece(): ConfettiPiece {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height - this.height,
      rotation: Math.random() * 360,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      oscillationSpeed: Math.random() * 0.05 + 0.01
    };
  }

  private readonly animate = (): void => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.confetti.forEach((p) => {
      p.y += p.speed;
      p.rotation += p.speed;
      p.angle += p.oscillationSpeed;
      p.x += Math.cos(p.angle) * 1;

      if (p.y > this.height) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }

      this.drawPiece(p);
    });
    this.animationId = requestAnimationFrame(this.animate);
  };

  private drawPiece(p: ConfettiPiece): void {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    this.ctx.fillStyle = p.color;
    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    this.ctx.restore();
  }
}

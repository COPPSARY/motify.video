import { AfterViewInit, Component, ElementRef, Input, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

@Component({
  selector: 'app-pattern-waves',
  standalone: true,
  template: '<div #host class="pattern-waves"><canvas #fallbackCanvas aria-hidden="true"></canvas></div>',
  styleUrl: './pattern-waves.component.css',
})
export class PatternWavesComponent implements AfterViewInit, OnDestroy {
  @Input() preset: 'silk' | 'ocean' | 'pond' | 'lines' | 'terminal' | 'mesh' = 'silk';
  @Input() color = '#ffffff';
  @Input() backgroundColor = '#000000';
  @Input() fade: 'edges' | 'center' | 'bottom' | 'top' | 'none' = 'edges';
  @Input() spacing = 9;
  @Input() depth = 0.95;
  @Input() shine = 0.8;
  @Input() contrast = 1.2;
  @Input() speed = 0.35;
  @Input() scale = 1;
  @Input() direction = 20;
  @Input() opacity = 1;
  @Input() interactive = true;
  @Input() cursorSize = 50;
  @Input() cursorStrength = 0.6;
  @Input() paused = false;

  @ViewChild('host', { static: true }) private readonly host?: ElementRef<HTMLDivElement>;
  @ViewChild('fallbackCanvas', { static: true }) private readonly fallbackCanvas?: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);
  private renderer?: Renderer;
  private mesh?: Mesh;
  private resizeObserver?: ResizeObserver;
  private animationFrame = 0;
  private fallbackContext?: CanvasRenderingContext2D;
  private readonly pointer = { x: 0.5, y: 0.5, active: 0 };
  private readonly onPointerMove = (event: PointerEvent) => this.updatePointer(event);
  private readonly onPointerLeave = () => { this.pointer.active = 0; };

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.host) return;
    const host = this.host.nativeElement;
    host.style.backgroundColor = this.backgroundColor;
    this.fallbackContext = this.fallbackCanvas?.nativeElement.getContext('2d') ?? undefined;
    try {
      this.renderer = new Renderer({ alpha: true, antialias: false, depth: false });
      const gl = this.renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const geometry = new Triangle(gl);
      this.mesh = new Mesh(gl, {
        geometry,
        program: new Program(gl, {
          vertex: `#version 300 es
            in vec2 position;
            void main() { gl_Position = vec4(position, 0.0, 1.0); }`,
          fragment: `#version 300 es
            precision highp float;
            uniform vec2 uResolution;
            uniform float uTime;
            uniform vec2 uPointer;
            uniform float uPointerActive;
            uniform vec3 uColor;
            uniform float uSpacing;
            uniform float uDepth;
            uniform float uShine;
            uniform float uContrast;
            uniform float uDirection;
            uniform float uOpacity;
            out vec4 fragColor;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y); }
            void main() {
              vec2 uv = gl_FragCoord.xy / uResolution;
              vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uSpacing;
              float angle = uDirection * 0.0174533;
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              p = rot * p;
              float wave = sin(p.x * 0.14 + sin(p.y * 0.08 + uTime * 0.28) * 2.4 - uTime * 0.72);
              wave += 0.42 * sin(p.x * 0.25 + p.y * 0.075 - uTime * 0.45);
              wave += 0.28 * noise(p * 0.045 + vec2(uTime * 0.18, -uTime * 0.12));
              float distanceToPointer = distance(uv, uPointer);
              float wake = exp(-distanceToPointer * distanceToPointer / 0.018) * uPointerActive;
              float rings = sin(distanceToPointer * 115.0 - uTime * 7.0) * exp(-distanceToPointer * 18.0) * uPointerActive;
              wave += wake * 0.4 + rings * 0.95;
              float level = smoothstep(-0.72, 0.82, wave) * uDepth;
              float size = 0.08 + level * 0.42;
              vec2 cell = fract(gl_FragCoord.xy / uSpacing) - 0.5;
              float dotMark = 1.0 - smoothstep(size - 0.08, size, length(cell));
              float highlight = pow(max(0.0, wave * 0.5 + 0.5), 2.2) * uShine;
              float tone = clamp(dotMark * (0.25 + level * 0.75 + highlight * 0.35) * uContrast, 0.0, 1.0);
              float edgeFade = 1.0 - smoothstep(0.54, 0.78, length(uv * 2.0 - 1.0));
              fragColor = vec4(uColor * tone, tone * edgeFade * uOpacity);
            }`,
          uniforms: {
            uResolution: { value: [1, 1] },
            uTime: { value: 0 },
            uPointer: { value: [0.5, 0.5] },
            uPointerActive: { value: 0 },
            uColor: { value: this.parseColor(this.color) },
            uSpacing: { value: this.spacing },
            uDepth: { value: this.depth },
            uShine: { value: this.shine },
            uContrast: { value: this.contrast },
            uDirection: { value: this.direction },
            uOpacity: { value: this.opacity },
          },
        }),
      });
      host.addEventListener('pointermove', this.onPointerMove, { passive: true });
      host.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(host);
      this.resize();
      this.animate(0);
    } catch {
      host.style.backgroundColor = this.backgroundColor;
    }
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.animationFrame);
    this.resizeObserver?.disconnect();
    const host = this.host?.nativeElement;
    host?.removeEventListener('pointermove', this.onPointerMove);
    host?.removeEventListener('pointerleave', this.onPointerLeave);
    this.renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private resize(): void {
    const host = this.host?.nativeElement;
    if (!host || !this.renderer || !this.mesh) return;
    this.renderer.setSize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight));
    const canvas = this.fallbackCanvas?.nativeElement;
    if (canvas && this.fallbackContext) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(host.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(host.clientHeight * dpr));
      canvas.style.width = `${host.clientWidth}px`;
      canvas.style.height = `${host.clientHeight}px`;
      this.fallbackContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const resolution = this.mesh.program.uniforms['uResolution'];
    resolution.value = [host.clientWidth, host.clientHeight];
  }

  private animate(time: number): void {
    this.drawFallback(time);
    if (!this.renderer || !this.mesh) {
      this.animationFrame = requestAnimationFrame((next) => this.animate(next));
      return;
    }
    const uniforms = this.mesh.program.uniforms;
    uniforms['uTime'].value = this.paused ? 0 : time * 0.001 * this.speed * this.scale;
    uniforms['uPointer'].value = [this.pointer.x, 1 - this.pointer.y];
    uniforms['uPointerActive'].value = this.interactive ? this.pointer.active * this.cursorStrength * Math.max(0.1, this.cursorSize / 50) : 0;
    this.renderer.render({ scene: this.mesh });
    this.animationFrame = requestAnimationFrame((next) => this.animate(next));
  }

  private drawFallback(time: number): void {
    const canvas = this.fallbackCanvas?.nativeElement;
    const context = this.fallbackContext;
    const host = this.host?.nativeElement;
    if (!canvas || !context || !host) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    context.clearRect(0, 0, width, height);
    const t = time * 0.001 * this.speed;
    const spacing = Math.max(6, this.spacing);
    const pointerX = this.pointer.x * width;
    const pointerY = this.pointer.y * height;
    const white = this.parseColor(this.color).map((channel) => Math.round(channel * 255));
    const cobalt = [31, 69, 176];
    for (let y = spacing * 0.5; y < height; y += spacing) {
      for (let x = spacing * 0.5; x < width; x += spacing) {
        const nx = (x - width * 0.5) / 360;
        const ny = (y - height * 0.5) / 360;
        let wave = Math.sin(nx * 4.2 + Math.sin(ny * 2.5 + t * 0.8) * 2.1 - t * 1.6);
        wave += 0.35 * Math.sin(nx * 8.1 + ny * 2.2 - t * 0.9);
        const distance = Math.hypot(x - pointerX, y - pointerY);
        wave += Math.sin(distance * 0.12 - t * 6) * Math.exp(-distance / 150) * this.pointer.active * this.cursorStrength;
        const level = Math.max(0, Math.min(1, (wave + 1.1) / 2.1));
        const edge = 1 - Math.min(1, Math.hypot((x / width - 0.5) * 2, (y / height - 0.5) * 2));
        const radius = 0.7 + level * 3.6;
        const alpha = Math.max(0, edge) * (0.22 + level * 0.78) * this.opacity;
        const blend = Math.pow(level, 3.1);
        const red = Math.round(cobalt[0] + (white[0] - cobalt[0]) * blend);
        const green = Math.round(cobalt[1] + (white[1] - cobalt[1]) * blend);
        const blue = Math.round(cobalt[2] + (white[2] - cobalt[2]) * blend);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  private updatePointer(event: PointerEvent): void {
    if (!this.interactive || !this.host) return;
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.pointer.x = (event.clientX - rect.left) / Math.max(1, rect.width);
    this.pointer.y = (event.clientY - rect.top) / Math.max(1, rect.height);
    this.pointer.active = 1;
  }

  private parseColor(value: string): [number, number, number] {
    const hex = value.replace('#', '');
    const normalized = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
    const number = Number.parseInt(normalized, 16);
    return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255];
  }
}

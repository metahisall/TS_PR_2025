export class ShakeAnimator {
  private element: HTMLImageElement;
  private animationFrameId: number | null = null;
  private startTime = 0;

  private readonly SHAKE_DISTANCE = 3;
  private readonly SHAKE_SPEED = 0.5;

  constructor(element: HTMLImageElement) {
    this.element = element;
    this.initStyles();
    this.attachEvents();
  }

  private initStyles(): void {
    this.element.style.transition = "transform 0.1s ease-out";
    this.element.style.transform = "translate(0,0)";
  }

  private shakeLoop = (timestamp: number): void => {
    if (!this.startTime) this.startTime = timestamp;

    const elapsed = timestamp - this.startTime;

    const offsetX =
      Math.sin(elapsed * 0.01 * this.SHAKE_SPEED) * this.SHAKE_DISTANCE;
    const offsetY =
      Math.cos(elapsed * 0.01 * this.SHAKE_SPEED * 1.5) * this.SHAKE_DISTANCE;

    this.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    this.animationFrameId = requestAnimationFrame(this.shakeLoop);
  };

  private startShake = (): void => {
    if (!this.animationFrameId) {
      this.startTime = 0;
      this.animationFrameId = requestAnimationFrame(this.shakeLoop);
    }
  };

  private stopShake = (): void => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.element.style.transform = "translate(0,0)";
  };

  private attachEvents(): void {
    this.element.addEventListener("mouseover", this.startShake);
    this.element.addEventListener("mouseout", this.stopShake);
  }
}

export class IconHighlighter {
  private wrapper: HTMLElement;
  private icon: HTMLElement | null;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.icon = wrapper.querySelector(".icon");

    this.initStyles();
    this.attachEvents();
  }

  private initStyles(): void {
    if (this.icon) {
      this.icon.style.transition = "filter 0.15s ease-out";
      this.icon.style.filter = "";
    }
    this.wrapper.style.transition = "color 0.15s ease-out";
  }

  private highlight = (): void => {
    if (this.icon) this.icon.style.filter = "sepia(1) brightness(2)";
    this.wrapper.style.color = "#100a03";
  };

  private removeHighlight = (): void => {
    if (this.icon) this.icon.style.filter = "";
    this.wrapper.style.color = "";
  };

  private attachEvents(): void {
    this.wrapper.addEventListener("mouseover", this.highlight);
    this.wrapper.addEventListener("mouseout", this.removeHighlight);
  }
}

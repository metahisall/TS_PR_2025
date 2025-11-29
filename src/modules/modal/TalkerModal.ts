import { injectStyles } from "../utils/injectStyles";
import type { QuoteData } from "../../types/index";

export class TalkerModal {
  private modal: HTMLElement | null = null;

  public async open(
    image: string,
    name: string,
    quoteId: number
  ): Promise<void> {
    if (!this.modal) this.createModal();

    this.setContent(image, name);
    await this.loadQuote(quoteId);

    const scrollY = window.scrollY;
    document.body.classList.add("talker-modal-open");
    document.body.style.top = `-${scrollY}px`;

    this.modal!.style.display = "flex";

    requestAnimationFrame(() => {
      const content = this.modal!.querySelector(".talker-modal-content")!;
      content.scrollTop = 0;
    });
  }

  public close(): void {
    if (this.modal) this.modal.style.display = "none";

    const scrollY = Math.abs(parseInt(document.body.style.top || "0"));
    document.body.classList.remove("talker-modal-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  }

  private createModal(): void {
    this.modal = document.createElement("div");
    this.modal.className = "talker-modal";
    this.modal.innerHTML = `
      <div class="talker-modal-backdrop"></div>
      <div class="talker-modal-content">
        <img class="talker-modal-img" src="" alt="Talker">
        <p class="talker-modal-name"></p>
        <p class="talker-modal-quote"></p>
        <button class="talker-close-btn">Закрити</button>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.injectStyles();

    this.modal
      .querySelector(".talker-modal-backdrop")!
      .addEventListener("click", () => this.close());

    this.modal
      .querySelector(".talker-close-btn")!
      .addEventListener("click", () => this.close());
  }

  private injectStyles(): void {
    injectStyles(`
      body.talker-modal-open { position: fixed; width: 100%; overflow-y: scroll; }

      .talker-modal {
        position: fixed; inset: 0; display: none;
        justify-content: center; align-items: center; z-index: 9999;
      }

      .talker-modal-backdrop {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.55); backdrop-filter: blur(2px);
      }

      .talker-modal-content {
        z-index: 9999;
        background: #fff; padding: 20px; border-radius: 12px;
        width: 90%; max-width: 360px;
        max-height: 90vh; overflow-y: auto;
        animation: fadeIn .25s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `);
  }

  private setContent(img: string, name: string): void {
    this.modal!.querySelector(".talker-modal-img")!.setAttribute("src", img);
    this.modal!.querySelector(".talker-modal-name")!.textContent = name;
  }

  private async loadQuote(id: number): Promise<void> {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${id}`
    );
    const data = (await res.json()) as QuoteData;

    this.modal!.querySelector(".talker-modal-quote")!.textContent = data.body;
  }
}

import { ShakeAnimator } from "./modules/animations/ShakeAnimator";
import { IconHighlighter } from "./modules/animations/IconHighlighter";
import { TalkerModal } from "./modules/modal/TalkerModal";
import { injectStyles } from "./modules/utils/injectStyles";

// Ховер карток
injectStyles(`
  .grid-column {
    text-align:center;
    padding:10px;
    transition: transform .15s ease-out, box-shadow .15s ease-out;
  }

  .grid-column:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.15);
    cursor: pointer;
  }
`);

const imgSmall = document.querySelector<HTMLImageElement>("h1 img");
const imgBig = document.querySelector<HTMLImageElement>("img.mb3");
const iconItems = document.querySelectorAll<HTMLElement>(".mt1");

if (imgSmall) new ShakeAnimator(imgSmall);
if (imgBig) new ShakeAnimator(imgBig);

iconItems.forEach((el) => new IconHighlighter(el));

const talkerModal = new TalkerModal();
const talkerCards = document.querySelectorAll(".grid-column");

talkerCards.forEach((card, index) => {
  const img = card.querySelector("img");
  const name = card.querySelector("p")?.textContent ?? "Unknown";

  if (!img) return;

  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    talkerModal.open(img.src, name, index + 1);
  });
});

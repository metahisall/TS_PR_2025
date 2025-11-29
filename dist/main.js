import { ShakeAnimator } from "./modules/animations/ShakeAnimator.js";
import { IconHighlighter } from "./modules/animations/IconHighlighter.js";
import { TalkerModal } from "./modules/modal/TalkerModal.js";
import { injectStyles } from "./modules/utils/injectStyles.js";
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
const imgSmall = document.querySelector("h1 img");
const imgBig = document.querySelector("img.mb3");
const iconItems = document.querySelectorAll(".mt1");
if (imgSmall) new ShakeAnimator(imgSmall);
if (imgBig) new ShakeAnimator(imgBig);
iconItems.forEach((el) => new IconHighlighter(el));
const talkerModal = new TalkerModal();
const talkerCards = document.querySelectorAll(".grid-column");
talkerCards.forEach((card, index) => {
  var _a, _b;
  const img = card.querySelector("img");
  const name =
    (_b =
      (_a = card.querySelector("p")) === null || _a === void 0
        ? void 0
        : _a.textContent) !== null && _b !== void 0
      ? _b
      : "Unknown";
  if (!img) return;
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    talkerModal.open(img.src, name, index + 1);
  });
});

"use strict";
//------------------------------------------------------
// АНІМАЦІЯ ЛЕГКОГО СТРУСУ ПРИ НАВЕДЕННІ
//------------------------------------------------------
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ShakeAnimator {
    constructor(element) {
        this.animationFrameId = null;
        this.startTime = 0;
        // Максимальний радіус зміщення та інтенсивність руху
        this.SHAKE_DISTANCE = 3;
        this.SHAKE_SPEED = 0.5;
        // Безкінечний цикл дрібного руху елемента (створює ефект "тремтіння")
        this.shakeLoop = (timestamp) => {
            if (!this.startTime)
                this.startTime = timestamp;
            const elapsed = timestamp - this.startTime;
            const offsetX = Math.sin(elapsed * 0.01 * this.SHAKE_SPEED) * this.SHAKE_DISTANCE;
            const offsetY = Math.cos(elapsed * 0.01 * this.SHAKE_SPEED * 1.5) * this.SHAKE_DISTANCE;
            this.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            this.animationFrameId = requestAnimationFrame(this.shakeLoop);
        };
        // Запуск анімації при наведенні
        this.startShake = () => {
            if (!this.animationFrameId) {
                this.startTime = 0;
                this.animationFrameId = requestAnimationFrame(this.shakeLoop);
            }
        };
        // Зупинка анімації та повернення елемента в початкову позицію
        this.stopShake = () => {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            this.element.style.transform = "translate(0,0)";
        };
        this.element = element;
        this.initStyles(); // Базові стилі для коректної анімації
        this.attachEvents(); // Прив’язуємо реакції на наведення миші
    }
    // Початкові стилі, щоб зміна transform відбувалася плавно
    initStyles() {
        this.element.style.transition = "transform 0.1s ease-out";
        this.element.style.transform = "translate(0,0)";
    }
    // Вішаємо події наведення й виходу курсора
    attachEvents() {
        this.element.addEventListener("mouseover", this.startShake);
        this.element.addEventListener("mouseout", this.stopShake);
    }
}
//------------------------------------------------------
// ПІДСВІЧУВАННЯ ІКОН ПРИ НАВЕДЕННІ
//------------------------------------------------------
class IconHighlighter {
    constructor(wrapper) {
        // Увімкнення підсвічування
        this.highlight = () => {
            if (this.icon)
                this.icon.style.filter = "sepia(1) brightness(2)";
            this.wrapper.style.color = "#100a03";
        };
        // Вимкнення стилів
        this.removeHighlight = () => {
            if (this.icon)
                this.icon.style.filter = "";
            this.wrapper.style.color = "";
        };
        this.wrapper = wrapper;
        this.icon = wrapper.querySelector(".icon");
        this.initStyles(); // Встановлення плавності ефектів
        this.attachEvents(); // Реакція на наведення
    }
    // Початкові стилі для плавного переходу
    initStyles() {
        if (this.icon) {
            this.icon.style.transition = "filter 0.15s ease-out";
            this.icon.style.filter = "";
        }
        this.wrapper.style.transition = "color 0.15s ease-out";
    }
    // Наведення та вихід миші
    attachEvents() {
        this.wrapper.addEventListener("mouseover", this.highlight);
        this.wrapper.addEventListener("mouseout", this.removeHighlight);
    }
}
//------------------------------------------------------
// МОДАЛЬНЕ ВІКНО ДЛЯ ТАЛКЕРІВ
//------------------------------------------------------
class TalkerModal {
    constructor() {
        this.modal = null;
    }
    // Відкриває модалку, показує контент, завантажує цитату
    open(image, name, quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.modal)
                this.createModal();
            this.setContent(image, name);
            yield this.loadQuote(quoteId);
            // Фіксуємо сторінку, щоб не стрибала при відкритті модалки
            const scrollY = window.scrollY;
            document.body.classList.add("talker-modal-open");
            document.body.style.top = `-${scrollY}px`;
            document.documentElement.style.setProperty("--scroll-lock-position", `-${scrollY}px`);
            // Показ модалки
            this.modal.style.display = "flex";
            // Скидаємо прокрутку контенту на верх
            requestAnimationFrame(() => {
                const content = this.modal.querySelector(".talker-modal-content");
                content.scrollTop = 0;
            });
        });
    }
    // Закриття модалки та відновлення позиції сторінки
    close() {
        if (this.modal)
            this.modal.style.display = "none";
        const scrollY = Math.abs(parseInt(document.body.style.top || "0"));
        document.body.classList.remove("talker-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
    }
    // Створення DOM-структури модалки
    createModal() {
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
        // Закриття при натисканні поза вікном
        this.modal
            .querySelector(".talker-modal-backdrop")
            .addEventListener("click", () => this.close());
        // Закриття через кнопку
        this.modal
            .querySelector(".talker-close-btn")
            .addEventListener("click", () => this.close());
    }
    // Додаємо стилі модалки
    injectStyles() {
        injectStyles(`

/* Фіксація сторінки при відкритій модалці */
body.talker-modal-open {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

/* Контейнер модалки */
.talker-modal {
  position: fixed;
  inset: 0;
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Затінення фону */
.talker-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(2px);
}

/* Контейнер вмісту */
.talker-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 360px;
  position: relative;
  z-index: 2;
  text-align: center;
  animation: fadeIn .25s ease-out;

  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Зображення */
.talker-modal-img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 12px;
}

/* Ім'я */
.talker-modal-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

/* Цитата */
.talker-modal-quote {
  color: #444;
  margin-bottom: 14px;
}

/* Кнопка закриття */
.talker-close-btn {
  border: none;
  background: #323232;
  color: #fff;
  border-radius: 6px;
  padding: 6px 15px;
  cursor: pointer;
}

/* Анімація появи */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

`);
    }
    // Встановлює зображення та ім’я в модалці
    setContent(img, name) {
        this.modal.querySelector(".talker-modal-img").setAttribute("src", img);
        this.modal.querySelector(".talker-modal-name").textContent = name;
    }
    // Завантаження тексту цитати з API
    loadQuote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`https://jsonplaceholder.typicode.com/comments/${id}`);
            const data = yield res.json();
            this.modal.querySelector(".talker-modal-quote").textContent = data.body;
        });
    }
}
// Просте додавання CSS у <head>
function injectStyles(styleText) {
    const css = document.createElement("style");
    css.innerHTML = styleText;
    document.head.appendChild(css);
}
//------------------------------------------------------
// ІНІЦІАЛІЗАЦІЯ ЕФЕКТІВ ТА МОДАЛКИ
//------------------------------------------------------
// Стиль ховера карток talker
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
// Анімація струшування
if (imgSmall)
    new ShakeAnimator(imgSmall);
if (imgBig)
    new ShakeAnimator(imgBig);
// Хайлайт ікон
iconItems.forEach((el) => new IconHighlighter(el));
// Модалка talker
const talkerModal = new TalkerModal();
const talkerCards = document.querySelectorAll(".grid-column");
// Відкриття модалки по кліку
talkerCards.forEach((card, index) => {
    var _a, _b;
    const img = card.querySelector("img");
    const name = (_b = (_a = card.querySelector("p")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "Unknown";
    if (!img)
        return;
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
        talkerModal.open(img.src, name, index + 1);
    });
});

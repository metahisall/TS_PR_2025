//------------------------------------------------------
// АНІМАЦІЯ ЛЕГКОГО СТРУСУ ПРИ НАВЕДЕННІ
//------------------------------------------------------

class ShakeAnimator {
  private element: HTMLImageElement;
  private animationFrameId: number | null = null;
  private startTime = 0;

  // Максимальний радіус зміщення та інтенсивність руху
  private readonly SHAKE_DISTANCE = 3;
  private readonly SHAKE_SPEED = 0.5;

  constructor(element: HTMLImageElement) {
    this.element = element;
    this.initStyles(); // Базові стилі для коректної анімації
    this.attachEvents(); // Прив’язуємо реакції на наведення миші
  }

  // Початкові стилі, щоб зміна transform відбувалася плавно
  private initStyles(): void {
    this.element.style.transition = "transform 0.1s ease-out";
    this.element.style.transform = "translate(0,0)";
  }

  // Безкінечний цикл дрібного руху елемента (створює ефект "тремтіння")
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

  // Запуск анімації при наведенні
  private startShake = (): void => {
    if (!this.animationFrameId) {
      this.startTime = 0;
      this.animationFrameId = requestAnimationFrame(this.shakeLoop);
    }
  };

  // Зупинка анімації та повернення елемента в початкову позицію
  private stopShake = (): void => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.element.style.transform = "translate(0,0)";
  };

  // Вішаємо події наведення й виходу курсора
  private attachEvents(): void {
    this.element.addEventListener("mouseover", this.startShake);
    this.element.addEventListener("mouseout", this.stopShake);
  }
}

//------------------------------------------------------
// ПІДСВІЧУВАННЯ ІКОН ПРИ НАВЕДЕННІ
//------------------------------------------------------

class IconHighlighter {
  private wrapper: HTMLElement;
  private icon: HTMLElement | null;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.icon = wrapper.querySelector(".icon");

    this.initStyles(); // Встановлення плавності ефектів
    this.attachEvents(); // Реакція на наведення
  }

  // Початкові стилі для плавного переходу
  private initStyles(): void {
    if (this.icon) {
      this.icon.style.transition = "filter 0.15s ease-out";
      this.icon.style.filter = "";
    }
    this.wrapper.style.transition = "color 0.15s ease-out";
  }

  // Увімкнення підсвічування
  private highlight = (): void => {
    if (this.icon) this.icon.style.filter = "sepia(1) brightness(2)";
    this.wrapper.style.color = "#100a03";
  };

  // Вимкнення стилів
  private removeHighlight = (): void => {
    if (this.icon) this.icon.style.filter = "";
    this.wrapper.style.color = "";
  };

  // Наведення та вихід миші
  private attachEvents(): void {
    this.wrapper.addEventListener("mouseover", this.highlight);
    this.wrapper.addEventListener("mouseout", this.removeHighlight);
  }
}

//------------------------------------------------------
// МОДАЛЬНЕ ВІКНО ДЛЯ ТАЛКЕРІВ
//------------------------------------------------------

class TalkerModal {
  private modal: HTMLElement | null = null;

  // Відкриває модалку, показує контент, завантажує цитату
  public async open(
    image: string,
    name: string,
    quoteId: number
  ): Promise<void> {
    if (!this.modal) this.createModal();

    this.setContent(image, name);
    await this.loadQuote(quoteId);

    // Фіксуємо сторінку, щоб не стрибала при відкритті модалки
    const scrollY = window.scrollY;
    document.body.classList.add("talker-modal-open");
    document.body.style.top = `-${scrollY}px`;
    document.documentElement.style.setProperty(
      "--scroll-lock-position",
      `-${scrollY}px`
    );

    // Показ модалки
    this.modal!.style.display = "flex";

    // Скидаємо прокрутку контенту на верх
    requestAnimationFrame(() => {
      const content = this.modal!.querySelector(".talker-modal-content")!;
      content.scrollTop = 0;
    });
  }

  // Закриття модалки та відновлення позиції сторінки
  public close(): void {
    if (this.modal) this.modal.style.display = "none";

    const scrollY = Math.abs(parseInt(document.body.style.top || "0"));
    document.body.classList.remove("talker-modal-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  }

  // Створення DOM-структури модалки
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

    // Закриття при натисканні поза вікном
    this.modal
      .querySelector(".talker-modal-backdrop")!
      .addEventListener("click", () => this.close());

    // Закриття через кнопку
    this.modal
      .querySelector(".talker-close-btn")!
      .addEventListener("click", () => this.close());
  }

  // Додаємо стилі модалки
  private injectStyles(): void {
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
  private setContent(img: string, name: string): void {
    this.modal!.querySelector(".talker-modal-img")!.setAttribute("src", img);
    this.modal!.querySelector(".talker-modal-name")!.textContent = name;
  }

  // Завантаження тексту цитати з API
  private async loadQuote(id: number): Promise<void> {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${id}`
    );
    const data = await res.json();

    this.modal!.querySelector(".talker-modal-quote")!.textContent = data.body;
  }
}

// Просте додавання CSS у <head>
function injectStyles(styleText: string): void {
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

const imgSmall = document.querySelector<HTMLImageElement>("h1 img");
const imgBig = document.querySelector<HTMLImageElement>("img.mb3");
const iconItems = document.querySelectorAll<HTMLElement>(".mt1");

// Анімація струшування
if (imgSmall) new ShakeAnimator(imgSmall);
if (imgBig) new ShakeAnimator(imgBig);

// Хайлайт ікон
iconItems.forEach((el) => new IconHighlighter(el));

// Модалка talker
const talkerModal = new TalkerModal();
const talkerCards = document.querySelectorAll(".grid-column");

// Відкриття модалки по кліку
talkerCards.forEach((card, index) => {
  const img = card.querySelector("img");
  const name = card.querySelector("p")?.textContent ?? "Unknown";

  if (!img) return;

  img.style.cursor = "pointer";

  img.addEventListener("click", () => {
    talkerModal.open(img.src, name, index + 1);
  });
});

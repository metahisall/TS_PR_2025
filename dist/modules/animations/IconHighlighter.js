export class IconHighlighter {
    constructor(wrapper) {
        this.highlight = () => {
            if (this.icon)
                this.icon.style.filter = "sepia(1) brightness(2)";
            this.wrapper.style.color = "#100a03";
        };
        this.removeHighlight = () => {
            if (this.icon)
                this.icon.style.filter = "";
            this.wrapper.style.color = "";
        };
        this.wrapper = wrapper;
        this.icon = wrapper.querySelector(".icon");
        this.initStyles();
        this.attachEvents();
    }
    initStyles() {
        if (this.icon) {
            this.icon.style.transition = "filter 0.15s ease-out";
            this.icon.style.filter = "";
        }
        this.wrapper.style.transition = "color 0.15s ease-out";
    }
    attachEvents() {
        this.wrapper.addEventListener("mouseover", this.highlight);
        this.wrapper.addEventListener("mouseout", this.removeHighlight);
    }
}

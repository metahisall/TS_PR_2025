export function injectStyles(styleText) {
    const css = document.createElement("style");
    css.innerHTML = styleText;
    document.head.appendChild(css);
}

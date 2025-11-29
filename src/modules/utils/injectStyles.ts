export function injectStyles(styleText: string): void {
  const css = document.createElement("style");
  css.innerHTML = styleText;
  document.head.appendChild(css);
}

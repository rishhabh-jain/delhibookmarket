import { useRef, useState } from "react";

export function useFlyingAnimationForCombo() {
  const comboRef = useRef<HTMLDivElement | null>(null);
  const [flyingProducts, setFlyingProducts] = useState<
    { id: number; x: number; y: number; img: string }[]
  >([]);

  const addFlyingProduct = (id: number, img: string, startEl: HTMLElement) => {
    if (!comboRef.current) return;

    const startRect = startEl.getBoundingClientRect();
    const endRect = comboRef.current.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const product = {
      id,
      img,
      x: startX,
      y: startY,
    };

    setFlyingProducts((prev) => [...prev, product]);

    // Animate using CSS transition
    const animEl = document.createElement("div");
    animEl.style.position = "fixed";
    animEl.style.left = `${startX}px`;
    animEl.style.top = `${startY}px`;
    animEl.style.width = "50px";
    animEl.style.height = "50px";
    animEl.style.borderRadius = "8px";
    animEl.style.overflow = "hidden";
    animEl.style.zIndex = "9999";
    animEl.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    animEl.innerHTML = `<img src="${img}" style="width:100%;height:100%;object-fit:cover;" />`;

    document.body.appendChild(animEl);

    requestAnimationFrame(() => {
      animEl.style.left = `${endX}px`;
      animEl.style.top = `${endY}px`;
      animEl.style.transform = "scale(0.3)";
      animEl.style.opacity = "0.5";
    });

    animEl.addEventListener("transitionend", () => {
      animEl.remove();
      setFlyingProducts((prev) => prev.filter((p) => p.id !== id));
    });
  };

  return { comboRef, flyingProducts, addFlyingProduct };
}

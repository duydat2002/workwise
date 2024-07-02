import type { Directive, DirectiveBinding } from "vue";
import type { IPoint } from "@/types";

interface ExtendHTMLElement extends HTMLElement {
  _mouseDownEvent?: (event: MouseEvent) => void;
  _mouseUpEvent?: (event: MouseEvent) => void;
  _clickEvent?: (event: MouseEvent) => void;
}

const checkClickOutside = (
  el: ExtendHTMLElement,
  elClick: ExtendHTMLElement
) => {
  return el !== elClick && !el.contains(elClick);
};

// binding.value = function
// binding.value = {handle: function, excludes: string[] - class, id, selector}
export const ClickOutside: Directive = {
  mounted(el: ExtendHTMLElement, binding: DirectiveBinding) {
    if (!binding.modifiers.short) {
      let mouseDownPosition: IPoint | null = null;

      el._mouseDownEvent = (event: MouseEvent) => {
        if (checkClickOutside(el, event.target as ExtendHTMLElement)) {
          mouseDownPosition = { x: event.clientX, y: event.clientY };
        }
      };

      el._mouseUpEvent = (event: MouseEvent) => {
        const mouseUpPosition = { x: event.clientX, y: event.clientY };

        if (
          mouseDownPosition &&
          mouseDownPosition.x == mouseUpPosition.x &&
          mouseDownPosition.y == mouseUpPosition.y
        ) {
          if (typeof binding.value == "object" && "handle" in binding.value) {
            const inExclude = binding.value.excludes?.some(
              (exclude: string) => {
                const dom = document.querySelector(exclude);
                return dom && dom.contains(event.target as ExtendHTMLElement);
              }
            );
            if (!inExclude) binding.value.handle();
          } else {
            binding.value(event);
          }
        }

        mouseDownPosition = null;
      };

      document.body.addEventListener("mousedown", el._mouseDownEvent);
      document.body.addEventListener("mouseup", el._mouseUpEvent);
    } else {
      el._clickEvent = (event: MouseEvent) => {
        if (checkClickOutside(el, event.target as ExtendHTMLElement)) {
          if (typeof binding.value == "object" && "handle" in binding.value) {
            const inExclude = binding.value.excludes?.some(
              (exclude: string) => {
                const dom = document.querySelector(exclude);
                return dom && dom.contains(event.target as ExtendHTMLElement);
              }
            );
            if (!inExclude) binding.value.handle();
          } else {
            binding.value(event);
          }
        }
      };

      document.body.addEventListener("mousedown", el._clickEvent);
    }
  },
  unmounted(el, binding: DirectiveBinding) {
    if (!binding.modifiers.short) {
      document.body.removeEventListener("mousedown", el._mouseDownEvent);
      document.body.removeEventListener("mouseup", el._mouseUpEvent);
    } else {
      document.body.removeEventListener("mousedown", el._clickEvent);
    }
  },
};

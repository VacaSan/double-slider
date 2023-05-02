const LMB = 0;

type DragEvent = MouseEvent | TouchEvent;

export type DragState = {
  x: number;
  movement: number;
  initial: number;
  active: boolean;
  last: boolean;
  target: EventTarget | null;
};

function addDragHandler(el: HTMLElement, callback: (state: DragState) => void) {
  let rAF = -1;
  // state
  let active = false;
  let last = false;
  let x = 0;
  let initial = 0;
  let target: EventTarget | null;

  el.addEventListener("mousedown", onDragStart);
  el.addEventListener("touchstart", onDragStart, { passive: false });

  function update() {
    callback &&
      callback({
        x,
        movement: x - initial,
        initial,
        active,
        last,
        target,
      });

    if (!active) return;

    rAF = window.requestAnimationFrame(update);
  }

  function onDragStart(evt: DragEvent) {
    const isMouseEvent = evt instanceof MouseEvent;

    if (isMouseEvent && evt.button !== LMB) return;

    target = evt.currentTarget as HTMLElement;
    initial = isMouseEvent ? evt.pageX : evt.touches[0].pageX;
    active = true;
    last = false;
    x = initial;

    // could be moved to its own function
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragMove, { passive: false });
    document.addEventListener("touchcancel", onDragEnd, { passive: false });

    rAF = window.requestAnimationFrame(update);
    evt.preventDefault();
  }

  function onDragMove(evt: DragEvent) {
    const isMouseEvent = evt instanceof MouseEvent;

    try {
      x = isMouseEvent ? evt.pageX : evt.touches[0].pageX;
    } catch (err) {
      // if anything bad happens, release the handle
      active = false;
      last = true;
      // *NOTE* I don't think we need to clear event handlers at this point,
      // since "mouseup" will fire as soon as the user releases the LMB
    }
    evt.preventDefault();
  }

  function onDragEnd(evt: DragEvent) {
    active = false;
    last = true;

    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("touchend", onDragMove);
    document.removeEventListener("touchcancel", onDragEnd);

    evt.preventDefault();
  }
}

export { addDragHandler };

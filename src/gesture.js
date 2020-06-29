const LMB = 0;

function addDragHandler(el, callback) {
  let rAF = -1;
  // state
  let active = false;
  let last = false;
  let x = 0;
  let initial = 0;
  let target = null;

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

  function onDragStart(evt) {
    if (evt.type === "mousedown" && evt.button !== LMB) return;

    target = evt.target;
    initial = evt.pageX || evt.touches[0].pageX;
    active = true;
    last = false;
    x = initial;

    // could be moved to its own function
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragMove, { passive: false });
    document.addEventListener("touchcancel", onDragMove, { passive: false });

    rAF = window.requestAnimationFrame(update);
    evt.preventDefault();
  }

  function onDragMove(evt) {
    try {
      x = evt.pageX || evt.touches[0].pageX;
    } catch (err) {
      // if anything bad happens, release the handle
      active = false;
      last = true;
      // *NOTE* I don't think we need to clear event handlers at this point,
      // since "mouseup" will fire as soon as the user releases the LMB
    }
    evt.preventDefault();
  }

  function onDragEnd(evt) {
    active = false;
    last = true;

    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDragMove, { passive: false });
    document.removeEventListener("touchend", onDragMove, { passive: false });
    document.removeEventListener("touchcancel", onDragMove, { passive: false });

    evt.preventDefault();
  }
}

export { addDragHandler };

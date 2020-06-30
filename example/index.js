import "double-slider";

window.addEventListener(
  "load",
  () => {
    valuemax.value = mySlider.valuemax;
    valuemin.value = mySlider.valuemin;
    max.value = mySlider.max;
    min.value = mySlider.min;
    step.value = mySlider.step;

    step.addEventListener("change", evt => {
      mySlider.step = Number(evt.target.value);
    });

    toggle.addEventListener("change", evt => {
      mySlider.disabled = evt.target.checked;
    });

    valuemax.addEventListener("input", evt => {
      mySlider.valuemax = Number(evt.target.value);
    });

    valuemin.addEventListener("input", evt => {
      mySlider.valuemin = Number(evt.target.value);
    });

    max.addEventListener("input", evt => {
      mySlider.max = Number(evt.target.value);
    });

    min.addEventListener("input", evt => {
      mySlider.min = Number(evt.target.value);
    });

    mySlider.addEventListener("slider:input", evt => {
      valuemax.value = evt.target.valuemax;
      valuemin.value = evt.target.valuemin;
    });
  },
  { once: true }
);

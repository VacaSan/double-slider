import "double-slider";

window.mySlider.addEventListener("slider:change", evt => {
  console.log("slider:change", evt.target.valuemax, evt.target.valuemin);
});
window.mySlider.addEventListener("slider:input", evt => {
  console.log("slider:input", evt.target.valuemax, evt.target.valuemin);
});

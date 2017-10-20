export default class {
  constructor (id) {
    this.range = document.getElementById(id);
    this.track = this.range.querySelector('#js-range__track');

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);
    this.target = null;
    this.rangeX = 0;
    this.currentX = 0;
    this.addEventListeners();
  }

  addEventListeners () {
    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
  }

  onStart (evt) {
    if (this.target)
      return;

    if (!evt.target.classList.contains('knob'))
      return;

    this.target = evt.target;
    this.rangeX = this.range.offsetLeft;
    this.currentX = evt.pageX - this.rangeX;
    this.rAF = requestAnimationFrame(this.update);

    this.target.classList.add('range__control--active');
  }

  onMove (evt) {
    if (!this.target)
      return;

    this.currentX = evt.pageX - this.rangeX;
  }

  onEnd (evt) {
    if (!this.target)
      return;

    this.target.classList.remove('range__control--active');
    this.target = null;
  }

  update () {
    this.rAF = requestAnimationFrame(this.update);

    if (!this.target)
      return;

    this.target.style.transform = `translateX(${this.currentX}px) translate(-50%, -50%)`;
  }

  get minimum () {

  }

  set minimum (val) {

  }

  get maximum () {

  }

  set maximum (val) {

  }

  get range () {

  }

  set range (val) {

  }
}
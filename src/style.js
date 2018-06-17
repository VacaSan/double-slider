import {css} from 'injected-css';

const style = css`
  position: relative;
  width: 100%;
  height: 48px;

  &-trackWrap {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
    overflow: hidden;

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: currentColor;
      opacity: .26;
    }
  }

  &-track {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: left top;
    background-color: currentColor;
    transform: scaleX(0) translateX(0);
    will-change: transform;
  }

  &-control {
    position: absolute;
    top: 50%;
    left: 0;
    width: 42px;
    height: 42px;
    background-color: transparent;
    transform: translateX(0) translate(-50%, -50%);
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  &-controlKnob {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: currentColor;
    transform: translate(-50%, -50%) scale(0.571);
    transition: transform 100ms ease-out;
    pointer-events: none;
    will-change: transform;
  }

  &-focusRing {
    width: 100%;
    height: 100%;
    background-color: currentColor;
    opacity: 0;
    pointer-events: none;
    transform: scale(0);
    border-radius: 50%;
    transition: transform 210ms ease-out, opacity 210ms ease-out;
  }

  &-control:focus &-focusRing {
    opacity: .25;
    transform: scale(.8);
  }

  &-control.active &-controlKnob {
    transform: translate(-50%, -50%) scale(1);
  }
`;

export default style;

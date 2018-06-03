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
    background-color: rgba(0, 0, 0, .26);
    transform: translateY(-50%);
    overflow: hidden;
  }
  &-track {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: left top;
    background-color: #3F51B5;
    transform: scaleX(0) translateX(0);
  }
  &-control {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
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
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: #3F51B5;
    transform: scale(0.571);
    transition: transform 100ms ease-out;
    pointer-events: none;
    will-change: transform;
  }
  &-control:active &-controlKnob,
  &-control:focus &-controlKnob {
    transform: scale(1);
  }
`;

export default style;

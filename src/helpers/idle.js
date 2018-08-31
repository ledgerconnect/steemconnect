import _ from 'lodash';

export default function createIdleDetector({ treshold, autostop = false }) {
  let enabled = false;
  let callback = null;

  const triggerIdle = _.debounce(() => {
    if (enabled && typeof callback === 'function') callback();
    if (autostop) enabled = false;
  }, treshold);

  window.onload = triggerIdle;
  window.onmousemove = triggerIdle;
  window.onmousedown = triggerIdle;
  window.ontouchstart = triggerIdle;
  window.onclick = triggerIdle;
  window.onkeypress = triggerIdle;

  return {
    setCallback(newCallback) {
      callback = newCallback;
    },
    start() {
      enabled = true;
      triggerIdle();
    },
    stop() {
      enabled = false;
    },
  };
}

export const isElectron = () => navigator.userAgent.toLowerCase().indexOf('electron') > -1;
export const isChromeExtension = () =>
  window.chrome && window.chrome.runtime && window.chrome.runtime.id;

export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return {};
  }
}

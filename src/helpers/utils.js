import _ from 'lodash';

export const isElectron = () => navigator.userAgent.toLowerCase().indexOf('electron') > -1;

export const isChromeExtension = () =>
  window.chrome && window.chrome.runtime && window.chrome.runtime.id;

export const isWeb = () => !isChromeExtension() && !isElectron();

export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return {};
  }
}

/** Parse error message from Steemd response */
export function getErrorMessage(error) {
  let errorMessage = '';
  if (_.has(error, 'stack[0].format')) {
    errorMessage = error.stack[0].format;
    if (_.has(error, 'stack[0].data')) {
      const { data } = error.stack[0];
      Object.keys(data).forEach(d => {
        errorMessage = errorMessage.split(`\${${d}}`).join(data[d]);
      });
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  return errorMessage;
}

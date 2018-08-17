export const isElectron = () => navigator.userAgent.toLowerCase().indexOf('electron') > -1;

export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return {};
  }
}

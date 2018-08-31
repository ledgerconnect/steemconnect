export const isElectron = () => navigator.userAgent.toLowerCase().indexOf('electron') > -1;

export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return {};
  }
}

export async function copyToClipboard(text) {
  const result = await navigator.permissions.query({ name: 'clipboard-write' });

  if (result.state !== 'granted' && result.state !== 'prompt') {
    throw new Error('Permissions not granted');
  }

  await navigator.clipboard.writeText(text);
}

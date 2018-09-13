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

const getSearchIndex = (value, term) =>
  value.toLowerCase().indexOf(term.toLowerCase());

export function simpleSearch(values, term, extractor = el => el) {
  if (term === '') return values;

  return values
    .filter(value => getSearchIndex(extractor(value), term) !== -1)
    .sort((a, b) => getSearchIndex(extractor(a), term) - getSearchIndex(extractor(b), term));
}

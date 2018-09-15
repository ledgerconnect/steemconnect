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

const getSearchIndex = (value, searchTerm) =>
  value.toLowerCase().indexOf(searchTerm.toLowerCase());

function getBestSearchIndex(extracted, searchTerm) {
  const terms = Array.isArray(extracted) ? extracted : [extracted];

  let bestIndex = null;

  for (let i = 0; i < terms.length; i += 1) {
    const current = getSearchIndex(terms[i], searchTerm);

    if (current !== -1 && (!bestIndex || current < bestIndex)) {
      bestIndex = current;
    }
  }

  return (bestIndex !== null) ? bestIndex : -1;
}

export function simpleSearch(values, searchTerm, extractor = el => el) {
  if (searchTerm === '') return values;

  return values
    .filter(value => getBestSearchIndex(extractor(value), searchTerm) !== -1)
    .sort((a, b) =>
      getBestSearchIndex(extractor(a), searchTerm) -
      getBestSearchIndex(extractor(b), searchTerm));
}

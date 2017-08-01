const isEmpty = value => value === undefined || value === null || value === '';

const isAsset = (value, precision) => {
  if (!/^[0-9]+\.?[0-9]* [A-Za-z0-9]+$/.test(value)) {
    return false;
  }

  const [amount] = value.split(' ');
  const dot = amount.indexOf('.');
  const p = dot === -1 ? 0 : amount.length - dot - 1;

  if (p > precision) {
    return false;
  }

  return true;
};

module.exports = {
  isEmpty,
  isAsset
};

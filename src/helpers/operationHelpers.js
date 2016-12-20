import operations from 'steem/lib/broadcast/operations.json';
import changeCase from 'change-case';

export const getOperation = type => {
  const ops = operations.filter(op =>
    op.operation === changeCase.snakeCase(type)
  );
  return ops[0] ? ops[0] : '';
};

export const isValid = (op, params) => {
  let isValid = false;
  if (op) {
    isValid = true;
    op.params.forEach((param) => {
      if (params[param] === undefined) {
        isValid = false;
      }
    });
  }
  return isValid;
};

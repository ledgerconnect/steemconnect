const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const jsonParse = (input) => {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
};

module.exports = {
  sleep,
  jsonParse,
};

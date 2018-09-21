function sortByLowest(a, b) {
  if (a < b) return -1;
  else if (a > b) return 1;
  return 0;
}

function sortByHighest(a, b) {
  if (a > b) return -1;
  else if (a < b) return 1;
  return 0;
}

export function groupByRealPrice(orders, digits = 6, tokenTicker = 'sbd') {
  return orders.reduce((a, b) => {
    const val = parseFloat(1 / b.real_price).toFixed(digits);

    const token = a[val] ? a[val].token : 0;
    const steem = a[val] ? a[val].steem : 0;
    const count = a[val] ? a[val].count : 0;

    return {
      ...a,
      [val]: {
        price: val,
        token: token + b[tokenTicker],
        steem: steem + b.steem,
        count: count + 1,
      },
    };
  }, {});
}

export function dropPrecision(value, digits = 3) {
  return parseFloat(value.toFixed(digits));
}

/**
 * Finds token market value for specified STEEM budget.
 * @param {*} orders Available sell orders on the market.
 * @param {*} budget STEEM budget.
 * @returns Token market value.
 */
export function getMarketValueForSteem(orders, budget) {
  if (!budget || typeof budget !== 'number') return 0;

  let leftToSpend = budget;
  let willReceive = 0;

  const bestPrices = Object.keys(orders).sort(sortByLowest);

  for (let i = 0; i < bestPrices.length; i += 1) {
    const order = orders[bestPrices[i]];

    const steemToSwapAtPrice = Math.min(leftToSpend, order.steem);
    const fillPercent = steemToSwapAtPrice / order.steem;

    leftToSpend -= steemToSwapAtPrice;
    willReceive += Math.floor(fillPercent * order.token);

    if (leftToSpend === 0) return willReceive;
  }

  return false;
}

/**
 * Finds STEEM market value for specified token budget.
 * @param {*} orders Available buy orders on the market.
 * @param {*} budget Token budget.
 * @returns Market value in STEEM.
 */
export function getMarketValueForToken(orders, budget) {
  if (!budget || typeof budget !== 'number') return 0;

  let leftToSpend = budget;
  let willReceive = 0;

  const bestPrices = Object.keys(orders).sort(sortByHighest);

  for (let i = 0; i < bestPrices.length; i += 1) {
    const order = orders[bestPrices[i]];

    const tokenToSwapAtPrice = Math.min(leftToSpend, order.token);
    const fillPercent = tokenToSwapAtPrice / order.token;

    leftToSpend -= tokenToSwapAtPrice;
    willReceive += Math.floor(fillPercent * order.steem);

    if (leftToSpend === 0) return willReceive;
  }

  return false;
}

/**
 * Finds market value for specified asset.
 * Wrapper for getMarketValueForAsset and getMarketValueForToken.
 * @param {*} allOrders Object with bids and asks on the market.
 * @param {*} amount Asset amount
 * @param {*} isToken Whether specified amount is token (true) or STEEM (false).
 * @returns Market value of our budget in opposite token of budget.
 */
export function getMarketValue(allOrders, amount, isToken) {
  if (typeof isToken === 'undefined') {
    throw new Error('isToken is required');
  }

  const getMarketValueForAmount = isToken ? getMarketValueForToken : getMarketValueForSteem;
  const orders = isToken ? allOrders.bids : allOrders.asks;

  return getMarketValueForAmount(orders, amount);
}

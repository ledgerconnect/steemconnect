/* eslint-disable quote-props */
import {
  groupByRealPrice,
  getMarketValueForSteem,
  getMarketValueForToken,
  getMarketValue,
} from '@/helpers/market';

describe('helpers:market', () => {
  describe('groupByRealPrice', () => {
    const orders = [
      {
        real_price: '0.75752965178602305',
        sbd: 43814,
        steem: 57838,
      },
      {
        real_price: '0.75778546712802763',
        sbd: 438,
        steem: 578,
      },
      {
        real_price: '1.00000000000000000',
        sbd: 4,
        steem: 4,
      },
      {
        real_price: '1.00000002500000007',
        sbd: 40000001,
        steem: 40000000,
      },
    ];

    it('should group by price', () => {
      const expected = {
        '1.320080': {
          price: '1.320080',
          token: 43814,
          steem: 57838,
          count: 1,
        },
        '1.319635': {
          price: '1.319635',
          token: 438,
          steem: 578,
          count: 1,
        },
        '1.000000': {
          price: '1.000000',
          token: 40000005,
          steem: 40000004,
          count: 2,
        },
      };

      expect(groupByRealPrice(orders)).toEqual(expected);
    });

    it('should group by price with different number of  digits', () => {
      const expected = {
        '1.3': {
          price: '1.3',
          token: 44252,
          steem: 58416,
          count: 2,
        },
        '1.0': {
          price: '1.0',
          token: 40000005,
          steem: 40000004,
          count: 2,
        },
      };

      expect(groupByRealPrice(orders, 1)).toEqual(expected);
    });
  });

  describe('getMarketValueForSteem', () => {
    const sellOrders = {
      '1.300390': {
        count: 1,
        price: '1.300390',
        steem: 2000,
        token: 1538,
      },
      '1.301390': {
        count: 1,
        price: '1.301390',
        steem: 17399,
        token: 13370,
      },
      '1.301518': {
        count: 2,
        price: '1.301518',
        steem: 9000,
        token: 6915,
      },
    };

    it('should return 0 for no budget', () => {
      expect(getMarketValueForSteem(sellOrders)).toBe(0);
      expect(getMarketValueForSteem(sellOrders, 0)).toBe(0);
    });

    it('should return market value using single order', () => {
      expect(getMarketValueForSteem(sellOrders, 20)).toBe(15);
    });

    it('should return market value using part of order', () => {
      expect(getMarketValueForSteem(sellOrders, 2020)).toBe(1553);
    });

    it('should return market value using multiple orders', () => {
      expect(getMarketValueForSteem(sellOrders, 19399)).toBe(14908);
    });

    it('should return market value when swap is not possible', () => {
      expect(getMarketValueForSteem(sellOrders, 29399)).toBe(false);
    });
  });

  describe('getMarketValueForToken', () => {
    const buyOrders = {
      '1.296953': {
        count: 1,
        price: '1.296953',
        steem: 6309,
        token: 4864,
      },
      '1.296767': {
        count: 1,
        price: '1.296767',
        steem: 4564,
        token: 3519,
      },
      '1.296737': {
        count: 2,
        price: '1.296737',
        steem: 8040,
        token: 6200,
      },
    };

    it('should return 0 for no budget', () => {
      expect(getMarketValueForToken(buyOrders)).toBe(0);
      expect(getMarketValueForToken(buyOrders, 0)).toBe(0);
    });

    it('should return market value using single order', () => {
      expect(getMarketValueForToken(buyOrders, 20)).toBe(25);
    });

    it('should return market value using part of order', () => {
      expect(getMarketValueForToken(buyOrders, 4964)).toBe(6438);
    });

    it('should return market value using multiple orders', () => {
      expect(getMarketValueForToken(buyOrders, 8383)).toBe(10873);
    });

    it('should return market value when swap is not possible', () => {
      expect(getMarketValueForToken(buyOrders, 14783)).toBe(false);
    });
  });

  describe('getMarketValue', () => {
    const orders = {
      bids: {
        '1.296737': {
          count: 2,
          price: '1.296737',
          steem: 8040,
          token: 6200,
        },
        '1.296767': {
          count: 1,
          price: '1.296767',
          steem: 4564,
          token: 3519,
        },
        '1.296953': {
          count: 1,
          price: '1.296953',
          steem: 6309,
          token: 4864,
        },
      },
      asks: {
        '1.300390': {
          count: 1,
          price: '1.300390',
          steem: 2000,
          token: 1538,
        },
        '1.301390': {
          count: 1,
          price: '1.301390',
          steem: 17399,
          token: 13370,
        },
        '1.301518': {
          count: 2,
          price: '1.301518',
          steem: 9000,
          token: 6915,
        },
      },
    };

    it('should throw when isToken is not specified', () => {
      expect(() => getMarketValue(orders, 20)).toThrow();
    });

    describe('token to steem', () => {
      it('should return market value using single order', () => {
        expect(getMarketValue(orders, 20, true)).toBe(25);
      });

      it('should return market value for token using part of order', () => {
        expect(getMarketValue(orders, 4964, true)).toBe(6438);
      });

      it('should return market value using multiple orders', () => {
        expect(getMarketValue(orders, 8383, true)).toBe(10873);
      });

      it('should return market value when swap is not possible', () => {
        expect(getMarketValue(orders, 14783, true)).toBe(false);
      });
    });

    describe('steem to token', () => {
      it('should return market value using single order', () => {
        expect(getMarketValue(orders, 20, false)).toBe(15);
      });

      it('should return market value for token using part of order', () => {
        expect(getMarketValue(orders, 2020, false)).toBe(1553);
      });

      it('should return market value using multiple orders', () => {
        expect(getMarketValue(orders, 19399, false)).toBe(14908);
      });

      it('should return market value when swap is not possible', () => {
        expect(getMarketValue(orders, 29399, false)).toBe(false);
      });
    });
  });
});

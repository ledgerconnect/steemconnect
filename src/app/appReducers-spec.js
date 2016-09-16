/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import appReducers from './appReducers';
import { expect } from 'chai';

const initialStateMock = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
};

describe('appReducers', function () {
  it('is expected to return an object', function () {
    expect(
      appReducers(undefined, {})
    ).to.be.an('object');
  });
  it('is expected to return initial state', function () {
    expect(
      appReducers(undefined, {})
    ).to.deep.equal(initialStateMock);
  });
});

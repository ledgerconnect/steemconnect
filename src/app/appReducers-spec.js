/* eslint-disable prefer-arrow-callback, no-undef, func-names, import/no-extraneous-dependencies */
import { expect } from 'chai';
import appReducers from './appReducers';

const initialStateMock = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
  sidebarIsVisible: true,
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

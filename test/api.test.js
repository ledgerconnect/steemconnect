/* global before, describe, it */
/* eslint-disable
   import/no-extraneous-dependencies,
   prefer-arrow-callback,
   func-names,
   prefer-template,
 */
const Promise = require('bluebird');
const assert = require('assert');
const crypto = require('crypto-js');
const steemauth = require('steemauth');
const supertest = require('supertest');

const app = require('../app');

Promise.promisifyAll(supertest.Test.prototype);

describe('/api/customJson', function () {
  before(function () {
    this.api = supertest(app);
  });

  it('works', function () {
    return this.api
      .get('/')
      .expect(200)
      .endAsync();
  });

  describe('GET /api/customJson', function () {
    it('requires authentication', function () {
      return this.api
        .get('/api/customJson')
        .expect(401)
        .endAsync();
    });

    describe('with authentication', function () {
      it('gets a CSRF token', function (done) {
        const resP = this.api.get('/').expect(200).endAsync();
        resP.then(
          (res) => {
            const setCookie = res.headers['set-cookie'];
            this.csrfToken = setCookie[0].split(';')[0].split('=')[1];
            assert(this.csrfToken);
            done();
          },
          done
        );
      });

      it('authenticates with a cookie header', function () {
        this.agent = supertest.agent(app);
        return this.agent.get('/auth/login')
          .query({
            encryptedData: crypto.AES.encrypt(crypto.enc.Utf8.parse(JSON.stringify({
              username: process.env.TEST_USERNAME,
              wif: steemauth.toWif(process.env.TEST_USERNAME, process.env.TEST_WIF, 'owner'),
            })), this.csrfToken).toString(),
          })
          .set('cookie', '_csrf=' + this.csrfToken + ';')
          .expect(200)
          .endAsync()
          .then((res) => {
            // console.log(res.headers);
            // console.log(res.body);
            this.jwt = res.body.auth;
          });
      });

      it.skip('lets us authorize this action', function () {
        return this.agent.get('/auth/authorize')
          .query({
            encryptedData: crypto.AES.encrypt(crypto.enc.Utf8.parse(JSON.stringify({
              username: process.env.TEST_USERNAME,
              wif: steemauth.toWif(process.env.TEST_USERNAME, process.env.TEST_WIF, 'owner'),
            })), this.csrfToken).toString(),
          })
          .set('cookie', '_csrf=' + this.csrfToken + ';')
          .expect(200)
          .endAsync()
          .then((res) => {
            // console.log(res.headers);
            // console.log(res.body);
            assert(res.body.auth);
            this.jwt = res.body.auth;
          });
      });

      it.skip('responds successfully', function () {
        return this.agent
          .get('/api/customJson')
          .set('Authorization', 'Bearer ' + this.jwt)
          .expect(200)
          .endAsync()
          .then((/* res */) => {
            // console.log(res.text);
            // console.log(res.body);
          });
      });
    });
  });
});

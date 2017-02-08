/* global before, describe, it */
/* eslint-disable
   import/no-extraneous-dependencies,
   prefer-arrow-callback,
   func-names,
   prefer-template,
 */
const Promise = require('bluebird');
const assert = require('assert');
const url = require('url');
const crypto = require('crypto-js');
const steem = require('steem');
const supertest = require('supertest');

const app = require('../app');

Promise.promisifyAll(supertest.Test.prototype);
const permissions = ['vote'];
const origins = ['http://test.url'];
const redirect_urls = ['http://test.url/cb'];

describe('/api', function () {
  before(function () {
    this.api = supertest(app);
  });

  it('works', function () {
    return this.api
      .get('/')
      .expect(200)
      .endAsync();
  });

  describe('GET /api/vote', function () {
    it('requires authentication', function () {
      return this.api
        .get('/api/vote')
        .expect(401)
        .endAsync();
    });

    describe('with authentication', function () {
      it('gets a CSRF token', function (done) {
        const resP = this.api.get('/').expect(200).endAsync();
        resP.then(
          (res) => {
            const setCookie = res.headers['set-cookie'];
            this.csrfCookie = setCookie[0].split(';')[0].split('=')[1];
            this.csrfToken = res.text.match(/<meta name="_csrf" content="(.+)">/)[1];

            assert(this.csrfToken);
            assert(this.csrfCookie);
            done();
          },
          done
        );
      });

      it('authenticates with a cookie header', function () {
        const encryptData = crypto.AES.encrypt(crypto.enc.Utf8.parse(JSON.stringify({
          username: process.env.TEST_USERNAME,
          wif: steem.auth.toWif(process.env.TEST_USERNAME, process.env.TEST_WIF, 'posting'),
        })), this.csrfCookie).toString();

        this.agent = supertest.agent(app);
        return this.agent.post('/auth/login')
          .send({ encryptedData: encryptData })
          .set('x-csrf-token', this.csrfToken)
          .set('cookie', `_csrf=${this.csrfCookie};`)
          .expect(200)
          .endAsync()
          .then((res) => {
            const setCookie = res.headers['set-cookie'];
            this.authCookie = setCookie[0].split(';')[0].split('=')[1];
            this.user = res.body.userAccount;
            assert(res.body.userAccount.name === process.env.TEST_USERNAME);
            assert(this.authCookie);
          });
      });

      it('should create test app', function () {
        let jsonMetadata = this.user.json_metadata;
        try { jsonMetadata = typeof jsonMetadata === 'object' ? jsonMetadata : JSON.parse(jsonMetadata); } catch (e) { jsonMetadata = {}; }
        jsonMetadata.app = {
          name: 'TestApp',
          author: 'John',
          permissions,
          origins,
          redirect_urls,
        };
        this.user.json_metadata = jsonMetadata;
        return new Promise((resolve, reject) => {
          steem.broadcast.accountUpdate(steem.auth.toWif(process.env.TEST_USERNAME, process.env.TEST_WIF, 'owner'),
            process.env.TEST_USERNAME, undefined, undefined, undefined,
            this.user.memo_key, jsonMetadata, (err) => {
              if (err) {
                reject(err);
              }
              resolve();
            });
        });
      });

      it('lets us authorize this action', function () {
        const appName = process.env.TEST_USERNAME;
        let jsonMetadata = this.user.json_metadata;
        try { jsonMetadata = typeof jsonMetadata === 'object' ? jsonMetadata : JSON.parse(jsonMetadata); } catch (e) { jsonMetadata = {}; }
        jsonMetadata.apps = jsonMetadata.apps || {};
        jsonMetadata.apps[appName] = { permissions };
        return new Promise((resolve, reject) => {
          steem.broadcast.accountUpdate(steem.auth.toWif(process.env.TEST_USERNAME, process.env.TEST_WIF, 'owner'),
            process.env.TEST_USERNAME, undefined, undefined, undefined,
            this.user.memo_key, jsonMetadata, (err) => {
              if (err) {
                reject(err);
              }
              resolve();
            });
        }).then(() => {
          const redirect_url = redirect_urls[0];
          return this.agent.get('/auth/authorize')
            .query({ redirect_url, appUserName: appName })
            .set('cookie', `_csrf=${this.csrfCookie};auth=${this.authCookie};`)
            .expect(302)
            .endAsync()
            .then((res) => {
              const location = url.parse(res.headers.location, true);
              this.jwtToken = location.query.token;
              assert(this.jwtToken);
            });
        });
      });

      it('responds successfully', function () {
        const voter = process.env.TEST_USERNAME;
        const author = 'fabien';
        const permlink = 'steem-script-an-open-json-standard-for-trusted-workflows-proposal';
        const weight = 10000;
        this.agent = supertest.agent(app);
        return this.agent
          .get('/api/vote')
          .query({ voter, author, permlink, weight })
          .set('cookie', `_csrf=${this.csrfCookie};auth=${this.authCookie};`)
          .set('x-steemconnect-token', this.jwtToken)
          .set('origin', origins[0])
          .expect(200)
          .endAsync()
          .then((res) => {
            assert(res.body.result === null);
          });
      });
    });
  });
});

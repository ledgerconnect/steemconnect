# SteemConnect v2

## Install
Download and install Node.js >= 7.7.1 then run
```
npm install
```
Add config vars
```
BROADCASTER_USERNAME = Main Steem account holding posting permissions e.g 'steemconnect'
BROADCASTER_POSTING_WIF = Posting wif of the main account
JWT_SECRET = Random string
DATABASE_URL = PostgreSQL database URL
DEBUG = sc2:*
```

## Run
```
npm start
```

## Demo

Test demo app here: https://sc2-angular.herokuapp.com

## Api

### Routes

*/api/me* - Get user profile (require user or app token)

*/api/broadcast* - Broadcast posting operation for user (require app token)

## OAuth2
*/api/oauth2/authorize* - Issue new app token (require user token)

## Tokens
Tokens are created with JWT, the payload is public. Here is how it look:

### Token for user
```
{
  role: 'user',
  user: 'guest'
}
```
The token hash is saved on user localStorage once he login.

### Token for application
```
{
  role: 'app',
  proxy: 'example',
  user: 'guest',
  scope: ['vote', 'comment']
}
```

The token hash is sent to the application once user authorize the application.

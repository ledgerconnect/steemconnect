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
DEBUG = sc2:*
```

## Run
```
npm start
```

## Demo

Test demo app here: http://localhost:3000/demo

## Api

### Routes

*/api/v1/me* - Get user profile (require app token)

*/api/v1/broadcast* - Broadcast posting operation for user (require app token)

## OAuth2
*/oauth2/authorize* - Issue new app token (require user token)

## Tokens
Tokens are created with JWT, the payload is public. Here is how it look:

### Token for user
```
{
  type: 'user',
  user: 'guest'
}
```
The token hash is saved on user cookies once he login.

### Token for application
```
{
  type: 'app',
  app: 'example',
  user: 'guest'
}
```

The token hash is sent to the application once user authorize the application.

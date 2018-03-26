[![CircleCI Build Status](https://circleci.com/gh/steemit/sc2.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/steemit/sc2)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/steemconnect/localized.svg)](https://crowdin.com/project/steemconnect)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/steemit/sc2/dev/LICENSE)
[![SteemConnect channel on Discord](https://img.shields.io/badge/chat-discord-738bd7.svg)](https://discord.gg/G95rNZs)

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

Test demo app here: https://steemit.github.io/sc2-angular

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

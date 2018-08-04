# Podcast Tune

A Web application for listening and discovering podcasts.

Main features:

- You can browse, search and subscribe to podcasts.
- Play episodes, add them to Up next, mark them as played and add them to favorites.
- In player you can increase/decrease volume and playback speed, skip time and browse episode in Up next.
- For registered users all information stores in application database, for 'guests' - in local storage.

![Podcast tune demonstration of main functionalities](https://media.giphy.com/media/4TnRSFsV2kxR2cB7py/giphy.gif)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Install

This project uses [Meteor](https://www.meteor.com/) and [npm](https://npmjs.com). Meteor comes with npm bundled so that you can type `meteor npm` without worrying about installing it yourself. If you like, you can also use a globally installed npm to manage your packages. To install Meteor, head to [Install meteor](https://www.meteor.com/install)

```
$ meteor npm install
# Installs dependencies
```

## Usage

In order to run Podcast Tune app, type in console:

```
$ meteor
# Builds and runs application on 3000 port.
# Mongo DB available on 3001 port
```

To run test, type in console:

```
$ npm run test
# Runs tests
```

Additionally, you could set an environment variable ENGINE_API_KEY value to your Apollo Engine API key. That gives you access to performance insights, error reporting, and caching for GraphQL. For more information - [Apollo Engine docs](https://www.apollographql.com/docs/engine/):

```
$ set ENGINE_API_KEY=your-api-key&&meteor
# Sets up Apollo Engine and runs application
```

## License

[MIT](LICENSE) © Anton Zimnitski

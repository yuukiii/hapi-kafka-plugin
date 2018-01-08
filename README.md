# Hapi Kafka Plugin

It's a plugin for Hapi.js with support until the version 16 that implement a Kafka client using [node-rdkafka](https://github.com/Blizzard/node-rdkafka)

## Usage

Install Hapi Kafka Plugin using [npm](https://www.npmjs.com/):

```shell
npm install --save hapi-kafka-plugin
```

To register the plugin you must `require` it

```javascript
const KafkaPlugin = require('hapi-kafka-plugin')
```

## Configuration

The plugin require some paremeteres listed bellow:

| Parameter | Description | Type | Required | Example |
|---|---|---|---|---|
| host | Kafka broker host | string | yes | `localhost` or `kafka` (if you are using [Docker](https://www.docker.com/)) |
| port | Kafka broker port | number | yes | `9092` |
| debug | Flag that allows to the package write logs in console | boolean | no (default value: `true`) | `true` or `false` |
| errorListener | Listener for any error encounter | function | no | `(eror) => { console.error('An error has been ocurred', error) }`|

## How to use it

You have to register the plugin in the hapi.js server:

```javascript
const KafkaPlugin = require('hapi-kafka-plugin')

server.register({
	register: KafkaPlugin,
	options: {
		host: 'localhost',
		port: 9092,
	}
}).then(() => {
	console.log('Kafka has been started')

	// And now its available in the server
	server.plugins.kafka.producer('whatsapp',
      null,
      Buffer.from('hi from hooks-proxy'),
      null,
      Date.now(),)
})
```

## Tests

Tests are written in [Jest](https://facebook.github.io/jest) to tests Javascript code.

```shell
npm test
```

---

Created with :heart: by [Yalo](https://github.com/yalochat)

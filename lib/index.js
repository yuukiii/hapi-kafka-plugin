const bucker = require('bucker')
const joi = require('joi')
const Kafka = require('node-rdkafka')

const schema = joi.object().keys({
  host: joi.string().required(),
  port: joi.number().required(),
  debug: joi.boolean().optional(),
  errorListener: joi.func().optional(),
})

const defaults = {
  options: {
    host: 'localhost',
    port: 9092,
    debug: true,
  },
  errorListener: logger => (err) => {
    logger.error('Error from producer')
    logger.error(err)
  },
}

// eslint-disable-next-line
exports.register = (server, options, next) => {
  const config = Object.assign({}, defaults.options, options)
  const logger = bucker.createLogger({ name: 'hapi-kafka-client', console: config.debug })
  const { error } = joi.validate(config, schema)

  // Validate incoming options for kafka client
  if (error) {
    logger.info('An error has been ocurred when validating options for hapi-kafka-client plugin')
    return next(error)
  }

  // Init kakfa producer with received options
  const broker = `${config.host}:${config.port}`
  const producer = new Kafka.Producer({
    'metadata.broker.list': broker,
  })

  logger.info(`Connecting producer to broker: ${broker}`)

  producer.connect()

  // Set producer as a plugin property in the server
  server.expose('producer', producer)

  // Set listeners when the producer is ready o an error has been ocurred
  producer.on('event.error', config.errorListener || defaults.errorListener(logger))

  producer.on('ready', () => {
    logger.info('Producer is connected and ready')
    next()
  })

  producer.on('connection.failure', (err) => {
    logger.info('An error has been ocurred when tried to connect to the broker')
    next(err)
  })
}

exports.register.attributes = {
  name: 'kafka',
}

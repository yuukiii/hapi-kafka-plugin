const Hapi = require('hapi')
const Kafka = require('node-rdkafka')
const KakfaClientPlugin = require('../../lib')

let server = null

beforeEach(() => {
  server = new Hapi.Server()
  server.connection()
})

afterEach(() => {
  server.stop()
})

describe('hapi kafka client plugin', () => {
  test('should be able to validate options and raise an error', (done) => {
    server.register({
      register: KakfaClientPlugin,
      options: {
        port: 'bad-port',
      },
    }).catch((err) => {
      expect(err).toBeInstanceOf(Error)
      expect(err.name).toBe('ValidationError')
      done()
    })
  })

  test('should be able to  register a new producer', (done) => {
    server.register({
      register: KakfaClientPlugin,
      options: {},
    }).then(() => {
      expect(server.plugins).toHaveProperty('kafka')
      expect(server.plugins.kafka).toHaveProperty('producer')
      expect(server.plugins.kafka.producer).toBeInstanceOf(Kafka.Producer)
      done()
    })
  })
})

// Głowny plik aplikacji

const http = require('http')
const { env, port, ip, apiRoot, mongo } = require('./config')
const express = require('./services/express')
const api = require('./api')
const mongoose = require('./services/mongoose')
const sendmail = require('./services/emails')
const app = express(apiRoot, api)
const server = http.createServer(app)
mongoose.connect(mongo.uri)

setImmediate(() => {
  server.listen(port, ip, () => {
    if(env === 'development') console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

function stop() {
  server.close()
}

// const content = `<html>Hello <strong>Krzysztof</strong></html>`
// sendmail('kbzowski@agh.edu.pl', 'System Is Online!', content)


module.exports = app
module.exports.stop = stop

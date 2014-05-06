module.exports = function (app, configurations, express, logger) {

    var nconf = require('nconf')
        , cachify = require('connect-cachify')
        , winston = require('winston')
        , requestLogger = require('winston-request-logger')
        , errorHandler     = require('errorhandler')
        , bodyParser     = require('body-parser')
        , methodOverride = require('method-override')

    nconf.argv().env().file({ file: 'local.json' })

    // load assets node from configuration file.
    var assets = nconf.get('assets') || {}

    // Development Configuration
    if ('development' == app.get('env') || 'test' == app.get('env')) {
        // register the request logger
        app.use(requestLogger.create(logger))
        app.set('DEBUG', true)
        app.use(errorHandler({ dumpExceptions: true, showStack: true }))
    }

    // Production Configuration
   if ('production' == app.get('env')) {
        app.set('DEBUG', false)
        app.use(errorHandler())
    }

    // Cachify Asset Configuration
    app.use(cachify.setup(assets, {
        root: __dirname + '/public',
        production: nconf.get('cachify')
    }))

    // Global Configuration
//   app.configure(function(){

        app.set('views', __dirname + '/views')
        app.set('view engine', 'jade')
        app.set('view options', { layout: false })
        app.use(bodyParser())
        app.use(methodOverride())
        app.use(express.static(__dirname + '/public'))

        //app.use(app.router)

//    })

    return app
}
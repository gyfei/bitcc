var express = require('express')
    , configurations = module.exports
    , app = express()
    , nconf = require('nconf')
    , winston = require('winston')
   // , routes = require('./routes')

    /*, routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
*/
// Logging
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] })

// load the settings
require('./settings')(app, configurations, express, logger)

// merge nconf overrides with the configuration file.
nconf.argv().env().file({ file: 'local.json' })

// Routes
require('./routes')(app)

logger.info('listening on', nconf.get('port'))

app.listen(process.env.PORT || nconf.get('port'))
//app.get('/', routes.index);


/*app.post('/upload', function(req, res){  
      console.log(req.params.key);//输出index   
      console.log(req.body.text);//输出表单post提交的login_name   
      res.send('great you are right for post method!');//显示页面文字信息  
    });
    */
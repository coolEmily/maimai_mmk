var express = require('express');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require("fs");
var FileStreamRotator = require('file-stream-rotator');
var logger = require('morgan');
var routes = require('./routes/index');
var hbs = require('hbs');
var mail = require('./tools/mail');
var getPages = require('./tools/getPages');
var app = express();
app.use(helmet({
    frameguard: false
}));
hbs.registerPartials(__dirname + '/views/app/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('view options', {layout: '/app/layout.html'});
app.engine('html', hbs.__express);
var publicFolder = 'public';

global.__pagesArr = getPages(path.resolve(__dirname, './views/'));

switch (app.get('env')) {
    case 'development' :
        global.__isOnline = false;
        app.use(logger('dev'));
        break;
    case 'production' :
        global.__isOnline = true;
        publicFolder = 'online_public';
        var logDirectory = path.join(__dirname, 'log');
        fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
        var accessLogStream = FileStreamRotator.getStream({
            date_format: 'YYYYMMDD',
            filename: path.join(logDirectory, 'access-%DATE%.log'),
            frequency: 'daily',
            verbose: false
        });
        logger.token('remote-addr', function (req) {
            return req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
        });
        logger.token('date', function () {
            return new Date();
        });
        app.use(logger('combined', {
            skip: function (req, res) {
                return res.statusCode < 400
            }, stream: accessLogStream
        }));
        break;
}
app.use(express.static(path.join(__dirname, publicFolder)));

app.use(favicon(path.join(__dirname, publicFolder, 'images', 'favicon.ico')));

// app.use(function (req, res, next) {
//     if (!res.locals.partials)res.locals.partials = {};
//     res.locals.partials.favorite = {
//         value: "I am partials."
//     };
//     next();
// });

app.use('*', function (req, res, next) {
    var paramsJson = req.query;
    if (Object.keys(paramsJson).indexOf('mId') !== -1) {
        var f_id = paramsJson.mId;
        if (f_id) {
            res.cookie('maimaicn_f_id', f_id, {"domain": ".maimaicn.com"});
        }
    }
    res.setHeader("Cache-Control", "max-age=0"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    next();
});

app.use('/', routes);

var blocks = {};
hbs.registerHelper('extend', function (name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(context.fn(this));
});
hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');
    blocks[name] = [];
    return val;
});
hbs.registerHelper('if_eq', function (a, b, opts) {
    if (a === b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log(err);
    res.render(path.join(__dirname, 'views/app/404.html'));
});

var countdown = 0;
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (global.__isOnline) {
        if (new Date().getTime() - countdown > 600000) {
            mail.send('vipisy@qq.com', err + '<br/> from ' + (global.__isOnline ? 'online' : 'offline') + ': ' + req.originalUrl + '<br/> time: ' + new Date());
            countdown = new Date().getTime();
        }
    }
    console.error(err.stack);
    res.render(path.join(__dirname, 'views/app/error.html'), {
        message: err.message,
        error: {}
    });
});

module.exports = app;
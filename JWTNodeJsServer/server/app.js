const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var console = require('./utils/consoleColors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const loginRouter = require('./routes/login');
const portfinder = require('portfinder');
let app, server;



let port = process.env.PORT || 9200;


portfinder.basePort = port;

const onPortCB = (err, portNo) => {
    if (err) {
        console.redBold('Port Not Avaialable because of ' + err);
        return;
    }
    port = portNo;
    setupApp(port);
}




portfinder.getPort(onPortCB)

function setupApp(port){
    app = express();
    server = app.listen(port,function(){
        console.cyanBold('Log Parser Listening on ' + port);
        onServerBind();
    });
  
    server.on('error',function(err){
        console.redBold(' Error while trying to setup LogParser  ');
        var code = err && err.code? err.code : err;
        console.log(code);
    });

}
function  onServerBind(){
    app.use(cors);
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

  
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/products', productsRouter);
    app.use('/login', loginRouter);

}



function cors(req, res, next) {
    'use strict';
     if (req.method === 'OPTIONS') {
          console.log('!OPTIONS');
          res.header('Access-Control-Allow-Origin','*');
          res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS');
          res.header('Access-Control-Allow-Credentials',true);
          res.header('Access-Control-Max-Age',86400);
          res.header('Access-Control-Allow-Headers','Access-Control-Allow-Headers, Origin,Accept, Authorization, X-Requested-With, X-HTTP-Method-Override,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
          res.json({});
          res.end();
    }else{
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    }
  }

  
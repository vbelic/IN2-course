const express = require('express');
const router = express.Router();
const diskDB = require('diskdb');
const shortid = require('shortid');
var console = require('../utils/consoleColors');
const authenticate = require('../utils/authenticate');
const path = require('path');
const rootDir = path.join(__dirname,'..');
const dbPath = rootDir + '/db';
const productsDB = diskDB.connect(dbPath,['products']);



router.use('/', function (req, res, next) {
  if(req.method === 'POST' && req.url === '/'){
    next();
    return;
  }
  const headers = req.headers;
  const authorization = headers.authorization;
  if(!authorization){
      return res.status(403).json({ error: 'Invalid credentials' });
  }
  let token;
  if (authorization.startsWith('Bearer ')) {
    // Remove Bearer from string
   token = authorization.slice(7, authorization.length);
  }

  if(!token){  
    console.red('Invalid Token');
    return res.status(403).json({ error: 'Invalid Login. Please login Again ' });
  }


  const userDetails = authenticate.authenticate(token);

  if(!userDetails){
    console.red('Authentication Issue');
    return res.status(403).json({ error: 'InActivity. Please login Again ' });
  }
  
  console.log('Request came from ' + userDetails.userId+ ' Request Type:', req.method)
  next();
});

/* GET products listing. */
router.get('/', function(req, res, next) {
  res.json(productsDB.products.find());
  //res.send('respond with a resource');
});

router.get('/:id',function(req,res, next){
     const productId = req.params.id;
     const product = productsDB.products.find({id: productId});
     res.json(product);
})

function onLogin(data, res){
 
 const token = authenticate.login(data.userId);
 if(token){
   res.status(200).json({
     token: token,
     expiresIn :  2 * 60 * 1000,
     userId: data.userId
   });

 }else {
   res.status(401).json({error:'Unable to Login, Please try later!'});
 }

}

module.exports = router;

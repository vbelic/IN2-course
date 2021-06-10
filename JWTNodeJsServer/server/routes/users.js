const express = require('express');
const router = express.Router();
const diskDB = require('diskdb');
const shortid = require('shortid');
var console = require('../utils/consoleColors');
const authenticate = require('./../utils/authenticate');
const path = require('path');
const rootDir = path.join(__dirname,'..');
const dbPath = rootDir + '/db';
const usersDB = diskDB.connect(dbPath,['users']);



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

/* GET users listing. */
router.get('/', function(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;

  let token;
  if (authorization.startsWith('Bearer ')) {
    // Remove Bearer from string
   token = authorization.slice(7, authorization.length);
  }
  const userDetails = authenticate.authenticate(token);
  const userId = userDetails.userId;
  const user = usersDB.users.find({userId: userId});
  if(user && user.length){
    const response = user[0];
    res.json(response);

  }else {
    res.json({});
  }
  //res.send('respond with a resource');
});

router.get('/:id',function(req,res, next){
     const userId = req.params.id;
     const user = usersDB.users.find({userId: userId});
     res.json(user);
})

router.post('/',function(req,res,next){

    const data = req.body;

    const errorMessage = '';
    
    if(!data.lastName){
      console.red('Missing Last Name!!');
      errorMessage += 'Missing Last Name!!';
    }

    if(!data.firstName){
      console.red('Missing First Name!!');
      errorMessage += 'Missing First Name!!';
    }

    if(!data.emailAddress){
      console.red('Missing emailAddress !!');
      errorMessage += 'Missing emailAddress!!';
    }
    

    if(!data.password){
      console.red('Missing Password !!');
      errorMessage += 'Missing Password!!';
    }

//    `city`, `state`, `postalCode`, `country`, `salesRepEmployeeNumber`, `creditLimit`

    if(!(data.phoneNumber || data.securityAnswer)){
      const missing = !data.phoneNumber ? ' Phone Number ' : ' Security Answer';
      console.red(`Missing ${missing}!!`);
      errorMessage += (errorMessage !== '' ? ' , ' : '')+`${missing}`;
    }

    if(errorMessage  !== ''){
      console.red('Not able to save, so Returning!!');
      res.status(422).send(errorMessage + ' Please correct and send again!');
      return;
    }

    data.userId = shortid.generate();

    usersDB.users.save(data);

    onLogin(data,res);
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

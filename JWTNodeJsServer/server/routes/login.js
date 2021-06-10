const express = require('express');
const router = express.Router();
const diskDB = require('diskdb');
const console = require('../utils/consoleColors');
const authenticate = require('./../utils/authenticate');
const path = require('path');
const rootDir = path.join(__dirname,'..');
const dbPath = rootDir + '/db';
const usersDB = diskDB.connect(dbPath,['users']);


router.post('/',function(req,res,next){
    const data = req.body;
    const errorMessage = '';
    

    if(!data.emailAddress){
        console.red('Missing emailAddress !!');
        errorMessage += 'Missing emailAddress!!';
      }
      
  
      if(!data.password){
        console.red('Missing Password !!');
        errorMessage += 'Missing Password!!';
      }

      if(errorMessage  !== ''){
        console.red('Not able to login, so Returning!!');
        res.status(422).send(errorMessage + ' Please correct and send again!');
        return;
      }
     const user = usersDB.users.findOne({emailAddress: data.emailAddress});
     
     if(!user){
        console.red('Not able to login user not found, so Returning!!');
        res.status(422).send(' User Not Found. Please check email address and send again!');
        return;
     }

     if(user.password !== data.password){
        console.red('Not able to login password donot match, so Returning!!');
        res.status(422).send('Invalid email or password');
        return;
     }

     onLogin(res,user);
    
});

function onLogin(res,user) {
    const token = authenticate.login(user.userId);
    if(token){
        res.status(200).json({
            token: token,
            expiresIn :  2 * 60 * 1000,
            userId: user.userId
        });

    }else {
    res.status(401).json({error:'Unable to Login, Please try later!'});
    }
}

module.exports = router;
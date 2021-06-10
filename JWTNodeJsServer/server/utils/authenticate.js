
const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const path = require('path');
const rootDir = path.join(__dirname,'..');
var console = require('./consoleColors');
const privateKEY  = fs.readFileSync(rootDir +'/private.key', 'utf8');
const publicKEY  = fs.readFileSync(rootDir +'/public.key', 'utf8');

const issuer = 'TruckTracker';  // Issuer 
const subject = 'app for truck track'; // Subject 
const audience = 'http://localhost:4200'; // Audience

module.exports = {
    authenticate: authenticate,
    login: login,
    decode: decode
}


function login(userId) {

 var signOptions = {
  issuer:  issuer,
  subject:  subject,
  audience:  audience,
  expiresIn:  "2m",
  algorithm:  "RS256"
 };

 var payload = {
   userId : userId,
   expiresIn: 2 * 60 * 1000,
 }

 try{
     const token = jwt.sign(payload, privateKEY, signOptions);
    return token;
 }catch(error){
     console.error(error);
  return false;
 }

}


function authenticate(token){
    var verifyOptions = {
        issuer:  issuer,
        subject:  subject,
        audience:  audience,
        expiresIn:  "2m",
        algorithm:  ["RS256"]
    };
    try{
        const legit = jwt.verify(token, publicKEY, verifyOptions);
        return legit;
    }catch(error){
        console.red('Error in verifying token');
        console.dir(error);
        
        return false;
    }

}

function decode (token){
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
}

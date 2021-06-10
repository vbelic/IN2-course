'use strict';
const fs   = require('fs');
const jwt  = require('jsonwebtoken');

 // PRIVATE and PUBLIC key
 var privateKEY  = fs.readFileSync('./private.key', 'utf8');
 var publicKEY  = fs.readFileSync('./public.key', 'utf8');
 var i  = 'Truck';          // Issuer 
 var s  = 'truck';        // Subject 
 var a  = 'http://localhost:4200'; // Audience
 // SIGNING OPTIONS
 var signOptions = {
  issuer:  i,
  subject:  s,
  audience:  a,
  expiresIn:  "12h",
  algorithm:  "RS256"
 };

 const payload = {
    data: '10000',
    userId: 'bob'
 };

 var token = jwt.sign(payload, privateKEY, signOptions);

 console.log("Token - " + token);


 var verifyOptions = {
    issuer:  i,
    subject:  s,
    audience:  a,
    expiresIn:  "12h",
    algorithm:  ["RS256"]
   };
var legit = jwt.verify(token, publicKEY, verifyOptions);
console.dir(legit);
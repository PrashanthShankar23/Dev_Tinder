const express = require("express");

const app = express(); // Instance of an express.js application

const adminAuth = (req, res, next) => {
    console.log(req.body);
    
    if(req.body.userId!== "abc"){
        res.status(401).send("User Unauthenticated")
    }
    next()
}

module.exports = {adminAuth}
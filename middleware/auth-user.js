'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const e = require("express");
const { User } = require('../models');

// express middleware function to authenticate routes
exports.authenticateUser = async(req,res,next) =>{
    let message;
   
    const credentials = auth(req);
    console.log(credentials)
  
    if (credentials) {
        const user = await User.findOne({where: {emailAddress:credentials.name}});
        if(user){
            const authenticated = bcrypt
            .compareSync(credentials.pass, user.password);
            if(authenticated){
                console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`)
                req.currentUser = user
            } else {
                message = `Authentication failure for user: ${user.firstName} ${user.lastName}`
            }
        } else {
            message = `User not found for username: ${credentials.name}`
        }
    } else {
        message = 'Auth header not found'
    }
  
    // 401 status code is returned if authentication fails
    if(message){
        console.warn(message);
        res.status(401).json({message: 'Access Denied'})
    } else {
       next(); 
    }
    
};
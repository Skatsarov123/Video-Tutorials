
const jwt = require('../utils/jwt');
const User = require('../models/user');
const {JWT_SECRET} =require ('../constants');
const Course = require('../models/course');

exports.login = async ({username,password}) => {
    let user = await User.findOne({username});

    if(!user){
        throw new Error('invalid username or password')
    }
    let isValid = await user.validatePassword(password);

    if(!isValid){
        throw new Error('invalid username or password')
    }
    let payload = {
        _id: user._id,
        username:user.username,
    };
    let token= await jwt.sign(payload, JWT_SECRET);
   
    return token
}

exports.register = (userData)=>User.create(userData);

exports.getOne = (userData) =>User.findById(userData);


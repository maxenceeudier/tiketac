var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    
})

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
var mongoose = require("mongoose");
var mongoosedb = require("./mongoosedb");

var userSchema = new mongoose.Schema({
        username  : String,
        password : String,
        email : String,
        avatar : String
    }, {versionKey: false}
);

var users = mongoose.model('users',userSchema);


module.exports = users;
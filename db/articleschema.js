/**
 * Created by Administrator on 4/8/2018.
 */
var mongoose = require("mongoose");
var mongoosedb = require("./mongoosedb");

var articleSchema = new mongoose.Schema({
    title : String,
    body : String,
    author : String,
    time : String,
    likenumber: Number
}, {versionKey: false});

var article = mongoose.model('article',articleSchema);

module.exports = article ;
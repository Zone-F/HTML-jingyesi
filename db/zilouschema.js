/**
 * Created by Administrator on 2018/5/5.
 */
var mongoose = require("mongoose");
var mongoosedb = require("./mongoosedb");

var zilouSchema = new mongoose.Schema({
    body : String,
    author : String,
    time : String,
}, {versionKey: false});

var zilou = mongoose.model('zilou',zilouSchema);

module.exports = zilou ;
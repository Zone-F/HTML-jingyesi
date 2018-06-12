var formidable = require("formidable");

var mongoose = require('mongoose');
var mongoosedb = require("../db/mongoosedb");
var userModel = require("../db/userschema");
var articleModel = require("../db/articleschema");


//首页
exports.showIndex = function (req, res, next) {
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }
        res.render("index",{
            "login":login,
        });
};
//文章列表页
exports.showPagelist = function (req, res, next) {
    res.render("article/pagelist");
};
//文章页
exports.showPage = function (req, res, next) {
    var id= req.query.id;
    var _id = mongoose.Types.ObjectId(id);
    articleModel.find({"_id": _id}, function (err, result) {
        if (err) {
            res.send("文章被删除"); //服务器错误
            return
        }
        res.render('article/page',{
            "title":result[0].title,
            "body":result[0].body,
            "time":result[0].time,
            "author":result[0].author,
            "likeNumber":result[0].likenumber
        });

    });
};
//纸篓
exports.showZilou = function (req, res, next) {
    res.render("article/zilou");
};
//用户个人中心
exports.showAdmin = function (req, res, next) {
    if (!req.session.login) {
        res.redirect('http://120.79.25.54/login');
        return;
    }
    userModel.findOne({username:req.session.username},function (err,result) {
            res.render("admin/admin",{
                "username":req.session.username,
                "email":result.email,
                "avatar":result.avatar,
        });
    });
};
//登陆页
exports.showLogin = function (req, res, next) {
    res.render("admin/login");
};
//注册页
exports.showRegister = function (req, res, next) {
    res.render("admin/register");
};
//写文章页
exports.showWrite = function (req, res, next) {
    if(req.session.login){
        res.render("admin/write");
    }else{
        res.redirect('http://120.79.25.54/login')
    }
};

exports.showAboutUs = function (req, res, next) {
        res.render("aboutus")
};
exports.showZilouWrite = function (req, res, next) {
    if(req.session.login){
        res.render("admin/zilouwrite");
    }else{
        res.redirect('http://120.79.25.54/login')
    }
};
//修改文章页
exports.updateArticle = function (req, res, next) {
    var _id = mongoose.Types.ObjectId(req.query.id);

    if(req.session.login){
        res.render("admin/updateArticle");
    }else{
        res.render('http://120.79.25.54/login')
    }
};



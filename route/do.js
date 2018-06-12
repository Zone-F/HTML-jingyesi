var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var md5 = require("md5");

var mongoose = require('mongoose');
var mongoosedb = require("../db/mongoosedb");
var userModel = require("../db/userschema");
var articleModel = require("../db/articleschema");
var zilouModel = require("../db/zilouschema");

//注册
exports.doRegister = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var username = fields.username;
        var password = fields.password;
        var email = fields.email;
        var avatar = 'avatar.jpg';    //新用户默认头像
        userModel.findOne({username:username},function (err,result) {
            //检查用户名是否存在
            if(result){
                res.send("-1"); //用户名已存在
            }else{
                //注册新用户，写入数据库
                password = md5(password); //密码用md5加密
                var newUser = new userModel({username:username,password:password,email:email,avatar:avatar}).save(function (err,result) {});
                res.send("1");
            }
        });
    });
};
//登陆
exports.doLogin = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var password = md5(fields.password);
        userModel.findOne({username:username,password:password},function (err,result) {
            if(result){
                req.session.login = "1";
                req.session.username = username;
                res.send("1")  //登陆成功，写入session,Login为登陆状态
            }else {
                res.send("-1")
            }
        })
    })
};
//退出登陆
exports.doLoginOut = function (req,res,next) {
    res.render("index",{
        "login":req.session.login = false,
        "username":req.session.username=""
});};
//更改头像
exports.changeAvatar = function (req,res,next) {
    var form = new formidable.IncomingForm();
    //设置上传文件夹
    form.uploadDir = path.normalize(__dirname + "/../public/avatar");

    form.parse(req, function (err, fields, files) {
        var oldpath = files.file.path;
        var newpath = path.normalize(__dirname + "/../public/avatar") + "/" + req.session.username + ".jpg";
        fs.rename(oldpath,newpath,function (err,result) {
            if(err){
                console.log("改名失败");
                return
            }
            //更新数据库中的用户头像
            req.session.avatar=req.session.username+'.jpg';
            userModel.update({username:req.session.username},{avatar:req.session.avatar},function (err,result) {
            });
        });
    });
};
//新增文章
exports.newArticle = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {
        var title = fields.title;
        var body = fields.body;
        var author = req.session.username;
        var date = new Date();
        var mydata = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()/*+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()*/;

        var newArticle = new articleModel(
            {title:title,body:body,author:author,likenumber:1,time:mydata}
            ).save(function (err,result) {});

        res.send("1")
    })
};
exports.newZilou = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {
        var body = fields.body;
        var author = req.session.username;
        var date = new Date();
        var mydata = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()/*+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()*/;

        var newzilou = new zilouModel(
            {body:body,author:author,time:mydata}
            ).save(function (err,result) {
                if(err){
                    res.send('发表失败')
                    return
                }else{
                    res.send("1")
                }
        });
    })
};
//修改用户名
exports.changeUsername = function (req,res,next) {
    //修改用户名要将头像.jpg的名字也更改
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../public/avatar");

    form.parse(req, function (err, fields, files) {

        var newusername = fields.username;
        var avatar = newusername+'.jpg';
        var oldpath = form.uploadDir+'/'+req.session.username+'.jpg';
        var newpath = path.normalize(__dirname + "/../public/avatar") + "/" + newusername + ".jpg";
        //给头像.jpg改名
        fs.rename(oldpath,newpath,function (err,result) {
            if(err){
                console.log("改名失败");
                return
            }
            //更新文章表中的用户名
            articleModel.updateMany({author:req.session.username},{author:newusername},function (err,result) {
                //更新数据库中的用户表
                userModel.update({username:req.session.username},{avatar:newusername+'.jpg',username:newusername},function (err,result) {
                    //更新Session
                    req.session.username = newusername;
                    req.session.avatar=newusername+'.jpg';
                    res.send("1");

                });
            });

        });
    });
};
//修改邮箱
exports.changeEmail = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {
        var email = fields.email;

        userModel.findOneAndUpdate({username:req.session.username},
            {email:email},function (err,result) {
                res.send("1");
        });
    })
};
//得到文章总数
exports.allArticle = function (req,res,next) {
    /*得到纸篓总数
     *isuser:1表示查询某个用户的文章
     * isuser:0表示查询所有用户的文章
     * */
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {

        if(fields.isuser==1){
            articleModel.find({author:req.session.username}).count(function (err,result) {
                res.send(result.toString());  //将查询结果转为String发送
            });
        }else{
            articleModel.find().count(function (err,result) {
                res.send(result.toString());  //将查询结果转为String发送
            });
        }

    });
};
//得到纸篓总数
exports.allzilou = function (req,res,next) {
    /*得到文章总数
     *isuser:1表示查询某个用户的文章
     * isuser:0表示查询所有用户的文章
     * */
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {

        if(fields.isuser==1){
            zilouModel.find({author:req.session.username}).count(function (err,result) {
                res.send(result.toString());  //将查询结果转为String发送
            });
        }else{
            zilouModel.find().count(function (err,result) {
                res.send(result.toString());  //将查询结果转为String发送
            });
        }
    });
};
//文章分页
exports.getPage = function (req,res,next) {
    /*
     *isuser:1表示查询某个用户的文章
     * isuser:0表示查询所有用户的文章
     * */
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {

        var mypage=fields.mypage;

        if(fields.isuser==1){
                articleModel.find({author:req.session.username}).sort({'_id':-1}).limit(mypage*5).skip(Math.ceil((mypage-1)*5)).exec(function (err,result) {
                    res.send(result)
                });
        }else{
            articleModel.find().sort({'_id':-1}).limit(mypage*5).skip(Math.ceil((mypage-1)*5)).exec(function (err,result) {
                res.send(result)
            });
        }

    });
};
//纸篓分页
exports.getZilou = function (req,res,next) {
    /*
     *isuser:1表示查询某个用户的文章
     * isuser:0表示查询所有用户的文章
     * */
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {

        var mypage=fields.mypage;
        var getdata=fields.getdata;

        if(fields.isuser==1){
                zilouModel.find({author:req.session.username}).sort({'_id':-1}).limit(mypage*getdata).skip(Math.ceil((mypage-1)*getdata)).exec(function (err,result) {
                    res.send(result)
                });
        }else{
            zilouModel.find().sort({'_id':-1}).limit(mypage*getdata).skip(Math.ceil((mypage-1)*getdata)).exec(function (err,result) {
                res.send(result)
            });
        }
    });
};
//
exports.getArticleById = function (req,res,next) {
    var _id = mongoose.Types.ObjectId(req.query.id);
    articleModel.findById(_id,function (err,result) {
        res.send(result)
    });
};
//修改文章
exports.updateArticle = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req,function (err,fields,files) {
        var _id = fields.id;
        var title = fields.title;
        var body = fields.body;
        var date = new Date();
        var mydata = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()/*+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()*/;
        articleModel.findOneAndUpdate({_id:_id},{title:title,body:body,time:mydata},function (err,result) {
            res.send("1")
        });
    })
};
//删除文章
exports.deleteArticle = function (req,res,next) {
    var _id = mongoose.Types.ObjectId(req.query.id);

    articleModel.findByIdAndRemove({_id:_id},function (result) {
        res.redirect('http://120.79.25.54/admin')
    })
};
//更新like数
exports.changeLikeNumber = function (req,res,next) {
    var _id = mongoose.Types.ObjectId(req.query.id);
    articleModel.findOneAndUpdate({"_id":_id},{$set :{"likenumber":req.query.likenumber}},{},function (err,result) {
        if (err){console.log("出错了")}
        res.send("1");
    })
};



/*
 *
 *          ┌─┐       ┌─┐
 *       ┌──┘ ┴───────┘ ┴──┐
 *       │                 │
 *       │       ───       │
 *       │  ─┬┘       └┬─  │
 *       │                 │
 *       │       ─┴─       │
 *       │                 │
 *       └───┐         ┌───┘
 *           │         │
 *           │         │
 *           │         │
 *           │         └──────────────┐
 *           │                        │
 *           │                        ├─┐
 *           │                        ┌─┘
 *           │                        │
 *           └─┐  ┐  ┌───────┬──┐  ┌──┘
 *             │ ─┤ ─┤       │ ─┤ ─┤
 *             └──┴──┘       └──┴──┘
 *                 神兽保佑
 *                 代码无BUG!
 */
var express = require('express');
var app = express();
var session = require('express-session');

var route = require('./route/route');    //路由.js
var myDo = require('./route/do');

//设置视图模板引擎
app.set('views', './views');
app.set('view engine','ejs');
//静态文件存放
app.use('/static',express.static('public'));
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//纯前端展示页面
app.get('/',route.showIndex);               //首页
app.get('/page',route.showPage);        //文章详情页
app.get('/admin',route.showAdmin);      //用户页
app.get('/zilou',route.showZilou);
app.get('/login',route.showLogin);
app.get('/register',route.showRegister);
app.get('/write',route.showWrite);      //写文章页
app.get('/zilouwrite',route.showZilouWrite);      //写纸篓页
app.get('/update',route.updateArticle);      //修改文章
app.get('/aboutus',route.showAboutUs);      //关于我们

//涉及数据验证页面
app.post('/doregister',myDo.doRegister);//注册
app.post('/dologin',myDo.doLogin);   //登陆
app.get('/logout',myDo.doLoginOut);  //登出
app.post('/changeavatar',myDo.changeAvatar); //更换头像
app.post('/changeemail',myDo.changeEmail); //修改邮箱
app.post('/changeusername',myDo.changeUsername); //修改用户名
app.post('/newarticle',myDo.newArticle); //新文章提交
app.post('/newzilou',myDo.newZilou); //新纸篓提交
app.post('/getallarticle',myDo.allArticle); //获取文章总数
app.post('/getallzilou',myDo.allzilou); //获取纸篓总数
app.post('/getpage',myDo.getPage); //分页形式获取文章
app.post('/getzilou',myDo.getZilou); //分页形式获取纸片
app.post('/doupdate',myDo.updateArticle);//文章更新
app.get('/getarticlebyid',myDo.getArticleById);
app.get('/delarticle',myDo.deleteArticle);//删除文章
app.get('/changeLikeNumber',myDo.changeLikeNumber);//更新文章like



app.listen(80,'0.0.0.0',function () {
    console.log('app is listen in 80')
});
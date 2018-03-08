var express = require("express");
var app = express();

//io配置
var http = require("http").Server(app);
var io = require("socket.io")(http);
//session配置
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
//模板引擎
app.set("view engine", "ejs");

//静态服务
app.use(express.static("./public"));

var allUser = []

//首页路由
app.get("/", function(req, res, next){
    res.render("index");
});
//登录,检查是否有用户名，昵称不能重复
app.get("/check", function(req, res, next){
    var user = req.query.user
    if (!user) {
        res.send("必须填写用户名！！");
        return;
    };
    if (allUser.indexOf(user) != -1) {
        res.send("用户名已经被占用!!");
        return;
    };
    allUser.push(user);
    // 赋值session
    req.session.user = user;
    res.redirect("/chat");
})
//进入聊天页面
app.get("/chat", function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/");
        return
    };
    res.render("chat", {
        "user": req.session.user
    });
})



io.on("connection", function (socket) {
    socket.on("req", function(msg){
        io.emit("res", msg)
    })

})




//监听
http.listen(3000);

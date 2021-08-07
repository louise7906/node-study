const express=require('express');
//보안 관련 helmet도구 사용
const helmet=require('helmet');
const app=express();
const ejs=require("ejs");
const db=require('./model/db');
var bodyParser=require('body-parser');
const json2xls=require("json2xls")


//html파일들을 나타내기 위해
app.set('view engine',ejs);
app.set('views', './views');

app.use('/public', express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(json2xls.middleware)

//helmet쓰기위해 
//app.use(helmet());

//주소를 라우터로 옮기고 어떤 주소들이 있는지 받음
const mainRouter=require("./router/mainRouter")
//여러 라우터들을 관리하기 위해 미들웨어에서 정의
app.use('/',mainRouter)

//3000포트를 서버로 사용
app.listen(3000,function(req,res){
    db.sequelize.sync({force:false})
    console.log("server running")
})
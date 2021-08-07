const express=require('express')
//express도구 안에 router()를 이용하여 
const router=express.Router();
const db=require('../model/db');
const url="https://finance.naver.com/sise/sise_quant.nhn"

//excel down
router.get("/excel/down",function(req,res){
    let excel_data=[{"A":1,"B":2,"C":3,"D":4}]// 리스트 데이터가
    res.xls('data.xlsx',excel_data) // data.xlsx파일로 다운로드 됨

})


//엑셀 업무 자동화
router.get("/excel", function(req,res){
    res.render("excel.ejs")
})


//크롤링을 위한 도구들
const cheerio=require("cheerio")
const axios=require("axios")
const iconv=require("iconv-lite")

router.get("/crawling",function(req,res){
   //외부 접속 위해 axios
     axios({url:url, method:"GET",responseType:"arraybuffer"}).then(function(html){
        //한글 깨짐 방지를 위해 iconv
        const content=iconv.decode(html.data,"EUC-KR").toString()
        const $=cheerio.load(content) // 네이버금융 html데이터를 $변수에 담는다
      //  const h3=$(".sub_tlt") //접근하고 싶은 클래스의 선택자
      //  console.log(h3.text()) 
        const table=$(".type_2 tr td")
        // each는 리스트 형태로 인덱스 i에 해당하는 값을 tag에 출력 
        table.each(function(i,tag){
            console.log($(tag).text().trim()) //cheerio도구를 이용해 태그의 데이터 담음. 공백없음
        })

        res.send({success:200})
     })   
})

router.get("/",function(req,res){
   res.render('main.ejs',{title:"영화 리뷰 사이트"})
})

router.post("/review/create",function(req,res){
    let movie_id=req.body.movie_id;
    let review=req.body.review;

    if(movie_id==''||movie_id==0){
        res.send({success:400})
    }else{
        db.reviews.create({
            movie_id:movie_id,
            review:review
        }).then(function(result){
            res.send({success:200})
        })
    }   
})

router.get("/review/read",function(req,res){
    let movie_id=req.query.movie_id;

    db.reviews.findAll({where:{movie_id:movie_id}}).then(function(result){
        res.send({success:200, data:result})
    })
})


router.get("/about",function(req,res){
    res.send('about page');
})

router.post("/postapi",function(req,res){
    let body=req.body;
    console.log(body)
    res.send('post api')
})

router.get("/data/create",function(req,res){
    let user_id=parseInt(Math.random()*10000)
    db.users.create({user_id:user_id}).then(function(result){
        res.send({success:200})
    })
})

router.get("/data/read",function(req,res){
    db.users.findAll().then(function(result){
        res.send({success:200, data:result})
    })

})

router.post("/data/update", function(req,res){    
     let target_id = req.body.target_id;
     console.log(target_id);
    db.users.update({user_id:9999},{where:{user_id:target_id}}).then(function(result){  
               res.send({success:200})
    }) })

    router.post("/data/delete", function(req,res){     
        let target_id = req.body.target_id;
        db.users.destroy({where:{user_id:target_id}}).then(function(result){        
            res.send({success:200})
        }) })


module.exports=router
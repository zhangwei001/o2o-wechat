/**
 * Created by Administrator on 2016/8/25.
 */



var express = require('express');
var router = express.Router();
var serverConf = require('./util/getServerConf');
var conf=serverConf.getServerSyncConf();//默认读取一次配置文件
var tools = require("./util/commentUtil");
var superagent = require("superagent");
var logger=require('./util/logUtil').logger;


/*  //已有公共号，引导去绑定,绑定成功后回调 */

router.get("/:userId",function(req,res,next){

    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });
    console.log('%s %s %s', req.method, req.params.userId,req.path);
  /*  var shopSid = req.query.shopSid;
    var userId  = req.params.userId;
    var authCode = req.query.auth_code;
    var expiresIn = req.query.expires_in;*/
    console.log("Ip:"+tools.getClientIp(req));
    var userId = req.params.userId;
    var shopSid = req.query.shopSid;
    var url = conf.wechatActionServer.trim()+"/expre?ip="+tools.getClientIp(req)+"&user_id="+userId+"&address="+conf.wechatActionServer.trim()+"/o2o/bindSuccess"+"/"+userId+"?shopSid="+shopSid;
    res.redirect(url);
});


router.get("/bindSuccess/:userId",function(req,res,next){

    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });
   /* 调接口判断是否绑定 */
    var ajaxUrl = conf.wechatActionServer.trim()+"/register";

    var userId = req.params.userId;
    var shopSid = req.query.shopSid;
    var authCode = req.query.auth_code;
    var expires_in = req.query.expires_in;

    superagent
        .post(ajaxUrl)
        .send({ auth_code: authCode, expires_in: Number(expires_in),user_id:userId })
        .end(function(err, result){
            console.log("JSON.stringify(result)>>>>"+JSON.stringify(result));
            if (err || !result.ok) {
                logger.info('进程异常:',err.message + "\n\n" + err.stack + "\n\n" + err.toString());
            } else {
                console.log("res:"+JSON.stringify(result));
                logger.info("res:"+JSON.stringify(result));
                if(result.status !=200){
                    res.redirect( conf.wechatActionServer.trim()+"/o2o/route/"+ shopSid +"/qrcode-open_pub_fail" );
                }
                res.redirect( conf.wechatActionServer.trim()+"/o2o/route/"+ shopSid +"/qrcode-open_pub_succeed?userId="+ userId );
            }
        });











});



/*

res.render("qrcode/open_pub_bind",{
    shopSid             : req.query.shopSid,
    userId              : req.params.userId,
    authCode            : req.query.auth_code,
    expiresIn           : req.query.expires_in,
    accessToken         : req.query.access_token,
    homeUrl             : conf.homeUrl,
    downloadUrl         : conf.downloadUrl,
    staticResourcesUrl  : conf.staticResourcesUrl,
    staticImageUrl      : conf.staticImageUrl,
    uploadActionServer  : conf.uploadActionServer,
    fileVersion         : conf.fileVersion,
    ContextPath         : conf.ContextPath,
    wechatActionServer  : conf.wechatActionServer,
    saasActionServer    : conf.saasActionServer,
    staticHomeUrl       :conf.staticHomeUrl,
    context             :conf.context

});
*/

module.exports = router;
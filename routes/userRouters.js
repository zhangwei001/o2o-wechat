/**
 * Created by Administrator on 2016/8/25.
 */



var express = require('express');
var router = express.Router();
var serverConf = require('./util/getServerConf');
var conf=serverConf.getServerSyncConf();//默认读取一次配置文件



/* 微信用户管理  */
router.get("/:shopSid/manage-weixin_custom_index",function(req,res,next){

    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("manage/weixin_custom_index",{
        shopSid             : req.params.shopSid,
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
        staticHomeUrl       :conf.staticHomeUrl

    });

});
/*http://localhost:3000/o2o/route/1286/help-wechat_help_center*/

router.get("/:shopSid/help-wechat_help_center",function(req,res,next){

    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("help/wechat_help_center",{
        shopSid             : req.params.shopSid,
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
        staticHomeUrl       :conf.staticHomeUrl

    });

});


module.exports = router;
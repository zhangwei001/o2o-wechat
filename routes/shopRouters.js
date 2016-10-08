/**
 * Created by Administrator on 2016/8/22.
 */

var express = require('express');
var router = express.Router();
var serverConf = require('./util/getServerConf');
var conf=serverConf.getServerSyncConf();//默认读取一次配置文件


/* 路由 */
router.get("/:shopSid/*",function(req,res,next){
    var routerPathList =req.path.split("/");
    var routerPath = routerPathList[routerPathList.length-1];
    var routerModel =routerPath.replace(/\-/g,'/');


    console.log('%s %s %s $s', req.method, req.url,routerPath ,routerModel);

    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render(routerModel,{
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
        staticHomeUrl       :conf.staticHomeUrl,
        context             :conf.context

    });

});

module.exports = router;
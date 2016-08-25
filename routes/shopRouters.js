/**
 * Created by Administrator on 2016/8/22.
 */

var express = require('express');
var router = express.Router();
var serverConf = require('./util/getServerConf');
var conf=serverConf.getServerSyncConf();//默认读取一次配置文件




/* 发微信内容 */
router.get("/:shopSid/thirdpartnar-send_public_message",function(req,res,next){

    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("thirdpartnar/send_public_message",{
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

/* 发布微信内容，查看已发布内容 */

router.get("/:shopSid/thirdpartnar-released_public_message?",function(req,res,next){
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("thirdpartnar/released_public_message",{
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
    /* 发布优惠活动 */
    router.get("/:shopSid/promotions-release_promotion_activity",function(req,res,next){
        serverConf.getServerConf(function(err,objConf){
            //每次进店铺主页异步读取一次配置文件

            if(!err){
                conf=objConf;
            }
        });

        res.render("promotions/release_promotion_activity",{
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

    /* 自动回复  */
    router.get("/:shopSid/robot-upweixin_auto_reply_index",function(req,res,next){
        serverConf.getServerConf(function(err,objConf){
            //每次进店铺主页异步读取一次配置文件

            if(!err){
                conf=objConf;
            }
        });

        res.render("robot/upweixin_auto_reply_index",{
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


/* 自定义发消息 http://wx.mljiadev.cn/o2o/route/1286/customized-creat_mass_message_index  */
router.get("/:shopSid/customized-creat_mass_message_index",function(req,res,next){
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("customized/creat_mass_message_index",{
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

/* 自定义发消息,发送历史 http://wx.mljiadev.cn/o2o/route/1286/customized-weixin_mass_history_index  */
router.get("/:shopSid/customized-weixin_mass_history_index",function(req,res,next){
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("customized/weixin_mass_history_index",{
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
/* 素材库 http://wx.mljiadev.cn/o2o/route/1286/fodder-wechat_fodder_index*/
router.get("/:shopSid/fodder-wechat_fodder_index",function(req,res,next){
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("fodder/wechat_fodder_index",{
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

/* 新建图文消息 http://wx.mljiadev.cn/o2o/route/1286/fodder-wechat_sourse_add_imageText */
router.get("/:shopSid/fodder-wechat_sourse_add_imageText",function(req,res,next){
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件

        if(!err){
            conf=objConf;
        }
    });

    res.render("fodder/wechat_sourse_add_imageText",{
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

/* 图文库 http://localhost:3000/o2o/route/1286/fodder-weixin_source_image_index*/
    router.get("/:shopSid/fodder-weixin_source_image_index",function(req,res,next){
        serverConf.getServerConf(function(err,objConf){
            //每次进店铺主页异步读取一次配置文件

            if(!err){
                conf=objConf;
            }
        });

        res.render("fodder/weixin_source_image_index",{
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
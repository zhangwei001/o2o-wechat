/**
 * Created by Administrator on 2016/8/22.
 */

var express = require('express');
var router = express.Router();



router.get("/",function(req,res,next){
    res.send('respond with a resource');
});

router.get("/user",function(req,res,next){
    res.send('respond with a resource,user');
});


module.exports = router;
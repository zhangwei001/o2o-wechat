<%@page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include  page="../layout_second/header.html" />




    
    
<link href="${resourcesPath}/css/bootstrap3/css/bootstrap.min.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap3/icons.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap3/dialog.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap3/guide_tise.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap3/base.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap3/mymiljia.css?v=${fileVersion}" rel="stylesheet" type="text/css" />



</head>
<jsp:include  page="../layout_second/top.html" />



<div class="container my_mlijia_container" id="wxUserInfApp">
	<wechatinfo isAuth="1"></wechatinfo>
</div>

<template id="publicInfo_template">
  

    <div class="container weixingginfo">
		<div class="wXinfotop">
	        <p class="fz18 fl"><i class="icon-wXinfotop01 mr10"></i>公众号信息</p>
	        <p class="fl txthui ml10 mt2"><i class="icon-wXinfotop02"></i>点击“更新”字样即可将微信公众号的名称、头像、二维码、公众号类型信息同步为最新状态。<a @click="refreshEvent( userId )">更新 <span class="fsongti">>></span></a></p>
        </div>

        <ul class="gginfomain">
            <li class="a1 poi1">
                <p class="txt1">公众号类型：</p>
                <p>{{ accountType }}</p>
				<p class="wXinfoTese poi2" v-if=" isAuth=='未认证' ||  accountType=='订阅号' "><i class="icon-wXinfotop03"></i>您需要更换公众号类型为【服务号】，才可使用全部微信服务。<a v-bind:href="upgradeLink" target="_blank">如何更换？</a></p>
            </li>

            <li class="a2 poi1">
                <p class="txt1">是否认证：</p>
                <p>{{ isAuth }}</p>
				<p class="wXinfoTese poi2"  v-if="isAuth=='未认证' ||  accountType=='订阅号'"><i class="icon-wXinfotop03"></i>您需要【认证】服务号，才可使用全部微信服务。<a v-bind:href="authLink" target="_blank">如何认证？</a></p>
            </li>
            
            <li class="a1">
                <p class="txt1">公众号名称：</p>
                <p>{{nick_name}}</p>


            </li>
            <li class="a3 poi1 downBcodeMain">
                <p class="txt1">二维码：</p>
                <p><img src="{{qrCodeImg}}" width="168" height="168"></p>
                <p class="poi2 downBcode"><a v-bind:href="downLoadCodeImg">下载高清二维码</a></p>
            </li>
            <li class="a5">
                <p class="txt1">公众号头像：</p>
                <p><img src="{{headImg}}" width="168" height="168"></p>
            </li>
            <li class="tise2">
                <p class="ml40">如需解除绑定，请联系4007889166</p>
            </li>
        </ul>
    </div>
  </div>
  
 
</template>




<script src="<%=request.getContextPath()%>/resources/javascript/wechat/qrcode/open_pub_succeed.js?${fileVersion}"></script>

<script src="<%=request.getContextPath()%>/resources/javascript/wechat/base/mljia_wx_userUtil.js?v=${fileVersion}"></script>

 <jsp:include  page="../layout_second/footer.html" />



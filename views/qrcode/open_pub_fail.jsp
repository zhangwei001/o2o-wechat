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



   <div class="container my_mlijia_container" id="auto_my_mlijia_container">

 <!--提示内容s-->       
<div class="Signup_main" id="auto_Signup_main">

<p class="Signup_txt01 SignupFailed_tatle"><span class="a1"> <i class="icon-Signup icon-SignupFailed"></i></span><span class="a2">绑定失败，该账号已被其他店铺绑定。</span></p>
<p class="Signup_txt02"><span class="a1"></span><span class="a2">一个微信公众号只能绑定一个店铺，如果不想继续使用之前的店铺，请先向美丽加申请解绑。</span></p>
<!-- <p class="Signup_txt03"><span class="a1"></span><span class="a2">若逾期未能审核通过，请联系我们：4007-889-166转002</span></p> -->

<p class="Signup_txt04"><span class="a1"></span><span class="a2"><a class="butsbase butblue01" id="goBindPage">返回我的美丽加</a></span></p>

</div>

 <!--提示内容e-->   



    </div>




<%--    
<div class="container weixingginfo">
	<p class="bbmbs">您当前的位置：我的美丽加店面/ 授权公众号</p>

	<div class="wxktggh_main wxkbdsb_main">

		<ul class="wxktggh_shenhecg wxktggh_shenhesb">
			<li class="a1"><img src="${staticImage_Url}/mljia/erroecross_r2_c2.gif"
				width="40" height="40"></li>
			<li class="a2">
				<p class="fz20">绑定失败，该账号已被其他店铺绑定。</p>
				<p class="td1 txthui">一个微信公众号只能绑定一个店铺，如果不想继续使用之前的店铺，请先向美丽加申请解绑。</p>


			</li>

		</ul>


	</div>


</div> --%>
<script src="<%=request.getContextPath()%>/resources/javascript/wechat/qrcode/open_pub_fail.js?${fileVersion}"></script>

<script src="<%=request.getContextPath()%>/resources/javascript/wechat/base/mljia_wx_userUtil.js?v=${fileVersion}"></script>

<jsp:include  page="../layout_second/footer.html" />


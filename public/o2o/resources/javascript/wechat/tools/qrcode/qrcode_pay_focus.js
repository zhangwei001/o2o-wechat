// 店铺二维码

$(function(){
	
	

	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || store.get("wx_access_token") || $.cookie('access_token');
	
	//清空授权码
	store.remove("wxAuthCode");
	
	//wx_access_token 
	store.remove("wx_access_token");
	store.set("wx_access_token",accessToken);
	
	
	var userId;
	if(!accessToken){
		store.remove("shopIdAndUserId");
		window.location.href= wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
	}
	
	//获取授权码
	globalUtil.getWXAuthCode(accessToken);
	
	
	
	var shopQRCodeApp={
			init:function(){
				document.title ="微信公众号";
				this.fetchPayQrCode();
				this.fetchQRCode();
			},
			fetchQRCode:function(){
				$.ajax({
	 				url:requestUrl.user.fetchFocusQrcodeImg +wxGLOBAL.shopSid + "/attention/qrcode",
	 				data:{},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.returnCode == "success" ){
	 						
	 						var focusQrImg =data.code.imageUrl;
	 						$("#focusImg").attr("src",focusQrImg).parent("p").next("p").find("a").attr("href",focusQrImg);
	 						
	 						var showCardImgUrl= data.xxx;
	 						$("#SampleCard").attr("src",showCardImgUrl);
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
				this._end()
			},
			fetchPayQrCode:function(){
				
				$.ajax({
	 				url:requestUrl.user.fetchPayQrcodeImg +wxGLOBAL.shopSid + "/pay/qrcode",
	 				data:{},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.returnCode == "success" ){
	 						var payQrImg = data.payCode.imageUrl;
	 						$("#payImg").attr("src",payQrImg).parent("p").next("p").find("a").attr("href",payQrImg)
	 						
	 					/*	var focusQrImg =data.code.imageUrl;
	 						$("#payImg").attr("src",focusQrImg).parent("span").parent("p").next("a").attr("href",focusQrImg);
	 						
	 						var showCardImgUrl= data.xxx;
	 						$("#SampleCard").attr("src",showCardImgUrl);*/
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
			},
			_end:function(){
				var hre ="/o2o/route/"+wxGLOBAL.shopSid+"/auth-register_server_number";
				
				$("#toBindLink").attr("href",hre).attr("target","_blank");
				//$("body").delegate("a.itemId","click",function(){})
				
				//导航设置
				var wifiRoute = "/o2o/route/"+wxGLOBAL.shopSid+"/tools-wifi-shop_wifi_snapshoot";
				$("#navigation_set").attr("href",wifiRoute);
				$("#jumpSetWifiPage").attr("href",wifiRoute).attr("target","_blank");
			}
	};
	shopQRCodeApp.init()
});
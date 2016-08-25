/**
 * 扫码失败
 * 
 */
$(function(){
	var accessToken=store.get("wx_access_token");
	var qrcodeFailApp={
			init:function(){
				this.backTobindAgin();
			},
			backTobindAgin:function() {
				$("#goBindPage").on("click",function(){
					window.location.href = contextPath   + "route/" + shopSid  + "/qrcode-open_pub_succeed?access_token="+accessToken;
				});
			}
	};
	qrcodeFailApp.init();
	
	
	
});

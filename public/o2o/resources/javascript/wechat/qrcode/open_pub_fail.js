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
					window.location.href = "/o2o/route/" + wxGLOBAL.shopSid  + "/qrcode-open_pub_succeed?access_token="+accessToken;
				});
			}
	};
	qrcodeFailApp.init();
	
	
	
});

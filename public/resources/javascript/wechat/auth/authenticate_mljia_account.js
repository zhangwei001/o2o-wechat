/**
 * 
 */
//http://192.168.2.21/o2o/route/auth-authenticate_server_number?shopId=2&userId=2

$(function(){
	var authMLjiaApp={
			
			init:function(){
				document.title=""; 
				this.getShopAndUserInfo();
			},
			getShopAndUserInfo:function(){
				var _this =this;
				var accessToken = store.get("wx_access_token");
				$.ajax({
					url:requestUrl.user.getUserInfo,
					data:{
						access_token: accessToken
					},
					type:'post',
					dataType:'json',
					success:function(data){
						if(data.status===200){
							var content=data.content;
							if(data.content){
								content = JSON.parse($.base64.decode(content, "utf-8"));
								console.log("shopIdAndUserId:",content);
								
								store.remove("shopIdAndUserId");
								store.set("shopIdAndUserId",content);
								
								_this._endFun(content.shop_sid,content.user_id);
							}else{
								layer.msg('获取用户信息失败，请重新登陆');
							}
							
							
						}else{
							layer.msg('更新失败，请稍后重试')
						}
					}
				});
			},
			_endFun:function(shopSid,userId){
				
				var backLink = contextPath +"route/"+shopSid+"/auth-authenticate_server_number";
				new Vue({
					el:"#twoBtn",
					data:{
						backLink: backLink,
						authMljiaLink: contextPath+"bind/"+userId +"?shopSid="+shopSid
					},
					
				});
			}
			
	};
	authMLjiaApp.init();
});
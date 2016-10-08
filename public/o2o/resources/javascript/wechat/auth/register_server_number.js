/**
 * 注册服务号
 */

$(function(){
	
	var registerApp={
			
			data:{
			 nextLink:	"/o2o/route/"+wxGLOBAL.shopSid+"/auth-authenticate_server_number",
			 backLink:	"/o2o/route/"+wxGLOBAL.shopSid+"/auth-register_server_number",
			 
			 register:   "/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#register",
			 auth    :  "/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#auth",
			 upgrade :   "/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#upgrade",
			 intro :  "/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#intro"
			 
			},
			
			init:function(){
				this._bindJumpEvent();
			},
			/**
			 * 绑定返回前进 跳转地址
			 */
			_bindJumpEvent:function(){
				var vmNext = new Vue({
					  el: '#nextBtn',
					  data: {
					    nextLink:this.data.nextLink
					  }
				})
				var vmBack = new Vue({
					el:"#backbtn",
					data:{
						backLink: this.data.backLink
					}
				});
				var goHelp = new Vue({
					el: "#goHelp",
					data:{
						register: this.data.register,
						auth   : this.data.auth,
						upgrade: this.data.upgrade,
						intro: this.data.intro,
						
					}
				});
			}
	};
	registerApp.init();
});
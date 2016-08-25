/**
 * 注册服务号
 */

$(function(){
	
	var registerApp={
			
			data:{
			 nextLink:	contextPath +"route/"+shopSid+"/auth-authenticate_server_number",
			 backLink:	contextPath +"route/"+shopSid+"/auth-register_server_number",
			 
			 register:  contextPath + "route/"+ shopSid + "/help-wechat_help_center#register",
			 auth    :  contextPath + "route/"+ shopSid + "/help-wechat_help_center#auth",
			 upgrade :  contextPath + "route/"+ shopSid + "/help-wechat_help_center#upgrade",
			 intro :  contextPath + "route/"+ shopSid + "/help-wechat_help_center#intro"
			 
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
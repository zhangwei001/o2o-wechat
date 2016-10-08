/**
 * 认证服务号
 */

$(function(){
	
	
	var  nextLink="/o2o/route/"+wxGLOBAL.shopSid+"/auth-authenticate_mljia_account";

	var backLink = "/o2o/route/"+wxGLOBAL.shopSid+"/auth-register_server_number";
	
	var  register="/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#register";
	var  auth    ="/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#auth";
	var  upgrade ="/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#upgrade";
	var  intro ="/o2o/route/"+ wxGLOBAL.shopSid + "/help-wechat_help_center#intro";
	new Vue({
		  el: '#nextBtn',
		  data: {
		    nextLink:nextLink
		  }
	})
	new Vue({
		el:"#backBtn",
		data:{
			backLink: backLink
		}
	});
	
	 new Vue({
		el: "#goHelp",
		data:{
			register: register,
			auth   : auth,
			upgrade: upgrade,
			intro: intro,
			
		}
	});
});
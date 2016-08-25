/**
 * 认证服务号
 */

$(function(){
	
	
	var  nextLink=contextPath +"route/"+shopSid+"/auth-authenticate_mljia_account";

	var backLink = contextPath +"route/"+shopSid+"/auth-register_server_number";
	
	var  register=contextPath + "route/"+ shopSid + "/help-wechat_help_center#register";
	var  auth    =contextPath + "route/"+ shopSid + "/help-wechat_help_center#auth";
	var  upgrade = contextPath + "route/"+ shopSid + "/help-wechat_help_center#upgrade";
	var  intro = contextPath + "route/"+ shopSid + "/help-wechat_help_center#intro";
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
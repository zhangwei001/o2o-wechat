$(function(){
	/**
	 * 查询当前店铺微信公众号详情
	 */
	var userId ;
	var shopIdAndUserId=store.get("shopIdAndUserId");
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || store.get("wx_access_token");
	
	var bindPubSuccess={
			
			init:function(){
				
				document.title="微信公众号";
				//清空授权码
				store.remove("wxAuthCode");
				
				//wx_access_token 
				store.remove("wx_access_token");
				store.set("wx_access_token",accessToken);
				
				globalUtil.getWXAuthCode(accessToken);
				if(!shopIdAndUserId){
					this.getUserInfo();
					
				}
				this.getPubInfo(userId,accessToken);
			},
			/*
			 *用户登陆信息 
			 */
			
			getUserInfo:function(){
				$.ajax({
					url:requestUrl.user.getUserInfo,
					data:{
						access_token: accessToken
					},
					type:'post',
					async:false,
					dataType:'json',
					success:function(data){
						if(data.status===200){
							var content=data.content;
							if(data.content){
								content = JSON.parse($.base64.decode(content, "utf-8"));
								console.log("shopIdAndUserId:",content);
								userId= content.user_id
								store.remove("shopIdAndUserId");
								store.set("shopIdAndUserId",content);
							}else{
								layer.msg('获取用户信息失败，请重新登陆')
							}
							
							
						}else{
							layer.msg('更新失败，请稍后重试')
						}
					}
				});
			},
			
			getPubInfo:function(userId,accessToken){
				var _this = this;
				$.ajax({
					url:requestUrl.user.appInfo,
					data:{
						"user_id":userId,
						 access_token:accessToken
					},
					type:"get",
					dataType:"json",
					success:function(data){
						if(data.status==200){
							console.log("data:",data);
							var content = JSON.parse( $.base64.decode(data.content,"utf-8"));
							console.log("content:",content);
							_this.component(content,userId);
						}else if(data.status==25){
							//layer.msg("没有绑定公众号!",1, 3);
							//http://192.168.2.21/route/auth-register_server_number
							location.href="/o2o/route/"+wxGLOBAL.shopSid+"/auth-register_server_number"
						}
						else{
							layer.msg(data.error_message,1, 3);
						}
					},
					fail:function(){
						console.log("fail");
					}
					
					
				});
			},
			component:function(content,userId){
				Vue.component('wechatinfo',{
					template:"#publicInfo_template",
					props:["isAuth"],
					data:function(){
						return {
							"userId":userId,
							"isAuth":content.service_type_info,
							"headImg":content.head_image,
							"qrCodeImg":wxGLOBAL.download_url+"/image/"+content.qr_file_image,
							"downLoadCodeImg":wxGLOBAL.download_url+content.qr_file_image,
							"upgradeLink":"/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#upgrade",
							"authLink":"/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#auth",
							"nick_name":content.nick_name
							
						}
					},
					computed:{
						accountType:function(){
							if(content.service_type_info==0 || content.service_type_info==1){
								return "订阅号";
							}
							else{
								return "服务号";
							}
							
						},
						isAuth:function(){
							if(-1 == content.verify_type_info){
								return "未认证"
								//serviceTypeInfo=serviceTypeInfo+"(未认证)";
							}else{
								return "已认证"
								//serviceTypeInfo=serviceTypeInfo+"(已认证)";
							}
						}
					},
					methods:{
						refreshEvent:function(userid){
							var self = this;
							//点击刷新
							$.ajax({
								url:requestUrl.material.wxRefresh,
								type:'post',
								data:{user_id :userid},
								dataType:'json',
								//async:false,
								success:function(data){
									if(data.status===200){
										
									
										
										var htm='<div class="wxzdhf_optise wxzdhf_optise_box1">'+
									    '<p><i class="icon-optise02"></i></p>'+
									    '<p class="txt01">更新信息成功~</p></div>';
									    
										$.layer({
										    type: 1,
										    time: 2,
										    title: false,
										    shadeClose: false,
										    area: ['auto', 'auto'],
										    bgcolor: '',
										    border: [0], //去掉默认边框 
										    closeBtn: [1, false], //去掉默认关闭按钮
										    shift: 'top', 
										    page: {
										        html:htm
										    },
										    end:function(){
										    	window.location.reload(true);    	
										    }
										});
										
										
									}else{
										var htm='<div class="wxzdhf_optise wxzdhf_optise_box1">'+
										 '<p class="txt01">&nbsp;&nbsp;&nbsp;更新失败，请稍后重试</p></div>';
									    
										$.layer({
										    type: 1,
										    time: 2,
										    title: false,
										    shadeClose: false,
										    area: ['auto', 'auto'],
										    bgcolor: '',
										    border: [0], //去掉默认边框 
										    closeBtn: [1, false], //去掉默认关闭按钮
										    shift: 'top', 
										    page: {
										        html:htm
										    }
										});
									}
								}
							});
						}
					}
					
					
				});
				this.renderTemp();
				
			},
			renderTemp:function(){
				
				new Vue({
					el:"#wxUserInfApp"
				});
			}
		
			
	};
	bindPubSuccess.init();
	

});




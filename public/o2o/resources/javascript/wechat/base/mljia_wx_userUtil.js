$(function(){
	var userLoginInfo=store.get("shopIdAndUserId");
	var user={
			role:0,
			init:function(){
				//判断用户是账号登录 还是工作机模式下的登录
				
				if( !userLoginInfo ){
					this.getUserInfo();
				};
				
				var userInfo=userLoginInfo.auth_info,
					str='其他方式';
//				saas URL 返回的accessToken  和 登陆信息返回的accessToken 不一致时，重新用登陆信息accessToken 获取一次wxAuthCode

				this.role=userInfo.role;//0工作机， 1店内， 2账号登录

				if(2==userInfo.role){
					this.accountPattern(userInfo,str);
				}else{
					this.machinePattern(userInfo);
				}
				this.eventBind();

				//this.loadShopSetting();
			},
			getUserInfo:function(){
				$.ajax({
					url:requestUrl.user.getUserInfo,
					data:{
						access_token: store.get("wx_access_token")
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
								userLoginInfo=content;
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
			accountPattern:function(userInfo,str){
				//账号登录
				//userFlag 登录标识(0:QQ登录 1：新浪登录  2：美丽加账号登录3匿名登录 5 微信登录)
				if(0==userInfo.user.userFlag){
					str='QQ登录';
				}else if(1==userInfo.user.userFlag){
					str='新浪登录';
				}else if(2==userInfo.user.userFlag){
					str='美丽+账号登录';
				}else if(3==userInfo.user.userFlag){
					str='匿名登录';
				}else if(5==userInfo.user.userFlag){
					str='微信登录';
				}
				var $li=$('#user_module [data-user="true"]');

				$li.eq(0).text('您好，'+userInfo.user.otherName+'（'+str+'）');
				$li.eq(2).show();
				$li.eq(1).hide();
			},
			machinePattern:function(userInfo){
				//工作机登录(店内登录)
				var $li=$('#user_module [data-user="true"]');

				//otherName; XXX(店主)
				if(userInfo.user && userInfo.user.otherName){
					$li.eq(0).html('<i class="icon-ggjpc"></i>'+userInfo.user.otherName);
					$li.eq(2).show();
					$li.eq(1).hide();
				}else{
					$li.eq(0).html('<i class="icon-ggjpc"></i>工作机管理');
					$li.eq(1).show();
					$li.eq(2).hide();
				}

			},
			loadShopSetting:function(){
				//
				$.ajax({
					url: requestUrl.setting.selectShopSetting,
					data:{shop_sid:shopId},
					type:'get',
					dataType:'json',
					success:function(res){
						if(res.status==200 && res.content) {
							var data = globalUtil.decryptData(res.content);
							if(0==data.sys_version_strengthen){
								$('#shopSysStrengthen')
							}
							GLOBAL.setting=data;
						}
					}
				});

			},
			eventBind:function(){
				var _this=this;

				$('#staffLogin').on('click',function(){
					//店内登录
					globalUtil.handler.accessPanel(1);
				});
				$('#exitLogin').on('click',function(){
					//退出登录staffLoginOut

					$.ajax({
						url:requestUrl.user.wXUserExit,
						type:'GET',
						dataType:"json",
						success:function(){
							store.remove("shopIdAndUserId");
							window.location.href =wxGLOBAL.homeUrl ;
						}
					
					});
				});
				//加入收藏夹
				$("#addHomePage").click(function () {
					if (document.all) {//设置IE
						document.body.style.behavior = 'url(#default#homepage)';
						document.body.setHomePage(document.URL);
					}
					else
					{//网上可以找到设置火狐主页的代码，但是点击取消的话会有Bug，因此建议手动设置
						layer.alert('设置首页失败，请手动设置！<br>或者 按CTRL+D 加入收藏夹', {icon: 5});
					}
				});
			}
			
	};
	user.init();
	
	
	
})
/**
 * wechat help center 
 * david 
 * 2016.5.26
 */

$(function(){
	
	var helpCenterApp={
			//获取是否为
			data:{
				itemType:window.location.hash.substr(1)//哈希值帮助项目
			},
			//备忘录 缓存数据
			cache:{},
			
			init:function(){
				
				$("title").html("帮助中心");
				//订阅升级服务号
				if(this.data.itemType=="upgrade"){
					$(".navATag").removeClass("active");
					this.getItemData("upgrade");
					$(".navATag").eq(3).addClass("active");
			    //认证服务号
				}else if(this.data.itemType=="auth"){
					$(".navATag").removeClass("active");
					$(".navATag").eq(2).addClass("active");
					this.getItemData("auth");
				//注册服务号
				}else if(this.data.itemType=="register"){
					$(".navATag").removeClass("active");
					$(".navATag").eq(1).addClass("active");
					this.getItemData("register");
				//简介
				}else{
					this.getItemData("intro");
				}
				
				this.bindEvent();
			},

			getItemData:function(itemId){
				var _this = this;
				
				//如果缓存中有值，从缓存中取值
				if(this.cache[itemId]){
					_this.showPage(this.cache[itemId]);
				}else{
					if(itemId && itemId=="intro"){
						$.ajax({
							url:"/resources/template/help/wechat_platform_intro_temp.html",
							type:"get",
							dataType:"html",
							success:function(data){
								_this.cache[itemId]=data;
								_this.showPage(data);
							}
						});
					}else if(itemId && itemId=="register"){
						$.ajax({
							url:"/resources/template/help/wechat_register_temp.html",
							type:"get",
							dataType:"html",
							success:function(data){
								_this.cache[itemId]=data;
								_this.showPage(data);
							}
						});
						
					}else if(itemId && itemId=="upgrade"){
						
						$.ajax({
							url:"/resources/template/help/upgrade_server_account_temp.html",
							type:"get",
							dataType:"html",
							success:function(data){
								_this.cache[itemId]=data;
								_this.showPage(data);
							}
						});
						
					}else if(itemId && itemId=="auth"){
					
						$.ajax({
							url:"/resources/template/help/auth_server_account_temp.html",
							type:"get",
							dataType:"html",
							success:function(data){
								_this.cache[itemId]=data;
								_this.showPage(data);
							}
						});
					}
					
				}
				
				
				
			},
			showPage:function(data){
				
				 laytpl(data).render({
					 staticImage_Url:wxGLOBAL.staticImage_Url
				 },function(html){
					 $("#helpCenteView").empty().append(html);
				 });
			},
			bindEvent:function(){
				var _this =this;
				var navBtn = $(".navBtn");
				navBtn.on("click",function(){
					var parentATag= $(this).parent("a");
					$(".navATag").removeClass("active");
					parentATag.addClass("active");
					
					var itemId = $(this).data().itemid;
					_this.getItemData(itemId);
					
					
				});
			}
	};
	helpCenterApp.init();
});
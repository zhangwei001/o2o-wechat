//1、进入页面后检测wifi 设置状态
//2.未设置的 渲染设置页面，设置的渲染修改页面
$(function(){
	

	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || store.get("wx_access_token") || $.cookie('access_token');
	
	//清空授权码
	store.remove("wxAuthCode");
	
	//wx_access_token 
	store.remove("wx_access_token");
	store.set("wx_access_token",accessToken);
	
	
	var userId;
	if(!accessToken){
		store.remove("shopIdAndUserId");
		window.location.href= wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
	}
	
	//获取授权码
	globalUtil.getWXAuthCode(accessToken);
	
	
	
	var wifiSnapshootApp={
			data:{
				isSetWifi:false,
				wifiInfo:{
					wifiCount:"",
					wifiPassWord:""
				}
			},
			init:function(){
				document.title ="WiFi";
				
				this.checkWifiStatus();
				this.endFun();
			},
			checkWifiStatus:function(){
				var _this =this;
				$.ajax({
	 				url:requestUrl.user.fetchWXshopInfo,
	 				data:{shop_sid:wxGLOBAL.shopSid},
	 				type:"post",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status==200 ){
	 						//设置参数
	 						
	 						var content = JSON.parse(data.content);
	 						_this.data.wifiInfo.wifiCount=content.wifiAccount;
	 						_this.data.wifiInfo.wifiPassWord=content.wifiPasswd;
	 						
	 						if(content.wifiAccount){
	 							_this.data.isSetWifi=true;
	 						}else{
	 							_this.data.isSetWifi=false;
	 						}
	 						
	 						_this.rendTempFun();
	 					}else if(data.status==400 || data.status==301){
	 						_this.data.isSetWifi=false;
	 						_this.rendTempFun();
	 					}else{
	 						alert("后台返回数据有误");
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
				
			},
			rendTempFun:function(){
				var _this = this;
				if(this.data.isSetWifi){
					laytpl($("#hasSetWifiTemp").html()).render({
						wifiInfo:_this.data.wifiInfo,
						shopSid :wxGLOBAL.shopSid
 					},function(html){
 					    $(".weixin_container_box").empty().append(html);
 					   _this.hasWifiEventFun();
 					});
					
				}else if(!this.data.isSetWifi){
					var _this = this;
					laytpl($("#wifiStepTemp").html()).render({
						/*wifiInfo:_this.data.wifiInfo,
						shopSid :shopSid*/
 					},function(html){
 					    $(".weixin_container_box").empty().append(html);
 					    $("#setWifiStepBtn").on("click",function(){
 					    	laytpl($("#noWifiTemp").html()).render({
 								/*wifiInfo:_this.data.wifiInfo,
 								shopSid :shopSid*/
 		 					},function(html){
 		 					    $(".weixin_container_box").empty().append(html);
 		 					  _this.noWifiEventFun();
 		 					   
 		 					});
 					    });
 					});
					
					
					/*laytpl($("#noWifiTemp").html()).render({
						
 					},function(html){
 					    $(".weixin_container_box").empty().append(html);
 					    _this.noWifiEventFun();
 					});*/
				}
			},
			//已设置wifi的处理事件
			hasWifiEventFun:function(){
				this.editWifiFun();
				this.deleWifiFun();
			},
			//没有设置wifi的处理事件 包括 编辑
			noWifiEventFun:function(){
				var _this =this;
				$(".wifiName").on("keyup",function(){
					var _this$dom = $(this);
					if( _this$dom.val() ){
						_this$dom.parent(".p1").next(".p2").text("");
					}else{
						_this$dom.parent(".p1").next(".p2").text("请输入网络名称");
					}
					
				})
				$(".wifiPassword").on("keyup",function(){
					var _this$dom = $(this);
					if( _this$dom.val() ){
						if(_this$dom.val().length<8 || _this$dom.val().length>126){
							_this$dom.parent(".p1").next(".p2").text("请输入8到126位字符");
						}else{
							_this$dom.parent(".p1").next(".p2").text("");
						}
					}
					
				});
				$(".saveWifi").on("click",function(){
					var wifiName =$(".wifiName").val();
					var wifipassword =$(".wifiPassword").val();
					if(wifiName && (( wifipassword.length>=8 && wifipassword.length<=126 ) || wifipassword.length==0 )  ){
						_this.submitWifiInfo(wifiName, wifipassword)
					}
					
				});
				
				
			},
			editWifiFun:function(){
				var _this = this;
				var layerIndex="";
				$("#editBtn").on("click",function(){
					laytpl($("#edtiWifiTemp").html()).render({
						wifiInfo:_this.data.wifiInfo,
						shopSid :wxGLOBAL.shopSid
	                },function(html){
	                  var layerIndex = $.layer({
	                        type: 1,
	                        title: false,
	                        shadeClose: false,
	                        area: ['auto', 'auto'],
	                        bgcolor: '',
	                        border: [0], //去掉默认边框
	                        closeBtn: [1, false], //去掉默认关闭按钮
	                        shift: 'top', //从左动画弹出
	                        page: {
	                            html:html
	                        },
	                        end: function(){
	                        	
	                        },
	                        success: function(layero){
	                        	_this.noWifiEventFun();
	                        }
	                    });
	                });
					
					$("#quitEditWifi").on("click",function(){
						layer.closeAll();
                	});
					$(".crossbut").on("click",function(){layer.closeAll();});
				});
			},
			deleWifiFun:function(){
				var _this = this;
					$("#deleBtn").on("click",function(){
						laytpl($("#deleteWifiTemp").html()).render({
		                   /* download_url:download_url,
		                    items:items*/
		                },function(html){
		                    $.layer({
		                        type: 1,
		                        title: false,
		                        shadeClose: false,
		                        area: ['auto', 'auto'],
		                        bgcolor: '',
		                        border: [0], //去掉默认边框
		                        closeBtn: [1, false], //去掉默认关闭按钮
		                        shift: 'top', //从左动画弹出
		                        page: {
		                            html:html
		                        },
		                        success: function(){
		                        	//删除店铺wifi设置
		                        	$("#deleteSure").on("click",function(){
		                        		$.ajax({
		                	 				url:requestUrl.user.deleteWifiSettting,
		                	 				type:"get",
		                	 				dataType: "json",
		                	 				success :function(data){
		                	 					if(data.status==200 ){
		                	 						//刷新页面
		                	 						_this.data.isSetWifi=false;
		                	 						window.location.reload(true);
		                	 					
		                	 					}else{
		                	 						console.log(data.content);
		                	 					}
		                	 				},
		                	 				error :function(){
		                	 					alert("网络开了小差，重新试试吧~");
		                	 				}
		                	 			 });
		                        	});

		                        }
		                    });
		                });
						
						
						
						//取消删除
						$("#cancelDeletWifi").on("click",function(){
							layer.closeAll();
						});
						$(".crossbut").on("click",function(){layer.closeAll();});
					});
			},
			submitWifiInfo:function(wifiName,wifipassword){
				var _this = this;
				$.ajax({
	 				url:requestUrl.user.saveWXshopInfo,
	 				data:{
	 					wifi_account:wifiName,
	 					wifi_passwd:wifipassword
	 				},
	 				type:"post",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status == 200 ){
	 						//设置wifi成功标准
	 						_this.data.isSetWifi=true;
	 						
	 						laytpl($("#savaSuccess").html()).render({
	 		                   /* download_url:download_url,
	 		                    items:items*/
	 		                },function(html){
	 		                    $.layer({
	 		                        type: 1,
	 		                        title: false,
	 		                        shadeClose: false,
	 		                        area: ['auto', 'auto'],
	 		                        bgcolor: '',
	 		                        border: [0], //去掉默认边框
	 		                        closeBtn: [1, false], //去掉默认关闭按钮
	 		                        shift: 'top', //从左动画弹出
	 		                        page: {
	 		                            html:html
	 		                        },
	 		                        end: function(){
	 		                        	//window.location= location.reload(true)
	 		                        },
	 		                       success:function(){
	 		                    	  
	 		                       }
	 		                    });
	 		                    setTimeout(function(){
	 		                    	window.location.reload(true);
	 		                    },800);
	 		                });
	 						
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
			},
			endFun:function(){
				
				//导航设置
				var wifiRoute = "/o2o/route/"+wxGLOBAL.shopSid+"/tools-qrcode-qrcode_pay_focus";
				$("#navigation_set").attr("href",wifiRoute);
				
				//导航设置
				var wifiRoute = "/o2o/route/"+wxGLOBAL.shopSid+"/tools-wifi-shop_wifi_snapshoot";
				$("#wifiRouter").attr("href",wifiRoute);
			}
	};
	wifiSnapshootApp.init();
});
/*
 * 常用工具函数
 * 
 */
$(function(){
		
		 //获取url请求参数值
		  function getUrlParam(name){
				    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				    var result = window.location.search.substr(1).match(reg);
				    if(result != null){
				        return result[2];
				    }else{
				        return null;
				    }
		  };
		  
		  //获取接口请求参数
		  function getRequestUrlParam(requetUrl,name){
			    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			    var requestParams = requetUrl.split("?")[1];
			    var result =requestParams.match(reg);
			    if(result != null){
			        return result[2];
			    }else{
			        return null;
			    }
		  };



			
			function changeTitle(title){
				  var $body = $('body');
			      document.title = title||'商家主页';
			      // hack在微信等webview中无法修改document.title的情况
			      //href="${contextPath}/resources/images/default/favicon.ico"
			      var $iframe = $('<iframe src='+GLOBAL.webRoot+'/resources/images/default/favicon.ico style="display:none;"></iframe>');
			      $iframe.on('load',function() {
			          setTimeout(function() {
			              $iframe.off('load').remove();
			          }, 0);
			      }).appendTo($body);
			};
			

			function packParam(url,opt){
				if(typeof(opt)==='object'){
					var arrs=[];
					for(var attr in opt){
						arrs.push(attr +'='+opt[attr]);
					}
					if(arrs.length>0){
						return url+'?'+arrs.join('&');	
					}else{
						return url;
					}
				}else{
					return null;
				}
			};
			
			function getAccessToken (appId,openId){
				var accessToken ;
				jQuery.ajax({
					url:request.user.getAccessToken,
					data:{app_id:appId,open_id:openId},
					type:'get',
					dataType:'json',
					async:false,
					success:function(data){
						if(data.status == 200 && data.content){
							accessToken=data.content;
						}
					}
				});
				return accessToken;
			}
			
			//通过accessToken 授权
			function getWXAuthCode(accessToken,fn ){
				if(accessToken && accessToken.length>0 ){
					$.ajax({
						url:requestUrl.user.getloginUserInfo,
						data:{
							"access_token":accessToken
						},
						type:"get",
						dataType:"json",
						async: false,
						//jsonp:'callback',
//						jsonpCallback:"success_jsonpCallback",
						success:function(data){
							if(data.status==200){
							//console.log("data:",data);
								if(data.content){
								
									//console.log("contentauthcode",data.content);
									var content = $.base64.decode(data.content, "utf-8");
									   
									//储存到localstorage
									store.remove("wxAuthCode");
									store.set("wxAuthCode",content);
									
									//console.log("wxAuthCode:",content);
									
									fn && fn(content);
								}else{
									store.remove("shopIdAndUserId");
									location.href=wxGLOBAL.homeUrl;
									
								}
							
							}else{
								store.remove("shopIdAndUserId");
								location.href=wxGLOBAL.homeUrl;
								
							}
						},
						fail:function(){
							console.log("fail");
						},error:function(){
							console.log("error");
						}
						
						
					});
				}
			
			};
			
			
			//
			function getUserInfo(accessToken){
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
								//console.log("shopIdAndUserId:",content);
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
			};
			
			/**
			 * 通用的解密函数
			 * 防止将来要变
			 * 传入字符串 返回json对象
			 */
			function decryptData(content){
				return content ? $.parseJSON($.base64.decode(content,"utf-8")) : null; 
			}
			
			/**获取请求参数值
			 * 
			 */
			function getUrlParam(name){
			    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			    var result = window.location.search.substr(1).match(reg);
			    if(result != null){
			        return result[2];
			    }else{
			        return null;
			    }
			};

			/**
			 * 增填页面入口逻辑
			 *传入 accessToken 设置 本地变量 wx_access_token & shopIdAndUserId &   wxAuthCode
	 		*/

			function entranceFilter(accessToken){
				if(!accessToken){ return }

				//wx_access_token
				store.remove("wx_access_token");
				store.set("wx_access_token",accessToken);
				//清空授权码
				store.remove("wxAuthCode");
				//获取授权码
				globalUtil.getWXAuthCode(accessToken);

				if(!store.get("shopIdAndUserId") ){
					globalUtil.getUserInfo(accessToken);
				}
			}




			window.globalUtil={
					changeTitle: changeTitle,
					getUrlParam: getUrlParam,
					packParam: packParam,
					getAccessToken:getAccessToken,
					getWXAuthCode:getWXAuthCode,
					decryptData:decryptData,
					getUrlParam:getUrlParam,
					getRequestUrlParam:getRequestUrlParam,
					getUserInfo:getUserInfo,
					entranceFilter :entranceFilter


					
			};
			
	
});

//由accessToken授权,测试某个接口是否引发授权
(function(){
	
	
	 function getParamStr(name,str){
			if(!str){
				 return null;
			}
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		    //.substr(1)
		    var result = str.match(reg);
		    if(result != null){
		        return result[2];
		    }else{
		        return null;
		    }
	};
	
	
	
	$(document).ajaxSend(function(evt, request, settings){
		
		
		   //统一给所以接口添加shopSid  除了 o2o/auth 接口
		   var accessToken = store.get("wx_access_token");
		  // var shopSid = store.get("wx_shop_sid");

		   if(settings.url.search(/auth\/check/) ==-1 &&  settings.url.search(/cloud\/image/) ==-1 ){
			   if('GET'==settings.type){
				   var url=settings.url;
				   if(url){
					   var parentUrl=url.split("?");
					   var getParam=parentUrl[1];
					   if(getParam){
						   //给saas.shop action添加accessToken
						   if(settings.url.search(/saas\.shop/)>0  || settings.url.search(/saas\.material/)>0){
							   if(!getParamStr('access_token',getParam)){
								   settings.url=url+'&access_token='+accessToken+"&shop_sid="+wxGLOBAL.shopSid;
								   request.setRequestHeader("Authorization", accessToken);
							   }
						   }else{
							   if(!getParamStr('shop_sid',getParam)){
								   settings.url=url+'&shop_sid='+wxGLOBAL.shopSid+"&access_token="+accessToken;
							   }
						   }
						   
					   }else{
						   //给saas.shop action添加accessToken
						   if(settings.url.search(/saas\.shop/)>0 || settings.url.search(/saas\.material/)>0){
							   if(!getParamStr('access_token',postParam)){
								   settings.url=url+'?access_token='+accessToken+"&shop_sid="+wxGLOBAL.shopSid;
								   request.setRequestHeader("Authorization", accessToken);
							   }
						   }else{
							   if(!getParamStr('shop_sid',postParam)){
								   settings.url=url+'?shop_sid='+wxGLOBAL.shopSid+"&access_token="+accessToken;
							   }
						   }
						  
					   }
				   }
				  // upload/image
			   	}else if('POST'==settings.type ){
			   		
			   		var postParam= settings.data ;
				  
				   	if(postParam){
					   	  //给saas.shop action添加accessToken
					   	 if(settings.url.search(/saas\.shop/)>0 ){
					   		if(!getParamStr('access_token',postParam)){
					   			settings.data=postParam+'&access_token='+accessToken;
							 }
					   	 }else{
					   		 if(!getParamStr('shop_sid',postParam)){
					   			settings.data=postParam+'&shop_sid='+wxGLOBAL.shopSid;
							 }
					   	 }
				   		
				   	}else{
				   	    //给saas.shop action添加accessToken
				   		if(settings.url.search(/saas\.shop/)>0 ){
				   			settings.data='access_token='+accessToken;
				   		}else{
				   			settings.data='shop_sid='+wxGLOBAL.shopSid;
				   		}
				   		
				   	}
			   	}
			   //授权写入header
			    var wxAuthCode = store.get("wxAuthCode");
			    
			    if(!wxAuthCode){
			    	store.remove("shopIdAndUserId");
			    	window.location.href= wxGLOBAL.homeUrl;
			    	//去掉 saas.shop action header设置
			    }else if( settings.url.search(/saas\.shop/)==-1 && settings.url.search(/saas\.material/)==-1 && settings.url.search(/saas\.customer/)==-1 ){
			    	request.setRequestHeader("Authorization", 'Bearer '+wxAuthCode);
			    }
			    
		   }
		   
		}).ajaxError(function(event,request, settings){
			//console.log("request:",request);
		}).ajaxSuccess(function(evt, request, settings){
			 var accessToken = store.get("wx_access_token");
             if(request.status==200){
            	 if(settings.url.search(/auth\/check/) ==-1){
            		 var wxCode = store.get("wxAuthCode");
                	 if(!wxCode){
                		 globalUtil.getWXAuthCode(accessToken);
                	 }
            	 }
             }else if(request.status==39){
            	  store.remove("shopIdAndUserId");
            	  window.location.href=wxGLOBAL.homeUrl;
             }
		});
	
	
})();



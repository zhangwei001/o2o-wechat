$(function(){


	var rows=$("#limit").val()||10;//每页多少行df

	var bindStatus = $("#bindStatus").val();
	

	
	
	//授权相关
	var accessToken = globalUtil.getUrlParam("accessToken") ||  globalUtil.getUrlParam("access_token");
	if(accessToken){
		//wx_access_token 
		store.remove("wx_access_token");
		store.set("wx_access_token",accessToken);
		
		//清空授权码
		store.remove("wxAuthCode");
		//获取授权码
		globalUtil.getWXAuthCode(accessToken);
		
		
		globalUtil.getUserInfo(accessToken);
		
	}
	var shop_id = store.get("shopIdAndUserId").shop_id;//主键	
	var shopId=shopSid;//SID
	var shopUserId= store.get("shopIdAndUserId").user_id;
		
		
		

	var userId =shopUserId;
	var itemHas = window.location.hash.substr(1) || "";
	    if(itemHas.search(/page/) >0){
	    		bindStatus=-1;
	    }else{
	    	bindStatus =itemHas;
	    }
	    
	
	if(!shopUserId){
		window.location.href=webRoot+"/"+shopSid;
	}
	//设置导航
	$("#sendWXInfo").attr("href",webRoot + "/route/"+ shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));
	
	document.title="微信用户管理"; 
	 
	if(itemHas.search(/page/g)>0){
		var page =location.hash.replace('#!page=', '') || 1;

	}else{
		var page=1;
	}
	
	/**
	 * 判断当前店铺是否绑定公众号没有则跳到绑定页面
	 */
	$.get(requestUrl.user.appInfo,{
		 shop_id:shop_id,
		 user_id:shopUserId
	},function(data){
		
		if(data.status==200 && data.content ){
				var item= JSON.parse($.base64.decode(data.content,"utf8"));
			 
				if(item.service_type_info==0 || item.service_type_info==1){
					wxPubInfoApp.rendTemp(item);
					//0订阅号 //-1未认证
					/*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，暂无法获取数据。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
						$(".wxminh500").html(htm);*/
					
				}else if(item.service_type_info==2 && -1 == item.verify_type_info){
					wxPubInfoApp.rendTemp(item);
					//2服务号 //-1未认证
						/*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，暂无法获取数据。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
						$(".wxminh500").html(htm);*/
				}else{
					//初始化用户列表
					selectUserListFun(page,'','','',bindStatus);
				}
			
		}else if(data.status==25){
			location.href=webRoot+"/route/"+shopSid+"/auth-register_server_number";
			//window.location.href=webRoot+"/"+(shopId || 0)+"/weixin/weixinFun";
		}
		else{
			console.log("错误信息:"+data.error_message);
		}
	});
	
	
var wxPubInfoApp={
			
			rendTemp:function(content){
				
				 //数据渲染dom
					laytpl($("#yingdaoTemp").html()).render({
						content:content,
						qrCodeImg:download_url+"/image/"+content.qr_file_image
						
					},function(html){
						$(".wxminh500").empty().append(html).css({"background-color":"#fff"});
					   $(".container").css({"margin-right":"auto","margin-left":"auto","padding-left":"15px"});
					   $(".upgradeLink").attr("href",webRoot+"/route/"+shopSid+"/help-wechat_help_center#upgrade");
					   $(".authLink").attr("href",webRoot+"/route/"+shopSid+"/help-wechat_help_center#auth");
					   $(".downLoadCodeImg").attr("href",download_url+content.qr_file_image);
					   $("#refreshEvent").on("click",function(){
							//点击刷新
							$.ajax({
								url:requestUrl.material.wxRefresh,
								type:'post',
								data:{user_id :userId},
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
						   
						   
					   })
					});
				
			}
			
	};
	
	
	$("body").delegate("#refush","click",function(){
		//点击刷新
		$.ajax({
			url:requestUrl.material.wxRefresh,
			type:'post',
			data:{},
			dataType:'json',
			async:false,
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
		
	});
	
	//初始化数据
	if(bindStatus){
		$(".wxdh_plusmenu a").removeClass("activ");
		
		$("a[data-status='"+bindStatus+"']").addClass("activ");
	}
	

	
	
	//点击按钮查询
	$("#btn").click(function(){
		$("#btn").attr("data-btn",1);
		getSelectCondition(page);
	});
	
 
	//得到查询条件
	function getSelectCondition(page){
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		var phone = $("#phone").val();
		var bindStatus = $("#bindStatus").val();
		if((startTime && !endTime) || !startTime && endTime){
			if(!startTime){
				startTime="1900-01-01";//默认开始时间
			}else{
				//得到服务器时间
				var date;
				$.ajax({
					url:webRoot+"/"+shopId+"/dialog/getNowTime",
					type:'get',
					async: false,
					success:function(data){
						date=new Date(data.time);
					}});
				var bombay = date + (3600000 * 8);
				var time = new Date(bombay);
				endTime = time;
			}
		}
		if(startTime || endTime){
			startTime+=" 00:00:00";
			endTime+=" 23:59:59";
			//转换为毫秒数
			startTime = (new Date(startTime)).getTime();
			endTime = (new Date(endTime)).getTime();
		}
		
		location.hash='';
		selectUserListFun(page,phone,startTime,endTime,bindStatus);
		
	}
	
	//条件查询用户列表
	$(".wxdh_plusmenu a").on("click",function(){
		
		var bindStatus=$(this).attr("data-status");
		
		$("#bindStatus").val(bindStatus);
		$(this).parent().find("a").removeClass("activ");
		$(this).addClass("activ");
		
		if(bindStatus==1){
			$("a[name='bindStatus']").children("span").remove();
			$("#newUnBindCount").val("-1");
		}
		
		getSelectCondition(1);
	});
  	
	//查询微信用户管理列表
	function selectUserListFun(page,cell_phone,start_time,end_time,bind_status){
		//店铺编号，员工编号，电话，开始时间，结束时间
		$.get(requestUrl.user.userListUser,{
			shop_id : shop_id,
			 user_id : shopUserId,
			 cell_phone : cell_phone||'',
			 start_time : start_time||'',
			 end_time : end_time||'',
			 is_bind : bind_status||'',
			 rows : rows,
			 page : page
		},function(resData){
			if(resData.status==200 && resData.content){
				var datas = JSON.parse($.base64.decode(resData.content,"utf-8"));
				
				
				laytpl($("#cardContentPanel").html()).render(
						datas.list,
				function(html){
							
					$("#temlInsert").html(html);
					
					var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : (resData.totalCount/rows+1));
					laypage({
					    cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
					    pages: totalPage, //总页数
					    curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
					    hash: 'page', //自定义hash值
					    jump: function(obj,first){
					    	if(!first){
					    		selectUserListFun(obj.curr,cell_phone,start_time,end_time,bind_status);
					    	}
					    }
					});
				});	
				
				if(datas.new_un_bind_count>0){
					$("a[data-status='1']").html("未关联<span>"+datas.new_un_bind_count+"</span>");
					$("#newUnBindCount").val(datas.new_un_bind_count);
				}else{
					var newUnBindCount = $("#newUnBindCount").val();
					if(newUnBindCount && newUnBindCount!=-1){
						$("a[data-status='1']").html("未关联<span>"+newUnBindCount+"</span>");
					}
				}
				$("#btn").attr("data-btn",0);
			}else{
				laytpl($("#cardContentPanel").html()).render({
							
				},function(html){
							$("#temlInsert").html(html);
							laypage({
							    cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
							    pages: 0, //总页数
							    curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
							    hash: 'page', //自定义hash值
							    jump: function(obj,first){
							    	 
							    }
							});
				});
				
				
				var btn = $("#btn").attr("data-btn");
				if(btn==1){
					$("#yesNull").html("无符合要求的查询结果，请核对查询条件或<a href=''>查看所有微信用户</a>。");
				}
			}
		});
	}
	
	
	//点击关联用户
	function relationCustom(obj){
		
		if($(obj).attr("data-statu")==2){
			$(obj).next().hide();
			$(obj).attr("data-statu","1");
			return;
		}
		$("a[data-statu='2']").next().eq(0).hide();
		$("a[data-statu='2']").next().eq(1).hide();
		$("a[data-statu='2']").attr("data-statu","1");
		$("li[name='relationCustom']").children().eq(2).hide();
		$(obj).next().show();
		$(obj).attr("data-statu","2");
		
	}

	
	var imgUrl ="";
	var customName="";
	var customMobile="";
	var customWxFlag="";
	var customId="";
	var domeObj=null;
	
	//点击查询顾客信息
	function selectCustomName(obj){
		
		var name = $(obj).parent().prev().children().val();
		
		if(name==""){
			return;
		}
		
		$.get(requestUrl.user.searchCustom,{
			"word":name,
			"shop_id": shopId
		},function(data){
			if(data.status==200 && data.content){
				var datas = JSON.parse($.base64.decode(data.content,"utf-8"));
				if(datas!=null && datas!=""){
				 
					var phone = $(obj).parent().parent().parent().parent().parent().attr("data-cellPhone");//得到当前微信号的手机号
					//保存所需数据
					domeObj=obj;
					imgUrl=datas[0].img_url2;
					customName=datas[0].custom_name;
					customMobile=datas[0].custom_mobile;
					customId=datas[0].custom_id;
					customWxFlag=datas[0].wx_flag;
					
					//如果顾客手机号与微信顾客手机号一致
					$("li[name='relationCustom']").children().eq(1).hide();
					$("a[data-statu='2']").attr("data-statu","1");
					$("li[name='relationCustom']").children().eq(2).hide();
					showCustInfo();
					//$(obj).parent().parent().parent().parent().parent().attr("data-cellPhone",datas[0].custom_mobile);//顾客电话存入页面中
					
				}else{
					$("a[data-statu='2']").attr("data-statu","1");
					layer.tips("该顾客不存在！",obj,{
		    			time: 2,
		    			guide: 2,
		    	        maxWidth:150
		    	    });
				}
			}else{
				layer.msg(data.error_message,1, 3);
			}
		});
	}
	

	//显示顾客信息
	function showCustInfo(){
		
		var $ul = $(domeObj).parent().parent().parent().parent().next();
		$ul.show();
		$ul.children().eq(2).children().children().eq(0).children("img").attr("src",imgUrl);//加载顾客头像
		$ul.children().eq(2).children().children().eq(1).text(customName?customName:"");//加载顾客名称
		$ul.children().eq(2).children().children().eq(2).text(customMobile?customMobile:"");//加载顾客电话
		if(customWxFlag==1){
			$ul.children().eq(2).children().children().eq(3).text("已关联");	
		}
		$(domeObj).parent().parent().parent().parent().parent().attr("data-coustomId",customId);//顾客ID存入页面中
		layer.closeAll();
	}
	
	//需要关联的顾客数据
	var reOpenId="",reCustomId="",reCheckCode="",reMainId="",rePhone="",reAppId="";
	
	
	//点击关联顾客（判断）
	function saveItemPriceData(obj){
		
		obj = $(obj).parent().parent().parent().parent().parent();
		
		reOpenId = $(obj).attr("data-openId");
		reCustomId = $(obj).attr("data-coustomId");
		reCheckCode = $(obj).attr("data-checkCode");
		reMainId = $(obj).attr("data-id");
		rePhone = $(obj).attr("data-cellPhone");
		reAppId = $(obj).attr("data-appId");
		
		if(customMobile!=rePhone){
			$.layer({
			    type: 1,
			    title: false,
			    shadeClose: false,
			    area: ['auto', 'auto'],
			    bgcolor: '',
			    border: [0], //去掉默认边框 
			    closeBtn: [1, false], //去掉默认关闭按钮
			    shift: 'top', //从左动画弹出
			    zIndex:50,
			    page: {
			        html:'<div class="wxqf_openqr wxglcg_tiseqx">'
			        	+'<ul class="wxqf_openqrul1"><li class="li2"><p>微信用户手机号与顾客资料不匹配，关联后微信用户手机号将替换顾客资料中原有手机号。是否继续关联？</p></li></ul>'
			        	+'<p class="wxqf_openqrul2"><a class="butp but1" onclick="relationThisCustom()">确认</a><a class="butp but2" onclick="colseLayer()">取消</a></p></div>'
			    }
			});
		}
		else{
			$("li[data-coustomId='"+customId+"']").children().eq(1).hide();
			$("li[data-coustomId='"+customId+"']").children().eq(2).hide();
			relationThisCustom(obj);
		}
		
	}

	
	function relationThisCustom(obj){
		//点击关联
		$.post(requestUrl.user.relate,{
			"open_id":reOpenId,
			"app_id":reAppId,
			"coustom_id":reCustomId,
			"check_code":reCheckCode,
			"main_id":reMainId,
			"mobile_phone":rePhone,
			"shop_id":shopId
		},function(data){
			if(data.status==200){
				
				$("li[data-coustomId='"+customId+"']").children().eq(1).hide();
				$("li[data-coustomId='"+customId+"']").children().eq(2).hide();
				
				$.layer({
				    type: 1,
				    title: false,
				    shadeClose: false,
				    area: ['auto', 'auto'],
				    time:2,
				    bgcolor: '',
				    border: [0], //去掉默认边框 
				    closeBtn: [1, false], //去掉默认关闭按钮
				    shift: 'top', //从左动画弹出
				    zIndex:50,
				    page: {
				        html:'<div class="wxglcg_tise"><img src="'+staticImage_Url+'/mljia/hisluru_wc.gif" width="34" height="34">关联成功</div>'
				    }
				});
				
				setTimeout(function(){
					window.location.reload();
				}, 2000);
				
			}
			else{
				console.log(data.error_message);
				layer.msg(data.error_message,1, 3);
				
				$("li[data-coustomId='"+customId+"']").children().eq(1).hide();
				$("li[data-coustomId='"+customId+"']").children().eq(2).hide();
			}
		});
	}
	
	
	//点击取消关联
	function cancelAssociation(obj){
		
		$.layer({
		    type: 1,
		    title: false,
		    shadeClose: false,
		    area: ['auto', 'auto'],
		    bgcolor: '',
		    border: [0], //去掉默认边框 
		    closeBtn: [1, false], //去掉默认关闭按钮
		    shift: 'top', //从左动画弹出
		    zIndex:50,
		    page: {
		        html:'<div class="wxqf_openqr wxglcg_tiseqx wxglcg_tiseqx2">'
					+'<ul class="wxqf_openqrul1"><li class="li2"><p>如需取消关联，请联系美丽加客服：<span class="txtpink">4007-889-166</span></p></li></ul>'
					+'<p class="wxqf_openqrul2"><a class="butp but1" style="cursor:pointer" onclick="colseLayer()">知道啦</a></p>'
				+'</div>'
		    }
		});
		
	}

	//点击搜索返回到搜索框
	function returnFun(obj){
		$(obj).parent().parent().parent().prev().show();
		$(obj).parent().parent().parent().hide();
	}
	
	
	function colseLayer(){
		layer.closeAll();
		$("li[name='relationCustom']").children().eq(1).hide();
		$("a[data-statu='2']").attr("data-statu","1");
		$("li[name='relationCustom']").children().eq(2).hide();
	}
	
	
	//点击添加顾客
	//data-href="/1182/shop?route=custom&amp;view=shop_custom_add"
	
	$("body").delegate(".addCustome","click",function(){
		var custom ={};
	    custom.userName =$(this).data("name");
	    custom.phoneNum = $(this).data("phone");
	    
	   /* var customEncode=$.base64.encode(JSON.stringify(custom),"utf-8");
	    console.log("custom",custom);
	    console.log("customEncode",customEncode);*/
	    var userName = $.base64.encode( custom.userName,"utf-8");
	    window.open(homeUrl  + "/" + shopSid + "/shop?route=custom&view=shop_custom_add&customName="+ userName +"&customPhone="+ custom.phoneNum );
	});

		
	window.returnFun=returnFun;
	window.relationThisCustom=relationThisCustom;
	window.showCustInfo=showCustInfo;
	window.colseLayer=colseLayer;
	window.relationCustom=relationCustom;
	window.cancelAssociation=cancelAssociation;
	window.selectCustomName=selectCustomName;
	window.saveItemPriceData=saveItemPriceData;
});




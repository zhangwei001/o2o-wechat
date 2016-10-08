(function(){


	//add other entrance
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || $.cookie('the_cookie');
	globalUtil.entranceFilter(accessToken);

	var page=location.hash.replace('#!page=', '') || 1;
	var rows=$("#limit").val()||10;//每页多少行
	
	
	var userId = store.get("shopIdAndUserId").user_id;
	var shop_id = store.get("shopIdAndUserId").shop_id;
	

	
	//设置导航
	$("#sendWXInfo").attr("href",webRoot + "/route/"+ shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));
	
	document.title="自动回复设置"; 

	
//	user_id	Integer	店长ID
//	type	Integer	回复类型 0：文字    1：图片    2：语音    3：视频    4：图文
//	rule_name	String	规则名称
//	key_word	String	关键词
	
	document.title="自动回复设置"; 

	/**
	 * 判断当前店铺是否绑定公众号没有则跳到绑定页面
	 */
	$.get(requestUrl.user.appInfo,{
		shop_id:shop_id,
		user_id:userId
	},function(data){
//		data.status=200;
//		data.content=';;;';
		if(data.status==200 && data.content){
			//当前点店铺已开通微信公众号 
			var datas =JSON.parse($.base64.decode(data.content,"utf-8"));
			
			if(datas.service_type_info==0 ||datas.service_type_info==1){
				//0订阅号 
				wxPubInfoApp.rendTemp(datas);
				/*	var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
					$("#w998").html(htm);
				    $(".margin-top").css("margin-top","550px");*/
			}else if(datas.service_type_info==2){
				//2服务号 //-1未认证
				
				if(-1 == datas.verify_type_info){
					wxPubInfoApp.rendTemp(datas);
					/*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
					$("#w998").html(htm);*/
					
				}else{
					initDataFun(1);
				}
			}
			
		}else if(data.status==25){
			window.location.href=webRoot+"/"+(shopId || 0)+"/weixin/weixinFun";
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
						$("#w998").empty().append(html).css({"background-color":"#fff"});
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
			data:{user_id :userId},
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

	/****1.查询列表*********/
	function initDataFun(page,type,ruleName,keyWord,falg){
		$.get(requestUrl.material.selectReplyList,{
			user_id : userId,
			type : type||'',
			rule_name : ruleName||'',
			key_word : keyWord||'',
			page : page,
			rows : rows
		},function(resData){
			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));
				
				var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : (resData.totalCount/rows+1));
				
				laytpl($("#replyListTmpl").html()).render({
					items:items,
					page:page,
					rows:rows,
					totalPage:totalPage,
					total:resData.totalCount
				},function(html){
					
					$("#containerDiv").html(html);
					if(!html.noSpace()){
						if(falg==1){
							//搜索的条件
							var html=['<div class="ebderror_tise">',
										'<img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">未找到符合条件的自动回复，请调整搜索条件或 <a onclick="resetInitData();">查看所有自动回复</a>',
										'</div>'].join('');
									
										$("#containerDiv").html(html);
						}else{
							var html=['<div class="ebderror_tise">',
										'<img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">暂无自动回复规则，请新增',
										'</div>'].join('');
										$("#containerDiv").html(html);	
						}
					}
					
					$("#totalNumber").text(resData.totalCount+"条规则");
					
					
					laypage({
					    cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
					    pages: totalPage, //总页数
					    curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
					    hash: 'page', //自定义hash值
					    jump: function(obj,first){
					    	if(!first){
					    		initDataFun(obj.curr,type,ruleName,keyWord);
					    	}
					    }
					});
				});
			}else{
			 
				if(falg==1){
					//搜索的条件
					var html=['<div class="ebderror_tise">',
								'<img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">未找到符合条件的自动回复，请调整搜索条件或 <a onclick="resetInitData();">查看所有自动回复</a>',
								'</div>'].join('');
							
								$("#containerDiv").html(html);
				}else{
					var html=['<div class="ebderror_tise">',
								'<img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">暂无自动回复规则，请新增',
								'</div>'].join('');
								$("#containerDiv").html(html);	
				}
			
			}
		});
	}
	
	
	
	function resetInitData(){
		initDataFun(1);
	 	 $('input[name="keyWords"]').val('');
	 	 $('input[name="ruleWords"]').val('');
	 	 $('select[name="type"]').val(-1);
	}
	
	window.resetInitData=resetInitData;

	
	var imageText='';//
	$("body").delegate("#seachKeys","click",function(){
		//搜索
		var keys=$("input[name='seachWords']").val();
			if(!imageText){
				imageText=$(".wxpt_zw").html();
			}
			seachImageTextData(keys);
	});
	$("body").delegate("#getAll","click",function(){
		//查看全部
			if(imageText){
				$(".wxpt_zw").html(imageText);
				$("input[name='seachWords']").val('');
			}
	});
	

	/****2.新增消息*********/
	function addReplyFun(){
		var tmpl='';
		var keyWords=[];//关键字
		$("#keyView p").each(function(){
			keyWords.push($(this).text());
		});
		
		var materialId=$("#containerContent li").attr("data-id")||0,
		 	keyType=$("input[name='lik']:checked").val(),
		 	rlueName=$('input[name="rlueName"]').val(),
		 	type=$("#containerContent").attr("data-type"),
		 	content=$("#containerContent p:last").text();
		
		if(keyWords.length==0 || !rlueName || !keyType || !type){
			if(keyWords.length==0){
				tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","请至少添加一个关键词!");
			}
			if(!rlueName){
				tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","规则名不能为空!");
			}
			if(!type){
				tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","必须选择一个类型！");
			}
			
		}
		if(type!=0 && materialId==0){
			tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","请添加回复！");
		}
		
		if(tmpl){
			 $.layer({
				    type: 1,
				    time: 2,
				    title: false,
				    shadeClose: false,
				    area: ['auto', 'auto'],
				    bgcolor: '',
				    border: [0], //去掉默认边框 
				    closeBtn: [1, false], //去掉默认关闭按钮
				    shift: 'top', //从左动画弹出
				    page: {
				        html:tmpl
				    }
				});
			 return;
		}
		
		
		$.ajax({
			url:requestUrl.material.addReply,
			data:{
				user_id : userId,
				type : type,
				rule_name : rlueName,
				content : content,
				material_id : materialId,
				key_type : keyType,
				key_words : keyWords
			},
			dataType:'json',
			async:false,
			traditional: true,
			success:function(resData){
				if(resData.status==200){
					tmpl=$("#sendSuccessTipsTmpl").html().replace("{{tips}}","新增成功！");
					setTimeout(function(){
						window.location.reload();
					},1000);
				}else{
					tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}",resData.errorMessage);
					console.log(resData);
				}
				
			},error:function(e){
				console.log(e);
			}
		});
		if(tmpl){
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
				        html:tmpl
				    }
				});
		}
		
	}
	
	window.addReplyFun=addReplyFun;
	
	/****3.修改***************************/
	
	function updateReplyFun(id,checkCode){
		var keyWords=[];//关键字
		var tmpl='';
		$("li[data-key-id='"+id+"'] p").each(function(){
			keyWords.push($(this).text());
		});

		var materialId=$("#containerContent"+id+" li:last").attr("data-id")||0,
		 	keyType=$("input[name='lik']:checked").val(),
		 	rlueName=$('input[name="rlueName"]').val(),
		 	type=$("#containerContent"+id).attr("data-type"),
		 	content=$("#containerContent"+id+" p").eq(1).text();
		
		if(keyWords.length==0 || !rlueName || !checkCode ||!type){
			
			if(keyWords.length==0){
				tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","关键字不能为空！");
			}else if(!rlueName){
				tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","规则名不能为空！");
			}else if(!checkCode){
				tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","数据异常！");
			}
		}
		
		if(type!=0 && materialId==0){
			tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","回复内容不能为空！");
		}
		
		if(!content && type==0){
			tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","回复内容不能为空！");
		}
		
		
		if(tmpl){
			 $.layer({
				    type: 1,
				    time:2,
				    title: false,
				    shadeClose: false,
				    area: ['auto', 'auto'],
				    bgcolor: '',
				    border: [0], //去掉默认边框 
				    closeBtn: [1, false], //去掉默认关闭按钮
				    shift: 'top', //从左动画弹出
				    page: {
				        html:tmpl
				    }
				});
			
			return;
		}
		$.ajax({
			url:requestUrl.material.updateReply+id,
			data:{
				user_id : userId,
				id : id,
				check_code : checkCode,
				type : type,
				rule_name : rlueName,
				content : content,
				material_id : materialId,
				key_type : keyType,
				key_words : keyWords
			},
			dataType:'json',
			async:false,
			traditional: true,
			success:function(resData){
				if(resData.status==200){
					tmpl=$("#sendSuccessTipsTmpl").html().replace("{{tips}}","修改成功！");
					 $.layer({
						    type: 1,
						    time:2,
						    title: false,
						    shadeClose: false,
						    area: ['auto', 'auto'],
						    bgcolor: '',
						    border: [0], //去掉默认边框 
						    closeBtn: [1, false], //去掉默认关闭按钮
						    shift: 'top', //从左动画弹出
						    page: {
						        html:tmpl
						    }
						});
					setTimeout(function(){
						window.location.reload();
					},1000);
				}else{
					console.log(resData);
				}
				
			},error:function(e){
				console.log(e);
			}
		});
		
		
	}
	
	window.updateReplyFun=updateReplyFun;
	
	/**********删除***************************/
	function confrimDelFun(id,checkCode){
		if(!id || !checkCode){
			console.log("参数错误");
			return;
		}
		
		
		$.ajax({
			url:requestUrl.material.delReply+id,
			data:{
				user_id : userId,
				id : id,
				check_code : checkCode
			},
			type:"post",
			dataType:'json',
			async:false,
			traditional: true,
			success:function(resData){
				if(resData.status==200){
					window.location.reload();
				}else{
					console.log(resData);
				}
				
			},error:function(e){
				console.log(e);
			}
		});
	}
	window.confrimDelFun=confrimDelFun;
	
	function delReplyFun(id,checkCode){
		
		laytpl($("#confirmTmpl").html()).render({
			id:id,
			checkCode:checkCode
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
				    }
				});
		});
	}
	window.delReplyFun=delReplyFun;
	
	$(".weixinaddbut").on("click",function(){
		var obj=this;
		if($("#addReplyDiv").length==0){
			laytpl($("#addReplyTmpl").html()).render({
				
			},function(html){
				$(obj).parent().parent().after(html);
				$("#addReplyDiv").fadeIn("slow");
			});
		}else{
			layer.tips('请先添加完下面的内容再试！', this , {guide: 1, time: 2});
		}
		
	});
	
	
	$("#search").on("click",function(){
	//搜索
		var keyWords=$('input[name="keyWords"]').val(),
			ruleWords=$('input[name="ruleWords"]').val(),
			type=$('select[name="type"]').val();
			type= type > -1 ? type : 0;
			
		initDataFun(1,type,ruleWords,keyWords,1);
		
	});
 
 
	$("body").delegate("a[data-update-container='true']","click",function(){
		//容器内更新事件
		 $(this).parent().parent().prev().find("li").each(function(){
			if($(this).attr("class").indexOf("activ")>-1){
				$(this).click();
				return false;
			} 
		 });
	});
	
	$("body").delegate("a[data-del-container='true']","click",function(){
		//容器内删除事件
		$(".weixint1ul1 li").removeClass("activ");
		 $(this).parent().hide();
		 $(this).parent().parent().removeClass("overflow_y_s");
		 $(this).parent().next().empty().next().empty();
	});
	
	$("body").delegate('li[data-pi="true"]',"click",function(event){
		//全匹配、未全匹配切换
		 var $a=$(this).find("a");
		 if($a.eq(0).attr("class").indexOf("activ")>-1){
			 var type1=$a.eq(0).removeClass("activ").attr("data-type");
			 $a.eq(1).removeClass("show");
			 
			var type2= $(event.target).attr("data-type");
			
			 if(type1 != type2){
				 //调换位置
				 var a0t=$a.eq(0).text();
				 var a1t=$a.eq(1).text();
				 //
				 $a.eq(0).text(a1t).attr("data-type",type2);
				 $a.eq(1).text(a0t).attr("data-type",type1);
				 var id=$(this).parent().attr("data-id");
				 var checkCode=$(this).parent().attr("data-code");
				 
				 $.post(requestUrl.material.updateReply+id+"/"+type2,{
					 user_id:userId,
					 id:id,
					 check_code:checkCode,
					 key_type:type2
				 },function(resData){
					 if(resData.status!=200){
						 console.log("保存失败");
					 }
				 });
				 
			 }
			 
		 }else{
			 $a.eq(0).addClass("activ");
			 $a.eq(1).addClass("show");
		 }
		 
	});	 
	
	$("body").delegate("a[data-update='true']","click",function(){
		//修改面板事件
		var falg=$(this).attr("data-val");
		var id=$(this).attr("data-id");
		var $div=$(this).parent().parent().parent();
		if(falg==0){
			var divContent=$div.html();
			var data=$(this).parent().next().text();
			data=JSON.parse(data);
			
			//单个图文，图片消息的查询
			if(data.material_id>0 && data.type==4){
				$.ajax({
					url:requestUrl.material.selectMaterialInfo+data.material_id,
					data:{
						user_id : userId,
						material_id : data.material_id
					},
					dataType:'json',
					async:false,
					success:function(resData){
						if(resData.status==200 && resData.content){
							var item= JSON.parse($.base64.decode(resData.content,"utf8"));
							laytpl($("#imageTextInfoTmpl").html()).render({
								item:item,
								download_url:download_url
							},function(html){
								setTimeout(function(){
								$("#containerContent"+id+" ul").html(html);
								},200);
							});
							
						}else{
							console.log(resData);
						}
					}
				});
 				
			}else if(data.material_id>0 && data.type==1){
				$.ajax({
					url:requestUrl.material.selectMaterialImageInfo+data.material_id,
					data:{
						user_id : userId,
						material_id : data.material_id
					},
					dataType:'json',
					async:false,
					success:function(resData){
						if(resData.status==200 && resData.content){
							var d= JSON.parse($.base64.decode(resData.content,"utf8"));
								
								var arrs=['<li class="wxpt_picli poi1" data-id="'+d.id+'">',
								'<img src="'+download_url+d.file_id+'" width="204" height="135">',
								'</li>'];
								arrs=arrs.join("");
								setTimeout(function(){
									$("#containerContent"+id+" ul").html(arrs);
									},200);
								
						}else{
							console.log(resData);
						}
					}
				});
 
			}else{
				//文字消息
			}
			
			laytpl($("#updateReplyTmpl").html()).render({
				item:data,
				divContent:divContent
			},function(html){
				$("body").append(html);
				$div.html($("#updateReplyDiv"+id).html());
				$("#updateReplyDiv"+id).remove();
			});
		
		}else{
			var spanContent=$(this).parent().next().html();
			$div.html(spanContent);
		}
			 
	});	
		
	 
	
	$("body").delegate(".weixint1ul3 li[data-index='true']","click",function(){
		var type=$(this).attr("data-type"); //0文字 1图片 4图文
		var id=$(this).attr("data-id");  
		
		 artLayer(type,id);
		 $(this).parent().find("li").removeClass("activ");
		 $(this).addClass("activ");
		 
	});
 
	/******************************************************/
	function artLayer(type,id){
		//type 0 图文素材， 1 图片素材,4图文素材
		if(type==1){
			initImageData(function(items){
				laytpl($("#artImageLayerTmpl").html()).render({
					download_url:download_url,
					id:id||'',
					items:items
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
						    	var type='';
						    	if($("#containerContent").length>0){
						    		type=$("#containerContent").attr("data-type");
						    	}else if($("#containerContent"+id).length>0){
						    		type=$("#containerContent"+id).attr("data-type");
						    	}
						    	$("li[data-index='true']").each(function(){
						    		if($(this).attr("data-type")==type){
						    			$(this).addClass("activ");
						    		}else{
						    			$(this).removeClass("activ");
						    		}
						    	});
						    	
						    }
						});
				});
			});
			
		}else if(type==4){
			
			initImageTextData('',function(items){
				laytpl($("#artImageTextLayerTmpl").html()).render({
					download_url:download_url,
					id:id||'',
					items:items
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
						    success:function(){
						    		
						    },
						    end: function(){
						    	var type='';
						    	if($("#containerContent").length>0){
						    		type=$("#containerContent").attr("data-type");
						    	}else if($("#containerContent"+id).length>0){
						    		type=$("#containerContent"+id).attr("data-type");
						    	}
						    	$("li[data-index='true']").each(function(){
						    		if($(this).attr("data-type")==type){
						    			$(this).addClass("activ");
						    		}else{
						    			$(this).removeClass("activ");
						    		}
						    	});
						    }
						});
				});
		
		});
		}else{
			//文字
			laytpl($("#artTextLayerTmpl").html()).render({
				id:id||'',
				text: $("#containerContent"+id+" p").eq(1).text()||''
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
					    	var type='';
					    	if($("#containerContent").length>0){
					    		type=$("#containerContent").attr("data-type");
					    	}else if($("#containerContent"+id).length>0){
					    		type=$("#containerContent"+id).attr("data-type");
					    	}
					    	$("li[data-index='true']").each(function(){
					    		if($(this).attr("data-type")==type){
					    			$(this).addClass("activ");
					    		}else{
					    			$(this).removeClass("activ");
					    		}
					    	});
					    }
					});
			});
			
			
		}
	} 
	
	function initImageTextData(keys,func){
		//1.图文父级函数
		//查询图文素材
		$.get(requestUrl.material.selectNewsList,{
			user_id:userId,
			is_sync:0,
			search_word: keys||'',
			page:1,
			rows:500
		},function(resData){
			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));
					func(items);
			}else{
				func({});
				console.log(resData.errorMessage);
			}
		});
	}
	function seachImageTextData(keys){
		//1.图文父级函数
		//查询图文素材
		$.get(requestUrl.material.selectNewsList,{
			user_id:userId,
			is_sync:0,
			search_word: keys||'',
			page:1,
			rows:500
		},function(resData){
			if(resData.status==200 ){
				var items= {};
				if(resData.content){
					items=JSON.parse($.base64.decode(resData.content,"utf8"));
				}
					 laytpl($("#seachImageTextTmpl").html()).render({
						 items:items
					 },function(html){
						 $(".wxpt_zw").html(html);
					 });
					 
			}else{
				console.log(resData.errorMessage);
			}
		});
	}
	
	function initImageData(func){
		//2.图片父级函数
		
		//查询图片素材
		$.get(requestUrl.material.selectMaterial,{
			user_id:userId,
			type:1,
			is_sync:0,
			page:1,
			rows:500
		},function(resData){
			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));
				func(items);
			}else{
				func({});
				console.log("错误信息：获取数据异常");
			}
			
		});
	}
	
	
	
	/**************************************************/
	
	$("body").delegate(".wxpt_tuwenmain li","click",function(){
		//弹出层列表选择事件
		if($(".poi2",this).length>0){
			$(".poi2",this).remove();
		}else{
			$(this).parent().find("li").find("p[class='poi2 wxpt_picseleed']").remove();
			$(this).append('<p class="poi2 wxpt_picseleed" style="display:block"></p>');
		}
	});
	

	$(document).keyup(function(event){
		  if(event.keyCode ==13){
			  var index=0;
			  $("input[name='words']").each(function(i){
					if($(this).is(":focus")){
						index=i;
						return false;
					}
				});
			  $("input[name='words']").eq(index+1).focus();
		  }
	});
	
	$("body").delegate('textarea[name="content"]',"keyup",function(){
		//监听输入文字的剩余字数事件
		var num=(600-Number($(this).val().length));
		if(num<=0){
			$("#lessWords").text(0);
			$(this).val($(this).val().substring(0,600));
			return;
		}
		 $("#lessWords").text(num);
	});
	
	
	function addTextContentFun(id){
		var content=$('textarea[name="content"]').val();
		//	0文字 1图片 4图文
		if(id && id>0){
			$("#containerContent"+id+" p").eq(1).text(content);
			$("#containerContent"+id+" ul").empty();
			$("#containerContent"+id).attr("data-type",0).addClass("overflow_y_s").find("p:first").show();
		}else{
			$("#containerContent p").eq(1).text(content);
			$("#containerContent ul").empty();
			$("#containerContent").attr("data-type",0).find("p:first").show();
		}
			
			layer.closeAll();
	}
	
	function addImageTextFun(id){
		if(id && id>0){
			$("ul[class='wxpt_tuwenmain'] li").each(function(){
				if($(this).find(".poi2").length>0){
					var li=$(this).clone();
					$("#containerContent"+id+" ul").html(li);
					$("#containerContent"+id).attr("data-type",4).addClass("overflow_y_s").find("p:first").show();
					return false;
				}
			});
			$("#containerContent"+id+" p").eq(1).text('');
		}else{
			$("ul[class='wxpt_tuwenmain'] li").each(function(){
				if($(this).find(".poi2").length>0){
					var li=$(this).clone();
					$("#containerContent ul").html(li);
					$("#containerContent").attr("data-type",4).addClass("overflow_y_s").find("p:first").show();
					return false;
				}
			});
			$("#containerContent p").eq(1).text('');
		}
	
		layer.closeAll();
		
	}	
	
	
	function addImageFun(id){
		if(id && id>0){
			$(".wxpt_tuwenmain li").each(function(){
				if($(this).find(".poi2").length>0){
					var li=$(this).clone();
					$("#containerContent"+id+" ul").html(li);
					$("#containerContent"+id).attr("data-type",1).addClass("overflow_y_s").find("p:first").show();
					return false;
				}
			});
			$("#containerContent"+id+" p").eq(1).text('');
		}else{
			$(".wxpt_tuwenmain li").each(function(){
				if($(this).find(".poi2").length>0){
					var li=$(this).clone();
					$("#containerContent ul").html(li);
					$("#containerContent").attr("data-type",1).addClass("overflow_y_s").find("p:first").show();
					return false;
				}
			});
			$("#containerContent p").eq(1).text('');
		}
	
		layer.closeAll();
		
	}
	
	
	
	window.addTextContentFun=addTextContentFun;
	window.addImageTextFun=addImageTextFun;
	window.addImageFun=addImageFun;
	/**************************************************/
	
	$("body").delegate("a[data-add-key='true']","click",function(){
		//新增关键字
		var obj=$(this).parent().prev();
		var id=$(this).attr("data-id")||'';
		
		laytpl($("#addKeyWordsTmpl").html()).render({
			id:id
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
				    zIndex:50,
				    page: {
				        html:html
				    }
				});
			 var keyViews=[];
			 $("p",obj).each(function(){
				 keyViews.push($(this).text());
			  });
			 
			 $('input[name="words"]').each(function(i){
				 $(this).val(keyViews[i]);
			 });
		});
	});
 

	function addKeyWordsFun(id){
		
		var keyWords=[];
		$('input[name="words"]').each(function(i){
			if($(this).val()){
				keyWords.push('<p >'+$(this).val()+'</p>');
			}
		});
		
		keyWords=keyWords.join("");
		if(id && id>0){
			$("li[data-key-id='"+id+"']").empty().append(keyWords);
		}else{
			$("#keyView").empty().append(keyWords);
		}
		layer.closeAll();
	}
	window.addKeyWordsFun=addKeyWordsFun;
	
	
	
	$("body").delegate("input[data-id='fileUpload']","click",function(){

		/********************批量上传图片*****************************/
		var xhrList=[],
			imgsTotal=0;
		
		 $(this).fileupload({ 
				url:upload_url, 
				type:'post',
				formData : {
					sysid : '3',
					gen_thumb : true,
					water_mark: true,
					thumb_width : 400,
					thumb_height : 400,
					width:1024,
					file_store_group : shopId+'_weixin_Images'
				},
				sequentialUploads:true,//排队发送请求  
				dataType: 'json',  
				acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
				maxFileSize : 2145728,// 2M
				add: function(e, data) { // 选了文件就可以点扫描
					imgsTotal++;
					if (imgsTotal > 10) {
						 layer.msg("不允许同时上传10张以上的图片！",2,-1);		
				        return false;
				    }
					
			        var uploadFile = data.files[0];
			   
			        var  reader = new FileReader();
			        if (!reader) {
			          this.value = '';
			          return;
			        };
			        reader.readAsDataURL(uploadFile); 
			        
			       var name= data.content=Math.ceil(Math.random()*100000)+"-"+uploadFile.size+"-"+Math.ceil(Math.random()*100000);
			        reader.onload = function(e) {
			        	
			           if (uploadFile.size < 2048576){   
			           		var xhr=data.submit(); 
			           		xhrList.push(xhr);
			   		   }else{
			   			 $.layer({
							    type: 1,
							    title: false,
							    shadeClose: false,
							    area: ['auto', 'auto'],
							    bgcolor: '',
							    border: [0], //去掉默认边框 
							    closeBtn: [1, false], //去掉默认关闭按钮
							    shift: 'left', //从左动画弹出
							    page: {
							        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择2M以内的图片！")
							    }
							});
			   			 
			   			   return false;
			   		   }
			           
			           
			       	var htms= ['<li class="wxpt_picli poi1" id="'+name+'" >',
				  				'<img src="'+e.target.result+'" width="204" height="135">', 
				  				'</li>'];
				       			htms=htms.join("");
				       			
					        	if($('.wxpt_tuwenmain').length>0){
					        		
					        		if($("#containerUl").length==0){
					        			$("#empty").after('<ul id="containerUl" class="wxpt_tuwenmain wxpt_uppicmain"  data-type="1"></ul>').remove();
					        		}
					        		
					        		$('.wxpt_tuwenmain').prepend(htms);
					        	}else{
					        		
					        		$('[data-tab="true"]').hide();
					        		$("#tabContent ul").hide();
					        		$("#tabContent ul").eq(2).show().html(htms);
					        	}
					        	
			        };
			        
				},
				done: function (e, data) {
					  var name = data.content;  
						if(data.result.status == 200){
							$.ajax({
								url  :  requestUrl.material.addMaterial,
								data : {
									user_id:userId,
									type : 1,
									file_id : data.result.data.id
									},
								type : 'post',
								async:false,
								dataType : 'json',
								success : function(resData) {
									if(resData.status==200){
										var item= JSON.parse($.base64.decode(resData.content,"utf8"));
										$("#"+name).attr("data-id",item.id);
									}else{
										console.log("错误信息：",JSON.stringify(resData));
									}
								
								},error:function(){
									
								}
							});
						
						}else{
							console.log("错误信息：",JSON.stringify(data));
							
						}
				} 
			}).on('fileuploadprogressall', function (e, data) {
			    var progress = parseInt(data.loaded / data.total * 100, 10);
			    console.log(progress);
			    if(progress==100){
			    	imgsTotal=0;
			    }
			});
		
		
		 
		});
	
}());
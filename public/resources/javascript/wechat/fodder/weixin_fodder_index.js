$(function(){
	//add other entrance
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || $.cookie('access_token');
	globalUtil.entranceFilter(accessToken);

	var page=location.hash.replace('#!page=', '') || 1;
	if(!$.isNumeric(page)){
		page=1;
	}
	var rows=$("#limit").val()||10;//每页多少行
	var userId=store.get("shopIdAndUserId").user_id || "";
	var shopId=store.get("shopIdAndUserId").shop_id || "";

	if(!userId){
		window.location.href= wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
	}
	document.title="微信图文素材";
	//设置导航
	$("#sendWXInfo").attr("href", "/o2o/route/"+ wxGLOBAL.shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));

	/**
	 * 判断当前店铺是否绑定公众号没有则跳到绑定页面
	 */
	$.get(requestUrl.user.appInfo,{
		shop_id:shopId,
		user_id:userId
	},function(data){
		if(data.status==200 && data.content){
			//当前点店铺已开通微信公众号
			var datas =JSON.parse($.base64.decode(data.content,"utf-8"));

			if(datas.service_type_info==0 ||datas.service_type_info==1){
				//0订阅号
				wxPubInfoApp.rendTemp(datas);
				/*	var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
				 $(".wxminh500").html(htm);

				 $('.wxtf_menu2').remove();*/
			}else if(datas.service_type_info==2){
				//2服务号 //-1未认证
				if(-1 == datas.verify_type_info){
					wxPubInfoApp.rendTemp(datas);

					/*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
					 $(".wxminh500").html(htm);

					 $('.wxtf_menu2').remove();*/
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
				qrCodeImg:download_url+"/image/"+content.qr_file_image,

			},function(html){
				$(".wxminh500").empty().append(html).css({"background-color":"#fff"});
				$(".container").css({"margin-right":"auto","margin-left":"auto","padding-left":"15px"});
				$(".upgradeLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#upgrade");
				$(".authLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#auth");
				$(".downLoadCodeImg").attr("href",wxGLOBAL.download_url+content.qr_file_image);
				$(".wxtf_menu2").remove();
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

	/*******************获取图文素材列表******************************/
	var init=0;


	function initData(page,keys){

		$.get(requestUrl.material.selectNewsList,{
			user_id:userId,
			is_sync:1,//显示草稿
			search_word: keys||'',
			page:page,
			rows:rows
		},function(resData){

			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));

				$("#containerUl").empty();
				$("#totalNumber").text('共'+resData.totalCount+'条');

				laytpl($("#imgTextTmpl").html()).render({
					items:items,
					download_url:wxGLOBAL.download_url
				}, function(html){

					$("#containerUl").html(html);

					var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : (resData.totalCount/rows+1));
					laypage({
						cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
						pages: totalPage, //总页数
						curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
						hash: 'page', //自定义hash值
						jump: function(obj,first){
							if(!first){
								initData(obj.curr,keys);
							}
						}
					});

					if(init==0){
						init++;
						$('#containerUl').masonry({
							itemSelector: '.masonry_brick',
							columnWidth:233,
							gutterWidth:22,//列的间隙 Integer
//						isAnimated: true,
//					    isFitWidth:true,// 适应宽度   Boolean
							isResizableL:true,// 是否可调整大小 Boolean
							isRTL:false//使用从右到左的布局 Boolean
						});
					}else{
						$('#containerUl').masonry('reload');
					}
					$("#emptyTipsDiv").hide();

				});
			}else{
				$("#containerUl").empty();
				$("#emptyTipsDiv").show();
				$("#totalNumber").text('共0条');
				console.log(resData.errorMessage);

				if(resData.status==37){
					//未认证提示
					$("#tipsDiv").show();
					$("#emptyTipsDiv").hide();
				}
			}

		});

	}

	initData(page);

	$('#seachKeys').on("click",function(){
		//搜索
		var keys=$("input[type='text']").val();
		if(keys){
			initData(page,keys);
		}
	});

	$(document).keyup(function(event){
		if(event.keyCode ==13){
			//搜索
			var keys=$("input[type='text']").val();
			if($("input[type='text']").is(":focus")){
				initData(page,keys);
			}
		}
	});



	/***********************************************************/


	var delObj;
	function confrimDelFun(){
		layer.closeAll();

		var $p=$(delObj).parent(),
			id=$p.attr("data-id"),
			code=$p.attr("data-code");
		if(!id || !code){
			return;
		}
		$.post(requestUrl.material.delBatchImageText,{
			user_id : userId,
			ids : id,
			check_codes : code
		},function(resData){
			if(resData.status==200){
				$p.parent().remove();
				$('.item img').load(function(){
					$('.infinite_scroll').masonry({
						itemSelector: '.masonry_brick',
						columnWidth:233,
						gutterWidth:22
					});
				});

				$('.infinite_scroll').masonry({
					itemSelector: '.masonry_brick',
					columnWidth:233,
					gutterWidth:22
				});
			}else{

			}
		});
	}

	$("#containerUl").delegate("a[data-index='2']","click",function(){
		delObj=this;
		laytpl($("#confirmTmpl").html()).render({
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
		});

	});

	window.confrimDelFun=confrimDelFun;


});
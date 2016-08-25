var shopId= document.getElementById("shopIdKey").value;
var shopUserId=$("#shopUserId").val();
$.ajaxSetup({cache:false});
var controlTarg=$("#controlTarg").val();
var cardMassge =$("#cardMassge").val();//是卡项或者护理
var sysFinanceFalg=$("#sysFinanceFalg").val();
var shopSetId = $("#shopSetId").val();//选择的是店铺设置中的哪个子项
var layerCostCard;
var costFlagLayer;
$(function () {

		
	if(sysFinanceFalg==0 && controlTarg==7){
		controlTarg=6;
	}
	if(controlTarg==0){
		$("#mlm25 ul").children().eq(0).attr("class","active fz16b");
		 
	}else if(controlTarg==1){
		$("#mlm25 ul").children().eq(2).attr("class","active fz16b");
	}else if(controlTarg==2){
		$("#mlm25 ul").children().eq(4).attr("class","active fz16b");
	}else if(controlTarg==3){
		$("#mlm25 ul").children().eq(6).attr("class","active fz16b kshlmenu");
		if(cardMassge==1){
			$("#mlm25 ul").children().eq(6).find("li").eq(0).attr("class","activ");
		}else{
			$("#mlm25 ul").children().eq(6).find("li").eq(1).attr("class","activ");
		}
	}else if(controlTarg==4){
		$("#mlm25 ul").children().eq(8).attr("class","active fz16b");
	}else if(controlTarg==5){
		$("#mlm25 ul").children().eq(10).attr("class","active fz16b");
	}else if(controlTarg==6){
		$("#mlm25 ul").children().eq(12).attr("class","active fz16b");
	}else if(controlTarg==7){
		$("#mlm25 ul").children().eq(14).attr("class","active fz16b kshlmenu");
		if(shopSetId==1){
			$("#mlm25 ul").children().eq(14).find("li").eq(0).attr("class","activ");
		}
		else if(shopSetId==2){
			$("#mlm25 ul").children().eq(14).find("li").eq(1).attr("class","activ");
		}
		else if(shopSetId==3){
			$("#mlm25 ul").children().eq(14).find("li").eq(2).attr("class","activ");
		}
		else if(shopSetId==4){
			$("#mlm25 ul").children().eq(14).find("li").eq(3).attr("class","activ");
		}
	}

	
	if(controlTarg!=0){
		$("#navi a").removeAttr("target");
	}
	//新版菜单
	if($("#menu-"+controlTarg).length>0){
		$(".active").removeClass('active');
		$("#menu-"+controlTarg).addClass('active');
	}
	//店长权限
	var usersTy=$("#usersTy").val();
	if(usersTy==1){
		validationRight2(0,1);
	}
	//工作机密码效验问题
	checkMacPwd();
	//刷新页面 删除提示内容
//	$.post(webRoot+"/"+shopId+"/message/deleteShopTips");
	function initModifyPanel(){
		
		$(".editPrice").hover(function(){
			$(".editPrice").addClass("btn-edit-skuhover");
			
		},function(){
			$(".editPrice").removeClass("btn-edit-skuhover");
		});
			//修改提成	
		$(".edittsPrice").hover(function(){
			  $(".edittsPrice").addClass("btn-edit-skuhover");
		},function(){
			 $(".edittsPrice").removeClass("btn-edit-skuhover");
		});
		
	}
	
	
	if(controlTarg==1 && validationRight1(79)){
		
	  //修改初始化-- 权限
	  initModifyPanel();
	}else{
		$("div .editPrice").addClass("editPriceoff");
		$("div .edittsPrice").addClass("editPriceoff");
		//移除
		$(".changofline").removeAttr("onmouseover");
	}
	   

	
	
///////////////迭代记录时候 查询 日志，员工姓名，//////////////
	var timer={},timeTitck={},nowTime,defTim;
	$.ajax({
		url:webRoot+"/"+shopId+"/dialog/getNowTime",
		type:'get',
		async: false,
		success:function(data){
			nowTime=new Date(data.time);
			defTim=nowTime.getTime();//服务倒计时
		}});
 
	
	
	var initOrderTips=function(){
		//修改初始化-- 权限
		if(validationRight1(79)){
			initModifyPanel();
		}else{
			$("div .editPrice").addClass("editPriceoff");
			$("div .edittsPrice").addClass("editPriceoff");
			//移除
			$(".changofline").removeAttr("onmouseover");
		}
		
		var layerIndex=0;
		$("a[data-note='true']").hover(function(){
		var id=$(this).attr("data-val");
		var obj=this;
		$.ajax({
			url : webRoot + "/"+ shopId+"/indexs/getOrderRemark",// 要访问的后台地址
			data:{
				limit:2,
				orderId:id
			},
			type : "get",
			dataType : "json",
			async : false ,
			cache : true ,
			success : function(msg) {
			 if(msg.status==200){
				 var htm="";
				 for(var i=0;i<msg.data.length;i++){
					 var ite=msg.data[i];
					 if(ite.tbStaff.tbStaffLevel){
						 htm=htm+"<pre><b>"+ite.tbStaff.staffName+"</b>("+ite.tbStaff.tbStaffLevel.staffLevelName+"):"+ite.orderNote+"</pre>";
					 }else if(ite.tbStaff.staffJobid==1000){
						 htm=htm+"<pre><b>"+ite.tbStaff.staffName+"</b>(店主):"+ite.orderNote+"</pre>";
					 }else{
						 htm=htm+"<pre><b>"+ite.tbStaff.staffName+"</b>(其他):"+ite.orderNote+"</pre>";
					 }
				 }
				 
					if(msg.dataTotal>2){
						htm=htm+"<span style='margin-top: -20px;float: right;'>.....</span>";
					}
					layerIndex=layer.tips(htm, obj, {
						guide: 2,
						style: ['border:1px #FFBB76 solid; background-color:#FFFCEF;'],
					    tipsMore: true,
					    maxWidth:440,
					    maxHeight:280
					});
			 }else{
				 layer.tips("查不出来啊", obj, {
						guide: 2,
					    tipsMore: true,
					    maxWidth:440,
					    height:380
					});
				 console.log("错误信息:"+msg.msg);
			 }

			} 
		});
		}, function() {
		layer.close(layerIndex);
		});
		
		////////////////////////////////////////////////////////////////////////////////////
		//迭代记录时候 查询 日志，员工姓名，
		var orderIds = [];
		var massageIds = [];
		var staffIds = [];
		$("tr[data-order-node=true]").each(function(){
			var $td=$("td",this),
				$staffObj=$td.eq(2),
				$orderObj=$td.eq(3),
				staffId=$staffObj.attr("data-staff-id"),
				massageId=$staffObj.attr("data-massageId")||0,
				orderId=$orderObj.attr("data-id");
				//orderType 3 表示开卡
				orderIds.push(orderId);
				staffIds.push(staffId);
				massageIds.push(massageId);
		});
		///////////////////////////
		{
			//倒计时  不能直接从服务器定时获取时间，否则导致cookie永不过期
			 if(timer){
				 clearInterval(timer);
			 }
			 var goTims=[];
			$("td[data-ing=true]").each(function(){
				var tim=$(this).attr("data-time"),
				    goTim =new Date(tim).getTime();
				    goTims.push({goTim:goTim,obj:this});
			});
			if(timeTitck){
				clearInterval(timeTitck);
			}
			timeTitck=setInterval(function(){
				defTim+=5000;
			},5000);
			
			var IntervalFun=function(){
				for (var j = 0; j < goTims.length; j++) {
					var Minutes=Math.floor((defTim-goTims[j].goTim)/(60*1000));
					if(Minutes>0){
						if(Minutes<60){
							$("p",goTims[j].obj).eq(1).text("已开始 "+Minutes+"分钟");	
						}else{
							var hours=Math.floor(Minutes/60);
							var	minutes=Math.floor(Minutes-hours*60)+1;
							if(hours<24){
								$("p",goTims[j].obj).eq(1).text("已开始 "+hours+"小时 "+minutes+"分钟");
							}else{
								var day=Math.floor(hours/24);
									hours=Math.floor(hours-day*24);
								$("p",goTims[j].obj).eq(1).text("已开始"+day+"天"+hours+"小时"+minutes+"分钟");
							}
						}
					}
					
				}
			};
			IntervalFun();
			 timer=setInterval(function(){
				 IntervalFun();
				
			},15*1000);	
		}

	
		//迭代记录时候 查询顾客姓名
		var $parentTr=$("tr[data-parent=true]");
 
		
		$parentTr.each(function(){
			var ins=$(this).attr('data-parent-index'),status=[];
			
			//退款中的订单
			var $nodeStatus=$("tr[data-node-index="+ins+"]"),
			 	nodeSize=$nodeStatus.length;
			
			$nodeStatus.each(function(){
				var nodeStatus=$(this).attr("data-node-status");
				if(nodeStatus ==8 || nodeStatus ==3){
					status.push(nodeStatus);
				}				
			});
			//最后一个跳转到收银
			if((nodeSize-status.length)==1 && status.length!=0 && nodeSize>1){
				var $td=$("td:last",this),
				fun=$("a[data-over=true]",$td).eq(1).attr("onclick");
				if(fun){
					$nodeStatus.each(function(){
						var nodeStatus=$(this).attr("data-node-status");
						if(nodeStatus ==0){
							var $td=$("td:last",this),
							$ul=$("ul",$td).eq(1);
							$("a:first",$ul).attr("onclick",fun);
						}
					});
				}
			}
		});
		
		/////////////////////所有子订单完成时候 主订单一键完成变成立即收款////////////////////////////////
		//需要A标签的属性 data-over=true 主订单的配合
		$parentTr.each(function(){
			var ins=$(this).attr('data-parent-index');
			var flg=true;
			var obj = this;
			
			//退款中的订单
			var dataNodes = $("tr[data-node-index="+ins+"]");
			dataNodes.each(function(){
				if($(this).attr("data-node-type")==4){
					var $info = $("a[data-over=true]",obj);
					$info.parent().parent().html("<label style='color: #808080;'>退款中</label>");
					$info.next().children().eq(0).hide();
					$info.next().children().eq(2).hide();
					flg = false;
					return false;
				}
				if($(this).attr("data-node-status")!=8 && $(this).attr("data-node-status")!=3){
					flg=false;
					return false;
				}				
			});
			if(flg){
				$("a[data-over=true]",this).each(function(){
					$(this).text("立即收银");
					var orderId=$(this).attr("data-orderId");
					if($(this).attr("onclick") && orderId){
						$(this).attr("onclick","oneKeyEnd('"+orderId+"',1);");
					}
				});
				
			}
		});
	///////////////////////////////////////////////////////////////////
	};
	 
	window.initOrderTips=initOrderTips;
	
	
	/////////////////////////////新增多条记录//////////////////////////////
	$("#addMultipleOrder").click(function(){
		
		var iframeUrl=webRoot+"/"+shopId+"/dialog/multiple/cost";
			art.dialog.open(iframeUrl, {
				id:"addMultipleOrder",
				lock: true,
				opacity: 0.07,
				width: 1090,
				height: 890,
				fixed: false,
				resize:false,
				drag:false,
				init:function(){
					$("iframe",parent.document).attr("scrolling","no");
				}
				});
		
	});
	var falg=$("#shopMacfalg").val();
	
	if(falg){
		setInterval(function(){
			//工作机且 未设置密码的 做不超时功能调用
			$.get(webRoot+"/"+shopId+"/dialog/getNowTime",function(data){});
			
		},1000 * 60 *10);
	}

	
function initBusiListView(){
		//营业记录列表组件函数
		if(typeof(arguments[0])!== "string" ){
			console.error("错误：initBusiView 第一个参数必须为string节点");
			return;
		}
		if(arguments.length>1 && typeof(arguments[1])!== "object" ){
			console.error("错误：initBusiView 第二个参数必须为object参数对象");
			return;
		}
		
		var paramObj={};
		if(arguments.length>1){
			paramObj=arguments[1];
		}
		
		for (var j = 0; j < arguments.length; j++) {
			if(j>1 && typeof(arguments[j])!=='function'){
				console.error("错误：initBusiView 第三个参数起 必须为function");
				return;
			}
		}
		var  args=arguments;
		
		$.get(webRoot+"/resources/tmpl/mljia_shop_business.html",{},function(html){
		 if(html){
			 $.ajax({
				 url:webRoot + "/"+ shopId+"/business/selectBusinessOrders",
				 data:paramObj,
				 type:"get",
				 dataType:"json",
				 success:function(data){
						if(data.status==200){
							if(data.data){
								var item = data.data[0];
								var costCardFlag = sessionStorage.costCardFlag;
								if(item.orderList[0].orderType==3 && Number(costCardFlag) && item.orderList[0].orderStatus==1){
									//如果第一条订单为开卡并且为没有耗过那么弹出提示耗卡窗
									sessionStorage.costCardFlag=0;
									var customId =0;
									var customShopId=0;
									var customName = "";
									var customPayPwd = 0;
									var cardId = item.orderList[0].cardId;
									$.ajax({
										 url:webRoot + "/"+ shopId+"/custom/selectCustomIdById/"+item.orderList[0].customId,
										 data:{},
										 type:"get",
										 dataType:"json",
										 success:function(data){
											if(data.status==200){
												customId = data.datas.id;
												customShopId = data.datas.shopId;
												customName = data.datas.customName;
												customPayPwd = data.datas.customPayPwd;
												var openCardType;
												if(costCardFlag==1){
													//次卡
													openCardType = "cikahaokaIndex";
												}else if(costCardFlag==2){
													openCardType = "chuzhikaCostCard";
												}
												//弹出提示耗卡窗口
												var costCardLayer = ['<div class="other_zftcopwin poi1">',
																	 	'<p class="cross" onclick="closeLayerCostCard();"><a><i class="icon-editup06"></i></a></p>',
																	 	'<ul class="Ehintmaintop ">',
																	 		'<li>已开通<span title="'+item.orderList[0].info+'">'+item.orderList[0].info.substr(0,9)+'</span>,是否立即耗卡？</li>',
																	 		'</ul>',
																	 	'<div class="Baccountbut ">',
																	 	'<a class="butsbase butblue01_s lh32 fl" onclick="openArtDialg(\'/indexs/'+openCardType+'?customName='+customName+'&customId='+customId+'&customShopId='+customShopId+'&customPwd='+customPayPwd+'&cardId='+cardId+'&itemName='+item.orderList[0].info+'\');">立即耗卡</a>',
																	 		'<a class="butsbase buthui01_s lh32 fl ml30" onclick="closeLayerCostCard();">取消</a>',
																	 	'</div>',
																	  '</div>'].join("");
												 layerCostCard=window.top.$.layer({
							                            type: 1,
							                            title: false,
							                            shadeClose: false,
							                            area: ['auto', 'auto'],
							                            bgcolor: '',
							                            border: [0], //去掉默认边框
							                            closeBtn: [1, false], //去掉默认关闭按钮
							                            shift: 'top', //从左动画弹出
							                            zIndex:1000,
							                            page: {
							                                html:costCardLayer
							                            },
							                            end: function(){
							                            }
							                        });
												
											}
										 }
									});
									
								}
								
								  laytpl(html).render({
									  webRoot:webRoot,
									  scene:"busi",
									  list:data.data,
									  addrIp:addrIp,
									  thildZhifubaoPay:thildZhifubaoPay,
									  staticImage_Url : staticImage_Url,
									  shopId:shopId}, function(html){
										  
										    $(args[0]).html(html);
										    setTimeout(function(){
											for (var j = 0; j < args.length; j++) {
												if(typeof(args[j])==='function'){
													args[j]();
												}
											}
										    },500);
								  });
								  if($("#pageRow").length>0){
									  //分页逻辑 使用场景 ：营业记录，顾客订单记录
									  $("#pageRow li:first").text("每页"+(data.limit || 0)+"条，共"+(data.totalRows ||0 )+"条");
									  $("#pageRow li").eq(1).attr("onclick","pageFun(1)");
									  if(data.page==1){
										  $("#pageRow li").eq(2).removeAttr("onclick");
									  }else{
										  $("#pageRow li").eq(2).attr("onclick","pageFun("+(data.page-1)+")");  
									  }
									  $("#pageRow li").eq(3).text("第  [ "+data.page+" ] 页").attr("data-row",data.page);
									  if(data.page >= data.pageTotal){
										  $("#pageRow li").eq(4).removeAttr("onclick");
									  }else{
										  $("#pageRow li").eq(4).attr("onclick","pageFun("+(data.page+1)+")");  
									  }
									  
									  $("#pageRow li").eq(5).attr("onclick","pageFun("+(data.pageTotal)+")");
									  
									  if(data.busiTotal>data.limit){
										  if(data.page==1){
											  $("#shouPage").hide();
											  $("#prevPage").hide();
										  }else{
											  $("#shouPage").show();
											  $("#prevPage").show();
										  }
										  var thisPage = Math.ceil((data.busiTotal?data.busiTotal:1)/data.limit);
										  if(thisPage<=1 || thisPage==data.page){
											  $("#weiPage").hide();
											  $("#nextPage").hide();
										  }else{
											  $("#weiPage").show();
											  $("#nextPage").show();
										  }
									  }else{
										  $("#shouPage").hide();
										  $("#prevPage").hide();
										  $("#weiPage").hide();
										  $("#nextPage").hide();
									  }
									 
								  }
								  
							}else{
							    $("#busiTotal").text(0);
							    $("#busiTolYs").text("，营业业绩：0元");
							    $("#busiTotalCostCard").text("，耗卡总额 ：0元");  
								$(args[0]).html('<div class="shop_no_news_txt" ><i class="icon-no_news"></i>亲，还没有记录哦~</div>');
								$("#pageRow li:first").text("每页"+(data.limit || 0)+"条，共"+(data.totalRows ||0 )+"条");
								$("#shouPage").hide();
								$("#prevPage").hide();
								$("#weiPage").hide();
								$("#nextPage").hide();
							}
							
							
							if(data.startTime && data.endTime){
								$("#reservation").val(data.startTime+" - "+data.endTime);
								$("#startTime").val(data.startTime);
								$("#endTime").val(data.endTime);
							}
							  $("#busiTotal").text(data.busiTotal || 0);
							  
							  $("#busiTolYs").text("，营业业绩："+Number(data.busiTotalMoney ||0).toFixed(2)+"元");
							  //if(data.busiTotalCostCardMoney>0){
								  $("#busiTotalCostCard").text("，耗卡总额 ："+Number(data.busiTotalCostCardMoney ||0).toFixed(2)+"元");  
							  //}
							  $("#mlbiNum").html("("+(data.meiliMoneyCount || 0)+")");
							
						}else{
							  $("#busiTotal").text(0);
							  $("#busiTolYs").text("，营业业绩：0元");
							  $("#busiTotalCostCard").text("，耗卡总额 ：0元"); 
							  $(args[0]).html('<div class="shop_no_news_txt" ><i class="icon-no_news"></i>亲，还没有记录哦~</div>');
						}
				 },
				 error:function(XMLHttpRequest,textStatus, errorThrown){
						console.log("错误状态码：status:"+XMLHttpRequest.status+" readyState:"+XMLHttpRequest.readyState+" textStatus:"+textStatus);
						
						if(XMLHttpRequest.readyState==0){
							art.dialog.tips('链接超时，请刷新页面！');
						}else{
							if(errorThrown=="SyntaxError: Unexpected token <"){
//								console.log("错误信息:"+XMLHttpRequest.responseText);
								console.log("错误信息:后台数据异常");
							}
						}
						
					}
			 });
			  
		 }
		
		},"html");	
	}
	
	window.initBusiListView=initBusiListView;
	

});

/**
 * 关闭耗卡提示
 */
function closeLayerCostCard(){
	layer.close(layerCostCard);
}
//关闭是否开始订单窗口
function closeCostFlagLayer(){
	layer.close(costFlagLayer);
}

//弹出是否开始订单窗口
function startOrderLayFun(mainOrderId,orderId,info,money,way){
	
	var bool = true;
	//查询订单信息判断是否线上预约   线上预约则输入消费码
    $.ajax({
        url:webRoot +"/"+ shopId+ "/dialog/multiple/busiConsoleOff/"+mainOrderId,
        type:'get',
        dataType:'json',
        success:function(resData){
        	if(resData.status==200){
        		var orderSms = resData.tbOrderMain.orderList[0].orderSms;
        		var orderFromFlag = resData.tbOrderMain.orderList[0].orderFromFlag;
        		var orderStatus = resData.tbOrderMain.orderList[0].orderStatus;
        		//线上预约需要输入消费码、输入后直接开始
        		if(orderSms &&(orderFromFlag==1|| orderFromFlag==2 || orderFromFlag==5) && ( orderStatus==4 || orderStatus==2)){
        			var dialog = art.dialog({
        			    content: '<p>短信消费码：</p>'
        			    	+ '<input id="customPassCode" type="text" style="width:15em; padding:4px" />',
        			    fixed: true,
        			    lock:true,
        			    opacity: 0.07,
        			    id: 'Fm7',
        			    okVal: '确认',
        			    ok: function () {
        			    	var customPassCode = $('#customPassCode').val();
        			    	if(orderSms!=customPassCode){
        			    		$('#customPassCode').val('');
        			    		dialog.shake && dialog.shake(); 
        			    		return false;
        			    	}else{
        			    		$.ajax({
        			    			url : webRoot + "/"+ shopId+'/indexs/startSerOrder',
        			    			data:{
        			    						orderid:orderId
        			    			},
        			    			traditional :true,  
        			    			type : 'post',
        			    			dataType : 'json',
        			    			success : function(msg) {
        			    				if(msg.status==200){
        			    					if(top.initMain){
        			    	    				top.initMain();
        			    	    				art.dialog.close();
        			    	    				closeCostFlagLayer();
        			    	    			}else{
        			    	    				top.location.reload(true);
        			    	    			}
        			    				}else{
        			    					console.log("错误信息:"+msg.msg);
        			    				}
        			    			}
        			    		});	
        			    	}
        			    },
        			    cancel: true
        			});
        		}else if(orderStatus==5 || orderStatus==6 || orderStatus==7){
        			layer.msg("订单状态已改变",2, 3);
        			setTimeout(function(){
        				if(top.initMain){
            				top.initMain();
            				art.dialog.close();
            				closeCostFlagLayer();
            			}else{
            				top.location.reload(true);
            			}
        			}, 2000);
        		}else{
        			//非线上预约弹出是否开始提示
        			//弹出提示耗卡窗口
        			var text = "";
        			//耗卡与单次消费提示不同
        			if(way==-1){
        				text="当前服务项目为"+info;
        			}else{
        				text="本次服务费用"+Number(money).toFixed(2)+"元";
        			}
        			var costFlagLayerhtml = ['<div class="other_startopwin poi1">',
        									'<p class="cross" onclick="closeCostFlagLayer();"><a><i class="icon-editup06"></i></a></p>',
        									'<ul class="Ehintmaintop ">',
        									'<li><p  class="fz14">'+text+'</p>',
        									'<p>是否立即开始服务？</p>',
        									'</li>',
        									'</ul>',
        									'<div class="Baccountbut ">',
        									'<a class="butsbase butblue01_s lh32 fl" onclick="startOrderFun(\''+orderId+'\')">开始服务</a>',
        									'<a class="butsbase buthui01_s lh32 fl ml30" onclick="closeCostFlagLayer();">取消</a>',
        									'</div>',
        									'</div>'].join("");
        			
        			costFlagLayer=window.top.$.layer({
        		        type: 1,
        		        title: false,
        		        shadeClose: false,
        		        area: ['auto', 'auto'],
        		        bgcolor: '',
        		        border: [0], //去掉默认边框
        		        closeBtn: [1, false], //去掉默认关闭按钮
        		        shift: 'top', //从左动画弹出
        		        zIndex:1000,
        		        page: {
        		            html:costFlagLayerhtml
        		        },
        		        end: function(){
        		        }
        		    });
        		}
        	}else{
        		console.log("错误信息:"+resData.msg);
        	}
        }
    });
	
	
	
}

/**
 * 开始订单
 */
function startOrderFun(orderId){   
    
	$.ajax({
		url : webRoot + "/"+ shopId+'/indexs/startSerOrder',
		data:{
					orderid:orderId
		},
		traditional :true,  
		type : 'post',
		dataType : 'json',
		success : function(msg) {
			if(msg.status==200){
				if(top.initMain){
    				top.initMain();
    				art.dialog.close();
    				closeCostFlagLayer();
    			}else{
    				top.location.reload(true);
    			}
			}else{
				console.log("错误信息:"+msg.msg);
			}
		}
	});	
}

/**
 * 完成，修改订单 专用
 * @param url
 */
function openArtEndModify(url){
	
	if(url){
		var str=url.split("&")[1];
		var str2=str.split("=");
		if(str2[0]=='Id' && str2[1]){
			$.ajax({
				url : webRoot+"/"+shopId+"/indexs/selectOrderStatus/"+str2[1],
				type : 'get',
				dataType : 'json',
				async : false,
				success :function(data){
					if(data.status==200 && data.data !=0){
				 			 var ht='该订单状态已发生变化，请刷新当前页面。';
//				 			 if(data.data==1){
//				 				ht='该订单已经完成';
//				 			 }else if(data.data==3){
//				 				ht='该订单已经撤销'; 
//				 			 }else{
//				 				ht='该订单正在退款中';  
//				 			 }
				 			var htm='<div class="Ehintmain muttanmain muttanconp">'
					 			+'<p class="cross"><a  onclick="closeLayer();"><img src="'+staticImage_Url+'/mljia/opencut_r3_c10.gif" width="22" height="22"></a></p>'
					 			+'<ul class="Ehintmaintop">'
					 			+'<li class="">'+ht+'</li></ul>'
					 			+'<div class="Baccountbut">'
					 			+'<input type="button"  value="确定" onclick="closeLayer();" class="binput01"></div></div>';
					 			
				 			
				 			 //订单不可操作
				 			  $.layer({
				 				    type: 1,
				 				    title: false,
				 				    shadeClose: false,
				 				    area: ['auto', 'auto'],
				 				    bgcolor: '#ccc',
				 				    border: [0], //去掉默认边框 
				 				    closeBtn: [0, false], //去掉默认关闭按钮
				 				    shift: 'top', //从左动画弹出
				 				    page: {
				 				        html:htm
				 				    },
				 				    end:function(){
				 				    	(function(top){
				    						toFunReload(top);	
				    					})(top);
				 				    }
				 				});
	 
				 	}else{
				 		art.dialog.open(webRoot +"/"+shopId+url, {id:"busiArtDialog",
			 				lock: true,
			 				opacity: 0.07,
			 				width: 840,
			 				height: 580,
			 				fixed: true,
			 				resize:false,
			 				drag:false,
			 				init:function(){
			 				}
			 				});
				 	}
				}
				});
			
		}
		
	}
	
}




//营业操作弹出层
function openArtDialg(url){
	
	closeLayerCostCard();//关闭耗卡提示
	art.dialog.open(webRoot +"/"+shopId+url, {id:"busiArtDialog",
			lock: true,
			opacity: 0.07,
			width: 840,
			height: 580,
			fixed: true,
			resize:false,
			drag:false,
			init:function(){
//				$("iframe",parent.document).attr("scrolling","no");
			}
			});
	

}



$(document).ready(function(){
	//主页和营业记录 在消费
	if(controlTarg==0 || controlTarg==1){
	
		
		var rexiaofei=function(obj){
			var customId=$(obj).attr("data-custom-id");
			var orderType=$(obj).attr("data-order-type");
			var cardId=$(obj).attr("data-card-id");
			var produceId=$(obj).attr("data-produce-id");
			var massageId=$(obj).attr("data-massage-id");
			var otherShopId=$(obj).attr("data-other-shop-id");
			var cardTypeId=$(obj).attr("data-card-type-id");
			if(!cardTypeId){
				cardTypeId=0;
			}
			
			
			var url='/indexs/cashWithItems?customId='+customId+"&otherShopId="+otherShopId+"&massageId="+massageId;//默认现金做服务
			if(customId<=0){
				url='/indexs/dispersionWithItems?customId='+customId+"&otherShopId="+otherShopId+"&produceId="+produceId+"&massageId="+massageId;

			}
			else if(orderType==0){
				//现金消费
				if(produceId>0){
					url='/indexs/cashWithProduce?customId='+customId+"&otherShopId="+otherShopId+"&produceId="+produceId;
				}
			}else if(orderType==1){
				//储值卡
					url='/indexs/chuzhikaCostCard?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId;
				if(produceId>0){
					url='/indexs/chuzhikaCostCard?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId+"&produceId="+produceId;//储值卡买产品	
				}else if(massageId>0){
					url='/indexs/chuzhikaCostCard?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId+"&massageId="+massageId;//储值卡做服务
				}
				
			}else if(orderType==2){
				//次卡
				url='/indexs/cikahaokaIndex?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId;
				if(massageId>0){
					url='/indexs/cikahaokaIndex?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId+"&massageId="+massageId;//次卡
				}
			}else if(orderType==3){
				//默认次卡开卡
				url='/indexs/openCardIndex?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId+"&cardTypeId="+cardTypeId;
				$.ajax({
					url : webRoot +"/"+ shopId+"/indexs/getCardType?cardTypeId="+cardTypeId, 
					type : "get",
					timeout: 300,
					dataType : "json",
					async:false,
					success : function(msg) { 
							if(msg.status==200){
								if(msg.data==1){
									//储值卡
									url='/indexs/chuzhikaOpenCardIndex?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId+"&cardTypeId="+cardTypeId;
								}
							}
					}
				});
				
			}else if(orderType==5 || orderType==6){
				//充值-储值卡
				url='/indexs/chuzhiRecharge?customId='+customId+'&cardId='+cardId+"&otherShopId="+otherShopId;
			}
			openArtDialg(url);
		};
		
		$("a[data-cost='true']").each(function(){
			$(this).attr("onclick","rexiaofei(this);");
		});
		window.rexiaofei=rexiaofei;
	
	}
	
/**********************轮播图片***********************************/
	if($("#controlTarg").length>0){
 
		$.ajax({
			url : webRoot +'/'+shopId+'/dialog/getImageCarousel',
			type : 'get',
			dataType : 'json',
			async : false,
			success : function(date){
				if(date.status==200 && date.data && date.data.length>0){
					$.get(webRoot+'/resources/tmpl/shop/mljia_shop_top_banner.html',function(htm){
						laytpl(htm).render({
							download_url:download_url,
							data:date.data
						},function(html){
						 $(".top_navbar").after(html).next().slideDown(300);
						});
					},'html');
				}else{
					console.log(date.msg);
					$(".top_advert").remove();
				}
			} 
		});
 
	}
	
	

});



//////////去除空格的方法//////////////
function Trim(str,is_global) 
{ 
var result; 
result = str.replace(/(^\s+)|(\s+$)/g,""); 
if(is_global.toLowerCase()=="g") 
result = result.replace(/\s/g,""); 
return result; 
} 
///////////////////

function artIos(url){
	art.dialog.open(webRoot +"/"+shopId+url, {lock: true,opacity: 0.07,width: 820,height: 560,fixed: true,resize:false,drag:false});
}

//加入收藏夹
$("#addHomePage").click(function () { 
    if (document.all) {//设置IE  
    	document.body.style.behavior = 'url(#default#homepage)'; 
    	document.body.setHomePage(document.URL); 
    } 
    else 
    {//网上可以找到设置火狐主页的代码，但是点击取消的话会有Bug，因此建议手动设置  
 	art.dialog({
		id: 'msg',
		icon: 'error',
		lock:true,
		opacity: 0.1,
		content: "设置首页失败，请手动设置！<br>或者 按CTRL+D 加入收藏夹",
		fixed: true,
		drag: false,
		resize: false
	});
    }  
});


//工作机密码效验问题
setInterval(checkMacPwd, 2000);
var tim=0;
//工作机密码小效验框
function checkMacPwd(){
	var falg=$("#shopMacfalg").val();
	
	if(falg==1&&tim==0){
		tim++;
		art.dialog.open(webRoot +"/"+shopId+"/parameter/to_mac_check", {
			id: 'msg2',
			lock: true,
			background:"#fff",
			opacity: 1,
			cancel:false,
			fixed: true,
			resize:false,
			drag:false
			});

	}
}


//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function forbidBackSpace(e) {
  var ev = e || window.event; //获取event对象
  var obj = ev.target || ev.srcElement; //获取事件源
  var t = obj.type || obj.getAttribute('type'); //获取事件源类型
  //获取作为判断条件的事件类型
  var vReadOnly = obj.readOnly;
  var vDisabled = obj.disabled;
  //处理undefined值情况
  vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
  vDisabled = (vDisabled == undefined) ? true : vDisabled;
  //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
  //并且readOnly属性为true或disabled属性为true的，则退格键失效
  var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
  //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
  var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
  //判断
  if (flag2 || flag1) return false;
}
//禁止后退键 作用于Firefox、Opera
document.onkeypress = forbidBackSpace;
//禁止后退键  作用于IE、Chrome
document.onkeydown = forbidBackSpace;


//弹出的消息框
function mainTips(HTML){
	
	art.dialog({
		id: 'msg',
		content: HTML,
		left: '100%',
		top: '100%',
		padding:'0px 0px',
		fixed: true,
		drag: false,
		resize: false,
		close: function () {
			$.post(webRoot+"/"+shopId+"/message/deleteShopTips");
		}
	});
	art.dialog.list['msg'].content(HTML);
}

var mes=0;
function closeTitle(url,num,ids){
	var cusUrl="/message/messageIndex#02";
	var bus="/business/index?timer=3&status=4";
	var comm="/business/orderInfo?orderId=";
	var compain="/business/complaints";
	if(url==1||url==2){
		url=cusUrl;
	}else if(url==3){
		url=bus;
	}else if(url==4){
		url=comm;
	}else if(url==5){
		url=compain;
	}
//	$.post(webRoot+"/"+shopId+"/message/deleteTips",{ids:ids});
	
	window.open(webRoot+"/"+shopId+url,'_blank'); 
	num--;
	if(mes==0){
		mes=num;
	}
	if(num==0){
		art.dialog.list['msg'].close();
	}
	if(num>0&&mes==0){
		art.dialog.list['msg'].close();
	}
}



function closeWxTitle(ids){
//	$.post(webRoot+"/"+shopId+"/message/deleteTips",{ids:ids});
	
	window.open(webRoot+"/"+shopId+"/weixin/custrom/index/1",'_blank');
	
	art.dialog.list['msg'].close();
	
}

function closeWxTitle2(ids){
	$.post(webRoot+"/"+shopId+"/message/deleteTips",{ids:ids});

	window.open(webRoot+"/"+shopId+"/business/index?timer=3&orderPre=1",'_blank');

	art.dialog.list['msg'].close();

}

function closeWxTitle3(ids){
	$.post(webRoot+"/"+shopId+"/message/deleteTips",{ids:ids});

	window.open(webRoot+"/"+shopId+"/business/index?timer=3&orderPre=1&status=3",'_blank');

	art.dialog.list['msg'].close();

}


var info=0;
function closeTitleComment(id,txt,num,ids){
	
	$.post(webRoot+"/"+shopId+"/message/deleteTips",{ids:ids});
	window.open(webRoot+"/"+shopId+"/business/orderInfo?orderId="+id+"&content="+encodeURIComponent(txt),'_blank'); 
	num--;
	if(info==0){
		info=num;
	}
	top.document.getElementById("mesNum").innerHTML=0;
	if(num==0){
		art.dialog.list['msg'].close();
	}
	if(num>0&&info==0){
		art.dialog.list['msg'].close();
	}
}



//店内登录框
function staffManager(){
	art.dialog.open(webRoot +"/edge/"+shopId+"/staff_login_manager", 
			{
			padding: -1,
			lock: true,
			opacity: 0.1,
			fixed: true,
			resize:false,
			drag:false
			});

}



//写cookies函数//两个参数，一个是cookie的名子，一个是值
function setCookie2(name,value){
	var Days = 1; //此 cookie 将被保存 1 天
	var exp   = new Date(); //new Date("December 31, 9998");
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//取cookies函数
function getCookie2(name) {
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	    if(arr != null)
	    	return unescape(arr[2]); return null;

}

//店内退出框
function staffManagerOut(shopId){
	//清除seaaion
	$.ajax({
		url : webRoot +'/edge/staffLoginManagerOut/'+shopId,
		type : 'post',
		dataType : 'json',
		async : false,
		success : function(date) {
			toMonitor("/"+ shopId+"/edge/staffLoginManagerOut/"+shopId,date);
			//清除cookie
			cleanCookie('rightId'+shopId);
			localStorage.setItem("steyeHide","");
			if(window.location.href==(webRoot+"/"+shopId)){
				parent.location.reload();
			}else{
				window.open(webRoot+"/"+shopId,"_self");
			}
			
		} 
	});
}

////调用场景=店铺主页店内退出框（不刷新）
//function staffManagerOutForShopMain(shopId){
//	//清除seaaion
//	$.ajax({
//		url : webRoot +'/edge/staffLoginManagerOut/'+shopId,
//		type : 'post',
//		dataType : 'json',
//		async : false,
//		success : function(data) {
//			//清除cookie
//			cleanCookie('rightId'+shopId);
//			
//			// 加载公共权限(工作机)
//			checkCookie(-1);
//			var $li=$('li[data-manager="true"]');
//			
//			var htm='<li data-manager="true"><a>工作机状态</a></li>'+
//					'<li data-manager="true"><a href="javascript:;" onclick="staffManager();">店内登录</a></li>';
//			
//			$li.last().after(htm);
//			$li.remove();
//		} 
//	});
//}



//卡项，项目，产品默认图片弹出层
function openArtDialgPic(url){
	art.dialog.open(webRoot +url, {lock: true, 
		opacity: 0.07,
		width: 960,
		height: 570, 
		resize:false,
		button:[{
			name:"确定",
			callback:function(){
				var parent_frame=window.frames[0];
				//判断 全局变量在那个iframe页面
				for(var a=0;a<window.frames.length;a++){
				try{
					var winmas=window.frames[a].catelogs;
					if(winmas != null && winmas != 'undefined'){
						parent_frame=window.frames[a];
						break;
					}
						}catch(e){
					}
				}
				parent_frame.closeWindow();
			}
		}]
		});
}
setTimeout(function(){
	
if($(document).width()<1200){
	$('div .app_downmenu').hide();
}else{
	$('div .app_downmenu').show();
}
},300);







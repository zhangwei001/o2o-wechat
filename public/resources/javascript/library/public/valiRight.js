var shopId= document.getElementById("shopIdKey").value;
//主页--营业记录更多--top
var url1="/"+shopId+"/business/index?timer=3";
//主页--营业记录-预约 &orderPre=1
var url101="/"+shopId+"/business/index?osta=2&timer=1&status=4";
//主页--营业记录-开卡记录
var url102="/"+shopId+"/business/index?busi=2&timer=1&type=3";
//主页--营业记录-耗卡记录
var url103="/"+shopId+"/business/index?busi=5&timer=1&falg=1";
//主页--营业记录-单次消费
var url104="/"+shopId+"/business/index?busi=6&timer=1&type=0";
//主页--营业记录-退款
var url105="/"+shopId+"/business/index?timer=1&type=4";


//主页--新增营业记录
var url2="/"+shopId+"/indexs/openCardIndex";
//主页--顾客耗卡
var url3="/"+shopId+"/indexs/cikahaokaIndex";
//主页--订单修改
var url4="/"+shopId+"/indexs/offService?falg=3&Id=";
//主页--新增顾客
var url5="/"+shopId+"/custom/addcustomIndex";
//主页--评价管理
var url6="/"+shopId+"/business/comment";
//主页--顾客管理更多--top
var url7="/"+shopId+"/custom/customIndex";
//顾客--修改资料
var url8="/"+shopId+"/custom/getCustomById/";
//顾客--消费详细
var urlCus1="/"+shopId+"/business/index?customId=";
var myDate = new Date();
var urlCus2="&timer=5&startTimer=2014-01-01&endTimer="+myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
//消息--消息管理--发消息
var urlMes="/"+shopId+"/message/sendMessage";
//消息--消息管理--回复
var urlMes2="/"+shopId+"/message/ReMessage";
//通知--
var urlNoc="/"+shopId+"/message/sendNotify";
//消息-验证
var urlCheck="/"+shopId+"/message/checkCustom?id=";
//主页--卡项和护理----top
//var url9="/"+shopId+"/cardItem/cardItemIndex?parmCardItem=0&chuZhiOrCiKa=2&bool=0";
var url9="/"+shopId+"/cardItem/card/list";
//卡项和护理--新增服务卡次卡
var url10="/"+shopId+"/cardItem/add/card/1";
//卡项和护理--新增服务卡储值卡
var url10Chu="/"+shopId+"/cardItem/add/card/2";
//卡项和护理--修改服务卡
//var url11="/"+shopId+"/cardItem/updateCardTypeIndex/";
var url11="/"+shopId+"/cardItem/update/cardType/";
//卡项和护理--查看基础项目
var url12="/"+shopId+"/cardItem/massageIndex";
//卡项和护理--增加基础项目
//var url13="/"+shopId+"/cardItem/addMassageIndex";
var url13="/"+shopId+"/cardItem/add/massage";
//卡项和护理--修改基础服务
//var url14="/"+shopId+"/cardItem/updateMassageIndex/";
var url14="/"+shopId+"/cardItem/update/massage/";
//卡项和护理--批量增加基础项目分类
var url15="/"+shopId+"/cardItem/massageTypeIncentoryIndex";
//卡项和护理--分类管理添加项目
//var url16="/"+shopId+"/cardItem/addMassageIndex?massageTypeId=";
var url16="/"+shopId+"/cardItem/add/massage?massageTypeId=";
//卡项和护理--分类管理更改分类
var url17="/"+shopId+"/cardItem/updateMassageTypeIndex/";
//主页--员工管理--top
var url18="/"+shopId+"/staff/staffIndex?falg=1&sortType=1";
//员工管理--新增员工
var url19="/"+shopId+"/staff/jumpToaddStaff";
//员工管理--修改员工资料
var url20="/"+shopId+"/staff/jumpToupdateStaff?staffId=";
//员工管理--查看员工考勤
var url21="/"+shopId+"/staff/staffKaoqin?staffId=";
//员工管理--查看全部考勤
var url22="/"+shopId+"/staff/staffKaoqin";
//员工管理--查看员工级别
var url23="/"+shopId+"/staff/selectStaffLevelList?group_id=";
//财务管理--查看员工业绩
var url24="/"+shopId+"/finance/staffWagesReport?falg=0";
//财务管理--修改固定成本
var url25="/"+shopId+"/finance/financeGuDing?flg=";
//财务管理--重新生成财务报表
var url26="/"+shopId+"/finance/makeReportOne?Id=";
//主页--库存管理--top
var url27="/"+shopId+"/inventory/inventoryIndex";
//库存管理--分类中新增产品
var url28="/"+shopId+"/inventory/add/product?productTypeId=";
//库存管理--更改产品分类
var url29="/"+shopId+"/inventory/updateProductTypeIndex/";
//库存管理--更改产品信息
//var url30="/"+shopId+"/inventory/updateProductIndex/";
var url30="/"+shopId+"/inventory/update/product/";
//库存管理--批量增加顶级分类
var url31="/"+shopId+"/inventory/addProductTypeIncentoryIndex";
//库存管理--新增产品
//var url32="/"+shopId+"/inventory/addProductIndex";
var url32="/"+shopId+"/inventory/add/product";
//库存管理--批量入库
var url33="/"+shopId+"/inventory/productIncentoryIndex";
//库存管理--单个入库
var url34="/"+shopId+"/inventory/inProductIndex/";
//库存管理--耗材管理
var url35="/"+shopId+"/inventory/consumableIndex?sortt=consumableTotal&sortType=1";
//耗材管理--修改耗材
var url36="/"+shopId+"/inventory/updateConsumableIndex/";
//耗材管理--新增耗材
var url37="/"+shopId+"/inventory/addConsumableIndex";
//耗材管理--耗材批量入库
var url38="/"+shopId+"/inventory/consumableIncentoryIndex";
//耗材管理--耗材出库
var urll38="/"+shopId+"/inventory/consumableOut?id=";
//耗材管理--耗材入库
var urll39="/"+shopId+"/inventory/consumableIn?consumableId=";

//批量入库--产品
var url39="/"+shopId+"/inventory/addProductIndex?fromType=1";
//批量入库--耗材
var url40="/"+shopId+"/inventory/addConsumableIndex?fromType=1";
//库存管理--出入库清单
var url41="/"+shopId+"/inventory/stockIndex";
//主页--参数管理--top
var url42="/"+shopId+"/parameter/shopMessageIndex";
//参数管理--修改地图
var url43="/"+shopId+"/parameter/updateShopMap";
//参数管理--查看权限组
var url44="/"+shopId+"/parameter/parameterIndex";
//参数管理--权限管理
var url45="/"+shopId+"/parameter/rightIndex/";
//主页--工作机管理
var url46="/"+shopId+"/parameter/parameterSetIndex";
//投诉
var url47="/"+shopId+"/business/complaintsInfo?complaints_id=";
//微信
var urlwx="/"+shopId+"/weixin/bindPublic";
//参数设置
var url48 ="/"+shopId+"/parameter/parameterSetIndex";
//微信平台
var url49 ="/"+shopId+"/weixin/weixinCustrom/-1";
//护理管理
var url50 ="/"+shopId+"/cardItem/massageIndex";
//护理管理
//var url51 ="/"+shopId+"/cardItem/selectMassageListByCondition?isrecommend=-1&status=1&massageTypeId=-1";
var url51 ="/"+shopId+"/cardItem/massage/list";


//关闭状态提示层专用
function closeLayer(){
	(function(top){
		layer.closeAll();
		toFunReload(top);	
	})(top);
}

//主页main上的权限验证  url全局地址 (data需要的值,无需传值则穿 '',不能传null) tag打开方式  (flg=0表示页面打开,flg=1表示弹出新小窗口(tag无效)) (targe标头页面打开方式参看top.js) width: 830,height: 480,
function checkRight(rightId,url,data,tag,flg,target){
	
	var boo=validationRight1(rightId);
		if(data==null||data==''||data=='null'||data.length<1){
			data='';
		}
			if(boo){
				if(flg==1){
					 if(data && !$.isNumeric(data) && data.split("&")[0]>0 ){
						 
						 $.ajax({
								url : webRoot+"/"+shopId+"/indexs/selectOrderStatus/"+data.split("&")[0],
								type : 'get',
								dataType : 'json',
								async : false,
								success :function(msg){
									if(msg.status==200 && msg.data !=0){
								 			 //订单不可操作
								 			 var ht='该订单状态已发生变化，请刷新当前页面。';
//								 			 if(data.data==1){
//								 				ht='该订单已经完成';
//								 			 }else if(data.data==3){
//								 				ht='该订单已经撤销'; 
//								 			 }else if(data.data==5){
//								 				ht='该订单正在退款中';  
//								 			 } 
								 			 
								 			var htm='<div class="Ehintmain muttanmain muttanconp">'
								 			+'<p class="cross"><a  onclick="closeLayer();"><img src="'+staticImage_Url+'/mljia/opencut_r3_c10.gif" width="22" height="22"></a></p>'
								 			+'<ul class="Ehintmaintop">'
								 			+'<li class="">'+ht+'</li></ul>'
								 			+'<div class="Baccountbut">'
								 			+'<input type="button"  value="确定" onclick="closeLayer();" class="binput01"></div></div>';
								 			
								 			
								 			
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
								 				        html: htm
								 				    },
								 				    end:function(){
								 				    	(function(top){
								    						toFunReload(top);	
								    					})(top);
								 				    }
								 				});
								 			
								 		 }else{
												art.dialog.open(webRoot +url+data, {
													id: 'businessPanel',
													lock: true, opacity: 0.07,
													fixed: true,width: 840,height: 610,
													resize:false,
													drag:false,
													init:function(){
//														$("iframe",parent.document).attr("scrolling","no");
													}
												});
								 		 }
								}
								});
						 
					 }else{
							
							art.dialog.open(webRoot +url+data, {
								id: 'businessPanel',
								lock: true, opacity: 0.07,fixed: true,width: 840,height: 610,
								resize:false,
								drag:false,
								init:function(){
//									$("iframe",parent.document).attr("scrolling","no");
								}
							});
					 }
						

				}else{
					if(target!=null&&target!=""){
						window.parent.open(webRoot+url+data,'_self');
//						if(target!=0){
//						}else{
//							window.parent.open(webRoot+url+data,"_blank");
//						}
					}else{
						tag=tag.replace(/[ ]/g, "");
						window.parent.open(webRoot+url+data,tag);
						
					}
				}
			}else{
				art.dialog.open(webRoot+"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&tag="+tag+"&urll="+encodeURIComponent(url+data)+"&flg="+flg+"&target="+target, {
					id: 'businessPanel',
					lock: true,
					background: '#000',
					opacity: 0.3,
					title:'',
					fixed: true,
					cancel:false,
					resize:false,
					drag:false
				});
				
			}

	
}
//员工考勤查询 width: 830,height: 480,
function checkRightAtt(rightId,url,data,tag,flg,target){
	var boo=validationRight1(rightId);
	if(data==null||data==''||data=='null'||data.length<1){
		data='';
	}
		if(boo){
			if(flg==1){
				art.dialog.open(webRoot +url+data, {lock: true, opacity: 0.07,width: 820,height: 500,fixed: true,
					resize:false,
					drag:false});
			}else{
				if(target!=null){
					if(target!=0){
						window.parent.open(webRoot+url+data,'_self');
					}else{
						window.parent.open(webRoot+url+data,"_self");
					}
				}else{
					var staffId = $("#staffManagerId").val();
					tag=tag.replace(/[ ]/g, "");
					if(staffId!=null&&staffId>0){
						window.top.open(webRoot+"/"+shopId+"/staff/staffKaoqin?staffId="+staffId,tag);
					}else{
						window.top.open(webRoot+url+data,tag);
					}
					
				}
			}
		}else{
			art.dialog.open(webRoot+"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&tag="+tag+"&urll="+encodeURIComponent(url+data)+"&flg="+flg+"&target="+target, {lock: true, background: '#ccc',opacity: 0.07,title:'',fixed: true,
				resize:false,
				drag:false});
			
		}
	
}




//顾客详细特殊传值
function checkRightInfo(rightId,url,data,tag,flg,target,url2){
	
	var boo=validationRight1(rightId);
		if(boo){
			if(flg==1){
				openArtDialg(url+data+url2);
			}else{
				tag=tag.replace(/[ ]/g, "");
				if(target!=null){
					if(target!=0){
						window.parent.open(webRoot+url+data+url2,'_self');
					}else{
						window.parent.open(webRoot+url+data+url2,"_self");
					}
				}else{
					window.parent.open(webRoot+url+data+url2,tag);
					
				}
			}
		}else{
			art.dialog.open(webRoot +"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&tag="+tag+"&urll="+encodeURIComponent(url+data+url2)+"&flg="+flg+"&target="+target, {lock: true, background: '#ccc',opacity: 0.07,title:'',fixed: true,
				resize:false,
				drag:false});
			
		}
	
}


//权限验证发送顾客消息 (funName表示要执行的函数名 data1 表示要执行的带参数函数方法 不能为null) flg=2表示当前页面提示授权通过
function checkRightMess(rightId,funName,data1,flg){
	var boo=validationRight1(rightId);
	if(boo){
		funName(data1);
	}else{
		art.dialog.open(webRoot +"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&urll="+encodeURIComponent(data1)+"&flg="+flg, 
				{lock: true,
				background: '#000',
				opacity: 0.3,
				height:400,
				width:460,
				title:'',
				fixed: true,
				cancel:false,
				resize:false,
				drag:false});
	}
}

//权限验证发送顾客消息 (funName表示要执行的函数名 data1 表示要执行的带参数函数方法 不能为null) flg=2表示当前页面提示授权通过
function checkRightMass2(rightId,funName,data1,data2,flg){
	
	var boo=validationRight1(rightId);
	if(boo){
		funName(data1,data2);
	}else{
		art.dialog.open(webRoot +"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&urll="+encodeURIComponent(data1,data2)+"&flg="+flg, {lock: true, background: '#ccc',opacity: 0.07,title:'',fixed: true,resize:false,drag:false});
	}
}
//权限验证发送顾客消息 (funName表示要执行的函数名 data1 表示要执行的带参数函数方法 不能为null) flg=2表示当前页面提示授权通过
function checkRightMass3(rightId,funName,data1,data2,data3,flg){
	var boo=validationRight1(rightId);
	if(boo){
		funName(data1,data2,data3);
	}else{
		art.dialog.open(webRoot +"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&urll="+encodeURIComponent(data1,data2)+"&flg="+flg, {lock: true, background: '#ccc',opacity: 0.07,title:'',fixed: true,resize:false,drag:false});
	}
}

//主页验证业绩员工工资权限
function checkRightMess4(rightId,rightId1,funName,data1,flg){
	var boo1=validationRight1(rightId);
	var boo2=validationRight1(rightId1);
	if(boo1 || boo2){
		funName(data1);
		$("#monthStaffWage_on_off").addClass("icon-eye_open");
 		$("#monthStaffWage_on_off").attr("title","点击隐藏金额");
	}else{
		rightId = rightId+"-"+rightId1;
		art.dialog.open(webRoot +"/edge/"+shopId+"/staffLogin?rightId="+rightId+"&urll="+encodeURIComponent(data1)+"&flg="+flg+"&refresh=1", 
				{lock: true,
				background: '#000',
				opacity: 0.3,
				height:380,
				width:460,
				title:'',
				fixed: true,
				cancel:false,
				resize:false,
				drag:false,
				init:function(){
					$("iframe",parent.document).attr("scrolling","no");
				}
		});
	}
}

(function(){


	var saasServer = wxGLOBAL.saasActionServer;//sassServer
	var wxServer = wxGLOBAL.wechatActionServer;//微信
    var uploadServer = wxGLOBAL.uploadActionServer;



	var requestUrl={
		upLoadUrl:{
			upLoadImg :uploadServer +"/upload/cloud/image" //上传图片
		},
		user:{
			searchCustom : saasServer+"/saas.customer/o2o/wx/search/custom",//获取用户信息
			wxUnwarp : wxServer+"/meirong.basic.action/o2o/wx/unwarp",//取消微信关联顾客
			relate : saasServer+"/saas.customer/o2o/wx/relate",//关联用户
			queryCustomerId : wxServer+'/wechat/o2o/user/customer/id/get',//获取顾客编号，添加顾客需要条件
			addCustomer : wxServer +'/wechat/o2o/user/add',//添加顾客
			userListUser : wxServer+"/wechat/o2o/user/list",//获取用户列表
			appInfo : wxServer+"/wechat/o2o/app/info",//获取公众号详情
			appSummaryo : wxServer+"/wechat/o2o/app/summary",//获取公众号首页统计
			auditSaveAudit : wxServer+"/wechat/o2o/audit/save",//保存店铺公众号申请信息
			selectUserChooseList : wxServer+"/wechat/o2o/user/choose",// 用户列表

			getloginUserInfo: wxServer +"/wechat/o2o/auth/check",//获取授权码

			getUserInfo: 	wxServer +"/wechat/o2o/auth/info", //获取微信用户userid shopId shopSid

			wXUserExit: wxServer + "/wechat/o2o/auth/exit",//微信端退出

			fetchWXshopInfo: wxServer + "/wechat/o2o/shop/get",// 获取微信店铺信息（含WIFI）

			saveWXshopInfo :wxServer + "/wechat/o2o/shop/save",// 2. 保存微信店铺信息（含Wifi等）

			fetchFocusQrcodeImg :wxServer + "/mp/shop/", //获取店铺关注二维码

			fetchPayQrcodeImg : wxServer + "/mp/shop/" ,//获取店铺支付二维码
			//http://wx.mlljiatest.cn/wechat/o2o/shop/delwifi
			deleteWifiSettting: wxServer +"/wechat/o2o/shop/delwifi"// 删除店铺wifi 设置
		},
		shop:{
			deleteShopMessage: wxServer+'/main.shop.action/o2o/message/delete',//删除店铺消息提示
			selectShopListByUserId : wxServer+"/wechat/o2o/shop/list",//根据user_id获取店铺列表

			getSendMessageRemainTimes: wxServer +"/wechat/o2o/tmpl/count", //根据user_id 获取剩余发送次数

			getMaterialListData:	   wxServer	+"/wechat/o2o/tmpl/list", //获取素材列表

			releaseMaterial:		   wxServer+ "/wechat/o2o/tmpl/export" , //发布素材

			getMaterialContent:		   wxServer+"/wechat/o2o/tmpl/info",  //获取素材正文

			getReleasedPublicMessage:  wxServer+ "/wechat/o2o/tmpl/choose/history",//获取userid 已经发布了的公众号数据

			getShopAllsellCardLis:     saasServer + "/saas.material/saas/card/list",//查询店铺对外在售卡项

			getShopAllsellmassageLis:     saasServer + "/saas.material/saas/massage/list",//查询店铺对外在售卡项

			getShopAllsellProductLis:     saasServer + "/saas.material/saas/product/list"//查询店铺对外在售产品

		},
		material:{
			selectMaterial : wxServer+"/wechat/o2o/material/list",//获取非图文素材列表
			selectMaterialInfo : wxServer+"/wechat/o2o/news/info/",//获取素材详情
			selectMaterialImageInfo : wxServer+"/wechat/o2o/material/info/",//获取非图文素材详情

			addMaterial : wxServer+"/wechat/o2o/material/add",//上传非图文素材单
			delMaterial : wxServer+"/wechat/o2o/material/del",//删除非图文素材单
			batchAddMaterial : wxServer+"/wechat/o2o/material/batch/add",//上传非图文素材批量

			addMassSend : wxServer+"/wechat/o2o/mass/send",// 新增群发消息
			selectMassHistoryList : wxServer+"/wechat/o2o/mass/history",//获取群发消息列表

			selectNewsList : wxServer+"/wechat/o2o/news/list",//查找图文素材列表
			addImageTextUrl : wxServer+"/wechat/o2o/news/add/item",//新增图文素材
			updateImageTextUrl : wxServer+"/wechat/o2o/news/update/item/",//更新图文素材
			addSyncImageTextUrl : wxServer+"/wechat/o2o/news/sync/",//同步图文素材到微信
			delBatchImageText : wxServer+"/wechat/o2o/news/del/",// 批量删除图文消息
			delImageText : wxServer+"/wechat/o2o/news/del/item/",// 删除图文消息

			addReply : wxServer+"/wechat/o2o/reply/add",// 新增自动回复规则
			delReply : wxServer+"/wechat/o2o/reply/del/",// 删除自动回复
			updateReply : wxServer+"/wechat/o2o/reply/update/",// 修改自动回复
			selectReplyList : wxServer+"/wechat/o2o/reply/list",// 自动回复列表
			wxRefresh: wxServer+'/wechat/o2o/app/refresh'//刷新信息
		},
		//微信优惠活动
		activity:{
			selectActivity : wxServer+"/wechat/o2o/activity/search",// 搜索活动信息
			insertActivity : wxServer+"/wechat/o2o/activity/add",// 新增活动信息
			operateActivity : wxServer+"/wechat/o2o/activity/operate",// 操作活动信息
			activityInfo : wxServer+"/wechat/o2o/activity/info",// 获取活动信息
			updateActivity : wxServer+"/wechat/o2o/activity/modify",// 修改活动信息
			previewActivity : wxServer + "/wechat/o2o/activity/show" //预览微信活动
		},
		//营业记录相关
		business:{
			//正常单
			mormal:{
				orderBegin:wxServer+"/meirong.order.action/o2o/multip/massage/begin",//开始服务
				orderFinish:wxServer+"/meirong.order.action/o2o/multip/massage/finish",//直接结束
				orderYuyue:wxServer+"/meirong.order.action/o2o/multip/massage/yuyue",//立即预约
				mainOrderInfo:wxServer+"/meirong.order.action/o2o/multip/mainorder/info",//主订单详情
				orderOffService:wxServer+"/meirong.order.action/o2o/multip/order/checkout"//直接结账
			},
			//补录单
			makeup:{

			},
			//操作订单
			operation:{
				revokeMainOrder:wxServer+"/meirong.order.action/o2o/multip/cancelAll",//撤销主订单
				revokeOrder:wxServer+"/meirong.order.action/o2o/multip/order/cancel",//撤销子订单
				addOrder:wxServer+"/meirong.order.action/o2o/multip/order/add",//新增子订单
				delOrder:wxServer+"/meirong.order.action/o2o/multip/order/remove"//删除子订单
			}
		},
		//顾客相关
		custom:{
			selectShopCustomBirthdayRemind: wxServer+'/meirong.basic.action/o2o/custom/birthday/remind',//获取即将过生日的顾客列表
			addShopCustomInfo: wxServer+'/meirong.basic.action/o2o/custom/add',//添加顾客信息
			modifyShopCustomInfo: wxServer+'/meirong.basic.action/o2o/custom/modify',//修改顾客信息
			selectShopCustomInfo: wxServer+'/meirong.basic.action/o2o/custom/info',//查询顾客信息

			selectUpdateCustomNote: wxServer+'/meirong.basic.action/o2o/custom/modify/note',//修改顾客备注
			selectCustomBirthdayListRemind: wxServer+'/meirong.basic.action/o2o/custom/birthday/remind',//即将过生日的顾客列表

			batchExcelimport: wxServer+'/meirong.basic.action/o2o/batch/excel/import'//顾客储值卡excel导入

		},
		//员工相关
		staff:{

		},
		//卡项和护理
		cardItem:{
			selectMassageTagList: wxServer+'/meirong.basic.action/o2o/massage/tag',//护理标记列表
			selectMassageTypeList: wxServer+'/meirong.basic.action/o2o/massage/type/list',//护理分类列表
			selectMassageList: wxServer+'/meirong.basic.action/o2o/massage/list',//护理列表查询
			selectMassageInfo: wxServer+'/meirong.basic.action/o2o/massage/info',//护理详情

			deleteMassageInfo: wxServer+'/meirong.basic.action/o2o/massage/delete',//删除护理
			copyMassageInfo: wxServer+'/meirong.basic.action/o2o/massage/copy',//复制护理


			unsellMassageCount: wxServer+'/meirong.basic.action/o2o/massage/unsell/count',//查询店铺停售护理数量
			checkMassageName: wxServer+'/meirong.basic.action/o2o/massage/check/name',//验证护理名称是否存在
			checkMassageCode: wxServer+'/meirong.basic.action/o2o/massage/check/code',//验证护理编号是否存在
			addMassage: wxServer+'/meirong.basic.action/o2o/massage/add',//新增护理
			modifyMassage: wxServer+'/meirong.basic.action/o2o/massage/modify',//修改护理
			batchModifyMassage: wxServer+'/meirong.basic.action/o2o/massage/batch/modify',//批量修改护理

			//卡项
			selectCardList: wxServer+'/meirong.basic.action/o2o/card/list',//查询卡项列表
			selectCardInfo: wxServer+'/meirong.basic.action/o2o/card/info',//查询卡项详情
			addCika: wxServer+'/meirong.basic.action/o2o/card/add/cicard',//新增次卡
			addChuzhika: wxServer+'/meirong.basic.action/o2o/card/add/storecard',//新增储值卡
			updateCika: wxServer+'/meirong.basic.action/o2o/card/modify/cicard',//修改次卡
			updateChuzhika: wxServer+'/meirong.basic.action/o2o/card/modify/storecard',//修改储值卡
			batchModify: wxServer+'/meirong.basic.action/o2o/card/batch/modify',//批量修改卡详情
			checkCardName: wxServer+'/meirong.basic.action/o2o/card/check/name',//验证卡类别名是否存在
			cardCopy: wxServer+'/meirong.basic.action/o2o/card/copy',//验证卡类别名是否存在
			cardDelete: wxServer+'/meirong.basic.action/o2o/card/delete',//删除卡项
			modifyCardSellShow: wxServer+'/meirong.basic.action/o2o/card/modify/sell/show',//修改卡项对外和在售状态
			selectUnsellCount: wxServer+'/meirong.basic.action/o2o/card/unsell/count',//查询店铺停售卡项总数

			//产品
			checkedProduceCode: wxServer+'/meirong.basic.action/o2o/{{shopId}}/produce',//查询产品 、检查产品编号、检查产品条码、新增产品、修改产品
			selectProduceType: wxServer+'/meirong.basic.action/o2o/{{shopId}}/produce_type'//查询产品类别

		},
		//产品相关
		product:{

		},
		//财务相关
		finance:{
			reports:wxServer+'/meirong.finance.shop.action/o2o/result/shop/finance/reports',//账务总况--报表
			orders:wxServer+'/meirong.finance.shop.action/o2o/result/shop/finance/orders',//账务总况--订单
			accounts:wxServer+'/meirong.finance.shop.action/o2o/result/shop/finance/accounts',//账务总况-入账汇总信息
			income:wxServer+'/meirong.finance.shop.action/o2o/result/shop/finance/income',//账务总况-收入
			costs:wxServer+'/meirong.finance.shop.action/o2o/result/shop/finance/costs',//账务总况-固定成本及开支
			shopList:wxServer+'/meirong.finance.shop.action/o2o/result/shop/list',//店主入口查询员工业绩提成明细
			paycutList:wxServer+'/meirong.finance.shop.action/o2o/result/paycut/list',//店主入口查询店内所有员工提成列表
			staffList:wxServer+'/meirong.finance.shop.action/o2o/result/staff/list',//员工入口查询业绩提成明细
			staffPaycut:wxServer+'/meirong.finance.shop.action/o2o/result/staff/paycut'//员工入口查询业绩提成明细
		},
		//店铺设置相关
		setting:{
			selectShopGuideList: wxServer+'/meirong.basic.action/o2o/{{shop_id}}/guide'//查询店铺参数设置列表

		}
	};

	window.requestUrl=requestUrl;


})();
$(function(){

	/**
	 * 通用的解密函数
	 * 防止将来要变
	 * 传入字符串 返回json对象
	 */
	function decryptData(content){
		return content ? $.parseJSON($.base64.decode(content,"utf-8")) : null;
	}

	/**
	 * 格式化时间
	 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	 * (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	 */
	 if(!Date.prototype.format){
			Date.prototype.format =function(format){
				var o = {
				"M+" : this.getMonth()+1, //month
				"d+" : this.getDate(), //day
				"h+" : this.getHours(), //hour
				"m+" : this.getMinutes(), //minute
				"s+" : this.getSeconds(), //second
				"q+" : Math.floor((this.getMonth()+3)/3), //quarter
				"S" : this.getMilliseconds() //millisecond
				};
				if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
				(this.getFullYear()+"").substr(4- RegExp.$1.length));
				for(var k in o)if(new RegExp("("+ k +")").test(format))
				format = format.replace(RegExp.$1,
				RegExp.$1.length==1? o[k] :
				("00"+ o[k]).substr((""+ o[k]).length));
				return format;
			};
	 }



	//暂不删除
	window.decryptData=decryptData;






/*	$(document).ajaxSend(function(evt, request, settings){
	   	   var accessToken=getCookie('access_token');

	   	   //设置头部信息

		   if('GET'==settings.type){
			   var url=settings.url;
			   if(url){
				   var parentUrl=url.split("?");
				   var getParam=parentUrl[1];
				   if(getParam && typeof(getParam)==='string'){
					   if(!getParamStr('access_token',getParam)){
						   settings.url=url+'&access_token='+accessToken;
					   }
				   }else{
					   if(!getParamStr('access_token',getParam)){
						   settings.url=url+'?access_token='+accessToken;
					   }
				   }
			   }
		   }else if('POST'==settings.type){
			   	var postParam= settings.data;
			   	if(postParam && typeof(postParam)==='string'){
			   		if(!getParamStr('access_token',postParam)){
			   			settings.data=postParam+'&access_token='+accessToken;
					   }
			   	}else if( typeof(postParam)!=='object'){
			   		settings.data='access_token='+accessToken;
			   	}

		   }else if('PUT'==settings.type){
			   	var postParam= settings.data;
			   	if(postParam && typeof(postParam)==='string'){
			   		if(!getParamStr('access_token',postParam)){
			   			settings.data=postParam+'&access_token='+accessToken;
					   }
			   	}else{
			   		settings.data='access_token='+accessToken;
			   	}
		   }
		}).ajaxError(function(event,request, settings){
		}).ajaxSuccess(function(evt, request, settings){
//			console.log('请求成功：',request,settings.url,settings.data);
		});*/


	/**
	 * 查找str字符串中有没有name这个值
	 */
	 function getParamStr(name,str){
			if(!str){
				 return null;
			}
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		    //substr(1)
		    var result = str.match(reg);
		    if(result != null){
		        return result[2];
		    }else{
		        return null;
		    }
	};


	/**
	 * 获取cookie的值
	 */
	function getCookie(c_name){
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1){
	    c_start=c_start + c_name.length+1;
	    c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) c_end=document.cookie.length;
	    return unescape(document.cookie.substring(c_start,c_end));
	    }
	  }
	 return "";
	}

	function setCookie(c_name,value,expiredays){
		//根目录设置cookie
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie=c_name+ "=" +escape(value)+
		((expiredays==null) ? "" : ";expires="+exdate.toGMTString()+";path=/");
	}

});



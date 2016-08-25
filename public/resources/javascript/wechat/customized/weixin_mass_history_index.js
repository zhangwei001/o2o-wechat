(function(){
//	download_url='http://dev.mljia.cn/cn.mljia.web/download/image/';
	
	var page=location.hash.replace('#!page=', '') || 1;
	var rows=$("#limit").val()||10;//每页多少行
	var userId=store.get("shopIdAndUserId").user_id || "";
	var shopId=store.get("shopIdAndUserId").shop_id || "";
	
	if(!userId){
		window.location.href=wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
	}
	//设置导航
	$("#sendWXInfo").attr("href","/o2o/route/"+ wxGLOBAL.shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));
	
	function initDataFun(page){
		$.get(requestUrl.material.selectMassHistoryList,{
			user_id:userId,
			page:page,
			rows:rows
		},function(resData){
			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));
				
				laytpl($("#containerUlTmpl").html()).render({
					items:items,
					staticImage_Url:wxGLOBAL.staticImageUrl,
					download_url:wxGLOBAL.downloadUrl
				},function(html){
					$("#containerDiv").html(html);
					
					var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : Math.floor(resData.totalCount/rows+1));
					laypage({
					    cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
					    pages: totalPage, //总页数
					    curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
					    hash: 'page', //自定义hash值
					    jump: function(obj,first){
					    	if(!first){
					    		initDataFun(obj.curr);
					    	}
					    }
					});
					
				});
			}
		});
	}
	
	
	
	initDataFun(page);
	
}());
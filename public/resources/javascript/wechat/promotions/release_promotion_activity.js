//微信优惠活动
$(function(){
	//add other entrance
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || $.cookie('access_token');
	globalUtil.entranceFilter(accessToken);

	var shop_id = store.get("shopIdAndUserId").shop_id;//主键
	var page=location.hash.replace('#!page=', '') || 1;
	var rows=$("#limit").val()||10;//每页多少行 5;//
	var layerEndActivity;//结束活动确认框
	var layerDeleteActivity;//删除活动确认框
	var closeInsertLay;//关闭新增活动弹窗提示
	var closeUpdateLay;//关闭新增活动弹窗提示
	var isDeleteItemTempLay;
	

	
	var userId=store.get("shopIdAndUserId").user_id,shopId=store.get("shopIdAndUserId").shop_id;
	
	if(!userId){
		window.location.href=wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
	}	
	
	document.title="微信优惠活动"; 
	// 设置导航
	$("#sendWXInfo").attr("href", "/o2o/route/"+ wxGLOBAL.shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));
	
	/**
	 * 判断当前店铺是否绑定公众号没有则跳到绑定页面
	 */
	$.get(requestUrl.user.appInfo,{
		 shop_id:$("#shop_id").val(),
		 user_id:userId
	},function(data){
		if(data.status==200){
 
		}else if(data.status==25){
			window.location.href= + "/o2o/route/" + wxGLOBAL.shopSid  + "/qrcode-open_pub_succeed?access_token="+store.get("wx_access_token");;
		}
		else{
			console.log("错误信息:"+data.error_message);
		}
	});
	
	selectActivity(page,null,null);//初始化查询
	/**
	 * 根据条件搜索微信优惠活动信息
	 */
	function selectActivity(pages,keyWords,activityState){
		if(!activityState){
			activityState = null;
		}
		if(!keyWords){
			keyWords = null;
		}
		if(!pages){
			pages=1;
		}
		page = pages;
		$.get(requestUrl.activity.selectActivity,{
			 key_words:keyWords,
			 activity_state:activityState,
			 shop_id:shop_id,
			 page:page,
			 rows:rows
		},function(data){
			if(data.status==200){
				var item;
				if(data.content){
					item= JSON.parse($.base64.decode(data.content,"utf8"));
				}else{
					item=[];
				}
				if(item.length<=0 && (pages && pages>1)){
					var pags = pages-1;
					//location.hash.replace(pages, pags); //获取hash值为fenye的当前页
					//$("#pageFenye").find("a[data-page="+pags+"]").click();
					clickSelectActivity(pags);
					return;
				}
				for(var i=0;i<item.length;i++){
					if(item[i].start_time){
						item[i].start_time = new Date(Date.parse(item[i].start_time.replace(/-/g, "/")));
					}
					if(item[i].end_time){
						item[i].end_time = new Date(Date.parse(item[i].end_time.replace(/-/g, "/")));
					}
				}
				laytpl($("#preferentialTemp").html()).render({
          			data:item
          			},function(htm){
          			$("#insertPreferentialTemp").html(htm);
          			var totalPage=(data.totalCount%rows == 0 ?data.totalCount/rows : (data.totalCount/rows+1));
          			if(totalPage>0){
          				laypage({
    					    cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
    					    pages: totalPage, //总页数
    					    curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
    					    hash: 'page', //自定义hash值
    					    jump: function(obj,first){
    					    	if(!first){
    					    		clickSelectActivity(obj.curr);
    					    	}
    					    }
    					});
          			}
					
                });
			}else{
				console.log("错误信息:"+data.error_message);
				layer.msg(data.error_message,2,-1);		
			}
		});
	}
	
	/**
	 * 点击搜索优惠活动
	 */
	function clickSelectActivity(page){
		var keyWords = $("#keyWords").val();//得到关键字
		var activityState = $("#activityState").val();//得到状态
		selectActivity(page,keyWords,activityState);//调用查询活动信息方法
	}
	
	//删除活动弹窗
	function deleteActivity(activity_id){
		laytpl($("#deleteActivityTemp").html()).render({
			activity_id:activity_id
		}, function(html){
			 layerDeleteActivity=window.top.$.layer({
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
	                 html:html
	             },
	             end: function(){
	             }
	         });
		});
	}
	
	//结束活动
	function endActivity(activity_id){
		laytpl($("#endActivityTemp").html()).render({
			activity_id:activity_id
		}, function(html){
			 layerEndActivity=window.top.$.layer({
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
	                 html:html
	             },
	             end: function(){
	             }
	         });
		});
	}
	
	/**
	 * 操作活动
	 * state  操作状态
	 * activity_id  活动ID 1复制活动 2开始活动 3结束活动 4删除活动
	 */
	function operateActivity(state,activity_id){
		$.get(requestUrl.activity.operateActivity,{
			activity_id:activity_id,
			operate_type:state,
			shop_id:shop_id
		},function(data){
			if(data.status==200){
				layer.closeAll();	
				var temp = "";
				if(state==1){
					temp=$("#copySuccessActivityTemp").html();
				}else if(state==4){
					temp=$("#deleteSuccessActivityTemp").html();
				}
				//开始活动不需要弹窗   其他的需要，开始直接刷新页面
				if(state!=2 && state!=3){
					window.top.$.layer({
	                    type: 1,
	                    title: false,
	                    shadeClose: false,
	                    time:2,
	                    area: ['auto', 'auto'],
	                    bgcolor: '',
	                    border: [0], //去掉默认边框
	                    closeBtn: [1, false], //去掉默认关闭按钮
	                    shift: 'top', //从左动画弹出
	                    zIndex:1000,
	                    page: {
	                        html:temp
	                    },
	                    end: function(){
	                    	if(window.initMain){
	            				initMain();
	            				layer.closeAll();
	            			}else{
	            				location.reload();
	            			}
	                    	//clickSelectActivity(page);
	                    }
	                });
				}else{
					if(window.initMain){
        				initMain();
        				layer.closeAll();
        			}else{
        				location.reload();
        			}
					//clickSelectActivity(page);
				}
				console.log("成功");
			}else if(data.status==401){
				//活动时间过期
				laytpl($("#ActivityTimeOver").html()).render({
					activity_id:activity_id
				}, function(html){
					 window.top.$.layer({
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
			                 html:html
			             },
			             end: function(){
			             }
			         });
				});
			}else if(data.status==403){
				//活动信息不完整
				laytpl($("#ActivityInfoIncomplete").html()).render({
					activity_id:activity_id
				}, function(html){
					 window.top.$.layer({
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
			                 html:html
			             },
			             end: function(){
			             }
			         });
				});
			}else{
				console.log("错误信息:"+data.error_message);
			}
		});
	}
	
	
	var img_ids = [];//保存图片ID
	var itemList = [];//已保存的项目
	var items = [];//保存项目集合
	
	/**
	 * 关闭操作弹窗界面
	 */
	function closeOperateActivity(){
		img_ids = [];//保存图片ID
		itemList = [];//已保存的项目
		items = [];//保存项目集合
		layer.closeAll();
	}
	
	/**************************************新增活动*********************************************/
	
	var cards = [];//卡项数据
	var produces = [];//产品数据
	var messages = [];//护理数据
	
	//新增活动
	function insertActivity(activity_id){
		laytpl($("#insertActivityTemp").html()).render({
			staticImage_Url:wxGLOBAL.staticImage_Url
		}, function(html){
			 layerEndActivity=window.top.$.layer({
	             type: 1,
	             title: false,
	             shadeClose: false,
	             area: ['auto', 'auto'],
	             bgcolor: '',
	             border: [0], //去掉默认边框
	             closeBtn: [1, false], //去掉默认关闭按钮
	             shift: 'top', //从左动画弹出
	             zIndex:1000,
	             fix:false,
	             page: {
	                 html:html
	             },
	             end: function(){
	             }
	         });
		});
	}
	
	//上传图片
	$("body").delegate("input[data-id='fileUpload']","click",function(){
		var xhrList=[],
			imgsTotal=0;
		
		 $(this).fileupload({ 
				url:requestUrl.upLoadUrl.upLoadImg, 
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
						layer.msg("不允许同时上传10张以上的图片",2,-1);		
				        return false;
				    }
			        var uploadFile = data.files[0];
//			        if(uploadFile.type !='image/jpeg'){
//			        	 $.layer({
//							    type: 1,
//							    time:2,
//							    title: false,
//							    shadeClose: false,
//							    area: ['auto', 'auto'],
//							    bgcolor: '',
//							    border: [0], //去掉默认边框 
//							    closeBtn: [1, false], //去掉默认关闭按钮
//							    shift: 'left', //从左动画弹出
//							    page: {
//							        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择jpeg格式的图片")
//							    }
//							});
//			        	return false;
//			        }
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
							    time:2,
							    title: false,
							    shadeClose: false,
							    area: ['auto', 'auto'],
							    bgcolor: '',
							    border: [0], //去掉默认边框 
							    closeBtn: [1, false], //去掉默认关闭按钮
							    shift: 'left', //从左动画弹出
							    page: {
							        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择2M以内的图片")
							    }
							});
			   			   return false;
			   		   }
			        };
				},
				done: function (e, data) {
					  var name = data.content;  
						if(data.result.status == 200){
							$("#fileUpload").before('<div class="poi1 xzyhul_picdiv" name="imageCount" style="background-image:url('+wxGLOBAL.download_url+data.result.data.id+')"><p class="poi2 xzyhul_picmenu"><a>修改<input data-id="fileUploadUpdate" data-img-id="'+data.result.data.id+'" type="file" name="files[]" style="position:absolute;left:7px;top:4px;width:24px;height:16px;z-index:999;opacity:0;filter:alpha(opacity=0);overflow: hidden;cursor:pointer;"/></a><span class="line">|</span><a onclick="deleteImg(this,'+data.result.data.id+')">删除</a></p></div>');
							img_ids.push(data.result.data.id);
							//如果已经上传了三张图片就隐藏上传按钮
							var imageCount = $("div[name='imageCount']").length;
							if(imageCount>2){
								$("#fileUpload").hide();
							}
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
	
	//修改上传图片
	$("body").delegate("input[data-id='fileUploadUpdate']","click",function(){
		
		var xhrList=[],
			imgsTotal=0;
		
		 $(this).fileupload({ 
				url:requestUrl.upLoadUrl.upLoadImg, 
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
						layer.msg("不允许同时上传10张以上的图片",2,-1);		
				        return false;
				    }
			        var uploadFile = data.files[0];
//			        if(uploadFile.type !='image/jpeg'){
//			        	 $.layer({
//							    type: 1,
//							    time:2,
//							    title: false,
//							    shadeClose: false,
//							    area: ['auto', 'auto'],
//							    bgcolor: '',
//							    border: [0], //去掉默认边框 
//							    closeBtn: [1, false], //去掉默认关闭按钮
//							    shift: 'left', //从左动画弹出
//							    page: {
//							        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择jpeg格式的图片")
//							    }
//							});
//			        	return false;
//			        }
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
							    time:2,
							    title: false,
							    shadeClose: false,
							    area: ['auto', 'auto'],
							    bgcolor: '',
							    border: [0], //去掉默认边框 
							    closeBtn: [1, false], //去掉默认关闭按钮
							    shift: 'left', //从左动画弹出
							    page: {
							        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择2M以内的图片")
							    }
							});
			   			   return false;
			   		   }
			        };
				},
				done: function (e, data) {
					  var name = data.content;  
						if(data.result.status == 200){
							var img_id = $(this).attr("data-img-id");
							if(img_id){
								for(var i=0;i<img_ids.length;i++){
									if(img_ids[i]==img_id){
										img_ids.splice(i,1,data.result.data.id);
										break;
									}
								}
								
							}
							$(this).parent().parent().parent().replaceWith('<div class="poi1 xzyhul_picdiv" name="imageCount" style="background-image:url('+wxGLOBAL.download_url+data.result.data.id+')"><p class="poi2 xzyhul_picmenu"><a>修改<input data-id="fileUploadUpdate" data-img-id="'+data.result.data.id+'" type="file" name="files[]" style="position:absolute;left:7px;top:4px;width:24px;height:16px;z-index:999;opacity:0;filter:alpha(opacity=0);overflow: hidden;cursor:pointer;"/></a><span class="line">|</span><a onclick="deleteImg(this,'+data.result.data.id+')">删除</a></p></div>');
							
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
	
	//删除当前图片
	function deleteImg(obj,img_id){
		for(var i=0;i<img_ids.length;i++){
			if(img_ids[i]==img_id){
				img_ids.splice(i,1);
				$(obj).parent().parent().remove();
				break;
			}
		}
		var imageCount = $("div[name='imageCount']").length;
		if(imageCount<3){
			$("#fileUpload").show();
		}
	}
	
	//关闭新增弹窗提示
	function closeInsert(){
		
		var describe = $("textarea[name='describe']").val();//活动描述
		var activity_name = $("input[name='activity_name']").val();//活动名称
		var is_draft = 1;//是否草稿 
		var start_time = $("input[name='start_time']").val();//开始时间
		var end_time = $("input[name='end_time']").val();//结束时间
		//img_ids 活动图片ID
		var itemLists = itemList;//itemLists 项目列表
		//存在数据则保存为草稿
		if(describe || activity_name || start_time || end_time || itemLists.length>0 || img_ids.length>0){
			closeInsertLay = window.top.$.layer({
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
	                html:$("#colseInsertTemp").html()
	            },
	            end: function(){
	            }
	        });
		}else{
			closeOperateActivity();
		}
	}
	
	//关闭新增弹窗提示
	function closeInsertLaytip(){
		if(closeInsertLay){
			layer.close(closeInsertLay);
		}
	}
	
	//保存活动信息 status 1正文  2草稿
	function insertActivityfun(status){
		var describe = $("textarea[name='describe']").val();//活动描述
		var activity_name = $("input[name='activity_name']").val();//活动名称
		var is_draft = 1;//是否草稿 
		var start_time = $("input[name='start_time']").val();//开始时间
		var end_time = $("input[name='end_time']").val();//结束时间
		//img_ids 活动图片ID
		var itemLists = [];//itemLists 项目列表
		if(itemList.length>0){
			for(var i=0;i<itemList.length;i++){
				var item = {};
				item.item_id = itemList[i].id;
				item.item_name = itemList[i].name;
				item.item_price = itemList[i].price;
				item.item_type = itemList[i].itemType;//项目类型 0卡项 1产品 2护理
				
				$(".wxthopen_joined_ul").each(function(){
					var type = $(this).attr("data-type");
					var id = $(this).attr("data-id");
					if(id==itemList[i].id && type==itemList[i].itemType){
						item.item_discount = $(this).find("input[name='offPrice']").val();//折扣
						item.pre_price = $(this).find("input[name='discountPrice']").val();//优惠价
						if(status==1){//草稿不需要验证
							if(!item.item_discount){
								layer.msg("项目折扣不能为空",1,-1);
								return ;
							}
							if(!item.pre_price){
								layer.msg("项目优惠价不能为空",1,-1);
								return;
							}
						}
						
					}
				});	
				itemLists.push(item);
			}
		}
		
		//验证开始时间必须大于当前时间
		var date=new Date();
		/*$.ajax({
			url:webRoot+"/"+shopId+"/dialog/getNowTime",
			type:'get',
			async: false,
			success:function(data){
				date=new Date(data.time);
			}});*/
		var bombay = date + (3600000 * 8);
		var time = new Date(bombay);
		
		var str = "" + time.getFullYear() + "-";
		str += (time.getMonth()+1) + "-";
		str += time.getDate()+" ";
		str +=time.getHours()+":"; //获取系统时，
		str +=time.getMinutes()+":"; //分
		str +=time.getSeconds(); //秒
		
		var thisStartTime=start_time+":00";   
		var thisEndTime=end_time+":00";   
		
		if(status==1){
			is_draft=0;
			
			/*****************验证*******************/
			//活动名字非空验证
			if((!activity_name)){
				layer.msg("请输入活动名称",1,-1);
				return;
			}
			//活动名称长度
			if(activity_name.length>10){
				layer.msg("活动名称长度10个字符以内",1,-1);
				return;
			}
			//活动描述
			if(!describe){
				layer.msg("请输入活动描述",1,-1);
				return;
			}
			//活动描述长度
			if(describe.length>300){
				layer.msg("活动描述长度为300字符以内",1,-1);
				return;
			}
			//活动图片
			if(img_ids.length<=0){
				layer.msg("请上传活动图片",1,-1);
				return;
			}
			//验证时间
			if(!start_time){
				layer.msg("请添加活动开始时间",1,-1);
				return;
			}
			
			
			//开始时间不能小于当前时间
//			if(new Date(str)>new Date(thisStartTime)){
//				layer.msg("开始时间不能小于当前时间",1,-1);
//				return;
//			}
			//活动结束时间
			if(!end_time){
				layer.msg("请添加活动结束",1,-1);
				return;
			}
			//结束时间不能小于开始时间
			
			if(new Date(thisStartTime)>new Date(thisEndTime)){
				layer.msg("结束时间不能小于开始时间",1,-1);
				return;
			}
			if(new Date(thisStartTime).getTime()==new Date(thisEndTime).getTime()){
				layer.msg("活动时长为0，请重新选择时间",1,-1);
				return;
			}
			if(new Date(str)>=new Date(thisEndTime)){
				layer.msg("结束时间必须是未来时间",1,-1);
				return;
			}
			//验证项目
			if(itemLists.length<=0){
				layer.msg("请添加活动项目",1,-1);
				return;
			}
			
			for(var i=0;i<itemLists.length;i++){
				if(!itemLists[i].item_discount){
					layer.msg("请输入项目折扣",1,-1);
					return;
				}
				if(!itemLists[i].pre_price){
					layer.msg("请输入项目优惠价",1,-1);
					return;
				}
				
			}
				
		}else{
			is_draft=1;
//			if(start_time){
//				//开始时间不能小于当前时间
//				if(new Date(str)>new Date(thisStartTime)){
//					layer.msg("开始时间不能小于当前时间",1,-1);
//					return;
//				}
//			}
			if(end_time){
				//结束时间不能小于开始时间
				var thisEndTime=end_time+":00";   
				if(new Date(thisStartTime)>new Date(thisEndTime)){
					layer.msg("结束时间不能小于开始时间",1,-1);
					return;
				}
				if(new Date(thisStartTime).getTime()==new Date(thisEndTime).getTime()){
					layer.msg("活动时长为0，请重新选择时间",1,-1);
					return;
				}
				if(new Date(str)>=new Date(thisEndTime)){
					layer.msg("结束时间必须是未来时间",1,-1);
					return;
				}
			}
			if(activity_name){
				if(activity_name.length>10){
					layer.msg("活动名称长度为10字符以内",1,-1);
					return;
				}
			}
			if(describe){
				//活动描述长度
				if(describe.length>300){
					layer.msg("活动描述长度为300字符以内",1,-1);
					return;
				}
			}
		}
		
		//时间后台需要时分秒
		if(start_time){
			start_time+=":00";
		}
		if(end_time){
			end_time+=":00";
		}
		
		$.ajax({
	        url:requestUrl.activity.insertActivity,
	        data:{
				activity_name:activity_name,//活动名称
				describe:describe,//描述
				shop_id:shop_id,
				is_draft:is_draft, //是否草稿 0不是 1是
				start_time:start_time,
				end_time:end_time,
				items:JSON.stringify(itemLists),
				img_ids:JSON.stringify(img_ids)
			},
	        type:'get',
	    	dataType : 'json',
			async : false,
	        success:function(data){
	        	if(data.status==200){
					layer.closeAll();
					window.top.$.layer({
	                    type: 1,
	                    title: false,
	                    shadeClose: false,
	                    time:1,
	                    area: ['auto', 'auto'],
	                    bgcolor: '',
	                    border: [0], //去掉默认边框
	                    closeBtn: [1, false], //去掉默认关闭按钮
	                    shift: 'top', //从左动画弹出
	                    zIndex:1000,
	                    page: {
	                        html:$("#insertActivitySuccessTip").html()
	                    },
	                    end: function(){
	                    	if(window.initMain){
	            				initMain();
	            				layer.closeAll();
	            			}else{
	            				location.reload();
	            			}
	                    }
	                });
				}else{
					console.log("错误信息:"+data.error_message);
				}
	        }
	    });
	}
	
	//如果点击是非下拉框区域则隐藏下拉框
	$(document).bind("click",function(e){
		var target = $(e.target);
		if(target.closest("#isShowHide").length == 0){
			$("#optionItem").hide();
		}
	}) ;
	
	//查询所有护理卡项产品信息
	$("body").delegate("#orderInfo","click",function(){
		orderInfoClick();
	});
	//查询所有护理卡项产品信息
	$("body").delegate("#isShow","change",function(){
		orderInfoClick();
	});
	
//	//活动名称不允许输入空格
//	$("body").delegate("#orderInfo","click",function(){
//		orderInfoClick();
//	});
	
	//验证
//	$("body").delegate("input[name='activity_name']","blur",function(){
//		var length = $(this).val().trim().length;
//		if(!length){
//			layer.msg("请输入活动名称",1,-1);
//			return;
//		}
//		if(length>10){
//			layer.msg("活动名称长度为10字符以内",1,-1);
//			return;
//		}
//	});
	
//	$("body").delegate("textarea[name='describe']","blur",function(){
//		var length = $(this).val().trim().length;
//		if(!length){
//			layer.msg("请输入活动描述",1,-1);
//			return;
//		}
//		if(length>300){
//			layer.msg("活动描述长度为300字符以内",1,-1);
//			return;
//		}
//	});
	
	
	function endDateCallBack(){
		var start_time = $("input[name='start_time']").val();
		if(!start_time){
			layer.msg("请选择开始时间",1,-1);
			$("input[name='end_time']").val("");
			$("#activityTime").hide();
			return;
		}
		var end_time = $("input[name='end_time']").val();
		
		if(!end_time){
			return;
		}
		var start = start_time.replace(/:/g,"");
		var starLength = start_time.length-start.length;
		var thisStartTime=start_time;   
		if(starLength==1){
			thisStartTime+=":00";
		}
		
		var end = end_time.replace(/:/g,"");
		var endLength = end_time.length-end.length;
		var thisEndTime=end_time;   
		if(endLength==1){
			thisEndTime=end_time+":00";  
		}
		
		thisStartTime = new Date(Date.parse(thisStartTime.replace(/-/g, "/")));
		thisEndTime = new Date(Date.parse(thisEndTime.replace(/-/g, "/")));
		//结束时间不能小于开始时间
		if(new Date(thisStartTime)>new Date(thisEndTime)){
			layer.msg("结束时间不能小于开始时间",1,-1);
			$("#activityTime").hide();
			return;
		}
		if(new Date(thisStartTime).getTime()==new Date(thisEndTime).getTime()){
			layer.msg("活动时长为0，请重新选择时间",1,-1);
			$("#activityTime").hide();
			return;
		}
		var time =  new Date(thisEndTime).getTime() - new Date(thisStartTime).getTime() ;
		var data = Math.ceil(time/(24*60*60*1000));
		$("#activityTime").text("活动期时长"+data+"天");
		$("#activityTime").show();
		console.log(data);
	}
	
	//点击下拉框
	function orderInfoClick(){
		var keyWork = $("#orderInfo").val();//查询关键字
		if(keyWork){
			keyWorkSelectItems();//如果存在关键字则根据关键字查询
			return;
		}
		items=[];
		var isShow = $("#isShow").val();
		var itemType=0;//项目类型
		//isShow  0卡项 1护理 2产品
		if(isShow==0){
			itemType=0;
			//查询卡项
			if(!cards.length>0){
				$.ajax({
			        url:requestUrl.shop.getShopAllsellCardLis,
			        data:{shop_sid:wxGLOBAL.shopSid,sell_type:3,page:1,rows:500},
			        type:'get',
			    	dataType : 'json',
					async : false,
					success:function(data){
						if(data.status==200){
							if(data.content){
								cards= JSON.parse($.base64.decode(data.content,"utf8"));
								console.log("cards:",cards);
							} 
						}
			        }
				});
			}
			for(var i=0;i<cards.length;i++){
				var item = {};
				item.type=0;//0未保存 1已保存
				//如果存在已经选择的项目则找到它并改变状态
				if(itemList.length>0){
					for(var j=0;j<itemList.length;j++){
						if(itemList[j].itemType==0 && itemList[j].id==cards[i].card_type_id){
							item.type=1;
							cards[i].type=1;
							break;
						}
					}
				}
				item.id=cards[i].card_type_id;
				item.name=cards[i].card_name;
				item.imgId=cards[i].card_image;
				item.price=cards[i].card_price;
				item.itemType=itemType;//项目类型 0卡项 1产品 2护理
				items.push(item);
			}
		}else if(isShow==1){
			itemType=1;
			//查询护理
			if(!messages.length>0){
				$.ajax({
			        url:requestUrl.shop.getShopAllsellmassageLis,
			        data:{shop_sid:wxGLOBAL.shopSid,is_show:0,if_sell:1,page:1,rows:500},
			        type:'get',
			    	dataType : 'json',
					async : false,
					success:function(data){
						if(data.status==200){
		    				if(data.content){
		    					messages = JSON.parse($.base64.decode(data.content,"utf8"));
		    					console.log("message:",messages);
		    				}
						}
			        }
				});
			}
			for(var i=0;i<messages.length;i++){
				var item = {};
				item.type=0;//0未保存 1已保存
				//如果存在已经选择的项目则找到它并改变状态
				if(itemList.length>0){
					for(var j=0;j<itemList.length;j++){
						if(itemList[j].itemType==1 && itemList[j].id==messages[i].massage_id){
							item.type=1;
							messages[i].type=1;
							break;
						}
					}
				}
				item.id=messages[i].massage_id;
				item.code=messages[i].massage_code;
				item.name=messages[i].massage_name;
				item.imgId=messages[i].massage_img;
				item.price=messages[i].massage_price;
				item.itemType=itemType;//项目类型 0卡项 1产品 2护理
				items.push(item);
			}
		}else if(isShow==2){
			itemType=2;
			//查询产品
			if(!produces.length>0){
				$.ajax({
			        url:requestUrl.shop.getShopAllsellProductLis,
			        data:{shop_sid:wxGLOBAL.shopSid,is_show:0,if_sell:1,page:1,rows:500},
			        type:'get',
			    	dataType : 'json',
					async : false,
					success:function(data){
						if(data.status==200){
		    				if(data.content){
		    					produces = JSON.parse($.base64.decode(data.content,"utf8"));
		    					console.log("products:",produces);
		    				}
						}
			        }
				});
			}
			for(var i=0;i<produces.length;i++){
				var item = {};
				item.type=0;//0未保存 1已保存
				//如果存在已经选择的项目则找到它并改变状态
				if(itemList.length>0){
					for(var j=0;j<itemList.length;j++){
						if(itemList[j].itemType==2 && itemList[j].id==produces[i].main_produce_id){
							item.type=1;
							produces[i].type=1;
							break;
						}
					}
				}
				item.id=produces[i].main_produce_id;
				item.code=produces[i].produce_code;
				item.name=produces[i].produce_name;
				item.imgId=produces[i].produce_image;
				item.price=produces[i].produce_price;
				item.itemType=itemType;//项目类型 0卡项 1产品 2护理
				items.push(item);
			}
			
		}
		
		//插入下拉框模板
		insertOptionTemp(items);
	}
	
	$("body").delegate("#orderInfo","keyup",function(){
		keyWorkSelectItems();
	});
	
	//活动名称
	$("body").delegate("input[name='activity_name']","keyup",function(){
		var activity_name = $(this).val();
		var length = activity_name.length;
		if(length>10){
			$(this).next().text("已超出"+(length-10)+"个字符");
			$(this).next().addClass("txtred");
		}else{
			$(this).next().text("10个字符以内");
			$(this).next().removeClass("txtred");
		}
	});
	//活动描述
	$("body").delegate("textarea[name='describe']","keyup",function(){
		var txtLength =$(this).val().length;
		txtLength =$(this).val().length;
		$(this).next().removeClass("txtred");
		if(txtLength<290){
			$("span[data-describe='true']").html("当前已输入<span class='txtpink'>"+txtLength+"</span>个字");
		}else if(txtLength>=290 && txtLength<=300){
			$("span[data-describe='true']").html("还可输入<span class='txtpink'>"+(300-txtLength)+"</span>个字");
		}else{
			$("span[data-describe='true']").html("已超出"+(txtLength-300)+"个字符");
			$(this).next().addClass("txtred");
		}
		
	});

	
	//根据关键字查询
	function keyWorkSelectItems(){
		var keyWork = $("#orderInfo").val();//查询关键字
		if(!keyWork){
			return;
		}
		var type = $("#isShow").val();//查询的类型  卡项没有code字段
		items = [];
		var showItem = [];
		if(type==0){
			for(var i=0;i<cards.length;i++){
				var item = {};
				item.type=0;//0未保存 1已保存
				//如果存在已经选择的项目则找到它并改变状态
				if(itemList.length>0){
					for(var j=0;j<itemList.length;j++){
						if(itemList[j].itemType==1 && itemList[j].id==cards[i].card_Type_Id){
							item.type=1;
							cards[i].type=1;
							break;
						}
					}
				}
				item.id=cards[i].card_Type_Id;
				item.name=cards[i].card_name;
				item.imgId=cards[i].card_image;
				item.price=cards[i].card_price;
				item.itemType=0;//项目类型 0卡项 1产品 2护理
				items.push(item);
			}
			//卡项没有code
			for(var i=0;i<items.length;i++){
				if(items[i].name.indexOf(keyWork)>-1){
					showItem.push(items[i]);
				}
			}
		}else{
			if(type==1){
				for(var i=0;i<messages.length;i++){
					var item = {};
					item.type=0;//0未保存 1已保存
					//如果存在已经选择的项目则找到它并改变状态
					if(itemList.length>0){
						for(var j=0;j<itemList.length;j++){
							if(itemList[j].itemType==1 && itemList[j].id==messages[i].id){
								item.type=1;
								messages[i].type=1;
								break;
							}
						}
					}
					item.id=messages[i].massage_id;
					item.code=messages[i].massage_code;
					item.name=messages[i].massage_name;
					item.imgId=messages[i].massage_img;
					item.price=messages[i].massage_price;
					item.itemType=2;//项目类型 0卡项 1产品 2护理
					items.push(item);
				}
				
			}else if(type==2){
				for(var i=0;i<produces.length;i++){
					var item = {};
					item.type=0;//0未保存 1已保存
					//如果存在已经选择的项目则找到它并改变状态
					if(itemList.length>0){
						for(var j=0;j<itemList.length;j++){
							if(itemList[j].itemType==2 && itemList[j].id==produces[i].id){
								item.type=1;
								produces[i].type=1;
								break;
							}
						}
					}
					item.id=produces[i].mainProduceId;
					item.code=produces[i].produceCode;
					item.name=produces[i].produceName;
					item.imgId=produces[i].produceImages;
					item.price=produces[i].producePrice;
					item.itemType=1;//项目类型 0卡项 1产品 2护理
					items.push(item);
				}
			}
			//根据关键字从缓存中查询需要的数据
			//显示根据名字查找
			for(var i=0;i<items.length;i++){
				if(items[i].name.indexOf(keyWork)>-1){
					showItem.push(items[i]);
				}
			}
			for(var i=0;i<items.length;i++){
				if(items[i].code.indexOf(keyWork)>-1){
					showItem.push(items[i]);
				}
			}
		}
		insertOptionTemp(showItem);
	}
	
	//插入下拉框模板
	function insertOptionTemp(showItem){
		//使用公共变量item给页面赋值
		laytpl($("#optionItemTemp").html()).render({
  			items:showItem,//项目信息
  			download_url:wxGLOBAL.download_url
  		},function(htm){
			$("#optionItem").html(htm).show();
//			if(showItem.length>0){
//				$("#optionItem").show();
//			}else{
//				$("#optionItem").hide();
//			}
			//数据三个以上则显示滚动条
  			if(showItem.length>3){
  				$("#optionItem").addClass("overflow_y_s");
  			}else{
  				$("#optionItem").removeClass("overflow_y_s");
  			}
  		});
	}
	
	//活动加入项目
	function joinActivitie(type,id){
		if(itemList.length>3){
			//活动项目加入的上限为4个
			window.top.$.layer({
                type: 1,
                title: false,
                shadeClose: false,
                time:2,
                area: ['auto', 'auto'],
                bgcolor: '',
                border: [0], //去掉默认边框
                closeBtn: [1, false], //去掉默认关闭按钮
                shift: 'top', //从左动画弹出
                zIndex:1000,
                page: {
                    html:$("#joinFailTemp").html()
                },
                end: function(){
                }
            });
			return;
		}
		
		for(var i=0;i<items.length;i++){
			if(items[i].id==id){
				itemList.push(items[i]);
				window.top.$.layer({
                    type: 1,
                    title: false,
                    shadeClose: false,
                    time:1,
                    area: ['auto', 'auto'],
                    bgcolor: '',
                    border: [0], //去掉默认边框
                    closeBtn: [1, false], //去掉默认关闭按钮
                    shift: 'top', //从左动画弹出
                    zIndex:1000,
                    page: {
                        html:$("#insertItemSuccessTip").html()
                    },
                    end: function(){
                    }
                });
				$("#optionItem").hide();
				laytpl($("#successItemTemp").html()).render({
          			items:items[i],//项目信息
          			download_url:wxGLOBAL.download_url,
          		},function(htm){
        			$("#endBtnTemp").before(htm);
          		});
				return;
			}
		}
		
	}
	//确认是否删除项目弹窗
	function isDeleteItem(type,id){
		laytpl($("#isDeleteTemp").html()).render({
			type:type,//项目信息
			id:id
  		},function(htm){
  			isDeleteItemTempLay = window.top.$.layer({
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
                    html:htm
                },
                end: function(){
                }
            });
  		});
	}
	
	//关闭确认删除项目提示
	function closeIsDeleteItemTempLay(){
		layer.close(isDeleteItemTempLay);
	}
	
	//活动取消项目加入
	function cancelItemActivitie(flag,type,id){
		var htmTemp = $("#cancelItemSuccessTip").html();
		if(Number(flag)){
			htmTemp = $("#deleteSuccessActivityTemp").html();
		}
		for(var i=0;i<itemList.length;i++){
			if(itemList[i].id==id){
				$(".wxthopen_joined_ul").each(function(){
					var type = $(this).attr("data-type");
					var id = $(this).attr("data-id");
					if(id==itemList[i].id && type==itemList[i].itemType){
						itemList.splice(i, 1);
						$(this).remove();
						window.top.$.layer({
		                    type: 1,
		                    title: false,
		                    shadeClose: false,
		                    time:1,
		                    area: ['auto', 'auto'],
		                    bgcolor: '',
		                    border: [0], //去掉默认边框
		                    closeBtn: [1, false], //去掉默认关闭按钮
		                    shift: 'top', //从左动画弹出
		                    zIndex:1000,
		                    page: {
		                        html:htmTemp
		                    },
		                    end: function(){
		                    }
		                });
						$("#optionItem").hide();
						layer.close(isDeleteItemTempLay);
						return false;
					}
				});
				return false ;
			}
		}
	}
	
	//验证项目折扣
	$("body").delegate("input[name='offPrice']","blur",function(){
		
		 //先把非数字的都替换掉，除了数字和.
	    $(this).val($(this).val().replace(/[^\d.]/g, ""));
	    //必须保证第一个为数字而不是.
	    $(this).val($(this).val().replace(/^\./g, ""));
	    //保证只有出现一个.而没有多个.
	    $(this).val($(this).val().replace(/\.{2,}/g, "."));
	    //保证.只出现一次，而不能出现两次以上
	    $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
	    //只能输入2位小数
	    $(this).val($(this).val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')); //只能输入两个小数
		
		var offPrice = $(this).val();
		var price = $(this).parent().parent().prev().find("input[name='price']").val();
		if(!offPrice){
			return;
		}
		if(offPrice<=0){
			$(this).val(10);
			offPrice=10;
		}
		if(offPrice>10){
			$(this).val(10);
			offPrice=10;
		}
		var discountPrice = Number(price*(offPrice/10)).toFixed(2);//计算优惠价
		if(discountPrice==0){
			discountPrice = 0.01;
		}
		$(this).parent().parent().next().find("input[name='discountPrice']").val(discountPrice);
		var $amountInput = $(this);
	    //最后一位是小数点的话，移除
	    $amountInput.val(($amountInput.val().replace(/\.$/g, "")));
	    
	    $(this).parent().parent().parent().find("input").attr("readonly",true);
	});
	
	$("body").delegate("input[name='offPrice']","click",function(){
		if($(this).attr("readonly")){
			$(this).attr("readonly",false);
		}
	});
	
	$("body").delegate("input[name='offPrice']","keyup", function (event) {
		
		 //先把非数字的都替换掉，除了数字和.
	    $(this).val($(this).val().replace(/[^\d.]/g, ""));
	    //必须保证第一个为数字而不是.
	    $(this).val($(this).val().replace(/^\./g, ""));
	    //保证只有出现一个.而没有多个.
	    $(this).val($(this).val().replace(/\.{2,}/g, "."));
	    //保证.只出现一次，而不能出现两次以上
	    $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
	    //只能输入2位小数
	    $(this).val($(this).val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')); //只能输入两个小数	            
	});
	
	//验证项目优惠价
	$("body").delegate("input[name='discountPrice']","blur",function(){
		
		//先把非数字的都替换掉，除了数字和.
	    $(this).val($(this).val().replace(/[^\d.]/g, ""));
	    //必须保证第一个为数字而不是.
	    $(this).val($(this).val().replace(/^\./g, ""));
	    //保证只有出现一个.而没有多个.
	    $(this).val($(this).val().replace(/\.{2,}/g, "."));
	    //保证.只出现一次，而不能出现两次以上
	    $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
	    //只能输入2位小数
	    $(this).val($(this).val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')); //只能输入两个小数
	    
		var discountPrice = $(this).val();
		var price = $(this).parent().parent().prev().prev().find("input[name='price']").val();
		if(!discountPrice){
			return;
		}
		if(discountPrice<=0){
			$(this).val(price);
			discountPrice=price;
		}
		if(Number(Number(discountPrice).toFixed(2))>Number(Number(price).toFixed(2))){
			$(this).val(price);
			discountPrice=price;
		}
		
		var offPrice = Number((discountPrice/price)*10).toFixed(2);//计算优惠价
		$(this).parent().parent().prev().find("input[name='offPrice']").val(offPrice);
		$(this).parent().parent().parent().find("input").attr("readonly",true);
	});
	
	$("body").delegate("input[name='discountPrice']","click",function(){
		if($(this).attr("readonly")){
			$(this).attr("readonly",false);
		}
	});
	
	$("body").delegate("input[name='discountPrice']","keyup", function (event) {
		 //先把非数字的都替换掉，除了数字和.
	    $(this).val($(this).val().replace(/[^\d.]/g, ""));
	    //必须保证第一个为数字而不是.
	    $(this).val($(this).val().replace(/^\./g, ""));
	    //保证只有出现一个.而没有多个.
	    $(this).val($(this).val().replace(/\.{2,}/g, "."));
	    //保证.只出现一次，而不能出现两次以上
	    $(this).val($(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
	    //只能输入2位小数
	    $(this).val($(this).val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')); //只能输入两个小数
	            
	});
	
	//////////////////////////////************************修改活动******************************///////////////////////
	//进入修改模板
	//活动状态 0草稿 1未开始
	function updateActivityTemp(status,id){
		layer.closeAll();
		$.ajax({
	        url:requestUrl.activity.activityInfo,
	        data:{
	        	shop_id:shop_id,
	        	activity_id:id
	        },
	        type:'get',
	    	dataType : 'json',
			async : false,
			success:function(data){
				if(data.status==200 && data.content){
					var item= JSON.parse($.base64.decode(data.content,"utf8"));
					if(item.start_time && item.end_time && item.start_time.indexOf(" ")>0 && item.end_time.indexOf(" ")>0){
						
						
						var date=new Date();
						/*$.ajax({
							url:webRoot+"/"+shopId+"/dialog/getNowTime",
							type:'get',
							async: false,
							success:function(data){
								date=new Date(data.time);
							}});*/
						var bombay = date + (3600000 * 8);
						var time = new Date(bombay);
						
						var str = "" + time.getFullYear() + "-";
						str += (time.getMonth()+1) + "-";
						str += time.getDate()+" ";
						str +=time.getHours()+":"; //获取系统时，
						str +=time.getMinutes()+":"; //分
						str +=time.getSeconds(); //秒
						
						var thisStartTime = item.start_time;
						var thisEndTime = item.end_time;
//						//开始时间小于当前时间则默认为空
//						if(new Date(str)>new Date(thisStartTime)){
//							item.start_time="";
//						}
//						//开始时间小于当前时间则默认为空
//						if(new Date(str)>new Date(thisEndTime)){
//							item.end_time="";
//						}
					}
					itemList = [];
					for(var i=0;i<item.items.length;i++){
						var itm = {};
						itm.id = item.items[i].item_id;
						itm.name = item.items[i].item_name;
						itm.price = item.items[i].item_price;
						itm.itemType = item.items[i].item_type;//项目类型 0卡项 1产品 2护理
						itm.item_discount = item.items[i].item_discount;//折扣
						itm.pre_price = item.items[i].pre_price;//优惠价
						itemList.push(itm);
					}
					img_ids = [];
					for(var i=0;i<item.img_ids.length;i++){
						img_ids.push(item.img_ids[i]);
					}
							
					laytpl($("#updateActivityTemp").html()).render({
						data:item,
						staticImage_Url:staticImage_Url,
						download_url:wxGLOBAL.download_url
					}, function(html){
						 window.top.$.layer({
				             type: 1,
				             title: false,
				             shadeClose: false,
				             area: ['auto', 'auto'],
				             bgcolor: '',
				             border: [0], //去掉默认边框
				             closeBtn: [1, false], //去掉默认关闭按钮
				             shift: 'top', //从左动画弹出
				             zIndex:1000,
				             fix:false,
				             page: {
				                 html:html
				             },
				             end: function(){
				             }
				         });
					});
				}else{
					console.log(data.msg);
					layer.msg(data.msg,2,-1);		
				} 
	        }
		});
	}
	
	//关闭修改弹窗提示
	function closeUpdate(status){
		
		laytpl($("#noUpdateSuccessTip").html()).render({
			status:status
		}, function(html){
			closeUpdateLay = window.top.$.layer({
	             type: 1,
	             title: false,
	             shadeClose: false,
	             area: ['auto', 'auto'],
	             bgcolor: '',
	             border: [0], //去掉默认边框
	             closeBtn: [1, false], //去掉默认关闭按钮
	             shift: 'top', //从左动画弹出
	             zIndex:1000,
	             fix:false,
	             page: {
	                 html:html
	             },
	             end: function(){
	             }
	         });
		});
		
	}
	//关闭关闭修改确认弹窗
	function closeUpdateLayFun(){
		layer.close(closeUpdateLay);
	}
	
	//修改活动信息 status 1正文  0草稿
	//url 0未完成过来   1完成过来需要验证
	function updateActivityfun(url,status){
		var describe = $("textarea[name='describe']").val();//活动描述
		var activity_name = $("input[name='activity_name']").val();//活动名称
		var activity_id = $("input[name='activity_id']").val();//活动名称
		var start_time = $("input[name='start_time']").val();//开始时间
		var end_time = $("input[name='end_time']").val();//结束时间
		//img_ids 活动图片ID
		var itemLists = [];//itemLists 项目列表
		if(itemList.length>0){
			for(var i=0;i<itemList.length;i++){
				var item = {};
				item.item_id = itemList[i].id;
				item.item_name = itemList[i].name;
				item.item_price = itemList[i].price;
				item.item_type = itemList[i].itemType;//项目类型 0卡项 1产品 2护理
				
				$(".wxthopen_joined_ul").each(function(){
					var type = $(this).attr("data-type");
					var id = $(this).attr("data-id");
					if(id==itemList[i].id && type==itemList[i].itemType){
						item.item_discount = $(this).find("input[name='offPrice']").val();//折扣
						item.pre_price = $(this).find("input[name='discountPrice']").val();//优惠价
						if(status==1){
							if(!item.item_discount){
								layer.msg("项目折扣不能为空",1,-1);
								return;
							}
							if(!item.pre_price){
								layer.msg("项目优惠价不能为空",1,-1);
								return;
							}
						}
					}
				});	
				itemLists.push(item);
			}
		}
		
		//验证开始时间必须大于当前时间
		var date=new Date();
		/*$.ajax({
			url:webRoot+"/"+shopId+"/dialog/getNowTime",
			type:'get',
			async: false,
			success:function(data){
				date=new Date(data.time);
			}});*/
		var bombay = date + (3600000 * 8);
		var time = new Date(bombay);
		
		var str = "" + time.getFullYear() + "-";
		str += (time.getMonth()+1) + "-";
		str += time.getDate();
		str += " 00:00:00";
		
		var start = start_time.replace(/:/g,"");
		var starLength = start_time.length-start.length;
		var thisStartTime=start_time;   
		if(starLength==1){
			start_time+=":00";
			thisStartTime+=":00";
		}
		var end = end_time.replace(/:/g,"");
		var endLength = end_time.length-end.length;
		var thisEndTime=end_time;   
		if(endLength==1){
			thisEndTime=end_time+":00";  
			end_time=end_time+":00";  
		}
		
		if(url==1){
			
			/*****************验证*******************/
			//活动名字非空验证
			if((!activity_name)){
				layer.msg("请输入活动名称",1,-1);
				return;
			}
			//活动名称长度
			if(activity_name.length>10){
				layer.msg("活动名称长度为10字符以内",1,-1);
				return;
			}
			//活动描述
			if(!describe){
				layer.msg("请输入活动描述",1,-1);
				return;
			}
			//活动描述长度
			if(describe.length>300){
				layer.msg("活动描述长度为300字符以内",1,-1);
				return;
			}
			//活动图片
			if(img_ids.length<=0){
				layer.msg("请上传活动图片",1,-1);
				return;
			}
			//验证时间
			if(!start_time){
				layer.msg("请添加活动开始时间",1,-1);
				return;
			}
			
			//开始时间不能小于当前时间
//			if(new Date(str)>new Date(thisStartTime)){
//				layer.msg("开始时间不能小于当前时间",1,-1);
//				return;
//			}
			//活动结束时间
			if(!end_time){
				layer.msg("请添加活动结束时间",1,-1);
				return;
			}
			//结束时间不能小于开始时间
			if(new Date(thisStartTime)>new Date(thisEndTime)){
				layer.msg("结束时间不能小于开始时间",1,-1);
				return;
			}
			if(new Date(thisStartTime).getTime()==new Date(thisEndTime).getTime()){
				layer.msg("活动时长为0，请重新选择时间",1,-1);
				return;
			}
			if(new Date(str)>=new Date(thisEndTime)){
				layer.msg("结束时间必须是未来时间",1,-1);
				return;
			}
			//验证项目
			if(itemLists.length<=0){
				layer.msg("请添加活动项目",1,-1);
				return;
			}
			for(var i=0;i<itemLists.length;i++){
				if(!itemLists[i].item_discount){
					layer.msg("请输入项目折扣",1,-1);
					return;
				}
				if(!itemLists[i].pre_price){
					layer.msg("请输入项目优惠价",1,-1);
					return;
				}
				
			}
			
			status=0;
		}else{
//			if(start_time){
//				//开始时间不能小于当前时间
//				if(new Date(str)>new Date(thisStartTime)){
//					layer.msg("开始时间不能小于当前时间",1,-1);
//					return;
//				}
//			}
			if(end_time){
				//结束时间不能小于开始时间
				var thisEndTime=end_time+":00";   
				if(new Date(thisStartTime)>new Date(thisEndTime)){
					layer.msg("结束时间不能小于开始时间",1,-1);
					return;
				}
				if(new Date(thisStartTime).getTime()==new Date(thisEndTime).getTime()){
					layer.msg("活动时长为0，请重新选择时间",1,-1);
					return;
				}
				if(new Date(str)>new Date(thisEndTime)){
					layer.msg("结束时间必须是未来时间",1,-1);
					return;
				}
			}
			if(activity_name){
				if(activity_name.length>10){
					layer.msg("活动名称长度为10字符以内",1,-1);
					return;
				}
			}
			if(describe){
				//活动描述长度
				if(describe.length>300){
					layer.msg("活动名称长度为300字符以内",1,-1);
					return;
				}
			}
			//如果数据完整则状态改变为未开始
			var bool = true;
			//如果项目存在则验证项目内容是否完整
			if(itemLists.length>0){
				for(var i=0;i<itemLists.length;i++){
					if(!itemLists[i].item_discount || !itemLists[i].pre_price){
						bool = false;
						break;
					}
				}
			}
			if(activity_name && describe && img_ids.length>0 && start_time && end_time && bool){
				status=0;
			}else{
				status=1;
			}
		}
		
		//时间后台需要时分秒
//		if(start_time){
//			start_time+=":00";
//		}
//		if(end_time){
//			end_time+=":00";
//		}
		
		$.ajax({
	        url:requestUrl.activity.updateActivity,
	        data:{
	        	activity_id:activity_id,
				activity_name:activity_name,//活动名称
				describe:describe,//描述
				shop_id:shop_id,
				is_draft:status, //是否草稿 0不是 1是
				start_time:start_time,
				end_time:end_time,
				items:JSON.stringify(itemLists),
				img_ids:JSON.stringify(img_ids)
			},
	        type:'get',
	    	dataType : 'json',
			//async : false,
	        success:function(data){
	        	if(data.status==200){
					layer.closeAll();
					window.top.$.layer({
	                    type: 1,
	                    title: false,
	                    shadeClose: false,
	                    time:1,
	                    area: ['auto', 'auto'],
	                    bgcolor: '',
	                    border: [0], //去掉默认边框
	                    closeBtn: [1, false], //去掉默认关闭按钮
	                    shift: 'top', //从左动画弹出
	                    zIndex:1000,
	                    page: {
	                        html:$("#updateActivitySuccessTip").html()
	                    },
	                    end: function(){
	                    	if(window.initMain){
	            				initMain();
	            				layer.closeAll();
	            			}else{
	            				location.reload();
	            			}
	                    }
	                });
				}else{
					console.log("错误信息:"+data.error_message);
				}
	        }
	    });
	}
	
	
	///////////////////////////************微信店铺活动预览************/////////////////////////////////
	function shopActivityShow(activity_id){
		$.ajax({
	        url:requestUrl.activity.previewActivity,
	        data:{
	        	activity_id:activity_id,
	        	shop_id:shop_id
			},
	        type:'post',
	    	dataType : 'json',
			async : false,
	        success:function(data){
	        	if(data.status == 200 && data.content){
	        	 	var data= JSON.parse($.base64.decode(data.content,"utf-8"));
		        	laytpl($("#weixinActivityShow").html()).render({
		        		serviceAddr:data.service_addr,
		        		joinDimCodeUrl:data.join_dim_code_url
					}, function(html){
						 window.top.$.layer({
				             type: 1,
				             title: false,
				             shadeClose: false,
				             area: ['auto', 'auto'],
				             bgcolor: '',
				             border: [0], //去掉默认边框
				             closeBtn: [1, false], //去掉默认关闭按钮
				             shift: 'top', //从左动画弹出
				             zIndex:1000,
				             fix:false,
				             page: {
				                 html:html
				             },
				             end: function(){
				             }
				         });
					});
	        	}
	        }
	    });
	}
	
	
	window.clickSelectActivity=clickSelectActivity;
	window.deleteActivity=deleteActivity;
	window.endActivity=endActivity;
	window.insertActivity=insertActivity;
	window.deleteImg=deleteImg;
	window.operateActivity=operateActivity;
	window.closeOperateActivity=closeOperateActivity;
	window.closeInsert=closeInsert;
	window.closeInsertLaytip=closeInsertLaytip;
	window.insertActivityfun=insertActivityfun;
	window.keyWorkSelectItems=keyWorkSelectItems;
	window.joinActivitie=joinActivitie;
	window.cancelItemActivitie=cancelItemActivitie;
	window.isDeleteItem=isDeleteItem;
	window.closeIsDeleteItemTempLay=closeIsDeleteItemTempLay;
	window.updateActivityTemp=updateActivityTemp;
	window.updateActivityfun=updateActivityfun;
	window.closeUpdate=closeUpdate;
	window.closeUpdateLayFun=closeUpdateLayFun;
	window.shopActivityShow=shopActivityShow;
	window.orderInfoClick=orderInfoClick;
	window.endDateCallBack=endDateCallBack;
});




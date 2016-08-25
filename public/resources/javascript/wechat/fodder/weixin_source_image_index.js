
$(function(){
	//add other entrance
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || $.cookie('access_token');
	globalUtil.entranceFilter(accessToken);

	var page=location.hash.replace('#!page=', '') || 1;
	var rows=$("#limit").val()||10;//每页多少行
	var userId=store.get("shopIdAndUserId").user_id || "";
    var shopId=store.get("shopIdAndUserId").shop_id || "";
	/*if(!userId){
		window.location.href=webRoot+"/"+shopId;
	}*/
//	download_url='http://dev.mljia.cn/cn.mljia.web/download/image/';
//	upload_url='http://dev.mljia.cn/cn.mljia.web/upload/image';
	/*********************获取图片列表***************************/
		//设置导航
	$("#sendWXInfo").attr("href", "/o2o/route/"+ wxGLOBAL.shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));

	function initData(page){
		$.get(requestUrl.material.selectMaterial,{
			user_id:userId,
			type:1,
			is_sync:0,
			page:page,
			rows:rows
		},function(resData){
			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));
				var htm='';
					for (var i = 0; i < items.length; i++) {
						var item=items[i];
					 	var htms=['<li class="wxsctpk_li">',
						          '<p class="a1" style="background-image: url('+wxGLOBAL.download_url+item.file_id+');"></p>',
						          '<p class="a2"><span class="fl"><input name="" type="checkbox" value="'+item.id+'"data-code="'+item.check_code+'"/ ></span>',
						          '<span class="fr"><a data-del="true" data-id="'+item.id+'"data-code="'+item.check_code+'"><img src="'+wxGLOBAL.staticImage_Url+'/mljia/wxsucaizw_icon02.gif" width="15" height="19"></a></span></p>',
						          '</li>'];
					 	
					    htms=htms.join("");
					    htm=htm+htms;
					}
					
					$("#containerUl").html(htm);
					
					var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : Math.floor(resData.totalCount/rows+1));
					laypage({
					    cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
					    pages: totalPage, //总页数
					    curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
					    hash: 'page', //自定义hash值
					    jump: function(obj,first){
					    	if(!first){
					    		initData(obj.curr);
					    	}
					    }
					});
				       			
			}else{
				console.log("错误信息：获取数据异常");
				$("#emptyTipsDiv").show();
				
				if(resData.status==37){
					//未认证提示
					$("#tipsDiv").show();
					$("#emptyTipsDiv").hide();
				}
			}
			
		});
		
	}
	
	initData(page);

	
	/************************批量删除***************************/
	$("#batchDel").on("click",function(){
		var delIds=[],delCodes=[],objs=[];
		$("#containerUl input[type='checkbox']").each(function(){
			if($(this).is(":checked")){
				delIds.push($(this).val());
				delCodes.push($(this).attr("data-code"));
				objs.push($(this).parent().parent().parent());
			}
		});
		if(delIds.length==0){
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
				        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请至少选择一张图片！")
				    }
				});
			return;
		}
		
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
	
	
	function confrimDelFun(){
		layer.closeAll();
		
		var delIds=[],delCodes=[],objs=[];
		$("#containerUl input[type='checkbox']").each(function(){
			if($(this).is(":checked")){
				delIds.push($(this).val());
				delCodes.push($(this).attr("data-code"));
				objs.push($(this).parent().parent().parent());
			}
		});
		if(delIds.length==0){
			
			return;
		}
		$.post(requestUrl.material.delMaterial,{
			user_id : userId,
			ids : delIds.join(","),
			check_codes : delCodes.join(",")
		},function(resData){
			if(resData.status==200){
				for(var i=0;i<objs.length;i++){
					objs[i].remove();
				}
			}else{
				
			}
		});
		
	}
	
	window.confrimDelFun=confrimDelFun;
	
	
	$("#containerUl").delegate("a[data-del='true']","click",function(){
		
		var obj=this;
		
		$.post(requestUrl.material.delMaterial,{
			user_id : userId,
			ids : $(obj).attr("data-id"),
			check_codes : $(obj).attr("data-code")
		},function(resData){
			if(resData.status==200){
				$(obj).parent().parent().parent().remove();
			}else{
				console.log(resData);
			}
		});
	});
	
	/********************批量上传图片*****************************/
	var xhrList=[],
		fileSize=0,
		imgsTotal=0;
	
	 $('#fileUpload').fileupload({ 
			url:requestUrl.upLoadUrl.upLoadImg, 
			type:'post',
			formData : {
				sysid : '3',
				gen_thumb : true,
				water_mark:true,
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
				$("#progressBar").show();
				if (imgsTotal > 10) {
					imgsTotal--;
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
		        	fileSize=fileSize+Math.floor(uploadFile.size/1024);
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
						        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择2M以内的图片！")
						    }
						});
		   			   return false;
		   		   }
		           
		       	var htms=['<li class="wxsctpk_li" id="'+name+'">',
				          '<p class="a1"><img src="'+e.target.result+'" width="204" height="135"></p>',
				          '</li>'];
		       	
			       			htms=htms.join("");
				        	$('#containerUl').prepend(htms);
		        };
		        
			},
			done: function (e, data) {
				  var name = data.content;  
					if(data.result.status == 200){
						$("#emptyTipsDiv").hide();
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
									
									var htms=['<p class="a2"><span class="fl"><input type="checkbox" value="'+item.id+'"data-code="'+item.check_code+'"></span>',
									          '<span class="fr"><a data-del="true" data-id="'+item.id+'"data-code="'+item.check_code+'"><img src="'+wxGLOBAL.staticImage_Url+'/mljia/wxsucaizw_icon02.gif" width="15" height="19"></a></span></p>',
									          ];
									htms=htms.join("");
									$("#"+name).append(htms);
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
		    $("#progressBar span:first").attr("style","width: "+progress+"%;");
		    $("#progressBar span:last").text(progress+"%");
		    $("#progressBar p:last").text("共"+imgsTotal+"张（"+fileSize+"k），已有"+imgsTotal+"张成功上传");
		    
		    if(progress==100){
		    	fileSize=0;
	    		imgsTotal=0;
	    		xhrList=[];
	    		setTimeout(function(){
	    			$("#progressBar").hide();
	    		},1000);
		    }
		});
	
});

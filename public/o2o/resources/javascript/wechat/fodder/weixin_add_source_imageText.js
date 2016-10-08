$(function(){

//add other entrance
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || $.cookie('access_token');
	globalUtil.entranceFilter(accessToken);



	var userId=store.get("shopIdAndUserId").user_id;

	document.title="新建图文消息";

	var colseWindow=0;

//临时参数
	var paramArrs=[];

	function _delparamArrsFun(uuid){
		for(var i=0;i<paramArrs.length;i++){
			if(paramArrs[i].uuid==uuid){
				paramArrs.splice(i,1);
				break;
			}
		}
	}

	function _getParamArrsFun(uuid){
		for(var i=0;i<paramArrs.length;i++){
			if(paramArrs[i].uuid==uuid){
				return paramArrs[i];
			}
		}
		return null;
	}

	function _updateParamArrsFun(uuid,obj){
		for(var i=0;i<paramArrs.length;i++){
			if(paramArrs[i].uuid==uuid){
				for(var attr in obj){
					paramArrs[i][attr]=obj[attr];
				}

				return paramArrs[i];
			}
		}
		return null;
	}



// 自定义插件 #1
	KindEditor.lang({
		image2 : '上传图片'
	});
	var image2Obj={};
	KindEditor.plugin('image2', function(K) {
		var self = this, name = 'image2';
		image2Obj=self;
		self.clickToolbar(name, function() {
			artUploadImageFun();
		});
	});

	var editor,kind;
	KindEditor.ready(function(K) {
		kind=K;
		editor = K.create('textarea[name="content"]', {
			width : '100%',
			height : '330px;',
			items : [
				'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
				'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
				'insertunorderedlist', 'hr','|', 'image2','fullscreen']
		});

		initData(kind);
		setInterval(function(){
			if (!editor.isEmpty()) {
				$("textarea[name='content']").next().remove();
			}
		},1500);
	});

//清空编辑中的内容
	function _clearEditorFun(){
		$('input[name="coverTitle"]').val('');//标题
		$('input[name="author"]').val('');//作者
		$('textarea[name="summary"]').val('');//摘要
		$(".icon-upimgbut").attr("data-file-id","");//封面图片ID
		$("#summaryNumber").text(120);
		$('input[name="showCover"]').removeAttr("checked");//正文显示
		$('input[name="contentSourceUrl"]').val('');//原文链接
		$(".icon-upimgbut").attr("style","background-image:url("+wxGLOBAL.staticImage_Url+"/mljia/picupload_r4_c4.gif)");
		editor.html('');//编辑器中的内容
	}

	function _backfillEditorFun(uuid){

		var obj=_getParamArrsFun(uuid);
		_clearEditorFun();

		if(obj){
			$('input[name="coverTitle"]').val(obj.coverTitle).html();//标题
			$('input[name="author"]').val(obj.author).html();//作者
			$('textarea[name="summary"]').val(obj.summary).html();//摘要
			$("#summaryNumber").text(120);
			$(".icon-upimgbut").attr("style","background-image:url("+wxGLOBAL.download_url+obj.coverImgId+")")
				.attr("data-file-id",obj.coverImgId);//封面图片ID

			if(obj.showCoverPic==1){
				$('input[name="showCover"]').prop("checked",true);//正文显示
			}
			$('input[name="contentSourceUrl"]').val(obj.sourseUrl);//原文链接

			$(".icon-upimgbut").attr("style","background-image:url("+wxGLOBAL.download_url+obj.coverImgId+")");

			editor.html(kind.unescape(obj.content));

		}

	}

	function confirmFun(){
		//获取选中的图片
		var imgs=[];
		$(".wxpt_tuwenmain li").each(function(){
			if($(this).find("p").length>0){
				$(this).find("p").remove();
				imgs.push($(this).html());
			}
		});
		image2Obj.insertHtml(imgs.join(''));
		layer.closeAll();
	}

	window.confirmFun=confirmFun;


	/***************************************************************************************/

	function saveImageTextFun(type,falg){


		if($(".hidebox").is(":hidden")){
			$(".hidebut1").click();
		}

		var parentId=!paramArrs[0] ? 0 : paramArrs[0].parentId;
		var uuid='',index=0;
		$('ul[data-container="true"]').each(function(k){
			var className=$(this).attr("class");
			if(className.indexOf('borderblue')>-1 && $(this).attr("data-uuid")){
				uuid=$(this).attr("data-uuid");
				index=k;
				return false;
			}
		});




		var nowObj=_getParamArrsFun(uuid);

		if(parentId>0 && type>0 && nowObj){
			//_getParamArrsFun(uuid) 能找到表示已保存

			var 	bool1=false,
				bool2=false,
				bool3=false;


			var coverTitle=$('input[name="coverTitle"]').val();
			if(!coverTitle || coverTitle.length>64){
				var titleTips= '<li><div class="poi2 editston_tise editston_tise01"><i class="icon-editup03 fl"></i>标题不能为空且长度不能超过64字<i class="icon-editup04 fr"></i></div></li>';

				if($(".editston_tatle").find("li").length==2){
					$(".editston_tatle").append(titleTips);
				}
			}else{
				bool1=true;
				if($(".editston_tatle").find("li").length>2){
					$(".editston_tatle li:last").remove();
				}
			}
			var coverFileId=$(".icon-upimgbut").attr("data-file-id");//封面图片ID
			if(!coverFileId){
				var coverTips='<li><div class="poi2 editston_tise editston_tise02"><i class="icon-editup03 fl"></i>封面不能为空且大小不超过2M<i class="icon-editup04 fr"></i></div></li>';
				if($(".editston_td3").find("li").length==5){
					$(".editston_td3").append(coverTips);
				}

			}else{
				bool2=true;
				if($(".editston_td3").find("li").length>5){
					$(".editston_td3 li:last").remove();
				}
			}

			var  content=editor.html();//获取编辑器中的内容
			if(content.length>20000 || content.length<1){
				if($(".editor_center").find(".editston_tise").length==0){
					$(".editor_center").append('<div class="poi2 editston_tise editston_tise01"><i class="icon-editup03 fl"></i>正文不能为空且长度不能超过20000字。<i class="icon-editup04 fr"></i></div>');
				}

			}else{
				bool3=true;
				$(".editor_center").find(".editston_tise").remove();
			}

			if(!bool1 || !bool2 || !bool3){
				return ;
			}

			var author=$('input[name="author"]').val();
			var contentSourceUrl=$('input[name="contentSourceUrl"]').val();//原文链接
			if(contentSourceUrl && !IsURL(contentSourceUrl)){
				var $li=$('input[name="contentSourceUrl"]').parent().parent().find("li");
				if($li.length==2){
					$('input[name="contentSourceUrl"]').parent().after('<li><div class="poi2 editston_tise editston_tise03"><i class="icon-editup03 fl"></i>链接格式错误<i class="icon-editup04 fr"></i></div></li>');
				}
				return ;
			}
			if(!contentSourceUrl){
				$('input[name="contentSourceUrl"]').parent().parent().find("li").eq(2).remove();
			}

			var showCoverPic=0;//是否显示到正文中
			if($('input[name="showCover"]').is(":checked")){
				showCoverPic=1;
			}
			var summary=$('textarea[name="summary"]').val();
			if(!summary){
//				 summary= editor.text().substring(0,120);
			}

			var contrastStr= (coverTitle ||'')
				+(author  ||'')
				+(contentSourceUrl ||'')
				+(coverFileId  ||'')
				+(summary  ||'')
				+(showCoverPic  ||0)
				+content;
			contrastStr=kind.unescape(contrastStr);

			if(nowObj.contrast!= contrastStr){
				//如果数据有变化 就需要修改在同步
				$.ajax({
					url : requestUrl.material.updateImageTextUrl+ nowObj.materialId,
					data:{
						user_id : userId,
						material_id : nowObj.materialId,
						check_code : nowObj.checkCode,
						index : index,
						title : coverTitle,
						description : summary,
						show_cover_pic : showCoverPic,
						content_source_url : contentSourceUrl,
						cover_file_id : coverFileId,
						content : content,
						author : author
					},
					type:'post',
					dataType:'json',
					async:false,
					success:function(resData){
						if(resData.status==200){


							var coverObj={
								uuid : uuid,
								status : 1,
								parentId : !paramArrs[0] ? 0 : paramArrs[0].parentId,
								coverImgId : coverFileId,
								coverTitle : coverTitle,
								author : author,
								sourseUrl : contentSourceUrl,
								showCoverPic : showCoverPic,
								summary : summary,
								content :content
							};

							coverObj.contrast= (coverObj.coverTitle || '')
								+(coverObj.author || '')
								+(coverObj.contentSourceUrl || '')
								+(coverObj.coverImgId || '')
								+(coverObj.summary || '')
								+(coverObj.showCoverPic || 0)
								+coverObj.content ;

							_updateParamArrsFun(uuid,coverObj);



						}else{
							console.log("修改失败:",resData);
							return;
						}
					}
				});
			}

			//同步
			$.ajax({
				url:requestUrl.material.addSyncImageTextUrl+parentId,
				type:'post',
				data:{
					user_id : userId
				},
				dataType:'json',
				success:function(resData){
					if(resData.status==200){
						colseWindow=1;
						layer.msg('保存成功',2,-1,function(){
							if(falg){
								window.location.href="/o2o/route/"+wxGLOBAL.shopSid+"/customized-creat_mass_message_index?parentId="+parentId;
								//window.location.href=webRoot+"/"+shopId+"/weixin/massage/add#art"+parentId;
							}else{
								window.location.href="/o2o/route/"+wxGLOBAL.shopSid+"/fodder-wechat_fodder_index";
							}
						});
					}else{

					}
				}
			});

		}else{

			var 	bool1=false,
				bool2=false,
				bool3=false;


			var coverTitle=$('input[name="coverTitle"]').val();
			if(!coverTitle || coverTitle.length>64){
				var titleTips= '<li><div class="poi2 editston_tise editston_tise01"><i class="icon-editup03 fl"></i>标题不能为空且长度不能超过64字<i class="icon-editup04 fr"></i></div></li>';

				if($(".editston_tatle").find("li").length==2){
					$(".editston_tatle").append(titleTips);
				}
			}else{
				bool1=true;
				if($(".editston_tatle").find("li").length>2){
					$(".editston_tatle li:last").remove();
				}
			}
			var coverFileId=$(".icon-upimgbut").attr("data-file-id");//封面图片ID
			if(!coverFileId){
				var coverTips='<li><div class="poi2 editston_tise editston_tise02"><i class="icon-editup03 fl"></i>封面不能为空且大小不超过2M<i class="icon-editup04 fr"></i></div></li>';
				if($(".editston_td3").find("li").length==5){
					$(".editston_td3").append(coverTips);
				}

			}else{
				bool2=true;
				if($(".editston_td3").find("li").length>5){
					$(".editston_td3 li:last").remove();
				}
			}

			var  content=editor.html();//获取编辑器中的内容
			if(content.length>20000 || content.length<1){
				if($(".editor_center").find(".editston_tise").length==0){
					$(".editor_center").append('<div class="poi2 editston_tise editston_tise01"><i class="icon-editup03 fl"></i>正文不能为空且长度不能超过20000字。<i class="icon-editup04 fr"></i></div>');
				}

			}else{
				bool3=true;
				$(".editor_center").find(".editston_tise").remove();
			}

			if(!bool1 || !bool2 || !bool3){
				return ;
			}


			var author=$('input[name="author"]').val();
			var contentSourceUrl=$('input[name="contentSourceUrl"]').val();//原文链接


			if(contentSourceUrl && !IsURL(contentSourceUrl)){
				var $li=$('input[name="contentSourceUrl"]').parent().parent().find("li");
				if($li.length==2){
					$('input[name="contentSourceUrl"]').parent().after('<li><div class="poi2 editston_tise editston_tise03"><i class="icon-editup03 fl"></i>链接格式错误<i class="icon-editup04 fr"></i></div></li>');
				}
				return ;
			}
			if(!contentSourceUrl){
				$('input[name="contentSourceUrl"]').parent().parent().find("li").eq(2).remove();
			}
			var showCoverPic=0;//是否显示到正文中
			if($('input[name="showCover"]').is(":checked")){
				//0否, 1是
				showCoverPic=1;
			}

			var summary=$('textarea[name="summary"]').val();
			if(!summary){
//				 summary= editor.text().substring(0,120);
			}

			if($('ul[ data-container="true"]').length>8){
				alert('图文数量不能大于8个');
				return;
			}

			var uuid=Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000);

			$('ul[data-container="true"]').each(function(k){
				var className=$(this).attr("class");
				if(className.indexOf('borderblue')>-1 && $(this).attr("data-uuid")){
					uuid=$(this).attr("data-uuid");
					return false;
				}
			});
			if(_getParamArrsFun(uuid)){

				$('ul[data-container="true"]').parent().find("ul").removeClass("borderblue");

				laytpl($("#leftMenuTipsTmpl").html()).render({
				},function(html){
					//增加新TAB栏
//						 $("#coverTips").after(html);
					$(".weixin_postpicul2").prev().after(html);
					if($('ul[data-container="true"]').length==8){
						$(".weixin_postpicul2").hide();
					}else{
						$(".weixin_postpicul2").show();
					}


				});
				//清空右侧栏
				_clearEditorFun();
				return;
			}

			$.ajax({
				url:requestUrl.material.addImageTextUrl,
				type:'post',
				data:{
					user_id : userId,
					title : coverTitle,
					show_cover_pic : showCoverPic,
					description : summary,
					content_source_url : contentSourceUrl,
					cover_file_id : coverFileId,
					content : content,
					author : author,
					parent_id : parentId
				},
				dataType:'json',
				async:false,
				success:function(resData){
					if(resData.status==200 && resData.content){
						var items= JSON.parse($.base64.decode(resData.content,"utf8"));
						if(type){
							//同步
							$.ajax({
								url:requestUrl.material.addSyncImageTextUrl+items.parent_id,
								type:'post',
								data:{
									user_id : userId
								},
								dataType:'json',
								success:function(resData){
									if(resData.status==200){
										colseWindow=1;
										layer.msg('保存成功',2,-1,function(){
											if(falg){
												window.location.href="/o2o/route/"+wxGLOBAL.shopSid+"/customized-creat_mass_message_index?parentId="+parent_id;
												//window.location.href=webRoot+"/"+shopId+"/weixin/massage/add#art!"+items.parent_id;
											}else{
												window.location.href="/o2o/route/"+wxGLOBAL.shopSid+"/fodder-wechat_fodder_index";
												//window.location.href=webRoot+"/"+shopId+"/weixin/source/index";
											}
										});
									}else{
										console.log("保存失败：",resData);
									}
								}
							});
						}else{
							//保存新增
							if(paramArrs.length==0){
								$("#coverTips").attr("data-parent-id",items.parent_id)
									.attr("data-uuid",uuid)
									.attr("data-status",1);//标记完成不可修改
							}

							$('ul[data-container="true"]').each(function(){
								//清空选中标记
								if($(this).attr("class").indexOf("borderblue") > -1){
									$(this).attr("data-uuid",uuid);
									$(this).find("a:last").prev().attr("onclick","delSingleArticleFun(this,"+items.material_id+",'"+items.check_code+"');");

								}
								$(this).removeClass("borderblue");
							});

							laytpl($("#leftMenuTipsTmpl").html()).render({
							},function(html){
								//增加新TAB栏
								$(".weixin_postpicul2").prev().after(html);
//							 $("#coverTips").after(html);
								if($('ul[data-container="true"]').length==8){
									$(".weixin_postpicul2").hide();
								}else{
									$(".weixin_postpicul2").show();
								}

							});

							var coverObj={
								uuid : uuid,
								status : 1,
								parentId : items.parent_id,
								materialId : items.material_id,
								checkCode : items.check_code,
								coverImgId : coverFileId,
								coverTitle : coverTitle,
								author : author,
								sourseUrl : contentSourceUrl,
								showCoverPic : showCoverPic,
								summary : summary,
								content :content
							};

							coverObj.contrast= (coverObj.coverTitle || '')
								+(coverObj.author || '')
								+(coverObj.contentSourceUrl || '')
								+(coverObj.coverImgId || '')
								+(coverObj.summary || '')
								+(coverObj.showCoverPic || 0)
								+(coverObj.content);

							paramArrs.push(coverObj);


						}
						//清空右侧栏
						_clearEditorFun();
					}else{
						console.log("错误信息：",resData);
					}
				}
			});
		}

	}


	window.saveImageTextFun=saveImageTextFun;




	function changeMenuFun(uuid,type){
		var 	bool1=false,
			bool2=false,
			bool3=false;

		var coverTitle=$('input[name="coverTitle"]').val();
		if(!coverTitle || coverTitle.length>64){
			var titleTips= '<li><div class="poi2 editston_tise editston_tise01"><i class="icon-editup03 fl"></i>标题不能为空且长度不能超过64字<i class="icon-editup04 fr"></i></div></li>';

			if($(".editston_tatle").find("li").length==2){
				$(".editston_tatle").append(titleTips);
			}
		}else{
			bool1=true;
			if($(".editston_tatle").find("li").length>2){
				$(".editston_tatle li:last").remove();
			}
		}
		if(!$("#coverImage").attr("src")){
			var coverTips='<li><div class="poi2 editston_tise editston_tise02"><i class="icon-editup03 fl"></i>封面不能为空且大小不超过2M<i class="icon-editup04 fr"></i></div></li>';
			if($(".editston_td3").find("li").length==5){
				$(".editston_td3").append(coverTips);
			}

		}else{
			bool2=true;
			if($(".editston_td3").find("li").length>5){
				$(".editston_td3 li:last").remove();
			}
		}

		var  content=editor.html();//获取编辑器中的内容
		if(content.length>20000 || content.length<1){
			if($(".editor_center").find(".editston_tise").length==0){
				$(".editor_center").append('<div class="poi2 editston_tise editston_tise01"><i class="icon-editup03 fl"></i>正文不能为空且长度不能超过20000字。<i class="icon-editup04 fr"></i></div>');
			}

		}else{
			bool3=true;
			$(".editor_center").find(".editston_tise").remove();
		}

		if(!bool1 || !bool2 || !bool3){
			return false;
		}

		var coverFileId=$(".icon-upimgbut").attr("data-file-id");//封面图片ID
		var author=$('input[name="author"]').val();
		var contentSourceUrl=$('input[name="contentSourceUrl"]').val();//原文链接


		if(contentSourceUrl && !IsURL(contentSourceUrl)){
			var $li=$('input[name="contentSourceUrl"]').parent().parent().find("li");
			if($li.length==2){
				$('input[name="contentSourceUrl"]').parent().after('<li><div class="poi2 editston_tise editston_tise03"><i class="icon-editup03 fl"></i>链接格式错误<i class="icon-editup04 fr"></i></div></li>');
			}
			return false;
		}
		var showCoverPic=0;//是否显示到正文中
		if($('input[name="showCover"]').is(":checked")){
			//0否, 1是
			showCoverPic=1;
		}

		var summary=$('textarea[name="summary"]').val();
		if(!summary){
//			 summary= editor.text().substring(0,120);
		}

		var obj= _getParamArrsFun(uuid);
		var bool=false;

		if(obj && type==0){
			var index=0;
			$('ul[data-container="true"]').each(function(k){
				var className=$(this).attr("class");
				if(className.indexOf('borderblue')>-1){
					index=k;
					return false;
				}
			});

			$.ajax({
				url : requestUrl.material.updateImageTextUrl+ obj.materialId,
				data:{
					user_id : userId,
					material_id : obj.materialId,
					check_code : obj.checkCode,
					index : index,
					title : coverTitle,
					description : summary,
					show_cover_pic : showCoverPic,
					content_source_url : contentSourceUrl,
					cover_file_id : coverFileId,
					content : content,
					author : author
				},
				type:'post',
				dataType:'json',
				async:false,
				success:function(resData){
					if(resData.status==200){

						var coverObj={
							uuid : uuid,
							status : 1,
							parentId : !paramArrs[0] ? 0 : paramArrs[0].parentId,
							coverImgId : coverFileId,
							coverTitle : coverTitle,
							author : author,
							sourseUrl : contentSourceUrl,
							showCoverPic : showCoverPic,
							summary : summary,
							content :content
						};

						coverObj.contrast= (coverObj.coverTitle || '')
							+(coverObj.author || '')
							+(coverObj.contentSourceUrl || '')
							+(coverObj.coverImgId || '')
							+(coverObj.summary || '')
							+(coverObj.showCoverPic || 0)
							+coverObj.content ;

						_updateParamArrsFun(uuid,coverObj);


						bool= true;
					}else{

					}
				}
			});

			return bool;
		}else{
			//新增
			var uuid=Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000);
			$('ul[data-container="true"]').each(function(){
				//清空选中标记
				if($(this).attr("class").indexOf("borderblue") > -1){
					$(this).attr("data-uuid",uuid);
				}
			});

			$.ajax({
				url:requestUrl.material.addImageTextUrl,
				type:'post',
				data:{
					user_id : userId,
					title : coverTitle,
					show_cover_pic : showCoverPic,
					description : summary,
					content_source_url : contentSourceUrl,
					cover_file_id : coverFileId,
					content : content,
					author : author,
					parent_id : !paramArrs[0] ? 0 : paramArrs[0].parentId
				},
				dataType:'json',
				async:false,
				success:function(resData){
					if(resData.status==200 && resData.content){
						var items= JSON.parse($.base64.decode(resData.content,"utf8"));
						var coverObj={
							uuid : uuid,
							status : 1,
							parentId : items.parent_id,
							materialId : items.material_id,
							checkCode : items.check_code,
							coverImgId : coverFileId,
							coverTitle : coverTitle,
							author : author,
							sourseUrl : contentSourceUrl,
							showCoverPic : showCoverPic,
							summary : summary,
							content :content
						};

						coverObj.contrast= (coverObj.coverTitle || '')
							+(coverObj.author || '')
							+(coverObj.contentSourceUrl || '')
							+(coverObj.coverFileId || '')
							+(coverObj.summary || '')
							+(coverObj.showCoverPic || 0)
							+coverObj.content || '';

						paramArrs.push(coverObj);

						bool= true;
					}else{
						console.log("错误信息：",resData);
					}
				}
			});
			return bool;
		}

		return true;
	}






	function delSingleArticleFun(obj,materialId,checkCode){
		//删除单个文章
		var $ul=$(obj).parent().parent().parent().parent().parent().parent();
		if(materialId>0 && checkCode){
			$.post(requestUrl.material.delImageText+materialId,{
				user_id:userId,
				check_code:checkCode
			},function(resData){
				if(resData.status==200){
					var uuid=$ul.attr("data-uuid");
					$ul.remove();
					_delparamArrsFun(uuid);
					_clearEditorFun();

					$('ul[data-container="true"]:last').click();

					if($('ul[data-container="true"]').length>7){
						$(".weixin_postpicul2").hide();
					}else{
						$(".weixin_postpicul2").show();
					}
				}else{
					console.log("错误信息：",resData);
				}
			});
		}else{
			$ul.remove();
			$('ul[data-container="true"]:last').click();
		}

	}

	window.delSingleArticleFun=delSingleArticleFun;

	/*******************************************************************************************/
	$("body").delegate('a[data-del="true"]',"click",function(){
		$('ul[data-container="true"]').each(function(){
			$("div:last",this).removeAttr("style").find("ul").removeAttr("style");
		});

		$(this).parent().attr("style","display:block;");
		$(this).parent().find("ul").show();


	});


	$("body").delegate('ul[data-container="true"]',"click",function(){
		//左侧选项TAB栏切换

		var coverTitle=$('input[name="coverTitle"]').val();
		var coverFileId=$(".icon-upimgbut").attr("data-file-id");//封面图片ID
		var author=$('input[name="author"]').val();
		var contentSourceUrl=$('input[name="contentSourceUrl"]').val();//原文链接
		var showCoverPic=0;//是否显示到正文中
		if($('input[name="showCover"]').is(":checked")){
			showCoverPic=1;
		}
		var summary=$('textarea[name="summary"]').val();
		if(!summary){
//				 summary= editor.text().substring(0,120);
		}

		var  content=editor.html();//获取编辑器中的内容
		var contrastStr= (coverTitle ||'')
			+(author  ||'')
			+(contentSourceUrl ||'')
			+(coverFileId  ||'')
			+(summary  ||'')
			+(showCoverPic  ||0)
			+content;
		contrastStr=kind.unescape(contrastStr);

		var bool=true,uuid='';
		$(this).parent().find("ul").each(function(){
			if($(this).attr("class").indexOf('borderblue')>-1){
				uuid=$(this).attr("data-uuid");
				return false;
			}
		});
		//对比数据
		if(_getParamArrsFun(uuid) && _getParamArrsFun(uuid).contrast != contrastStr ){
			if(confirm("需要【修改】编辑的数据吗？")){
				//修改上一个内容
				bool=changeMenuFun(uuid,0);
			}
		}else{
			if(contrastStr && contrastStr!='0' && !_getParamArrsFun(uuid)){
				if(confirm("需要【保存】编辑的数据吗？")){
					//保存上一个内容
					bool=changeMenuFun(uuid,1);
				}
				$(this).parent().find("ul").each(function(){
					if($(this).attr("class").indexOf('borderblue')>-1){
						$(this).find("li").eq(0).attr("style","background-image:url("+staticImage_Url+"/mljia/picupload_r4_c4.gif)");
						$(this).find("li").eq(1).text('图文消息标题');
					}
				});
			}
		}

		if(!bool){
			return;
		}

		$(this).parent().find("ul").removeClass("borderblue");

		$(this).addClass("borderblue");
		var uuid=$(this).attr("data-uuid");
		//执行右侧数据回写
		_backfillEditorFun(uuid);

	});



	$("body").delegate(".icon-editup04","click",function(){
		//删除
		if($(this).parent().parent().is("li")){

			$(this).parent().parent().remove();
		}else{
			$(this).parent().remove();
		}
	});

	$(".hidebut1").on("click",function(){
		$(".hidebox").toggle();

		if($(".hidebox").is(":hidden")){
			$(this).text('显示发布样式');
		}else{
			$(this).text('隐藏发布样式');
		}

	});

	$("body").delegate(".wxtw_upload_menu p","click",function(){
		//素材库/本地上传 切换
		$(this).parent().find("p").removeClass("activ");
		var index=$(this).addClass("activ").attr("data-tab");
		if(index==0){
			$("div[data-tab='0']").show();
			$("div[data-tab='1']").hide();
		}else{
			$("div[data-tab='1']").show();
			$("div[data-tab='0']").hide();
		}
	});


	$("body").delegate("div[data-tab='0'] li","click",function(){
		//图片选择事件
		if($(this).find("p").length>0){
			$(this).find("p").remove();
		}else{
			$(this).append('<p class="poi2 wxpt_picseleed" style="display:block"></p>');
		}
	});

	$('input[name="coverTitle"]').on("keyup",function(){
		//标题同步事件
		var text=$(this).val();

		$('ul[data-container="true"]').each(function(){
			if($(this).attr("class").indexOf("borderblue")>-1){

				if($(this).find("p").attr("id")=='coverTitle'){
					$(this).find("p").text(text);
				}
				$(this).find("li").eq(1).text(text);
			}
		});
		if(text.length>0){
			//去除提示
			$(this).parent().next().next().remove();
		}

	});


	$('textarea[name="summary"]').on("keyup",function(){
		$("#summaryNumber").text(120-$(this).val().length);
	});


	function  artUploadImageFun(func){
		var items={};
		$.ajax({
			url:requestUrl.material.selectMaterial,
			data:{
				user_id:userId,
				type:1,
				is_sync:0,
				page:1,
				rows:200
			},
			type:'get',
			dataType:'json',
			async:false,
			success:function(resData){
				if(resData.status==200 && resData.content){
					items= JSON.parse($.base64.decode(resData.content,"utf8"));
				}else{
					console.log("错误信息：获取数据异常");
				}
			}
		});

		laytpl($("#artImageTmpl").html()).render({
			download_url:download_url,
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
				zIndex:999999,
				page: {
					html:html
				}
			});

			$('div[data-tab="0"] ul').scroll(function(){
				//监听图片滚动条事件
				var divTop=$(this).parent().offset().top;
				$(this).find("img").each(function(){
					var src=$(this).attr("data-src");
					if(src){
						var sss=($(this).offset().top-divTop );
						if(sss<280){
							$(this).attr("src",src).removeAttr("data-src");
						}
					}
				});

			});
		});

	}












	/*************************************************批量上传图片**********************************/

	var xhrList=[];
	$("body").delegate('a[data-start="true"]',"click",function(){
		for(var i=0;i<xhrList.length;i++){
			xhrList[i].submit();
		}
	});

	$("body").delegate('input[data-id="fileUpload"]',"click",function(){

		var	inputObj=this,
			fileSize=0,
			imgsTotal=0;

		$(this).fileupload({
			url:requestUrl.upLoadUrl.upLoadImg,
			type:'post',
			formData : {
				sysid : '3',
				gen_thumb : true,
				water_mark:true,
				thumb_width : 400,
				thumb_height : 400,
				width:1024,
				file_store_group : store.get("shopIdAndUserId").shop_id+'_weixin_Images'
			},
			sequentialUploads:true,//排队发送请求
			dataType: 'json',
			acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
			maxFileSize : 2145728,// 2M
			add: function(e, data) { // 选了文件就可以点扫描
				imgsTotal++;
				if (imgsTotal > 10) {
					imgsTotal--;
					layer.msg("不允许同时上传10张以上的图片！",2,-1);
					return false;
				}

				$(".wxpt_upicbuts").hide();

				var uploadFile = data.files[0];

				var  reader = new FileReader();
				if (!reader) {
					this.value = '';
					return;
				};
				reader.readAsDataURL(uploadFile);

				var name= data.content=Math.ceil(Math.random()*100000)+"-"+uploadFile.size+"-"+Math.ceil(Math.random()*100000);
				var obj=this;
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
					if($(inputObj).attr("data-type")=='art'){

						var li=['<li class="wxpt_picli poi1" id="'+name+'">',
							'<img src="'+e.target.result+'" width="204" height="135">',
							'</li>'].join("");

						$('div[data-tab="1"] ul').show().find("li").eq(0).after(li);

						$('div[data-tab="1"] div:first').hide();
					}else{
						var index=0,_obj={};
						$('ul[data-container="true"]').each(function(k){
							var className=$(this).attr("class");
							if(className.indexOf('borderblue')>-1){
								uuid=$(this).attr("data-uuid");
								index=k;
								_obj=this;
								return false;
							}
						});
						if(index==0){
							$("#coverImage").attr("src",e.target.result).attr("data-uuid",name);
						}else{
							$("li:first",_obj).attr("style","background-image:url("+e.target.result+")");
						}

						$(obj).parent().find("i").attr("style","background-image:url("+e.target.result+")");

					}

				};

			},
			done: function (e, data) {
				var name = data.content;
				if(data.result.status == 200){
					//缩略图ID
					$(".icon-upimgbut").attr("style","background-image:url("+data.result.data.small_url+")")
						.attr("data-file-id",data.result.data.id);
					//去除提示
					$(this).parent().parent().next().next().next().remove();

					$.post(requestUrl.material.addMaterial,{
						user_id:store.get("shopIdAndUserId").user_id,
						type : 1,
						file_id : data.result.data.id
					},function(resData){
					},'json');


					if($(inputObj).attr("data-type")=='art'){
						$("#"+name).append('<p class="poi2 wxpt_picseleed" style="display:block"></p>')
							.find("img").attr("src",data.result.data.url);
					}else{
						var index=0,_obj={};
						$('ul[data-container="true"]').each(function(k){
							var className=$(this).attr("class");
							if(className.indexOf('borderblue')>-1){
								uuid=$(this).attr("data-uuid");
								index=k;
								_obj=this;
								return false;
							}
						});
						if(index==0){
							$("#coverImage").attr("src",data.result.data.url).attr("data-file-id",data.result.data.id);
						}else{
							$("li:first",_obj).attr("style","background-image:url("+data.result.data.url+")");
						}
					}

				}else{
					console.log("错误信息：",JSON.stringify(data));

				}
			}
		}).on('fileuploadprogressall', function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);

			var $spans=$('div[data-tab="1"] ul:first').find("p").eq(1).find("span");
			$spans.eq(0).attr("style","width: "+progress+"%;");
			$spans.eq(1).text(progress+"%");

			if(progress==100){
				$spans.parent().hide();
				$('div[data-tab="1"] ul:first').find("p").eq(0).show().text('已选'+imgsTotal+'张图片，共'+fileSize+'KB');
				setTimeout(function(){
					fileSize=0;
					imgsTotal=0;
					xhrList=[];
					$(".wxpt_upicbuts").show();
				},2000);
			}

		});


	});


	function IsURL(str_url){
		if (str_url.match(/(http[s]?|ftp):\/\/[^\/\.]+?\..+\w$/i) == null) {
			return false;
		} else {
			return true;
		}
	}

	/*******************************************图文消息的修改************************************************/

	function initData(){
		var materialId=globalUtil.getUrlParam("materialId");;
		if(!materialId){
			return;
		}
		$.get(requestUrl.material.selectMaterialInfo+materialId,{user_id:userId},function(resData){
			if(resData.status==200 && resData.content){
				var items= JSON.parse($.base64.decode(resData.content,"utf8"));
				//外面第一层
				var uuid=Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000);
				var coverObjmain={
					uuid : uuid,
					status : 1,
					parentId : items.id,
					materialId : items.id,
					checkCode : items.check_code,
					coverImgId : items.cover_file_id,
					coverTitle : items.title,
					author : items.author,
					sourseUrl : items.content_source_url,
					showCoverPic : items.show_cover_pic,
					summary : items.description,
					content : items.content
				};

				coverObjmain.contrast= kind.unescape((coverObjmain.coverTitle ||'')
					+(coverObjmain.author  ||'')
					+(coverObjmain.contentSourceUrl||'')
					+(coverObjmain.coverImgId ||'')
					+(coverObjmain.summary ||'')
					+(coverObjmain.showCoverPic ||0)
					+coverObjmain.content);

				paramArrs.push(coverObjmain);

				_backfillEditorFun(uuid);

				for(var i=0;i<items.sub_list.length;i++){
					var ite=items.sub_list[i];

					uuid=Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000)+"and"+Math.ceil(Math.random()*100000);
					var coverObj={
						uuid : uuid,
						status : 1,
						parentId : materialId,
						materialId : ite.id,
						checkCode : ite.check_code,
						coverImgId : ite.cover_file_id,
						coverTitle : ite.title,
						author : ite.author,
						sourseUrl : ite.content_source_url,
						showCoverPic : ite.show_cover_pic,
						summary : ite.description,
						content : ite.content
					};

					coverObj.contrast= kind.unescape((coverObj.coverTitle||'')
						+(coverObj.author ||'')
						+(coverObj.contentSourceUrl ||'')
						+(coverObj.coverImgId ||'')
						+(coverObj.summary ||'')
						+(coverObj.showCoverPic ||0)
						+coverObj.content);

					paramArrs.push(coverObj);

				}

				laytpl($("#leftMenuTipsListTmpl").html()).render({
					download_url:download_url,
					items:paramArrs
				},function(html){

					$("#coverTips").attr("data-uuid",paramArrs[0].uuid).find("p").html(paramArrs[0].coverTitle);
					$("#coverImage").attr("src",download_url+paramArrs[0].coverImgId);

					$("#coverTips").after(html);

					if(paramArrs.length>7){

						$(".weixin_postpicul2",$("#coverTips").parent()).hide();

					}


				});


			}else{
				layer.msg('数据异常',10,-1,function(){
//					try{
//						window.opener.location.reload();
//					}catch(e){
//					}
//						window.close();
				});
			}
		});


	}

	window.onbeforeunload = function(){
		//监听页面的关闭事件
		if(colseWindow==1){
			return;
		}
		var uuid='';
		$('ul[data-container="true"]').each(function(k){
			var className=$(this).attr("class");
			if(className.indexOf('borderblue')>-1 && $(this).attr("data-uuid")){
				uuid=$(this).attr("data-uuid");
				return false;
			}
		});
		var coverTitle=$('input[name="coverTitle"]').val();
		var coverFileId=$(".icon-upimgbut").attr("data-file-id");//封面图片ID
		var author=$('input[name="author"]').val();
		var contentSourceUrl=$('input[name="contentSourceUrl"]').val();//原文链接
		var showCoverPic=0;//是否显示到正文中
		if($('input[name="showCover"]').is(":checked")){
			showCoverPic=1;
		}
		var summary=$('textarea[name="summary"]').val();
		if(!summary){
//				 summary= editor.text().substring(0,120);
		}

		var  content=editor.html();//获取编辑器中的内容
		var contrastStr= (coverTitle ||'')
			+(author  ||'')
			+(contentSourceUrl ||'')
			+(coverFileId  ||'')
			+(summary  ||'')
			+(showCoverPic  ||0)
			+content;
		contrastStr=kind.unescape(contrastStr);

		var obj=_getParamArrsFun(uuid);
		var msg='';
		if(obj){

			if(contrastStr != obj.contrast){
				msg='您当前编辑的内容尚未保存';
				return msg;
			}

		}else{
			if(contrastStr!='0'){
				msg='您当前编辑的内容尚未保存';
				return msg;
			}
		}




	};





})


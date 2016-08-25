/**
 * 微信 发消息
 * 四种类型消息（type） 1.type 模板类型 0：行业要文 ；1：产品推荐；2：美丽资讯；3：优惠活动
 */
$(function(){
	
	
	var accessToken = globalUtil.getUrlParam("accessToken") || globalUtil.getUrlParam("access_token") || store.get("wx_access_token") || $.cookie('access_token');
	
	//清空授权码
	store.remove("wxAuthCode");
	
	//wx_access_token 
	store.remove("wx_access_token");
	store.set("wx_access_token",accessToken);
	
	
	var userId;
	if(!accessToken){
		store.remove("shopIdAndUserId");
		window.location.href=wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
		
	
	}
	
	//定义对象 首次加载数据是否有值,并初始化为false
	var firstRenderData={
			typeZero:	false,
			typeOne: 	false,
			typeTwo: 	false,
			typeThree: 	false
	};
	//定义右侧是否可以继续加载渲染 0不能 1可以
	var rightContinueload={
			typeZeroContinue:0,
			typeOneContinue:0,
			typeTwoContinue:0,
			typeThreeContinue:0
	};
	//标记是否可以发送 赋值为可发送次数
	var sendFlag=-1;
	
	//type 类型标记
	var itemPage={
			typeZeroPage:1,
			typeOnePage:1,
			typeTwoPage:1,
			typeThreePage:1
	};
	
	//标记是否点击了左侧已选项目 0表示未点击
	var leftSelectFlag={
			typeZeroFlag:0,
			typeOneFlag:0,
			typeTwoFlag:0,
			typeThreeFlag:0
	};
	
	var addPageFlag=0;
	//左侧点击项目 开关,0表示关闭,1表示打开
	var itemFlag ={
			typeZero:0,
			typeOne :0,
			typeTwo :0,
			typeThree:0,
			typeZeroDefault:0,//右侧区域默认  未操作左边
			typeOneDefault:0,
			typeTwoDefault:0,
			typeThreeDefault:0
			
	};
	//type 类型数组对象，各类型已经渲染的数据
	var itemList={
			typeZero:{
				typeZeroSelect:[],
				typeZeroLis:[]
				
			},
			typeOne:{
				typeOneSelect:[],
				typeOneLis:[]
			},
			typeTwo:{
				typeTwoSelect:[],
				typeTwoLis:[]
			},
			typeThree:{
				typeThreeSelect:[],
				typeThreeLis:[]
			}
	};
	
	
	var wxSendInfoApp ={
			init:function(){
				console.log("%c 您已进入微信模块", "font-size:50px;color:red;-webkit-text-fill-color:red;-webkit-text-stroke: 1px black;");
				//绑定的户信息 
				if(!store.get("shopIdAndUserId")){
					this.getUserInfo();
				}
				
				
				//清空授权码
				//store.remove("wxAuthCode");
				
				//初始化标题
				//$("#auto_header .hd_title").text("商家中心");
				this.getWXSendTimes();
				this.getMaterialList(0,1);
				
				this.handleWxItemEvent();
				
				this._endFun();
				document.title="发送消息"; 
			},
			/*
			 *用户登陆信息 
			 */
			
			getUserInfo:function(){
				$.ajax({
					url:requestUrl.user.getUserInfo,
					data:{
						access_token: accessToken
					},
					type:'post',
					async:false,
					dataType:'json',
					success:function(data){
						if(data.status===200){
							var content=data.content;
							if(data.content){
								content = JSON.parse($.base64.decode(content, "utf-8"));
								console.log("shopIdAndUserId:",content);
								 userId =content.user_id;
								store.remove("shopIdAndUserId");
								store.set("shopIdAndUserId",content);
							}else{
								layer.msg('获取用户信息失败，请重新登陆')
							}
							
							
						}else{
							layer.msg('更新失败，请稍后重试')
						}
					}
				});
			},
			
			/**
			 * function:	getWXSendTimes
			 * description:	根据userId 获取改公众号剩余的可发消息的次数
			 * input:		userId :公众号id
			 */
			getWXSendTimes:function(){
				$.ajax({
	 				url:requestUrl.shop.getSendMessageRemainTimes,
	 				data:{
	 					//user_id :userId,
	 				},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status == 200 ){
	 						if(data.content){
	 							var content = globalUtil.decryptData(data.content);
	 							 //   console.log("content:",content);
	 							    //可发送次数 标记 当大于等于1时 可发送 否则不可发送
	 							   sendFlag =content.left_count;
	 								//渲染模板
	 			 					laytpl($("#remainSendTimesTemp").html()).render({
	 			 						content:content,
	 			 						main_Url:wxGLOBAL.homeUrl || " ",
	 			 						shopId: shopId
	 			 					},function(html){
	 			 					      $("#remainSendTimesView").append(html)
	 			 					      
	 			 					      $("#wxPublicName").text(content.app_name);
	 			 					      var userId = store.get("shopIdAndUserId").user_id;
	 			 					      $("#checkReleased").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/thirdpartnar-released_public_message?shopId="+store.get("shopIdAndUserId").shop_id+"&userId="+userId)
	 			 					});
	 						}else{
	 							alert("获取数据失败");
	 						}
	 					}else{
	 						alert("调用接口失败");
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
				
			},
			/**
			 * function:	getMaterialList
			 * description:	根据type类型获取素材数据
			 * input:		1.type 模板类型 0：行业要文 ；1：产品推荐；2：美丽资讯；3：优惠活动
			 */
			getMaterialList:function(type,page,selectItemId){
				var  _this = this;
				$.ajax({
	 				url:requestUrl.shop.getMaterialListData,
	 				data:{
	 					user_id: store.get("shopIdAndUserId").user_id,
	 					shop_id: store.get("shopIdAndUserId").shop_id,
	 					type:    type,
	 					rows:    7,
	 					page:	 page
	 				},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status == 200 ){
	 						if(data.content){
	 							var content =  globalUtil.decryptData(data.content);
	 							   // console.log("content:",content);
	 							    
	 							   
	 								//如果已经选择了某个项目，从content中删除该项目
							    		if(selectItemId ){
		 							    	for(var m=0;m<content.length;m++){
		 							    		var item = content[m];
		 							    		for(var attr in item){
		 							    			if( (attr=="id") &&(item["id"]== selectItemId) ){
		 							    				content.splice(m,1)
		 							    			}
		 							    		}
		 							    	}
		 							    }
	 							 //   console.log("删除掉已近选择了的项目：",content);
	 							    
	 							    
	 							    if(content.length>=1){
	 							    	 if(type==0){
	 							    		 
	 							    		//存放已经获得数据
	 							    		itemList.typeZero.typeZeroLis.concat(content);
	 							    		
	 							    		 //左侧切换后，比较已经选择了 项目 置顶选择了的数据
	 							    		if(selectItemId && leftSelectFlag.typeZeroFlag==1){
	 							    			content=itemList.typeZero.typeZeroSelect.concat(content);
	 							    			leftSelectFlag.typeZeroFlag=0;
	 							    		}
	 							    		//如果有数据 设置firstReaderData对象
	 	 							    	firstRenderData.typeZero=true;
	 	 							    	// console.log("firstRenderData:",firstRenderData);
	 	 							    	
	 	 							    }else if(type==1){
	 	 							       //存放已经获得数据
	 	 							    	itemList.typeOne.typeOneLis.concat(content);
	 	 							    	 //置顶
	 	 							    	if(selectItemId && leftSelectFlag.typeOneFlag==1){
	 	 							    		content=itemList.typeOne.typeOneSelect.concat(content);
	 	 							    		leftSelectFlag.typeOneFlag=0
	 	 							    	}
	 	 							    	
	 	 							    	firstRenderData.typeOne=true;
	 	 							    	
	 	 							    	
	 	 							    }else if(type==2){
	 	 							    	//存放已经获得数据
	 	 							    	itemList.typeTwo.typeTwoLis.concat(content);
	 	 							    	
	 	 							    	 //置顶
	 	 							    	if(selectItemId && leftSelectFlag.typeTwoFlag==1){
	 	 							    		content=itemList.typeTwo.typeTwoSelect.concat(content);
	 	 							    		leftSelectFlag.typeTwoFlag=0
	 	 							    	}
	 	 							    	
	 	 							    	firstRenderData.typeTwo=true;
	 	 							    	
	 	 							    	
	 	 							    }else if(type==3){
	 	 							    	//存放已经获得数据
	 	 							    	itemList.typeThree.typeThreeLis.concat(content);
	 	 							    	
	 	 							    	 //置顶
	 	 							    	if(selectItemId && leftSelectFlag.typeThreeFlag==1){
	 	 							    		content=itemList.typeThree.typeThreeSelect.concat(content);
	 	 							    		leftSelectFlag.typeThreeFlag=0
	 	 							    	}
	 	 							    	
	 	 							    	firstRenderData.typeThree=true;
	 	 							    	
	 	 							    }
	 	 							   
	 	 							  _this.renderMaterialTemp(content,type,data.totalCount,selectItemId,page);
	 							    }else if(content.length==0 && selectItemId){
	 							    	if(type==0){
	 							    		content=itemList.typeZero.typeZeroSelect
	 							    	}else if(type==1){
	 							    		content=itemList.typeOne.typeOneSelect
	 							    	}else if(type==2){
	 							    		content=itemList.typeTwo.typeTwoSelect
	 							    	}else if(type==3){
	 							    		content=itemList.typeThree.typeThreeSelect
	 							    	}
	 							    	
	 	 							   _this.renderMaterialTemp(content,type,data.totalCount,selectItemId,page);
	 							    }else if(content.length==0){
	 							    	 _this.renderMaterialTemp(content,type);
	 							    }
	 							   
	 						}else{
	 								//没有数据
	 							 _this.renderMaterialTemp();
	 						}
	 					}else{
	 						//alert("get data failed");
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
			},
			/**
			 * function: 	handleWxItemEvent
			 * description: 处理左侧模拟的微信消息种类的点击事件
			 * input:		1.type
			 * 				2.page 公共itemPage
			 */
			handleWxItemEvent:function(){
				var _this = this;
			$("body").delegate("a.itemId","click",function(){
					
					var type=$(this).attr("data-type-id");
					
					
					$("span.itemId").removeClass("products_tj_s1").addClass("products_tj_s1_lg");
					
					$(this).children().eq(0).removeClass("products_tj_s1_lg").addClass("products_tj_s1");
					
					$("div.itemId_b").removeClass("itemId_b")
				
					
					//设置左侧点击开关
					$("div[data-item-id]").attr("data-item-click","true");
					
					
					//设置开关
					if(type==0){
						itemFlag ={
								typeZero:1,
								typeOne :0,
								typeTwo :0,
								typeThree:0,
								typeZeroDefault:1,//右侧区域默认  未操作左边
								typeOneDefault:0,
								typeTwoDefault:0,
								typeThreeDefault:0
						};
						itemPage.typeZeroPage=1;
					}else if(type==1){
						itemFlag ={
								typeZero:0,
								typeOne :1,
								typeTwo :0,
								typeThree:0,
								typeZeroDefault:0,//右侧区域默认  未操作左边
								typeOneDefault:1,
								typeTwoDefault:0,
								typeThreeDefault:0
						};
						itemPage.typeOnePage=1;
					}else if(type==2){
						itemFlag ={
								typeZero:0,
								typeOne :0,
								typeTwo :1,
								typeThree:0,
								typeZeroDefault:0,//右侧区域默认  未操作左边
								typeOneDefault:0,
								typeTwoDefault:1,
								typeThreeDefault:0
						};
						itemPage.typeTwoPage=1;
					}else if(type==3){
						itemFlag ={
								typeZero:0,
								typeOne :0,
								typeTwo :0,
								typeThree:1,
								typeZeroDefault:0,//右侧区域默认  未操作左边
								typeOneDefault:0,
								typeTwoDefault:0,
								typeThreeDefault:1
						};
						itemPage.typeThreePage=1;
					}
					
					$("#newsView div").attr("data-item-click","true");
					
					//控制提示信息
					var _selectDom = $(this);
					if( $("#newsView").children("div").attr("data-item-id") ){
						 _selectDom.parent("div").addClass("itemId_b");
						_selectDom.children("span").eq(1).text("请从右边选择您要发布的内容");
						$("#itemListView").empty();
						_this.getMaterialList(type, 1)
						
					}else{
						
						_selectDom.children("span").eq(1).text("请先选择行业要闻");
						
						
						setTimeout(function(){
							_selectDom.children("span").eq(1).text("");
							_selectDom.children("span").eq(0).removeClass("products_tj_s1").addClass("products_tj_s1_lg");
							//_selectDom.parent("div").removeClass("itemId_b");
						},1000);
					}
					
					
					
				});
			},
			
			/**
			 * function:	renderMaterialTemp
			 * description:	根据type，content 渲染不同模板
			 * input：       1.type 模板类型 0：行业要文 ；1：产品推荐；2：美丽资讯；3：优惠活动
			 * 				2. content:JSON Object 
			 * 				3. firstRenderData 首次获取 type类型数据 是否有值标记， false无值，true有值
			 * 				4. totalCount 该类型消息的数据总量
			 * 				5.selectItemId 用户已近选择了的项目Id，如果有值表示已经选了。否则表示没有选择
			 * res:          渲染数据后，根据类型重设分页对象参数，并把该page参数传给或的更多函数
			 */
			renderMaterialTemp:function(content,type,totalCount,selectItemId,page){
				var _this =this;
				
				$(".header").removeClass("header");
				
				if(content && content.length>0 ){
					 $(".btn_look_more_dimension").show();
					if(type==0){
						
						laytpl($("#itemListTemp").html()).render({
							content:content,
							type:   type
	 					},function(html){
	 						$(".shop_no_news_txt").remove();
	 						$(".btn_look_more_dimension").attr("data-item-type",type);
	 						
	 						//控制显示
	 						var existType =  $("#itemListView").children("li").last().attr("data-item-type");
	 						if(type ==existType){
	 							$("#itemListView").append(html);
	 							
	 							/*if( itemPage.typeZeroPage %6 ==0){
 									$("#itemListView").empty().append(html);
 								}else{
 									$("#itemListView").append(html);
 								}*/
	 							
	 						}else{
	 							$("#itemListView").empty().append(html);
	 						}
	 						
	 						
 							
 							//样式设置
 							for(var k=0;k<$(".btn_select").length;k++){
 								var itemDom= $(".btn_select").eq(k);
 								if( itemDom.attr("data-item-id") ==selectItemId ){
 									itemDom.addClass("btn_full_red");
 									itemDom.text("取消选择");
 								}
 							}
	 					      
	 					   $("#hasNoItemMessageView").removeClass("content_right_massage_small").addClass("content_right_massage_big");
	 					     
	 					   //页码控制
	 					   $(".btn_look_more_dimension").attr("data-item-page",itemPage.typeZeroPage);
	 					     
	 					
	 					     var page = itemPage.typeZeroPage;
	 					   
	 					    // console.log("itemList.typeZero.typeZeroLis:",itemList.typeZero.typeZeroLis);
	 					     
	 					    itemList.typeZero.typeZeroLis = itemList.typeZero.typeZeroLis.concat(content);
	 					   
	 					     var contents = itemList.typeZero.typeZeroLis;
	 					     
	 					    //处理右侧数据区域的点击逻辑逻辑，包括查看更多，选择，查看全文
	 					    _this.handleItemlClickEvent(type,page,contents);
	 					    
	 					    
	 					    //获得更多
	 					    var currLen = $("#itemListView").children("li[data-item-type='0']").length;
	 					    if(currLen < totalCount && itemPage.typeZeroPage<4){
	 					    	$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
	 						}else {
	 						   $(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
	 						}
	 					    
	 					   //获得更多
	 						/*if( Math.ceil(totalCount/7) > itemPage.typeZeroPage){
	 							$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
	 						}else {
	 							$(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
	 						}*/
	 					    
	 					    //查看详情
	 					     $("a[data-item-content='true']").on("click",function(){
		 					    	var id = $(this).attr("data-item-id");
		 					    	  _this.getMaterialContent(id);
		 					    	//_this.previewPageFun(id)
		 					 });
	 					    
	 					});
						
						
					}else if(type==1 || type==2 || type==3){
						laytpl($("#itemListTemp").html()).render({
							content:content,
							type:   type
	 					},function(html){
	 						$(".btn_look_more_dimension").attr("data-item-type",type);
	 						  $(".shop_no_news_txt").remove();
	 						  
	 						//控制显示
		 						var existType =  $("#itemListView").children("li").last().attr("data-item-type");
		 						if(type ==existType){
		 							
		 							
		 							if(type==1){
		 								$("#itemListView").append(html);
		 								
		 								/*if(itemPage.typeOnePage %6 ==0){
		 									$("#itemListView").empty().append(html);
		 								}else{
		 									$("#itemListView").append(html);
		 								}*/
		 							}else if(type==2){
		 								$("#itemListView").append(html);
		 								
		 							/*	if(itemPage.typeTwoPage %6 ==0){
		 									$("#itemListView").empty().append(html);
		 								}else{
		 									$("#itemListView").append(html);
		 								}*/
		 							}else if(type==3){
		 								$("#itemListView").append(html);
		 								
		 								/*if(itemPage.typeThreePage %6 ==0){
		 									$("#itemListView").empty().append(html);
		 								}else{
		 									$("#itemListView").append(html);
		 								}*/
		 							}
		 							
		 						}else{
		 							$("#itemListView").empty().append(html);
		 						}
		 					
                              
	 					      $("#hasNoItemMessageView").removeClass("content_right_massage_big").addClass("content_right_massage_small");
	 					   
	 					   //样式设置
	 							for(var k=0;k<$(".btn_select").length;k++){
	 								var itemDom= $(".btn_select").eq(k);
	 								if( itemDom.attr("data-item-id") ==selectItemId ){
	 									itemDom.addClass("btn_full_red");
	 									itemDom.text("取消选择");
	 								}
	 							}
	 					      
	 					      
	 					      
	 					      if(type==1){
	 					    	
	 					    	 var page =itemPage.typeOnePage;
	 					    	 
	 					    	//页码控制 
	 					 	   $(".btn_look_more_dimension").attr("data-item-page",itemPage.typeOnePage);
	 					    	
	 					       itemList.typeOne.typeOneLis = itemList.typeOne.typeOneLis.concat(content);
	 					       
	 					    	 var contents = itemList.typeOne.typeOneLis.concat(content);
		 					   //  console.log("链接后的数据typeOne：",content);
		 					     
		 					  //获得更多
	 					    	 
	 					    	 
	 					    	 
	 					    	 
	 					    	 var currLen = $("#itemListView").children("li[data-item-type='1']").length;
	 					    	
	 					    	 
		 					    if(  (currLen < totalCount) && itemPage.typeOnePage<4){
		 					    	$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
		 						}else {
		 							$(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
		 						}
		 					    
		 					  //获得更多
		 						/*if( Math.ceil(totalCount/7) > itemPage.typeOnePage){
		 							$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
		 						}else {
		 							$(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
		 						}*/
	 					    	  
	 					    	_this.handleItemlClickEvent(type,page,contents)
	 					      }else if(type==2){
	 					    	
	 					    	  var page =itemPage.typeTwoPage;
	 					    	  
	 					    	 //设置页面参数
	 					    	 $(".btn_look_more_dimension").attr("data-item-page",itemPage.typeTwoPage);
		 					    	
	 					    	itemList.typeTwo.typeTwoLis = itemList.typeTwo.typeTwoLis.concat(content);
	 					    	 var contents = itemList.typeTwo.typeTwoLis.concat(content);
		 					   //  console.log("链接后的数据typeTwo：",content);
		 					     
		 					  //获得更多
	 					    	 var currLen = $("#itemListView").children("li[data-item-type='2']").length;
		 					    if( currLen < totalCount && itemPage.typeTwoPage<4){
		 					    	$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
		 						}else {
		 							$(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
		 						}
		 					     
		 					     
		 					    //获得更多
		 					/*	if( Math.ceil(totalCount/7) > itemPage.typeTwoPage){
		 							$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
		 						}else {
		 							$(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
		 						}*/
	 					    	  
	 					    	_this.handleItemlClickEvent(type,page,contents)
	 					      }else if(type==3){
	 					    	
	 					    	  var page =itemPage.typeThreePage;
	 					    	  
	 					    	 //设置页面参数
		 					    $(".btn_look_more_dimension").attr("data-item-page",itemPage.typeThreePage);
	 					    	 
	 					    	itemList.typeThree.typeThreeLis = itemList.typeThree.typeThreeLis.concat(content);
	 					    	 var contents = itemList.typeThree.typeThreeLis.concat(content);
		 					  //   console.log("链接后的数据typeThree：",content);
		 					     
		 					  //获得更多
	 					    	var currLen = $("#itemListView").children("li[data-item-type='3']").length;
	 					    	
		 					    if( currLen < totalCount && itemPage.typeThreePage<4){
		 					    	$(".btn_look_more_dimension").text("查看更多内容").attr("id","getMoreItemBtn").css({"cursor":"pointer"});
		 						}else {
		 							$(".btn_look_more_dimension").text("已经到底了哦~ ").removeAttr("id").css({"cursor":"default"});
		 						}
	 					    	  
	 					    	_this.handleItemlClickEvent(type,page,contents)
	 					      }
	 					      
	 					     //查看详情
	 					     $("a[data-item-content='true']").on("click",function(){
		 					    	var id = $(this).attr("data-item-id");
		 					    	  _this.getMaterialContent(id);
		 					 });
	 					    
	 					});
						
					}else {
						alert("type error");
					}
					
					$("#getMoreItemBtn").attr("data-item-type",type);
					//获得更多
					
				}else {
					if(type==0 && firstRenderData.typeZero == false){
						laytpl($("#hasNoItemMessageTemp").html()).render({
	 					},function(html){
	 						if($(".shop_no_news_txt").length<=0){
	 							 $("#hasNoItemMessageView").append(html);
		 					     //处理获得更多按钮显示隐藏
		 						  $(".btn_look_more_dimension").hide();
	 						}
	 					     
	 					});
					}else if(type==1 && firstRenderData.typeOne == false){
						laytpl($("#hasNoItemMessageTemp").html()).render({
	 					},function(html){
	 						if($(".shop_no_news_txt").length<=0){
	 							 $("#hasNoItemMessageView").append(html);
		 					     //处理获得更多按钮显示隐藏
	 							 $(".btn_look_more_dimension").hide();
	 						}
	 					});
					}else if(type==2 && firstRenderData.typeTwo == false){
						laytpl($("#hasNoItemMessageTemp").html()).render({
	 					},function(html){
	 						if($(".shop_no_news_txt").length<=0){
	 							 $("#hasNoItemMessageView").append(html);
		 					     //处理获得更多按钮显示隐藏
	 							 $(".btn_look_more_dimension").hide();
	 						}
	 					});
					}else if(type==3 && firstRenderData.typeThree == false){
						laytpl($("#hasNoItemMessageTemp").html()).render({
	 					},function(html){
	 						if($(".shop_no_news_txt").length<=0){
	 							 $("#hasNoItemMessageView").append(html);
		 					     //处理获得更多按钮显示隐藏
	 							 $(".btn_look_more_dimension").hide();
	 						}
	 					});
					}
					
				}
			},
			/**
			 * function:	handleItemlClickEvent
			 * description:	处理右侧区域，type类型的获取更多按钮 点击逻辑,处理
			 * input：       1.type 模板类型 0：行业要文 ；1：产品推荐；2：美丽资讯；3：优惠活动
			 * 				2. 分页标记，来源于全局变量itemPage对象
			 * res:			再次调用接口获取数据，完成一个闭环
			 */
			handleItemlClickEvent:function(type,page,contents){
				var _this =this;
			
				//选择数据渲染右侧模板
			  
				$(".btn_select").on("click",function(){
					
					var itemId = $(this).attr("data-item-id");
					var type= $(this).attr("data-item-type");
					$("#getMoreItemBtn").attr("data-select-id",itemId);
					//获取选择的数据
					if(type ==0){
						for(var t=0;t<contents.length;t++ ){
							var itemData = contents[t];
							for(var attr in itemData){
								if(attr=="id"){
									if(itemData["id"] == itemId){
										itemList.typeZero.typeZeroSelect.length=0;
										itemList.typeZero.typeZeroSelect.push(itemData);
									}
								}
							}
						}
						// console.log("itemList.typeZero.typeZeroSelect:",itemList.typeZero.typeZeroSelect);
					}else if(type ==1){
						for(var t=0;t<contents.length;t++ ){
							var itemData = contents[t];
							for(var attr in itemData){
								if(attr=="id"){
									if(itemData["id"] == itemId){
										itemList.typeOne.typeOneSelect.length=0;
										itemList.typeOne.typeOneSelect.push(itemData);
									}
								}
							}
						}
						// console.log("itemList.typeOne.typeOneSelect:",itemList.typeOne.typeOneSelect);
						
					}else if(type ==2){
						for(var t=0;t<contents.length;t++ ){
							var itemData = contents[t];
							for(var attr in itemData){
								if(attr=="id"){
									if(itemData["id"] == itemId){
										itemList.typeTwo.typeTwoSelect.length=0;
										itemList.typeTwo.typeTwoSelect.push(itemData);
									}
								}
							}
						}
					//	 console.log("itemList.typeTwo.typeTwoSelect:",itemList.typeTwo.typeTwoSelect);
						
					}else if(type ==3){
						for(var t=0;t<contents.length;t++ ){
							var itemData = contents[t];
							for(var attr in itemData){
								if(attr=="id"){
									if(itemData["id"] == itemId){
										itemList.typeThree.typeThreeSelect.length=0;
										itemList.typeThree.typeThreeSelect.push(itemData);
									}
								}
							}
						}
					}
					
					//样式设置
					for(var k=0;k<$(".btn_select").length;k++){
						var itemDom= $(".btn_select").eq(k);
						if(itemDom.hasClass("btn_full_red")  && itemDom.attr("data-item-id") !=itemId ){
							itemDom.removeClass("btn_full_red");
							itemDom.text("选择添加");
						}
					}
					$(this).toggleClass("btn_full_red");
					
					if($(this).hasClass("btn_full_red")){
						$(this).text("取消选择");
						//渲染左侧
						if(type == 0){
							laytpl($("#newsTemp").html()).render({
								content:itemList.typeZero.typeZeroSelect
		 					},function(html){
		 					      $("#newsView").empty().append(html);
		 					      //$(".data_mount").attr({"data-item-id":itemList.typeZero.typeZeroSelect.id,"data-item-type":type})
		 					      
		 					     if($("span.products_tj2_s1").length>=1 && sendFlag>0 ){
		 					    	//控制是否可以发送
			 					      $("#submitData").removeClass("btn_sent_gk").addClass("btn_sent_gk_h");
		 					      }
		 					});
						}else if(type == 1){
							laytpl($("#itemTemp").html()).render({
								content:itemList.typeOne.typeOneSelect,
								tempType:"product"
		 					},function(html){
		 					      $("#productAdviceView").empty().append(html);
		 					      
		 					     $(".product").attr("data-item-id",itemList.typeOne.typeOneSelect[0].id).attr("data-item-type",type);
		 					     
		 					     //控制是否可以发送
		 					     if( sendFlag>0){
		 					    	  $("#submitData").removeClass("btn_sent_gk").addClass("btn_sent_gk_h");
		 					     }
		 					    
		 					});
						}else if(type == 2){
							laytpl($("#itemTemp").html()).render({
								content:itemList.typeTwo.typeTwoSelect,
								tempType:"advice"
		 					},function(html){
		 					      $("#beautyAdviceView").empty().append(html);
		 					      
		 					     $(".advice").attr("data-item-id",itemList.typeTwo.typeTwoSelect[0].id).attr("data-item-type",type) ;
		 					     
		 					    //控制是否可以发送
		 					     if(sendFlag>0){
		 					    	 $("#submitData").removeClass("btn_sent_gk").addClass("btn_sent_gk_h");
		 					     }
		 					     
		 					});
						}else if(type == 3){
							laytpl($("#itemTemp").html()).render({
								content:itemList.typeThree.typeThreeSelect,
								tempType:"event"
		 					},function(html){
		 					      $("#eventView").empty().append(html);
		 					      
		 					    $(".event").attr("data-item-id",itemList.typeThree.typeThreeSelect[0].id).attr("data-item-type",type); 
		 					     
		 					    //控制是否可以发送
		 					    if(sendFlag>0){
		 					    	$("#submitData").removeClass("btn_sent_gk").addClass("btn_sent_gk_h");
		 					    }
		 					      
		 					});
						}
						
						
					}else{
						$(this).text("选择添加");
						
						if(type==0 ){
							laytpl($("#selectNewsTemp").html()).render({
		 					},function(html){
		 					      $("#newsView").empty().append(html);
		 					      
		 					     //控制是否可以发送
		 					      $("#submitData").removeClass("btn_sent_gk_h").addClass("btn_sent_gk");
		 					});
						}else if(type==1 ){
							laytpl($("#selectProductTemp").html()).render({
		 					},function(html){
		 						var thisDom = $("#productAdviceView");
		 						thisDom.empty().append(html);
		 						thisDom.find("a").attr("data-type-id",type).addClass("itemId");
		 						
		 						//添加边框
		 						thisDom.children("div").toggleClass("itemId_b");
		 					   //控制是否可以发送
		 					      if($("span.products_tj2_s1").length==0){
		 					    	 $("#submitData").removeClass("btn_sent_gk_h").addClass("btn_sent_gk");
		 					      }
		 					     
		 					});
						}else if(type==2 ){
							laytpl($("#beautyAdviceSelectTemp").html()).render({
		 					},function(html){
		 						var beautyDom =  $("#beautyAdviceView");
		 						beautyDom.empty().append(html);
		 						beautyDom.find("a").attr("data-type-id",type).addClass("itemId");
		 						beautyDom.children("div").toggleClass("itemId_b");
		 					   //控制是否可以发送
		 					     if($("span.products_tj2_s1").length==0){
		 					      $("#submitData").removeClass("btn_sent_gk_h").addClass("btn_sent_gk");
		 					     }
		 					});
						}else if(type==3 ){
							laytpl($("#eventSelectTemp").html()).render({
		 					},function(html){
		 						var eventDom =   $("#eventView");
		 						eventDom.empty().append(html);
		 						eventDom.find("a").attr("data-type-id",type).addClass("itemId");
		 						eventDom.children("div").toggleClass("itemId_b");
		 					   //控制是否可以发送
		 					     if($("span.products_tj2_s1").length==0){
		 					      $("#submitData").removeClass("btn_sent_gk_h").addClass("btn_sent_gk");
		 					     }
		 					});
						}
						
					}
					
				})
				
			},
			/**
			 * function:	submitInfo
			 * description:	素材发布
			 * input：       1.type 模板类型 0：行业要文 ；1：产品推荐；2：美丽资讯；3：优惠活动
			 * 				2. content:JSON Object 
			 */
			submitInfo:function(materialLis){
				
				$.ajax({
	 				url:requestUrl.shop.releaseMaterial,
	 				data:{
	 					user_id: userId,
	 					shop_sid: wxGLOBAL.shopSid,
	 					idList: materialLis
	 				},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status == 200 ){
 						   //弹出层
	 						layer.load('发送成功', 2);
	 						
	 						setTimeout(function(){
	 							window.location.href= "/o2o/route/"+wxGLOBAL.shopSid+"/thirdpartnar-released_public_message";
	 						},1000);
	 						
	 					}else{
	 						alert("啊哦~发送通道堵车了，请您稍后再发");
	 					}
	 				},
	 				error :function(){
	 					alert("啊哦~发送通道堵车了，请您稍后再发");
	 				}
	 			 });
				
			},
			/**
			 * function:	getMaterialContent
			 * description:	获得素材正文
			 * input：       id 素材模板ID
			 */
			getMaterialContent: function(id){
				
				$.ajax({
	 				url:requestUrl.shop.getMaterialContent+"/"+id,
	 				data:{
	 					user_id: userId,
	 					id:		 id
	 				},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status == 200 ){
	 						if(data.content){
	 							var content =  globalUtil.decryptData(data.content);
	 							   // content = JSON.parse(content);
	 							  //  console.log("getMaterialContent:",content);
	 							 
	 							   var html=$.parseHTML(content.content);
	 							   //数据渲染dom
	 								laytpl($("#detaiInfoTemp").html()).render({
	 									content:content,
	 									html:html[0].data
	 			 					},function(html){
	 			 						$("#detaiInfoView").empty().append(html);
	 			 						//$("#contentDom").html(content.content);
	 			 						
		 			 					//弹出层
		 			 					 $.layer({
			 								    type: 1,
			 								    shade: [0.5, '#000'],
			 								    bgcolor: "rgb(250,255,255,0.5)",
			 								    area: ['auto', 'auto'],
			 								    title: false,
			 								    border: [0],
			 								    page: {dom : '#detaiInfoView'}
			 							 });
		 			 					 
		 			 					 //控制样式
		 			 					 var outDiv =$("#contentDom");
		 			 					 var PDom =outDiv.find("p");
		 			 					 var imgPDom =outDiv.find("p:has(img)");
		 			 					 
		 			 					PDom.css({"text-indent":"2em"});
		 			 					imgPDom.css({"text-indent":"0em"})
		 			 					 
		 			 					 
	 			 					  
	 			 					});
	 							  
	 						}else{
	 								//没有数据
	 						}
	 					}else{
	 						//alert("get data failed");
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
			},
			
			/**
			 * function: 		_endFun
			 * decription: 		处理准备提交的数据
			 * input:			
			 */
			_endFun:function(){
				var _this = this;
				
				//提交 只能点击一次
				$("#submitData").one("click",function(){
					if(	$(this).hasClass("btn_sent_gk_h") && sendFlag >=1){
						var MaterialLis=[];
						var typeZeroId=$("div[data-item-type='0']").attr("data-item-id") ;
						var typeOneId=$("div[data-item-type='1']").attr("data-item-id") ;
						var typeTwoId=$("div[data-item-type='2']").attr("data-item-id");
						var typeThreeId=$("div[data-item-type='3']").attr("data-item-id") ;
						
						if(typeZeroId){
							MaterialLis.push( Number(typeZeroId) );
						}
						if(typeOneId){
							MaterialLis.push( Number(typeOneId)  );
						}
						if(typeTwoId){
							MaterialLis.push( Number(typeTwoId)  );
						}
						if(typeThreeId){
							MaterialLis.push( Number(typeThreeId));
						}
						
						
						
					//	console.log("MaterialLis:",MaterialLis);
						
						_this.submitInfo(MaterialLis);
					}
				});
				
				
				//点击左侧已近选择了的项目，重绘右侧展示
				$("body").delegate("div[data-item-click='true']","click",function(){
					var type = $(this).attr("data-item-type");
					var selectItemId = $(this).attr("data-item-id");
					
					//给其他项目条件点击事件
					$("div[data-item-id]").attr("data-item-click","true");
					$("span.products_tj_s1").removeClass("products_tj_s1").addClass("products_tj_s1_lg");;
					
					//$(this).addClass("itemId_b");
					//本元素去掉点击事件
					$(this).attr("data-item-click","");
					
					//其他元素去掉高亮边框
					$(".data_mount").removeClass("itemId_b");
					$(".itemId_b").removeClass("itemId_b");
					
					$(this).addClass("itemId_b");
					//$(".itemId").removeClass("products_tj_s1").addClass("products_tj_s1_lg");
					
					if(type==0){
						leftSelectFlag.typeZeroFlag=1
						//重设分页参数
						itemPage.typeZeroPage=1;
						
						
						
					}else if(type==1){
						leftSelectFlag.typeOneFlag=1
						
						//重设分页参数
						itemPage.typeOnePage=1
					}else if(type==2){
						leftSelectFlag.typeTwoFlag=1
						
						//重设分页参数
						itemPage.typeTwoPage=1
					}else if(type==3){
						leftSelectFlag.typeThreeFlag=1
						
						//重设分页参数
						itemPage.typeThreePage=1
					}
					//更多按钮 item id
					$(".btn_look_more_dimension").attr("data-select-id",selectItemId);
					_this.getMaterialList(type,1,selectItemId)
					
				});
				
				//获取更多
				$("body").delegate("#getMoreItemBtn","click",function(){
					if($(this).attr("id")){
						var selectId= $(this).attr("data-select-id");
						var type = $(this).attr("data-item-type");
						
						var page =Number( $(this).attr("data-item-page") )+1;
						
						if(type==0){
							itemPage.typeZeroPage +=1;
						}else if(type==1){
							itemPage.typeOnePage +=1;
						}else if(type==2){
							itemPage.typeTwoPage +=1;
						}else if(type==3){
							itemPage.typeThreePage +=1;
						}
						
						
						_this.getMaterialList(type, page,selectId);
						
					}
					
					$(".btn_select").off("click");
					
				});
				
			}
			
	};
	
	//获取授权码
	globalUtil.getWXAuthCode(accessToken);
	

	
	//检测店铺是否绑定 。
	$.get(requestUrl.user.appInfo,{
		access_token:accessToken,
		shop_sid:wxGLOBAL.shopSid
	},function(data){

		if(data.status==200 && data.content){
			//当前点店铺已开通微信公众号 
			var datas =JSON.parse($.base64.decode(data.content,"utf-8"));
			
			if(datas.service_type_info==0 ||datas.service_type_info==1){
				//0订阅号 
				wxPubInfoApp.rendTemp(datas);
					/*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
					$("#w998").html(htm);
					
					 $(".footer_main").css("margin-top","550px");
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
						
					});*/
					
				
			}else if(datas.service_type_info==2){
				//2服务号 //-1未认证
				if(-1 == datas.verify_type_info){
					wxPubInfoApp.rendTemp(datas);
					/*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
					$("#w998").html(htm);
					 $(".footer_main").css("margin-top","550px");
					
					
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
									layer.msg('更新信息成功~')
			 						
			 						setTimeout(function(){
			 							window.location.reload(true);   
			 						},2000);
								
								}else{
									layer.msg('更新失败，请稍后重试')
								}
							}
						});
						
					});*/
					
				}else{
					wxSendInfoApp.init()
				}
			}
			
		}else if(data.status==25){
			
			location.href="/o2o/route/"+wxGLOBAL.shopSid+"/auth-register_server_number"
			//window.location.href=webRoot+"/route/auth-register_server_number?shopId="+(shopId || 0)+"&userId="+userId;
		}
		else{
			//console.log("错误信息:"+data.error_message);
		}
	});
	
	
	var wxPubInfoApp={
			
			rendTemp:function(content){
				
				 //数据渲染dom
					laytpl($("#yingdaoTemp").html()).render({
						content:content,
						qrCodeImg:download_url+"/image/"+content.qr_file_image,
						
					},function(html){
						$("#w998").empty().append(html).css({"background-color":"#fff"});
						$(".main_btn_box").remove();
					   $(".container").css({"margin-right":"auto","padding-left":"15px"});
					   $(".upgradeLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#upgrade");
					   $(".authLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#auth");
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
			
	}
	

});

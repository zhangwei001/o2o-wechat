/**
 * 店主已发的公共号消息
 */
$(function(){

	var userId= store.get("shopIdAndUserId").user_id || 6;
	var shopId= store.get("shopIdAndUserId").shop_id || 3;
	
	var morePage =1;
	
	var releasedMessageApp={
			init:function(){
				//初始化标题
				$("#auto_header .hd_title").text("已发布微消息");
				$("#mlj_menu").remove();
				
				
				this.getReleasedMessage(1);
				
				document.title="发送消息历史"; 
			},
			/**
			 * function:	getReleasedMessage
			 * description: 获取分页数据 
			 */
			getReleasedMessage:function(page){
				var _this = this;
				$.ajax({
	 				url:requestUrl.shop.getReleasedPublicMessage,
	 				data:{
	 					user_id :userId,
	 					shop_sid: wxGLOBAL.shopSid,
	 					rows:	 7,
	 					page:	 page
	 				},
	 				type:"get",
	 				dataType: "json",
	 				success :function(data){
	 					if(data.status == 200 ){
	 						if(data.content){
	 							var content = globalUtil.decryptData(data.content);
	 							   
	 							    //去除title 为null 的脏数据
	 							    
	 							   /* for(var m=0;m<content.length;m++){
	 							    	var itemObj = content[m];
	 							    	for(var attr in itemObj){
	 							    		if(attr=="title" && (itemObj["title"]=="null" || itemObj["title"]=="" || itemObj["title"]== null)){
	 							    			content.splice(m,1);
	 							    		}
	 							    	}
	 							    }
	 							   console.log("content:",content);*/
	 							    
	 							   _this.readerTemp(content,data.totalCount);
	 						}else{
	 							_this.readerTemp(content);
	 						}
	 					}else{
	 						alert("获取数据失败，请重启登陆");
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
			},
			/**
			 * function: 	readerTemp
			 * decription:  根据content 渲染模板
			 * input：		content 分页数据 如果为空则渲染空页面，否则渲染数据页面
			 */
			readerTemp:function(content,totalCount){
				var _this = this;
				if(content.length>0){
					//渲染模板
	 					laytpl($("#releasedInofTemp").html()).render({
	 						content:content,
	 						main_Url:main_Url,
	 						shopId: shopId
	 					},function(html){
	 						$(".top_subnav_main").removeClass("top_subnav_main").addClass("my_mlijia_top");
	 					      $("#auto_massage_list").empty().append(html);
	 					       var totalPage = (totalCount%7 == 0 ?totalCount/7 : (Math.floor(totalCount/7) +1));
	 					   //分页
	 					    	  _this.handlePaging(totalPage);
	 							
	 					    	  //查看详情
	 	 					     $("a[data-item-content='true']").on("click",function(){
	 		 					    	var id = $(this).attr("data-item-id");
	 		 					    	  _this.getMaterialContent(id);
	 		 					 });
	 		 					    
	 					     // $("#checkReleased").attr("href",webRoot+"/"+shopId+"/weixin/released/public/message")
	 					});
					
				}else{
					laytpl($("#hasNoReleasedInfoTemp").html()).render({
 						},function(html){
 							$(".top_subnav_main").removeClass("top_subnav_main").addClass("my_mlijia_top");
 					      $("#auto_massage_list").empty().append(html)
 					     // $("#checkReleased").attr("href",webRoot+"/"+shopId+"/weixin/released/public/message")
 					});
				}
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
	 			 					  
	 			 					 
	 			 					//#contentDom p:nth-of-type(even)
	 			 					//样式控制
	 			 					$("#contentDom p:odd").css({"text-indent":"0px"});
	 			 					
	 			 					 //控制样式
	 			 					 var outDiv =$("#contentDom");
	 			 					 var PDom =outDiv.find("p") ;
	 			 					 var imgPDom =outDiv.find("p:has(img)");
	 			 					 
	 			 					PDom.css({"text-indent":"2em"});
	 			 					imgPDom.css({"text-indent":"0em"})
	 			 					
	 			 					});
	 							  
	 						}else{
	 								//没有数据
	 						}
	 					}else{
	 						alert("数据已删除，获取数据失败");
	 					}
	 				},
	 				error :function(){
	 					alert("网络开了小差，重新试试吧~");
	 				}
	 			 });
			},
			/**
			 * 分页
			 * function: handlePaging
			 * descripion: 分页
			 * input : 
			 */
			handlePaging:function(totalPageNum){
				var _this =this;
				laypage({
						cont: $('#morePage'), //容器。值支持id名、原生dom对象，jquery对象,
						pages: totalPageNum, //总页数
						skip: true, //是否开启跳页.
						skin: 'blue', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
						groups: 4, //连续显示分页数
						curr:morePage ,
						jump: function(obj,first){
							if(!first){
								morePage=obj.curr;
								_this.getReleasedMessage(morePage);
								document.getElementsByTagName('body')[0].scrollTop = 0;
							}
						}
					});
			}
			
	};
	releasedMessageApp.init();
	
	
	
});

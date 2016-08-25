/**
 * [描述] 自动回复
 * @date 2016.06.27
 * @auther Antony-余光宝
 */


$(function(){

    //add other entrance
    var accessToken =  globalUtil.getUrlParam("accessToken") ||  globalUtil.getUrlParam("access_token") || $.cookie('access_token');
    globalUtil.entranceFilter(accessToken);

    /***********************初始化数据 START*****************************************/
    var _pageId = '#upweixin_auto_reply ';//当前全局控制 注意要空格
    var page=location.hash.replace('#!page=', '') || 1;
    var rows=$("#limit").val()||10;//每页多少行
    var userId = store.get("shopIdAndUserId").user_id;// 21152
    var shop_id = store.get("shopIdAndUserId").shop_id; //1352
    var shopId = wxGLOBAL.shopSid;//1110142
    //设置导航
    $("#sendWXInfo").attr("href", "/o2o/route/"+ wxGLOBAL.shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));
    document.title="自动回复设置";


    //  user_id Integer 店长ID
    //  type    Integer 回复类型 0：文字    1：图片    2：语音    3：视频    4：图文
    //  rule_name   String  规则名称
    //  key_word    String  关键词
    var itemHas = window.location.hash.substr(1) || "";
    if(itemHas.search(/page/g)>0){
        var page =location.hash.replace('#!page=', '') || 1;//当前页

    }else{
        var page=1;
    }

    /***********************初始化数据 END*****************************************/

    /************************方法初始化 Start**************************************/
    var replyControl = {
        //初始化加载数据
        init : function(){

            isCheckWeiXinbind(shop_id,userId);//判断当前店铺是否绑定公众号没有则跳到绑定页面
            bindEvent();
        }
    };
    /*******************方法初始化 End***********************************************/


    /*******************绑定方法 Start**********************************************/
    /***
     * 绑定方法
     */
    function bindEvent(){
        //新建规则(默认)
        $(_pageId + "#newRules").on("click",function(){
            //新增

            $(_pageId+ '#noRulesEl').hide();

            var htmlTemp =$("#addRuleTemp").html();
            laytpl(htmlTemp).render({},function(html){
                $(_pageId +"#addReply").html(html);
            });
            $(_pageId+ '#addReply').show();
        });

        //新增选择模糊还是精确
        $("body").delegate(".changeKeyType a","click",function(){
            var index =$(this).index();
            $(this).addClass("active").siblings("a").removeClass("active");
            if (index ==0) {
                //模糊
                $(this).parent("p").siblings("ul.exactEditContent").hide();//隐藏模糊
                $(this).parent("p").siblings("ul.blurredEditContent").show();//显示模糊
                $('#key_type').val(1);//隐藏域保存类型

            }else{
                //精确
                $(this).parent("p").siblings("ul.exactEditContent").show();//显示精确
                $(this).parent("p").siblings("ul.blurredEditContent").hide();//隐藏模糊
                $('#key_type').val(0);//隐藏域保存类型
            }

        });


        //新建规则展开收起
        $(_pageId + '#auto_weixin_reply_right').delegate('.auto_reply_setup_main a.txthui','click',function(){
        	
            var value_nameType = $(this).attr("name");//1收起的状态，0，展开
            var eL_id = $(this).data("index")+"";// 获取索引，指向id="editReplyContentUp{{ item.id }}";

            if (value_nameType == 1) {
                //展开
                if (!isNaN(parseInt(eL_id))){
                    //修改
                    //获取当前回复数据
                    var relayItem =JSON.parse($(this).siblings("p").text());
                    //查询规则回复详细
                    selectReplyDeatil(relayItem);
                }

                $(this).children("i").removeClass("icon-weixinmenu-down");
                $(this).children("i").addClass("icon-weixinmenu-up");
                $(this).attr("name","0");
                $(_pageId + "#editReplyContentUp"+eL_id).hide();
                $(_pageId + "#editRelyContentDown"+eL_id).show();
                
                
            var hights = $("#exactWord"+eL_id).find("[data-type=show]").children("li").height();
            var index =  $("#exactWord"+eL_id).find("[data-type=show]").children("li").length;
            if (hights*index>=95) {
                 $("#exactWord"+eL_id).find("[data-type=show]").addClass('overflow_y_s');
                 $("#exactWord"+eL_id).find("[data-type=show]").scrollTop(360);//设置滚动条保持底部
            }else{
                 $("#exactWord"+eL_id).find("[data-type=show]").removeClass('overflow_y_s');
                 
            }


            }else{
                //收起
                $(this).attr("name","1");
                $(this).children("i").removeClass("icon-weixinmenu-up");
                $(this).children("i").addClass("icon-weixinmenu-down");
                $(_pageId + "#editReplyContentUp"+eL_id).show();
                $(_pageId + "#editRelyContentDown"+eL_id).hide();
                var content = $(_pageId + "#editReplyContentUp"+eL_id).children("li").children("p.jingque").html();
                if (!content) {
                    $(_pageId + "#editReplyContentUp"+eL_id).children("li").first().children().remove();
                    $(_pageId + "#editReplyContentUp"+eL_id).children("li").first().html('<p class="tatle gl">关键词：</p><p style="margin-right:15px;color:#222;" class="jingque">当前关键词为空，点击右上角展开编辑关键词</p>');
                }
            }
        });


        //删除整个规则事件
        $("body").delegate('.auto_reply_setup_main a.detelRelay','click',function(){
            var id = $(this).data("id");//id
            var check_code = $(this).data("check_code");//check_code
            //$("#addReply").children().remove();//
            //删除原有规则
            if (!check_code) {
                check_code="new";
            }
            delReplyFunTc(id,check_code);
        });


        //隐藏自动回复框 收起
        $(_pageId + "#delmenuEl").on("click",function(){
            $(_pageId + "#haveRuleEl").hide();
        });


        //************左边S************



        //输入编辑点击 （左边）
        $("body").delegate('.auto_reply_exact_ul li a',"click",function(){

            var name_value = $(this).attr("name");
            var elHtml = $(this).parent("span");
            var elHtmlul =$(this).parent("span").parent().parent().parent();

            if (name_value =="editCon") {
                //编辑
                elHtml.siblings(".s1").children("input").attr("readonly",false);
                elHtml.siblings().show();
                elHtml.hide();
                elHtml.siblings(".s3").hide();

            }else if(name_value =="resetCon" ){
                //取消
                var newOrold =elHtml.parent().parent().parent().siblings(".auto_reply_exact_buts").children("a").data("neworold");

                if (newOrold=="newRule") {
                    //新建规则
                    elHtml.parent("p").parent(".list").remove();
                }else{
                    //已存在

                    var text = $(this).data("value");

                    if (text) {
                        elHtml.siblings(".s1").children("input").val(text);
                        elHtml.siblings(".s1").children("input").attr("readonly",true);
                        elHtml.siblings().show();
                        $(this).parent().hide();
                        elHtml.siblings(".s4").hide();
                    }else{
                        //删除
                        elHtml.parent("p").parent(".list").remove();
                    }


                }


            }else if(name_value =="delCon"){
                //删除
                elHtml.parent("p").parent(".list").remove();

            }else if(name_value =="SureCon"){
                //确定
                var text_value = elHtml.siblings(".s1").children("input").val();
                if (!text_value) {
                    layer.msg("请输入关键字",1, 3);
                    return;
                }else{
                    elHtml.siblings(".s1").children("input").attr("readonly",true);
                    elHtml.siblings().show();
                    $(this).parent().hide();
                    elHtml.siblings(".s5").hide();
                }

            }

            var hights =  elHtmlul.children("li").height();
            var index =   elHtmlul.children("li").length;
            if (hights*index>=95) {
                elHtmlul.addClass('overflow_y_s');
                elHtmlul.scrollTop(360);//设置滚动条保持底部
            }else{
                elHtmlul.removeClass('overflow_y_s');
            }



        });


        //添加关键词
        $("body").delegate(' .auto_reply_exact_buts a',"click",function(){

            var index = $(this).parent().siblings("ul.keyWordEL").children("li").length;
            if (index>9) {
                layer.msg("最多添加10个关键词",1,3);
                return;
            }


            $(this).parent().siblings("ul.keyWordEL").each(function(){
                var showOrHide = $(this).css("display");
                if (showOrHide=="block") {
                    var tempHtml = $("#keyEditTemps").html();
                    $(this).append(tempHtml);
                    var hights = $(this).children().height();
                    var index =  $(this).children("li").length;
                    if (hights*index>=95) {
                        $(this).addClass('overflow_y_s');
                        $(this).scrollTop(360);//设置滚动条保持底部
                    }else{
                        $(this).removeClass('overflow_y_s');
                    }
                    // var scrollHight = $(this).parent().siblings("ul.keyWordEL").height();
                    return;
                }

            });


        });
        //************左边end************

        //************右边S************
        //添加关键词回复，
        $('body').delegate('.auto_reply_right_buts a','click',function(){
            var index = $(this).index();
            var reply_id = $(this).parent().data("id");//当前id

            if (index == 3) {
                //添加文字
                var htmlText = $(this).parent().siblings('div.showRelay').children("textarea").html();//获取回复关键词
                $('#showRelay'+reply_id).children('textarea').attr("readonly",false);
                addReplyTc(0,reply_id,htmlText);

            }else if(index == 2){
                //图片
                addReplyTc(1,reply_id);

            }else if(index == 1){
                //图文
                addReplyTc(4,reply_id);

            }else if(index == 0){
                //删除

                laytpl($("#confirmContentTmpl").html()).render({
                    id:reply_id
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
                        page: {
                            html:html
                        }
                    });

                });



            }

            /* setTimeout(function () {
             $(".xubox_layer").css("display","");
             $(".xubox_layer").css("position","absolute");
             }, 500);*/


            //监听输入文字的剩余字数事件
            $("body").delegate('#textareaEdit'+reply_id,"keyup",function(){

                var num=(300-Number($(this).val().length));
                if(num<=0){
                    $("#lessWords").text(0);
                    $(this).val($(this).val().substring(0,300));
                    return;
                }
                $("#lessWords").text(num);
            });




        });



        //************右边e************
        //新增提交按钮 针对新增回复
        $(_pageId +"#addReply").delegate('.auto_reply_save_buts a','click',function(){

            var index = $(this).index();
            var relayEl = $(this).data("id");//获取当前id
            var type = $("#reply_type"+relayEl).val();//获取类型 隐藏域
            var key_type =$("#key_type").val();//获取精确类型
            var reply_contents ="";//回复文字内容
            //  var ruleName =$("#addReply #rulesName").html();
            var materialId ="";//默认0
            // var exactKeyWordList =[];//精确关键字,
            //  var blurredKeyWordList =[];//
            var keyWordData = new Array();
            $("#exactWord"+relayEl).children("ul.exactEditContent").find("input.inputKeyWord").each(function(){
                var readonlyFlag =$(this).attr("readonly");
                if (readonlyFlag) {
                    var param ={"key_word":$(this).val(),"key_type":0};
                    keyWordData.push(param);
                }

            });

            $("#exactWord"+relayEl).children("ul.blurredEditContent").find("input.inputKeyWord").each(function(){
                var readonlyFlag =$(this).attr("readonly");
                if (readonlyFlag) {
                    var param ={"key_word":$(this).val(),"key_type":1};
                    keyWordData.push(param);
                }

            });



            if (index == 0) {
                //确定保存
                if (type == 0) {
                    //文字
                    reply_contents =  $("#save_content"+relayEl).val();//;//获取回复内容 隐藏域
                    materialId =0;
                }else if (type == 1) {
                    //图片 获取素材id
                    materialId =$("#showRelay"+relayEl).find("a.upload_imgs").attr("data-material_id");
                    reply_contents="";
                }else if(type == 4){
                    materialId =$("#showRelay"+relayEl).find("div.imgAndContetEL").data('material_id');
                    reply_contents="";

                }

                var keyWordDataString =JSON.stringify(keyWordData);
                var replyParams={
                    "user_id" : userId,
                    "type" : type,
                    // "rule_name" : '规则'+newNameIndexs,
                    "content" : reply_contents,
                    "material_id" : materialId,
                    //  "key_type" : key_type,
                    "key_words" : keyWordDataString
                };

                //提交新增
                addReplyFun(replyParams);

            }else{
                //取消 清空关键词和输入
                $('#showRelay'+relayEl).children("textarea").html("");//清空回复内容
                $("#save_content"+relayEl).val("");//清空隐藏域保存的回复内容
                $('#showRelay'+relayEl).children(".auto_reply_right_pic").find('.upload_imgs').attr('data-material_id',"");
                $('#showRelay'+relayEl).children(".auto_reply_right_pic").find('.upload_imgs').css('background-image',"url()");
                $('#exactWord'+relayEl).children('.keyWordEL').children().remove();//清空关键词
                $('#exactWord'+relayEl).children('.keyWordEL').removeClass('overflow_y_s');
                $('#showRelay'+relayEl).children('div:first').removeClass('overflow_y_s');
                $('#showRelay'+relayEl).find('div.imgAndContetEL').children().remove();//清空图文回复
                $('#showRelay'+relayEl).find('div.imgAndContetEL').attr("data-material_id",'');//清空素材id
                $('#showRelay'+relayEl).find('div.imgAndContetEL').css("border",'0px');
                 $('#editRelyContentDown'+relayEl).find('.icon-delta').hide();
            }
        });




        //修改提交按钮 针对已存在的回复
        $(_pageId +"#replyList").delegate('.auto_reply_save_buts a','click',function(){

            var index = $(this).index();
            var relayEl = $(this).data("id");//获取当前id
            var type = $("#reply_type"+relayEl).val();//获取类型 隐藏域
            var replyData = JSON.parse($(this).siblings("div").text());
            var reply_contents ="";//回复文字内容
            var materialId ="";//默认0

            var keyWordData = new Array();
            $("#exactWord"+relayEl).children("ul.exactEditContent").find("input.inputKeyWord").each(function(){
                var readonlyFlag =$(this).attr("readonly");
                if (readonlyFlag) {
                    var param ={"key_word":$(this).val(),"key_type":0};
                    keyWordData.push(param);
                }

            });

            $("#exactWord"+relayEl).children("ul.blurredEditContent").find("input.inputKeyWord").each(function(){
                var readonlyFlag =$(this).attr("readonly");
                if (readonlyFlag) {
                    var param ={"key_word":$(this).val(),"key_type":1};
                    keyWordData.push(param);
                }

            });



            if (index == 0) {
                //确定保存
                if (type == 0) {
                    //文字
                    reply_contents =  $("#save_content"+relayEl).val();//;//获取回复内容 隐藏域
                    materialId =0;
                }else if (type == 1) {
                    //图片 获取素材id
                    materialId =$("#showRelay"+relayEl).find("a.upload_imgs").attr("data-material_id");
                    reply_contents="";
                }else if(type == 4){
                    materialId =$("#showRelay"+relayEl).find("div.imgAndContetEL").attr("data-material_id");
                    reply_contents="";
                }

                //转为json字符串
                var keyWordDataString =JSON.stringify(keyWordData);

                var replyParams={
                    "user_id" : userId,
                    "id" : replyData.id,
                    "check_code" : replyData.check_code,
                    "type" : type,
                    "rule_name" : replyData.rule_name,
                    "content" : reply_contents,
                    "material_id" : materialId,
                    // "key_type" : replyData.key_type,
                    "key_words" : keyWordDataString
                };

                //提交
                updateReply(replyParams);

            }else{
                    //取消 清空关键词和输入
                $('#showRelay'+relayEl).children("textarea").html("");//清空回复内容
                $("#save_content"+relayEl).val("");//清空隐藏域保存的回复内容
                $('#showRelay'+relayEl).children(".auto_reply_right_pic").find('.upload_imgs').attr('data-material_id',"");
                $('#showRelay'+relayEl).children(".auto_reply_right_pic").find('.upload_imgs').css('background-image',"url()");
                $('#exactWord'+relayEl).children('.keyWordEL').children().remove();//清空关键词
                $('#exactWord'+relayEl).children('.keyWordEL').removeClass('overflow_y_s');
                $('#showRelay'+relayEl).children('div:first').removeClass('overflow_y_s');
                $('#showRelay'+relayEl).find('div.imgAndContetEL').children().remove();//清空图文回复
                $('#showRelay'+relayEl).find('div.imgAndContetEL').attr("data-material_id",'');//清空素材id
                $('#showRelay'+relayEl).find('div.imgAndContetEL').css("border",'0px');
                 $('#editRelyContentDown'+relayEl).find('.icon-delta').hide();
            }
        });

        //图片选择事件
        $("body").delegate(".wxpt_tuwenmain li","click",function(){
            //弹出层列表选择事件
            if($(".poi2",this).length>0){
                $(".poi2",this).remove();
            }else{
                $(this).parent().find("li").find("p[class='poi2 wxpt_picseleed']").remove();
                $(this).append('<p class="poi2 wxpt_picseleed" style="display:block"></p>');
            }
        });


        $("body").delegate("#seachKeys","click",function(){
            //搜索
            var keys=$("input[name='seachWords']").val();
            if(!keys){
                layer.msg("请输入搜索条件！",1,3);
                return;
            }
            seachImageTextData(keys);
        });
        $("body").delegate("#getAll","click",function(){
            //查看全部
            $("input[name='seachWords']").val('');
            seachImageTextData();
        });

    }
    /*******************绑定方法 End************************************************/

    /**
     * 判断当前店铺是否绑定公众号没有则跳到绑定页面
     */
    function isCheckWeiXinbind(shop_ids,shopUserIds){
        $.get(requestUrl.user.appInfo,{
            shop_id:shop_id,
            user_id:userId
        },function(data){
            //      data.status=200;
            //      data.content=';;;';
            if(data.status==200 && data.content){
                //当前点店铺已开通微信公众号
                var datas =JSON.parse($.base64.decode(data.content,"utf-8"));

                if(datas.service_type_info==0 ||datas.service_type_info==1){
                    //0订阅号
                    rendTemp(datas);
                    /*  var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
                     $("#w998").html(htm);
                     $(".margin-top").css("margin-top","550px");*/
                }else if(datas.service_type_info==2){
                    //2服务号 //-1未认证

                    if(-1 == datas.verify_type_info){
                        rendTemp(datas);
                        /*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
                         $("#w998").html(htm);*/

                    }else{

                        initDataFun(page);//初始化

                    }
                }

            }else if(data.status==25){
                window.location.href=wxGLOBAL.homeUrl+"/"+(shopId || 0)+"/weixin/weixinFun";
            }
            else{
                console.log("错误信息:"+data.error_message);
            }
        });
    }


    /***
     * 引导页内容填充
     */
    function rendTemp(content){

        //数据渲染dom
        laytpl($("#yingdaoTemp").html()).render({
            content:content,
            qrCodeImg:download_url+"/image/"+content.qr_file_image

        },function(html){
            $(".wxminh500").empty().append(html).css({"background-color":"#fff"});
            $(".container").css({"margin-right":"auto","margin-left":"auto","padding-left":"15px"});
            $(".upgradeLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#upgrade");
            $(".authLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#auth");
            $(".downLoadCodeImg").attr("href",wxGLOBAL.download_url+content.qr_file_image);
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

    /***
     * 查询自动回复列表
     * @param page 当前页
     * @param Integer    回复类型 0：文字    1：图片    2：语音    3：视频    4：图文
     * @param keyWord 关键字
     */
    function initDataFun(page,type,ruleName,keyWord){
        //requestUrl.material.selectReplyList
        $.get(requestUrl.material.selectReplyList,{
            user_id : userId,
            type : type||'',
            rule_name : ruleName||'',
            key_word : keyWord||'',
            page : page,
            rows : rows
        },function(resData){
            if(resData.status==200){
                if (resData.content) {
                    $(_pageId+ '#noRulesEl').hide();
                    $(_pageId+ '#replyList').show();
                    var items= JSON.parse($.base64.decode(resData.content,'utf8'));
                    //存在列表
                    if (items!==null && items.length>0) {
                        var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : (resData.totalCount/rows+1));
                        laytpl($("#rulesListTemp").html()).render({'items':items},function(html){
                            $(_pageId +"#replyList").html(html);
                            laypage({
                                cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                                pages: totalPage, //总页数
                                curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页,初始当前页
                                hash: 'page', //自定义hash值
                                skip: true, //是否开启跳页
                                jump: function(obj,first){
                                    if(!first){
                                        initDataFun(obj.curr,type,ruleName,keyWord);
                                    }
                                }
                            });
                        });
                    }else{
                        $(_pageId+ '#noRulesEl').show();
                        $(_pageId+ '#replyList').hide();
                    }

                }else{
                    $(_pageId+ '#noRulesEl').show();
                    $(_pageId+ '#replyList').hide();
                }
            }else{
                layer.msg(resData.errorMessage,1, 3);
            }
        });
    }


    /***
     * 条件查询详细规则
     * @param relayItems 当前回复数据组
     */
    function selectReplyDeatil(relayItems){

        //单个图文，图片消息的查询
        if(relayItems.material_id>0 && relayItems.type==4){
            //填充图文
            InsertImgAndContentEd(relayItems.id,relayItems.material_id)  ;

        }else if(relayItems.material_id>0 && relayItems.type==1){
            //单个图片消息的查询
            $.ajax({
                url:requestUrl.material.selectMaterialImageInfo+relayItems.material_id,
                data:{
                    user_id : userId,
                    material_id : relayItems.material_id
                },
                dataType:'json',
                async:false,
                success:function(resData){
                    if(resData.status==200 && resData.content){
                        var resultData= JSON.parse($.base64.decode(resData.content,"utf8"));
                        var imgHtml = '<div class="auto_reply_right_pic  fl overflow_y_s">'
                            + '<a class="upload_imgs" data-material_id='+resultData.id+' style="background-image:url('+download_url+resultData.file_id+')"></a></div>';
                        $(_pageId +"#showRelay"+relayItems.id).html(imgHtml);

                    }else{
                        console.log(resData);
                    }
                }
            });

        }else if(relayItems.type==0){
            //文字
            var relayHtml = '<textarea data-type ="0"  class="auto_reply_right_txt fl " readonly="readonly" >'+relayItems.reply_content+'</textarea>';
            $(_pageId +"#showRelay"+relayItems.id).html(relayHtml);
            var heights=  $(_pageId +"#showRelay"+relayItems.id).children('testarea').height();
            if (heights>158) {
                $(_pageId +"#showRelay"+relayItems.id).children('testarea').addClass("overflow_y_s");
            }else{
                $(_pageId +"#showRelay"+relayItems.id).children('testarea').removeClass("overflow_y_s");
            }
        }else{
            //新增

        }


        //填充左边编辑关键字模板
        var keyWordTemp =$("#leftEdit").html();

        laytpl(keyWordTemp).render({accurate_list:relayItems.accurate_list,fuzzy_list:relayItems.fuzzy_list},function(html){
            $(_pageId +"#exactWord"+relayItems.id+"").html(html);

        });

        //判断精确模糊显示
        if (relayItems.accurate_list != null && relayItems.accurate_list.length>0) {
            $('#exactWord'+relayItems.id).children("p").children("a.reply_change_burt1").removeClass("active")
            $('#exactWord'+relayItems.id).children("p").children("a.reply_change_burt2").addClass("active");
            $('#exactWord'+relayItems.id).children("ul.exactEditContent").show();
            $('#exactWord'+relayItems.id).children("ul.blurredEditContent").hide();
            var heights = $('#exactWord'+relayItems.id).children("ul.exactEditContent").children("li").height();
            var index = $('#exactWord'+relayItems.id).children("ul.exactEditContent").children("li").lenght;
            if (index*heights>158) {
                $('#exactWord'+relayItems.id).children("ul.exactEditContent").addClass('overflow_y_s');
            }else{
                $('#exactWord'+relayItems.id).children("ul.exactEditContent").removeClass('overflow_y_s');
            }
        }else{
            $('#exactWord'+relayItems.id).children("p").children("a.reply_change_burt2").removeClass("active")
            $('#exactWord'+relayItems.id).children("p").children("a.reply_change_burt1").addClass("active");
            $('#exactWord'+relayItems.id).children("ul.exactEditContent").hide();
            $('#exactWord'+relayItems.id).children("ul.blurredEditContent").show();
            var heights = $('#exactWord'+relayItems.id).children("ul.blurredEditContent").children("li").height();
            var index = $('#exactWord'+relayItems.id).children("ul.blurredEditContent").children("li").lenght;
            if (index*heights>158) {
                $('#exactWord'+relayItems.id).children("ul.blurredEditContent").addClass('overflow_y_s');
            }else{
                $('#exactWord'+relayItems.id).children("ul.blurredEditContent").removeClass('overflow_y_s');
            }
        }






        //显示下拉详细
        $("#reply_type"+relayItems.id).val(relayItems.type);//给隐藏域赋值type，提交保存的时候需要获取此参数
        $("#save_content"+relayItems.id).val(relayItems.reply_content);//给隐藏域赋值content，提交保存的时候需要获取此参数

        //是否显示删除右边内容
        var contentre = $(_pageId +"#showRelay"+relayItems.id).html();
        if (contentre) {
            $(_pageId +"#showRelay"+relayItems.id).siblings('.auto_reply_right_buts').children("[class=icon-delta]").show();
        }else{
            $(_pageId +"#showRelay"+relayItems.id).siblings('.auto_reply_right_buts').children("[class=icon-delta]").hide();

        }



    }

    /***
     * 修改自动回复
     * @param paramdata json 数据格式
     *         user_id : userId,
     id : id,
     check_code : checkCode,
     type : type,
     rule_name : rlueName,
     content : content,
     material_id : materialId,
     key_type : keyType,
     key_words : keyWords
     */
    function updateReply(paramData){
        //验证
        if (checkIsRelayRules(paramData)) {

            $.ajax({
                url:requestUrl.material.updateReply+paramData.id,
                data:paramData,
                dataType:'json',
                async:false,
                traditional: true,
                success:function(resData){
                    if(resData.status==200){
                        //成功刷新
                        layer.msg("修改成功",2,1);
                        location.hash='';
                        window.location.reload();
                    }else{
                        console.log(resData);
                    }

                },error:function(e){
                    console.log(e);
                }
            });
        }


    }

    /****2.新增消息*********/
    function addReplyFun(pramData){

        if (checkIsRelayRules(pramData)) {
            $.ajax({
                url:requestUrl.material.addReply,
                //url:"http://192.168.2.18:8080/wechat/o2o/reply/add",
                data:pramData,
                dataType:'json',
                async:false,
                traditional: true,
                success:function(resData){
                    if(resData.status==200){
                        layer.msg("添加成功",2,1);
                        location.hash='';
                        window.location.reload();

                    }else{

                        layer.msg(resData.errorMessage,1,3);
                        console.log(resData);
                    }

                },error:function(e){
                    console.log(e);
                }
            });
        }

    }


    //填充图文编辑
    function InsertImgAndContentEd(relayId,materialId){
        $.ajax({
            url:requestUrl.material.selectMaterialInfo+materialId,
            data:{
                user_id : userId,
                material_id : materialId
            },
            dataType:'json',
            async:false,
            success:function(resData){
                if(resData.status==200 && resData.content){
                    var results= JSON.parse($.base64.decode(resData.content,"utf8"));
                    var insertHtml = $("#imageTextInfoTmpl").html();
                    laytpl(insertHtml).render({
                        items:results,
                        download_url:download_url
                    },function(html){
                        setTimeout(function(){
                            $(_pageId +"#showRelay"+relayId).html(html);
                        },200);
                    });


                }else{
                    console.log(resData);
                }
            }
        });

    }


    /***
     * 添加回复弹窗显示
     * @param type 回复类型
     * @param relayId 当前所属 id
     * @param ContentText 关键词回复内容  type=1 传入
     */
    function addReplyTc(types,relayId,ContentText){
        var htmlTemp ="";
        if (types == 0) {
            //文字模板
            var htmlTemp = $('#artTextLayerTmpl').html();//模板
            //获取弹出内容
            laytpl(htmlTemp).render({type:types,relay_id:relayId,text:ContentText},function(html){
                $.layer({
                    type: 1,
                    title: false,
                    shadeClose: false,
                    area: ['auto', 'auto'],
                    bgcolor: '',
                    fix: false,//用于设定层是否不随滚动条而滚动，固定在可视区域。
                    offset: ['', ''],
                    border: [0], //去掉默认边框
                    closeBtn: [1, false], //去掉默认关闭按钮
                    shift: 'center', //从左动画弹出
                    page: {
                        html:html
                    },
                    success: function(layero){
                      $(".xubox_layer").css("position","absolute");  
                      var heights = $(document).scrollTop();;
                     
                       $(".xubox_layer").css("margin-top",heights-100); 
                    }

                });
               //$(".xubox_layer").css("position","absolute");
               
            });


        }else if(types ==1){
            //图片模板
            var htmlTemp = $('#artImageLayerTmpl').html();//模板
            //获取图片资源
            initImageData(function(items){
                laytpl($("#artImageLayerTmpl").html()).render({
                    download_url:download_url,
                    id:relayId||'',
                    items:items
                },function(html){
                    $.layer({
                        type: 1,
                        title: false,
                        shadeClose: false,
                        area: ['auto', 'auto'],
                        bgcolor: '',
                        border: [0],
                         fix: false,//去掉默认边框
                        closeBtn: [1, false], //去掉默认关闭按钮
                        shift: 'center', //从左动画弹出
                        page: {
                            html:html
                        },
                        end:function(){
                            $(".xubox_layer").css("display","none");
                        }, success: function(layero){
                        $(".xubox_layer").css("position","absolute");  
                      var heights = $(document).scrollTop();;
                       $(".xubox_layer").css("margin-top",heights-100); 
                        }
                    });
                   
                });

            });

        }else if(types == 4){
            //图文模板
            initImageTextData('',function(items){
                laytpl($("#artImageTextLayerTmpl").html()).render({
                    download_url:download_url,
                    id:relayId||'',
                    shopId:shopId,
                    items:items
                },function(html){
                    $.layer({
                        type: 1,
                        title: false,
                        shadeClose: false,
                        area: ['auto', 'auto'],
                        bgcolor: '',
                         fix: false,
                        border: [0], //去掉默认边框
                        closeBtn: [1, false], //去掉默认关闭按钮
                        shift: 'center', //从左动画弹出
                        page: {
                            html:html
                        },
                        end:function(){
                            $(".xubox_layer").css("display","none");
                        },
                        success: function(layero){
                           $(".xubox_layer").css("position","absolute");  
                           var heights = $(document).scrollTop();;
                          $(".xubox_layer").css("margin-top",heights-100); 
                        }

                    });
                   
                });
            })

        }




    }


    /***
     * 回复弹框提示 删除
     */
    function delReplyFunTc(id,checkCode){

        laytpl($("#confirmTmpl").html()).render({
            id:id,
            check_code:checkCode

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
                page: {
                    html:html
                }
            });
        });
    }


    /***
     * 删除内容提醒
     */
    function DelContentFun(reply_id){
        //取消 清空关键词和输入 图片id 图片路径
        $('#showRelay'+reply_id).children("textarea").html("");//清空回复内容
        $("#save_content"+reply_id).val("");//清空隐藏域保存的回复内容
        $('#showRelay'+reply_id).children(".auto_reply_right_pic").find('.upload_imgs').attr('data-material_id',"");
        $('#showRelay'+reply_id).children(".auto_reply_right_pic").find('.upload_imgs').css('background-image',"url()");
        $('#showRelay'+reply_id).find('div.imgAndContetEL').children().remove();//清空图文回复
        $('#showRelay'+reply_id).find('div.imgAndContetEL').attr("data-material_id",'');//清空素材id
        $('#showRelay'+reply_id).find('div.imgAndContetEL').css("border",'0px');
        $("#showRelay"+reply_id).siblings('.auto_reply_right_buts').find("[class=icon-delta]").hide();
        $('#showRelay'+reply_id).children().removeClass('overflow_y_s');
        // $('#exactWord'+reply_id).children('.keyWordEL').children().remove();//清空关键词
        layer.closeAll();
    }




    /**
     * 删除规则执行
     */
    function confrimDelFun(id,checkCode){
        if(!id || !checkCode){
            console.log("参数有误");
            return;
        }if (checkCode=="new") {
            //删除新建
            layer.closeAll();
            layer.msg("删除成功",2,1);
            $("#addReply").children().remove();//
            var text_value =$("#replyList").children().text();

            //为空
            if (!text_value) {
                $(_pageId+ '#noRulesEl').show();
                $(_pageId+ '#replyList').hide();
            }
            return;
        }

        $.ajax({
            url:requestUrl.material.delReply+id,
            data:{
                user_id : userId,
                id : id,
                check_code : checkCode
            },
            type:"post",
            dataType:'json',
            async:false,
            traditional: true,
            success:function(resData){
                if(resData.status==200){
                    layer.closeAll();
                    layer.msg("删除成功",2,1);
                    location.hash='';
                    window.location.reload();
                }else{
                    console.log(resData);
                }

            },error:function(e){
                console.log(e);
            }
        });
    }

    //文字弹框输入内容确认
    /***
     *@param relayId id
     *@param types 回复类型
     *@param contents 回复内容文字
     */
    function insertTestArea(relayId,types){
        //填充到回复框内 弹窗确认按钮
        var contentText =  $('#textareaEdit'+relayId).val();//获取输入的回复语
        if (!contentText) {
            layer.msg("请输入回复",1,3);
            return;
        }
        //填充右边编辑关键字模板  文字
        var relayHtml = '<textarea data-type ="0"  class="auto_reply_right_txt fl " readonly="readonly" >'+contentText+'</textarea>';
        $(_pageId +"#showRelay"+relayId).html(relayHtml);
        $("#reply_type"+relayId).val(types);//给隐藏域赋值type，提交保存的时候需要获取此参数
        $("#save_content"+relayId).val(contentText);//给隐藏域赋值content，提交保存的时候需要获取此参数
        $("#showRelay"+relayId).siblings('.auto_reply_right_buts').find("[class=icon-delta]").show();
        /* $('#showRelay'+relayId).children('textarea').html(contentText);
         $('#showRelay'+relayId).children('textarea').attr("readonly",true);*/
        layer.closeAll();

    }

    //判断是否可以提交
    function checkIsRelayRules(pramData){

        var keyWords = pramData.key_words;
        var rlueName = pramData.rule_name;
        var keyType = pramData.key_type;
        var type =pramData.type;
        var materialId = pramData.material_id;
        var content = pramData.content;
        if(keyWords.length==0 || !rlueName || !keyType || !type){
            if(keyWords.length==2){   //"[]"
                layer.msg("请设定关键词和回复!",1,3);
                return false;
            }
            /*if(!rlueName){
             layer.msg("规则名不能为空!",1,3);
             return false;
             }*/
            if(!type){
                layer.msg("请设定关键词和回复!",1,3);
                return false;
            }

        }
        if(type == 0 && materialId==0){
            if (!content) {
                layer.msg("请添加回复内容！",1,3);
                return false;
            }


        }if(type > 0 && !materialId){
            layer.msg("请选择回复内容！",1,3);
            return false;

        }
        return true;
    }




    //获取用户图片资源
    function initImageData(callBack){
        //2.图片父级函数

        //查询图片素材
        $.get(requestUrl.material.selectMaterial,{
            user_id:userId,
            type:1,
            is_sync:0,
            page:1,
            rows:500
        },function(resData){
            if(resData.status==200 && resData.content){
                var items= JSON.parse($.base64.decode(resData.content,"utf8"));
                callBack(items);
            }else{
                callBack({});
                console.log("错误信息：获取数据异常");
            }

        });
    }

    //条件查询图文
    function initImageTextData(keys,func){
        //1.图文父级函数
        //查询图文素材
        $.get(requestUrl.material.selectNewsList,{
            user_id:userId,
            is_sync:0,
            search_word: keys||'',
            page:1,
            rows:500
        },function(resData){
            if(resData.status==200 && resData.content){
                var items= JSON.parse($.base64.decode(resData.content,"utf8"));
                func(items);
            }else{
                func({});
                console.log(resData.errorMessage);
            }
        });
    }

    /**
     * 条件查询图文填充到展示区
     */
    function seachImageTextData(keys){
        //1.图文父级函数
        //查询图文素材
        $.get(requestUrl.material.selectNewsList,{
            user_id:userId,
            is_sync:0,
            search_word: keys||'',
            page:1,
            rows:500
        },function(resData){
            if(resData.status==200 ){
                var items= {};
                if(resData.content){
                    items=JSON.parse($.base64.decode(resData.content,"utf8"));
                }
                laytpl($("#seachImageTextTmpl").html()).render({
                    items:items,
                    download_url:download_url
                },function(html){
                    $(".wxpt_zw").html(html);
                });

            }else{
                console.log(resData.errorMessage);
            }
        });
    }


    /***
     * 选中图片确认
     */
    function addImageFun(relay_id){
        //如果是已有规则回复
        var imgUrl="";
        var material_id ="";
        $(".wxpt_tuwenmain li").each(function(){
            if($(this).find(".poi2").length>0){
                imgUrl =  $(this).children("img").attr("src");//获取图片路径
                material_id = $(this).data("material_id");//素材id
                return false;
            }
        });
        $("#reply_type"+relay_id).val(1);//隐藏域 回复类型
        //填充图片
        var imgHtml = '<div class="auto_reply_right_pic  fl overflow_y_s">'
            + '<a class="upload_imgs" data-material_id='+material_id+' style="background-image:url('+imgUrl+')"></a></div>';
        $(_pageId +"#showRelay"+relay_id).html(imgHtml);

        $("#showRelay"+relay_id).siblings('.auto_reply_right_buts').find("[class=icon-delta]").show();
        layer.closeAll();

    }
    /***
     * 图文选中并填充到展示区
     */
    function addImageTextFun(relay_id){

        //选中中
        $("ul[class='wxpt_tuwenmain'] li").each(function(){
            if($(this).find(".poi2").length>0){
                var materialId =$(this).data("material_id");//获取素材id
                InsertImgAndContentEd(relay_id,materialId);//替换填充
                return false;
            }
        });
        $("#reply_type"+relay_id).val(4);//隐藏域 回复类型
        $("#showRelay"+relay_id).siblings('.auto_reply_right_buts').find("[class=icon-delta]").show();
        layer.closeAll();
    }




    //批量上传图片
    $("body").delegate("input[data-id='fileUpload']","click",function(){

        /********************批量上传图片*****************************/
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

                    if (uploadFile.size < 2048576){
                        var xhr=data.submit();
                        xhrList.push(xhr);
                    }else{
                        layer.msg("请选择2M以内的图片！",1,3);
                        return false;
                    }


                    var htms= ['<li class="wxpt_picli poi1" id="'+name+'" >',
                        '<img src="'+e.target.result+'" width="204" height="135">',
                        '</li>'];
                    htms=htms.join("");

                    if($('.wxpt_tuwenmain').length>0){

                        if($("#containerUl").length==0){
                            $("#empty").after('<ul id="containerUl" class="wxpt_tuwenmain wxpt_uppicmain"  data-type="1"></ul>').remove();
                        }

                        $('.wxpt_tuwenmain').prepend(htms);
                        //选中
                        $('.wxpt_tuwenmain').children('li').find("p[class='poi2 wxpt_picseleed']").remove();
                        $('.wxpt_tuwenmain ').find('li:first').append('<p class="poi2 wxpt_picseleed" style="display:block"></p>');

                    }else{

                        $('[data-tab="true"]').hide();
                        $("#tabContent ul").hide();
                        $("#tabContent ul").eq(2).show().html(htms);
                    }

                };

            },
            done: function (e, data) {
                var name = data.content;
                if(data.result.status == 200){
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
                                $("#"+name).attr("data-material_id",item.id);
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
            console.log(progress);
            if(progress==100){
                imgsTotal=0;
            }
        });



    });




    //页面直接提交删除
    window.confrimDelFun = confrimDelFun;
    window.insertTestArea = insertTestArea;
    window.addImageFun = addImageFun;
    window.addImageTextFun = addImageTextFun;
    window.DelContentFun = DelContentFun;
    /******执行******/
    replyControl.init();
    /************/




});


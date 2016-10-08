
$(function(){
    //add other entrance
    var accessToken =  globalUtil.getUrlParam("accessToken") ||  globalUtil.getUrlParam("access_token") || $.cookie('access_token');
    globalUtil.entranceFilter(accessToken);

    var userId=store.get("shopIdAndUserId").user_id;
    var shopId=store.get("shopIdAndUserId").shop_id;

    var shop_id =shopId;
//#art!531
    if(!userId){
        window.location.href= wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
    }

    //设置导航
    $("#sendWXInfo").attr("href", "/o2o/route/"+ wxGLOBAL.shopSid + "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));
    document.title="新建微信群发消息";
    /**
     * 判断当前店铺是否绑定公众号没有则跳到绑定页面
     */
    $.get(requestUrl.user.appInfo,{
        shop_id:shop_id,
        user_id:userId
    },function(data){
        if(data.status==200 && data.content){
            //当前点店铺已开通微信公众号
            var datas =JSON.parse($.base64.decode(data.content,"utf-8"));

            if(datas.service_type_info==0 ||datas.service_type_info==1){
                //0订阅号
                wxPubInfoApp.rendTemp(datas);
                /*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
                 $("#w998").html(htm);
                 $('.wxtf_menu2').remove();*/
            }else if(datas.service_type_info==2){
                //2服务号 //-1未认证
                if(-1 == datas.verify_type_info){
                    wxPubInfoApp.rendTemp(datas);

                    /*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，无法使用该功能。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
                     $("#w998").html(htm);
                     $('.wxtf_menu2').remove();*/
                }
            }

        }else if(data.status==25){
            location.href="/o2o/route/"+wxGLOBAL.shopSid+"/auth-register_server_number"
        }
        else{
            console.log("错误信息:"+data.error_message);
        }
    });



    var wxPubInfoApp={

        rendTemp:function(content){

            //数据渲染dom
            laytpl($("#yingdaoTemp").html()).render({
                content:content,
                qrCodeImg:wxGLOBAL.download_url+"/image/"+content.qr_file_image,

            },function(html){
                $("#w998").empty().append(html).css({"background-color":"#fff"});
                $(".container").css({"margin-right":"auto","margin-left":"auto","padding-left":"15px"});
                $(".upgradeLink").attr("href","/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#upgrade");
                $(".authLink").attr("href","、/o2o/route/"+wxGLOBAL.shopSid+"/help-wechat_help_center#auth");
                $(".downLoadCodeImg").attr("href",wxGLOBAL.download_url+content.qr_file_image);
                $(".wxtf_menu2").remove();
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

    };


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

    });



    if((location.hash).indexOf('#art')>-1){
        var hashStr=location.hash;
        var id=hashStr.split("!")[1];
        $.get(requestUrl.material.selectMaterialInfo+id,{
            user_id:userId
        },function(resData){
            if(resData.status==200 && resData.content){
                var items= JSON.parse($.base64.decode(resData.content,"utf8"));

                if(items.media_id){
                    //已同步
                    laytpl($("#artContainerTmpl").html()).render({
                        item:items
                    },function(html){
                        $('[data-tab="true"]').hide();
                        $("#tabContent").show();
                        $("#tabContent ul").eq(0).html(html).append('<p class="wxqf_ul03_menu poi2" style="display:block;">  <a onclick="artLayer(0);"><i class="icon-wxsucaizw03"></i></a>  <a data-del-container="true"><i class="icon-wxsucaizw02"></i></a> </p>');
                        //图文消息

                        if($("#tabContent ul").eq(0).html()){
                            $("#tabContent ul").eq(0).show();
                        }else{
                            $('[data-tab="true"]:first').show();
                        }
                    });
                }

            }
        });

        location.hash='';

    }else{
        location.hash='';
    }

    var page=location.hash.replace('#!page=', '') || 1;
    var rows=8;//每页多少行

    var sendParam={
        userCheckedList:[],//群发对象列表
        selectAll:false,
        sendText:{}	  //发送内容
    };
    /**************/

    $("body").delegate('input[data-time="true"]',"click",function(){
        laydate({istime: true, format: 'YYYY-MM-DD'});
    });

    $(".weixinaddbut").on("click",function(){
        //群发对象选择事件

        //1获取店铺列表
        var items=[];
        $.ajax({
            url:requestUrl.shop.selectShopListByUserId,
            data:{ user_id:userId},
            dataType:'json',
            async:false,
            success:function(resData){
                if(resData.status==200 && resData.content){
                    items= JSON.parse($.base64.decode(resData.content,"utf8"));
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
                        shift: 'top', //从左动画弹出
                        page: {
                            html: $("#sendErrorTipsTmpl").html().replace("{{tips}}","数据异常，没有店铺！")
                        }
                    });
                }
            }
        });
        if(items.length==0){
            return;
        }
        laytpl($("#artSelectCustomTmpl").html()).render({
            download_url:wxGLOBAL.download_url,
            shopItems:items
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
                shift: 'top', //从左动画弹出
                page: {
                    html:html
                },
                success: function(layero){
                    seachUserList(-1,page);

                    if(sendParam.selectAll){
                        $('input[name="selectAll"]').prop("checked",true);
                    }

                }
            });
        });
        $("#getNumber").text(sendParam.userCheckedList.length||0);

        setTimeout(function(){
            if(sendParam.userCheckedList.length==0){
                $('input[name="selectAll"]').click();
            }
        },300);

    });

    function confrimSelectUserFun(){

        $("#selectNumber").text(sendParam.userCheckedList.length);
        layer.closeAll();
        location.hash='';
    }

    function clearSelectedFun(){
        $('input[name="selectAll"]').prop("checked",false);
        $('#getNumber').text(0);
        $('#selectNumber').text(0);
        sendParam.userCheckedList=[];
        $('input[name="custom"]').each(function(){
            $(this).prop("checked",false);
        });

    }

    window.confrimSelectUserFun=confrimSelectUserFun;
    window.clearSelectedFun=clearSelectedFun;

    $("body").delegate('#seachCustomByCondition',"click",function(){
        //条件查询顾客
        var lianType=$("input[name='lianType']:checked").val(),
            shop_id=$("input[name='shop']:checked").val(),
            startTime=$('input[name="startTime"]').val(),
            endTime=$('input[name="endTime"]').val();
        if((startTime && !endTime) || !startTime && endTime){
            layer.msg("起止时间不能为空！", 2);
            return;
        }
        if((startTime && !endTime) || !startTime && endTime){
            if(!startTime){
                startTime="1900-01-01 00:00:00";//默认开始时间
            }else{
                //得到服务器时间
                var date;
                $.ajax({
                    url:webRoot+"/"+shopId+"/dialog/getNowTime",
                    type:'get',
                    async: false,
                    success:function(data){
                        date=new Date(data.time);
                    }});
                var bombay = date + (3600000 * 8);
                var time = new Date(bombay);
                endTime = time;
            }
        }
        if(startTime && endTime){
            //转换为毫秒数
            startTime = (new Date(startTime+" 00:00:00")).getTime();
            endTime = (new Date(endTime+" 23:59:59")).getTime();
        }

        location.hash='';
        seachUserList(shop_id,1,startTime,endTime,lianType);
        setTimeout(function(){
            $('input[name="selectAll"]').prop("checked",true).click();
        },500);

    });

    //查询用户列表
    function seachUserList(shop_id,page,startTime,endTime,lianType){
        $.ajax({
            url:requestUrl.user.selectUserChooseList,
            data:{
                user_id : userId,
                start_time : startTime ||'',
                end_time : endTime ||'',
                shop_id : shop_id || -1,
                has_mobile : lianType || -1,
                page:page,
                rows:rows
            },
            type:'get',
            dataType:'json',
            success:function(resData){
                if(resData.status==200 && resData.content){
                    var  items= JSON.parse($.base64.decode(resData.content,"utf8"));
                    laytpl($("#userListTmpl").html()).render({
                        items:items
                    },function(html){
                        $("#userContainer").html(html);
                        checkedUserFun();
                        var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : Math.floor(resData.totalCount/rows+1));
                        laypage({
                            cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                            pages: totalPage, //总页数
                            curr: location.hash.replace('#!page=', '')||1, //获取hash值为fenye的当前页
                            hash: 'page', //自定义hash值
                            jump: function(obj,first){
                                if(!first){
                                    seachUserList(shop_id,obj.curr,startTime,endTime,lianType);
                                }
                            }
                        });
                    });
                }else{

                    if(resData.status==37){
                        $("#userContainer").html('<div class=" editston_tise editston_tise01"><i class="icon-editup03 fl"></i>您当前绑定的账号为未认证的服务号或订阅号，无法选择群发对象，请重新绑定认证服务号</div>');
                    }else{
                        $("#userContainer").html('<div class=" editston_tise editston_tise01"><i class="icon-editup03 fl"></i>暂无微信用户，请新增</div>');
                    }

                    laypage({
                        cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                        pages: 0, //总页数
                        curr: location.hash.replace('#!page=', '')||1, //获取hash值为fenye的当前页
                        hash: 'page', //自定义hash值
                        jump: function(obj,first){
                        }
                    });

                }
            }
        });
    }


    //全选事件
    $("body").delegate('input[name="selectAll"]',"click",function(){
        if($(this).is(":checked")){
            sendParam.selectAll=true;
            //查询所有的 符合条件 的顾客列表
            //条件查询顾客
            var lianType=$("input[name='lianType']:checked").val(),
                shop_id=$("input[name='shop']:checked").val(),
                startTime=$('input[name="startTime"]').val(),
                endTime=$('input[name="endTime"]').val();

            if(startTime){
                startTime=new Date(startTime+" 00:00:00").getTime();
            }
            if(endTime){
                endTime=new Date(endTime+" 23:59:59").getTime();
            }
            //////////////初始化全选已全中所有数据///////////////////
            initAll(userId,startTime,endTime,shop_id,lianType);

            //全选当前页checkbox
            $('input[name="custom"]').each(function(){
                $(this).prop("checked",true);
            });

        }else{
            sendParam.selectAll=false;
            sendParam.userCheckedList=[];//清空
            //反选当前页checkbox
            $('input[name="custom"]').each(function(){
                $(this).prop("checked",false);
            });
            $("#getNumber").text(sendParam.userCheckedList.length||0);
        }
    });

    function initAll(userId,startTime,endTime,shop_id,lianType){
        //初始化全选
        $.get(requestUrl.user.selectUserChooseList,{
            user_id : userId,
            start_time : startTime || '',
            end_time : endTime || '',
            shop_id : shop_id || -1,
            has_mobile : lianType || -1,
            page:1,
            rows:5000
        },function(resData){
            if(resData.status==200 && resData.content){
                sendParam.userCheckedList= JSON.parse($.base64.decode(resData.content,"utf8"));

                $("#getNumber").text(resData.totalCount||0);
                $("#selectNumber").text(sendParam.userCheckedList.length);
            }else{
                $("#getNumber").text(resData.totalCount||0);
                $("#selectNumber").text(0);
                sendParam.userCheckedList.length=0;
                $('input[name="selectAll"]').prop("checked",false);
            }
        });
    }

    initAll(userId);
    sendParam.selectAll=true;

    function checkedUserFun(){
        //选中当前列表的checbox
        var $customs=$('input[name="custom"]');
        var len=sendParam.userCheckedList.length;
        if($customs.length>0 && len>0){
            var customIds=[];
            $customs.each(function(){
                customIds.push({
                    id:$(this).val(),
                    obj:$(this)
                });
            });

            for (var i = 0; i < len; i++) {
                for (var j = 0; j < customIds.length; j++) {
                    if(customIds[j].id == sendParam.userCheckedList[i].open_id){
                        customIds[j].obj.prop("checked",true);
                    }
                }
            }
        }
    }


    function delUser(id){
        if(id){
            for (var i = 0; i < sendParam.userCheckedList.length; i++) {
                if(sendParam.userCheckedList[i].open_id==id){
                    sendParam.userCheckedList.splice(i, 1);
                }
            }
            $("#getNumber").text(sendParam.userCheckedList.length||0);
        }
    }

    function addUser(id){
        if(id){
            var bool=true;
            for (var i = 0; i < sendParam.userCheckedList.length; i++) {
                if(sendParam.userCheckedList[i].open_id==id){
                    bool=false;
                    sendParam.userCheckedList.splice(i, 1);
                }
            }
            if(bool){
                sendParam.userCheckedList.push({
                    open_id:id
                });
            }
            $("#getNumber").text(sendParam.userCheckedList.length||0);
        }
    }

    $("body").delegate('input[name="custom"]',"click",function(){

        if($('input[name="selectAll"]').is(":checked")){
            //从列表从删除单个顾客
            if(!$(this).is(":checked")){
                delUser($(this).val());
                sendParam.selectAll=false;
                $('input[name="selectAll"]').prop("checked",false);
            }
        }else{
            if($(this).is(":checked")){
                //单个顾客加入到列表中
                addUser($(this).val());
            }else{
                //从列表从删除单个顾客
                delUser($(this).val());
                sendParam.selectAll=false;
                $('input[name="selectAll"]').prop("checked",false);
            }
        }
    });

    /************************************淫荡的分割线**************************************************/
    function artLayer(type){
        //type 0 图文素材， 1 图片素材
        if(type && type==1){
            initImageData(function(items){
                laytpl($("#artImageLayerTmpl").html()).render({
                    download_url:wxGLOBAL.download_url,
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
                        page: {
                            html:html
                        },
                        end: function(){

                        }
                    });
                });
            });

        }else{
            initImageTextData('',function(items){
                laytpl($("#artImageTextLayerTmpl").html()).render({
                    download_url:wxGLOBAL.download_url,
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
                        page: {
                            html:html
                        },
                        end: function(){

                        }
                    });

                });

            });
        }
    }

    function initImageTextData(keys,func){
        //1.图文父级函数

        //查询图文素材
        $.get(requestUrl.material.selectNewsList,{
            user_id:userId,
            is_sync:0,//非同步的素材 不显示
            search_word: keys||'',
            page:1,
            rows:50
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

    function seachImageTextData(keys){
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
                    items:items
                },function(html){
                    $(".wxpt_zw").html(html);
                });

            }else{
                console.log(resData.errorMessage);
            }
        });
    }

    function initImageData(func){
        //2.图片父级函数

        //查询图片素材
        $.get(requestUrl.material.selectMaterial,{
            user_id:userId,
            type:1,
            is_sync:0,
            page:1,
            rows:50
        },function(resData){
            if(resData.status==200 && resData.content){
                var items= JSON.parse($.base64.decode(resData.content,"utf8"));
                func(items);
            }else{
                func({});
                console.log("错误信息：获取数据异常");
            }

        });
    }


    var imageText='';//
    $("body").delegate("#seachKeys","click",function(){
        //搜索
        var keys=$("input[name='seachWords']").val();
        if(!imageText){
            imageText=$(".wxpt_zw").html();
        }
        seachImageTextData(keys);
    });
    $("body").delegate("#getAll","click",function(){
        //查看全部
        if(imageText){
            $(".wxpt_zw").html(imageText);
            $("input[name='seachWords']").val('');
        }
    });


    /************************************淫荡的分割线**************************************************/
    $(".wxqf_ul01 li").on("click",function(){
        //tab切换
        var index=$(this).attr("data-index");
        $(this).parent().find("li").removeClass("activ");
        $(this).addClass("activ");

        $('[data-tab="true"]').hide();
        $("#tabContent ul").hide();

        if(index==='4'){
            //图文消息

            if($("#tabContent ul").eq(0).html()){
                $("#tabContent ul").eq(0).show();
            }else{
                $('[data-tab="true"]:first').show();
            }

        }else if(index==='0'){
            //文字消息
            $('[data-tab="true"]').eq(1).show();

        }else if(index==='1'){
            //图片消息
            if($("#tabContent ul").eq(2).html()){
                $("#tabContent ul").eq(2).show();
            }else{
                $('[data-tab="true"]:last').show();
            }
        }
    });



    $("textarea").on("keyup",function(){
        //计数
        var num=(600-Number($(this).val().length));
        if(num<=0){
            $("#textNumber").text(0);
            $(this).val($(this).val().substring(0,600));
            return;
        }
        $("#textNumber").text(num);
    });


    $("body").delegate(".wxpt_tatle a:last","click",function(){
        //搜索事件
        var keyWords=$('input[name="keyWords"]').val();
        if(keyWords){
            initImageTextData(keyWords,function(items){

                laytpl($("#liTmpl").html()).render({
                    download_url:wxGLOBAL.download_url,
                    items:items
                },function(html){
                    console.log("执行了搜索");
                    $('ul[class="wxpt_tuwenmain"]').empty().append(html);
                });

            });
        }

    });

    $("body").delegate(".wxpt_tuwenmain li","click",function(){
        //弹出层列表选择事件
        if($(".poi2",this).length>0){
            $(".poi2",this).remove();
        }else{
            $(this).parent().find("li").find("p[class='poi2 wxpt_picseleed']").remove();
            $(this).append('<p class="poi2 wxpt_picseleed" style="display:block"></p>');
        }
    });
    /**********************************************************/
    $("body").delegate(".wxqf_openqrul2 a:first","click",function(){
        //弹出层 确定事件
        var arrIds=[];
        $(".wxpt_tuwenmain li").each(function(){
            if($(".poi2",this).length>0){
                arrIds.push($(this).attr("data-id"));
            }
        });
        if(arrIds.length==0){
            setTimeout(function(){

                $.layer({
                    type: 1,
                    time: 1,
                    title: false,
                    shadeClose: false,
                    area: ['auto', 'auto'],
                    bgcolor: '',
                    border: [0], //去掉默认边框
                    closeBtn: [1, false], //去掉默认关闭按钮
                    shift: 'top', //从左动画弹出
                    page: {
                        html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择一个内容！")
                    }
                });
            },1000);
            return;
        }
        $('[data-tab="true"]').hide();
        $("#tabContent").show();

        $(".wxpt_tuwenmain li").each(function(){
            if($(".poi2",this).length>0){
                var type=$(this).parent().attr("data-type");
                if(type==4){
                    $("#tabContent ul").eq(0).html($(this).clone()).append('<p class="wxqf_ul03_menu poi2" style="display:block;">  <a onclick="artLayer(0);"><i class="icon-wxsucaizw03"></i></a>  <a data-del-container="true"><i class="icon-wxsucaizw02"></i></a> </p>');
                    //图文消息

                    if($("#tabContent ul").eq(0).html()){
                        $("#tabContent ul").eq(0).show();
                    }else{
                        $('[data-tab="true"]:first').show();
                    }
                }else{
                    $("#tabContent ul").eq(2).html($(this).clone()).append('<p class="wxqf_ul03_menu poi2" style="display:block;">  <a onclick="artLayer(1);"><i class="icon-wxsucaizw03"></i></a>  <a data-del-container="true"><i class="icon-wxsucaizw02"></i></a> </p>');
                    //图片消息
                    if($("#tabContent ul").eq(2).html()){
                        $("#tabContent ul").eq(2).show();
                    }else{
                        $('[data-tab="true"]:last').show();
                    }
                }
                return false;
            }
        });
        layer.closeAll();

    });


    $("body").delegate("a[data-del-container='true']","click",function(){
        //容器内删除事件
        var index=0;

        $(".wxqf_ul01 li").each(function(){
            if($(this).attr("class")=='activ'){
                index=$(this).attr("data-index");
            }
        });

        $("#tabContent").removeAttr("style");
        $(this).parent().parent().hide();
        if(index==4){
            //图文
            $('ul[data-tab="true"]').eq(0).show();
        }else if(index==1){
            //图片
            $('ul[data-tab="true"]').eq(1).show();
        }
        $(this).parent().parent().empty();

    });



    window.artLayer=artLayer;
    /****************************************/

    function artConfirmFun(obj){
        var tmpl='';
        var openIds=[];
        for (var i = 0; i < sendParam.userCheckedList.length; i++) {
            openIds.push(sendParam.userCheckedList[i].open_id);
        }

        var type=0;
        var content=$("textarea").val();
        var materialId4=$("#tabContent ul").eq(0).find("li").attr("data-id");
        var materialId1=$("#tabContent ul").eq(2).find("li").attr("data-id");

        $(".wxqf_ul01 li").each(function(){
            if($(this).attr("class")=='activ'){
                type=$(this).attr("data-index");
                return false;
            }
        });

        if(!type || openIds.length<2 || !materialId4 || !materialId1 || !content){
            if(openIds.length<2){
                tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","至少选择两个群发对象！");
            }else if(openIds.length==0){
                tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","未选中群发对象！");
            }else if(!content && type==0){
                tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","请添加群发内容！");
            }else if(!materialId4 && type==4){
                tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","请添加群发内容！");
            }else if(!materialId1 && type==1){
                tmpl=$("#sendErrorTipsTmpl").html().replace("{{tips}}","请添加群发内容！");
            }
        }
        if(!tmpl){
            tmpl=$("#sendConfirmTmpl").html();
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
                    html:tmpl
                }
            });

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
                shift: 'top', //从左动画弹出
                page: {
                    html:tmpl
                }
            });
        }

    }

    window.artConfirmFun=artConfirmFun;

    $("body").delegate("#sendMass","click",function(){

        //发送消息
        var openIds=[];
        for (var i = 0; i < sendParam.userCheckedList.length; i++) {
            openIds.push(sendParam.userCheckedList[i].open_id);
        }

        var type=0;
        var content=$("textarea").val();
        var materialId=$("#tabContent li").attr("data-id");

        $(".wxqf_ul01 li").each(function(){
            if($(this).attr("class")=='activ'){
                type=$(this).attr("data-index");
                return false;
            }
        });

        $.ajax({
            url:requestUrl.material.addMassSend,
            data:{
                user_id:userId,
                type:type,
                material_id:materialId,
                content:content,
                open_ids:openIds
            },
            type:'post',
            dataType:'json',
            traditional: true,
            success:function(resData){
                if(resData.status==200){
                    window.location.href="/o2o/route/"+wxGLOBAL.shopSid+"/customized-weixin_mass_history_index";
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
                            html:$("#sendErrorTipsTmpl").html().replace("{{tips}}",resData.errorMessage)
                        }
                    });
                }
            },
            error:function(e){
                console.log(e);
            }
        });





    });




    $("body").delegate("input[data-id='fileUpload']","click",function(){

        /********************批量上传图片*****************************/
        var xhrList=[],
            imgsTotal=0;

        $(this).fileupload({
            url:upload_url,
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
                if (imgsTotal > 10) {
                    imgsTotal--;
                    layer.msg("不允许同时上传10张以上的图片！",2);
                    return false;
                }

                var uploadFile = data.files[0];

                var  reader = new FileReader();
                if (!reader) {
                    console.log('该抛弃这老旧的浏览器了');
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
                                html:$("#sendErrorTipsTmpl").html().replace("{{tips}}","请选择2M以内的图片！")
                            }
                        });
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
                    }else{

                        $('[data-tab="true"]').hide();
                        $("#tabContent").show();
                        $("#tabContent ul").eq(2).show().html(htms).append('<p class="wxqf_ul03_menu poi2" style="display:block;">  <a onclick="artLayer(1);"><i class="icon-wxsucaizw03"></i></a>  <a data-del-container="true"><i class="icon-wxsucaizw02"></i></a> </p>');
                    }

                };

            },
            done: function (e, data) {
                var name = data.content;
                if(data.result.status == 200){

                    console.log(userId,data.result.data.id);

                    $.post(requestUrl.material.addMaterial,{
                        user_id:userId,
                        type : 1,
                        file_id : data.result.data.id
                    },function(resData){
                        if(resData.status==200){
                            var item= JSON.parse($.base64.decode(resData.content,"utf8"));
                            $("#"+name).attr("data-id",item.id);
                        }else{
                            console.log("错误信息：",JSON.stringify(resData));
                        }
                    },'json');

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



});

/**
 * [描述] 用户管理
 * @date 2016.06.23
 * @auther Antony-余光宝
 */
$(function(){


    //add other entrance
    var accessToken =  globalUtil.getUrlParam("accessToken") ||  globalUtil.getUrlParam("access_token") || $.cookie('access_token');
    globalUtil.entranceFilter(accessToken);

    /***********************初始化数据 start*****************************************/
    Date.prototype.format = function(format){
        var o = {
            "M+" : this.getMonth()+1, //month 
            "d+" : this.getDate(), //day 
            "h+" : this.getHours(), //hour 
            "m+" : this.getMinutes(), //minute 
            "s+" : this.getSeconds(), //second 
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
            "S" : this.getMilliseconds() //millisecond 
        };

        if(/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    };
    var rows=$("#limit").val()||10;//每页多少行
    var bindStatus = $("#bindStatus").val();
    var _pageId = '#upweixin_custom_index ';//当前全局控制; //当前全局控制 注意要空格
    var endDate = new Date().format('yyyy-MM-dd'); //结束时间 
    $("#endDate").val(endDate);//隐藏域
    var association_htmlEl ="";//获取当前el，点击关联成功后用于改变其值
    var userInfoData =null;//
    //授权相关
    var accessToken = globalUtil.getUrlParam("accessToken") ||  globalUtil.getUrlParam("access_token") || store.get("wx_access_token");
    if(accessToken){
        //wx_access_token
        store.remove("wx_access_token");
        store.set("wx_access_token",accessToken);

        //清空授权码
        store.remove("wxAuthCode");
        //获取授权码
        globalUtil.getWXAuthCode(accessToken);

        globalUtil.getUserInfo(accessToken);

    }
    var shop_id = store.get("shopIdAndUserId").shop_id;//主键
    var shopId=wxGLOBAL.shopSid;//SID
    var shopUserId= store.get("shopIdAndUserId").user_id;

    var userId =shopUserId;
    var itemHas = window.location.hash.substr(1) || "";
    if(itemHas.search(/page/) >0){
        bindStatus=-1;
    }else{
        bindStatus =itemHas;
    }




    $("#bindStatus").val(bindStatus);//
    //初始化数据
    if(bindStatus){
        $(".weixin_user_plusmenu a").removeClass("activ");

        $("a[data-status='"+bindStatus+"']").addClass("activ");
    }


    if(!shopUserId){
        window.location.href=wxGLOBAL.homeUrl+"/"+wxGLOBAL.shopSid;
    }
    //设置导航
    $("#sendWXInfo").attr("href", "/o2o/route/"+ wxGLOBAL.shopSid+ "/thirdpartnar-send_public_message?access_token=" + store.get("wx_access_token"));

    document.title="微信用户管理";

    if(itemHas.search(/page/g)>0){
        var curPage =location.hash.replace('#!page=', '') || 1;//当前页

    }else{
        var curPage=1;
    }
    /***********************初始化数据 end*****************************************/


    /************************方法初始化 Start**************************************/
    var manageControl = {
        //初始化加载数据
        init : function(){

            $(_pageId + 'errorMsg').hide();//隐藏错误提醒
            initDateRangpick();//时间控件
            bindEvent();  //初始化绑定事件
            isCheckWeiXinbind(shop_id,shopUserId);//判断当前店铺是否绑定公众号没有则跳到绑定页面

        }
    };
    /*******************方法初始化 end***********************************************/

    /*******************绑定方法 start*******************************************/
    //绑定方法
    function bindEvent(){

        //条件查询用户列表点击事件
        $(_pageId + "#searchButton").on("click",function(){
            $("#searchButton").attr("data-btn",1);
            $(this).attr("name","1");// 查询需要判断手机号码  1判断   0不判断
            location.hash='';//重置hash值
            getSelectCondition(1);

        });

        //重置条件查询用户列表点击事件
        $(_pageId + "#resethButton ").on("click",function(){
            //重置
            var startDates = '2014-01-01';//开始时间
            var endDates = new Date().format('yyyy-MM-dd'); //结束时间
            $("#startDate").val(startDates);
            $("#endDate").val(endDates);
            $(_pageId + '#telPhone').val('');
            curPage = 1;
            bindStatus = -1;
            $("#bindStatus").val(bindStatus);
            $(_pageId + '#searchButton').attr("name","0");// 查询需要判断手机号码  1判断   0不判断
            $(_pageId + '.weixin_user_plusmenu a').removeClass("activ");
            $(_pageId + '.weixin_user_plusmenu a').first().addClass("activ");
            $(_pageId + '#errorMsg').html('');
            $(_pageId + '#errorMsg').hide();//错误提醒
            initDateRangpick();
            location.hash='';//重置hash值
            getSelectCondition(1);
        });




        //条件查询选项卡
        $(_pageId + ".weixin_user_plusmenu a").on("click",function(){
            var bindStatus =$(this).data('status');//查询类型
            $("#bindStatus").val(bindStatus);
            $(this).parent().find("a").removeClass("activ");
            $(this).addClass("activ");
            location.hash='';//重置hash值
            getSelectCondition(1);

        });


        var userInfoList =null;
        //取消关联
        $(_pageId + '#tempUserInfo').delegate('.weixin_user_tab_list .a6 >a','click',function(){
            var text_value = $(this).attr("name");//1未关联，0 已关联
            association_htmlEl =$(this);//获取当前el，点击关联成功后用于改变其值

            if (text_value==1) {
                //已关联
                userInfoList = $(this).data("userinfo");//获取用户信息 具有 name img tel 等属性
                userInfoList.shop_sid="";
                userInfoList.shop_sid = shopId;//赋值商店属性

                $(_pageId + '#search_boxshade').show();//遮罩显示
                $(_pageId + '#search_box').show();//搜索显示
                $(_pageId + '.weixinUs_search_tc').show();//搜索显示
                $(_pageId + '#searchResultNo').hide();//搜索显示

            }else{
                //未关联
                cancelAssociation();//弹窗
            }

        });


        //搜索用户信息
        $(_pageId + "#searchUserButton").on("click",function(){
            var value_text = $(_pageId + '#search_cont').val();//获取查询用户条件

            if (!value_text) {
                $(_pageId + '#error_search').html('<span class="txtred2">请输入搜索条件!');
                return ;
            }

            //查询用户信息
            selectCustomName(value_text,userInfoList);


        });

        $(_pageId + "#closeSearch,#closeSearchResult").on("click",function(){
            closeTc();
        });

        $(_pageId + "#search_boxshade").on("click",function(){
            //关闭搜索弹框
            $(_pageId + '#search_cont').val('');
            $(_pageId + '#search_boxshade').hide();
            $(_pageId + '#search_box').hide();
            $(_pageId + '#searchResultNo').hide();

        });

        //添加顾客并关联
        $(_pageId + '.s4>a.addcustor').on('click',function(e){

            var text_value = $(this).html();
            if (text_value.indexOf("添加") !=-1) {
                getAddCustomId(userInfoData);//查询顾客id并添加
            }else{
                relationThisCustom(userInfoData);//直接添加
            }

            e.stopPropagation();
        });





    }
    /*******************绑定方法 end*******************************************/

    /***
     * 判断当前店铺是否绑定公众号没有则跳到绑定页面
     */
    function isCheckWeiXinbind(shop_ids,shopUserIds){

        $.get(requestUrl.user.appInfo,{
            shop_id:shop_ids,
            user_id:shopUserIds
        },function(data){

            if(data.status==200 && data.content ){
                var item= JSON.parse($.base64.decode(data.content,"utf8mb4"));

                if(item.service_type_info==0 || item.service_type_info==1){
                    rendTemp(item);
                    //0订阅号 //-1未认证
                    /*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为订阅号，暂无法获取数据。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
                     $(".wxminh500").html(htm);*/

                }else if(item.service_type_info==2 && -1 == item.verify_type_info){
                    rendTemp(item);
                    //2服务号 //-1未认证
                    /*var htm='<div class="ebderror_tise poi2"><img src="'+staticImage_Url+'/mljia/dengpao_r2_c2.gif" width="16" height="22">您当前绑定的账号为未认证服务号，暂无法获取数据。如果您的当前账号已升级为认证服务号，请点击<a id="refush">刷新试试~</a></div>';
                     $(".wxminh500").html(htm);*/
                }else{
                    //初始化用户列表
                    getSelectCondition(curPage);


                }

            }else if(data.status==25){
                location.href=webRoot+"/route/"+wxGLOBAL.shopSid+"/auth-register_server_number";
                //window.location.href=webRoot+"/"+(shopId || 0)+"/weixin/weixinFun";
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
                                area: ['500px', '500px'],
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


    /**
     * [getCustormList 获取用户列表] //查询微信用户管理列表
     * @return {[type]} [description]
     */

    function selectUserListFun(page,cell_phone,start_time,end_time,bind_status){
        // location.hash='';//重置hash值

        //店铺编号，员工编号，电话，开始时间，结束时间
        var params = {
            shop_id : shop_id,
            user_id : shopUserId,
            cell_phone : cell_phone||'',
            start_time : start_time||'',
            end_time : end_time||'',
            is_bind : bind_status||'',
            rows : rows,
            page : page
        };

        //获取数据
        $.get(requestUrl.user.userListUser,params,function(resData){
            if(resData.status==200 && resData.content){

                // datas ="W3siY2VsbF9waG9uZSI6bnVsbCwibmlja19uYW1lIjoiY3lsaW5kZXLwn5iA8J+YgyIsImlkIjozNiwidXNlcl9uYW1lIjoi5Zev5ZevIiwib3Blbl9pZCI6Im9icUhNd3JfXzJEZndiTjNWTlZkSmkzSkFzZGMiLCJoZWFkX2ltZyI6Imh0dHA6Ly93eC5xbG9nby5jbi9tbW9wZW4vYTJVaWNCcXVpY1kxZDRhckJQNVJHc0hlbmxqc253clQ4ck9HWjdWNW9rekdWNWR6eE5pYkhWdEJEOXNBNzUyNGFoMzFiQXZtbVZpY0hqRXJadzQ5NmFzZGQxb1BHUmFyb24ySi8wIiwiYXBwX2lkIjoid3g5YjFlMDVkMDU5YWJkMDJkIiwiYXBwX25pY2tfbmFtZSI6Iue+juS4veWKoOa1i+ivlTAyIiwiY2hlY2tfY29kZSI6ImM1MWZhZmVlLTlmMDctNDA2Mi1hYjI5LTA4OTVhMzM0NmI2ZSIsInN1YnNjcmliZV90aW1lIjoiMjAxNi0wNi0zMCAwOTo0MTo1OCJ9XQ==";
                //转义base64
                // var datas = JSON.parse($.base64.decode(resData.content,"utf-8"));

                //libase64是libbase64.min.js 挂载到window的方法，//转为utf-8
                var datas =libbase64.decode(resData.content).toString("UTF-8");
                datas = JSON.parse(datas);//转json

                if (datas.list && datas.list.length>0) {
                    //加载模版
                    var insertHtml = $(_pageId +'#userListInsert').html();

                    //134****9579
                    for (var i = 0; i < datas.list.length; i++) {
                        if (datas.list[i].cell_phone) {
                            var tel = datas.list[i].cell_phone;
                            var m = tel.substring(3, tel.length-4).replace(/./g, "*");
                            var bindedPhone = tel.substr(0,3) + m + tel.substr(tel.length-4);
                            datas.list[i].cell_phones = bindedPhone;
                        }

                    }

                    laytpl(insertHtml).render(datas.list,function(html){

                        $("#tempUserInfo").html(html);

                        var totalPage=(resData.totalCount%rows == 0 ?resData.totalCount/rows : (resData.totalCount/rows+1));
                        laypage({
                            cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                            pages: totalPage, //总页数
                            curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页,初始当前页
                            hash: 'page', //自定义hash值
                            skip: true, //是否开启跳页
                            jump: function(obj,first){
                                //console.log(obj.curr,first);
                                if(!first){
                                    selectUserListFun(obj.curr,cell_phone,start_time,end_time,bind_status);
                                }
                            }
                        });
                    });

                    if(datas.new_un_bind_count>0){
                        $("a[data-status='1']").html("未关联<span>"+datas.new_un_bind_count+"</span>");
                        $("#newUnBindCount").val(datas.new_un_bind_count);
                    }else{
                        var newUnBindCount = $("#newUnBindCount").val();
                        if(newUnBindCount && newUnBindCount!=-1){
                            $("a[data-status='1']").html("未关联<span>"+newUnBindCount+"</span>");
                        }
                    }
                    $("#searchButton").attr("data-btn",0);
                }else{

                    var insertHtml = $(_pageId +'#userListInsert').html();

                    laytpl(insertHtml).render({},function(html){
                        $("#tempUserInfo").html(html);
                        laypage({
                            cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                            pages: 0, //总页数
                            curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
                            hash: 'page', //自定义hash值
                            jump: function(obj,first){

                            }
                        });
                    });


                    var btn = $("#searchButton").attr("data-btn");
                    if(btn==1){
                        $("#yesNull").html("无符合要求的查询结果，请核对查询条件");
                    }
                }

            }else{
                var insertHtml = $(_pageId +'#userListInsert').html();

                laytpl(insertHtml).render({},function(html){
                    $("#tempUserInfo").html(html);
                    laypage({
                        cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                        pages: 0, //总页数
                        curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
                        hash: 'page', //自定义hash值
                        jump: function(obj,first){

                        }
                    });
                });


                var btn = $("#searchButton").attr("data-btn");
                if(btn==1){
                    $("#yesNull").html("无符合要求的查询结果，请核对查询条件");
                }
            }
        });

    }


    //得到查询条件 用户列表
    function getSelectCondition(page){
        var telPhone = $(_pageId +'#telPhone').val();


        var submit_value = $(_pageId +'#searchButton').attr('name');//1点击  0为点击 ，号码可以为空
        var bindStatus=$('#bindStatus').val();//获取类型 -1全部 2已关联 1 未关联 0潜在
        var start_date =$("#startDate").val();//开始时间
        var end_date =$("#endDate").val();//开始时间
        //点击了查询按钮
        var telErrMsg ='';
        if (submit_value == 1) {
            var telErrMsg = checkPhone(telPhone);//验证手机号码
            //判断电话
        }

        if (telErrMsg) {
            $(_pageId + '#errorMsg').html(telErrMsg);
            $(_pageId + '#errorMsg').show();//错误提醒
            return  ;
        }else{
            $(_pageId + '#errorMsg').html('');
            $(_pageId + '#errorMsg').hide();//错误提醒
        }

        var  dayResult = diffDate(start_date,end_date);//获取两个日期的的相差天数
        //判断相差天数
        if (dayResult < 0) {
            layer.msg("结束时就不能小于开始时间",2, 3);
            return ;
        }else{
            start_date +=" 00:00:00";
            end_date +=" 23:59:59";
        }

        //转毫秒
        start_date = (new Date(start_date)).getTime();
        end_date = (new Date(end_date)).getTime();
        // location.hash='';
        selectUserListFun(page,telPhone,start_date,end_date,bindStatus);

    }




    /***
     * 通过姓名或手机号精确查找顾客信息
     * @param nameOrtEL 用户输入
     * @param addUerInfo 用户信息
     * @htmlel 用户所以el
     */
    function selectCustomName(nameOrTel,addUserInfo){

        $.get(requestUrl.user.searchCustom,{
            "word":nameOrTel,
            "shop_id": shopId
        },function(data){
            if(data.status==200 && data.content){
                var datas = JSON.parse($.base64.decode(data.content,"utf-8"));
                if(datas!=null && datas!=""){
                    //存在用户
                    addUserInfo.custom_id ="";
                    addUserInfo.custom_id = datas[0].custom_id;
                    $(_pageId + ".weixinUs_search_tc").hide();//搜索隐藏
                    $(_pageId + "#noCustormer").hide();//隐藏未存在
                    $(_pageId + "#userInfoName").html(datas[0].custom_name);
                    $(_pageId + "#userInfoImg").css("background-image","url("+addUserInfo.img+")");
                    $(_pageId + "#userInfoTel").html(datas[0].custom_mobile);
                    $(_pageId +"#addCustormerButton").html("确定关联");//结果展示
                    $(_pageId + "#noCustormer").hide();//结果展示
                    $(_pageId + "#searchResultNo").show();//结果展示


                }else{
                    //没有查询到信息
                    $(_pageId + ".weixinUs_search_tc").hide();//搜索隐藏
                    $(_pageId + "#noCustormer").show();//隐藏未存在
                    $(_pageId + "#userInfoName").html(addUserInfo.name);
                    $(_pageId + "#userInfoImg").css("background-image","url("+addUserInfo.img+")");
                    $(_pageId + "#userInfoTel").html(addUserInfo.custom_mobile);
                    $(_pageId +"#addCustormerButton").html("添加顾客并关联");//结果展示
                    $(_pageId + "#noCustormer").show();//结果展示
                    $(_pageId + "#searchResultNo").show();//结果展示

                }

                userInfoData =  addUserInfo;//赋值全局


            }else{
                layer.msg(data.error_message,1, 3);
            }


        });

    }





    /***
     * 关联顾客
     */
    function relationThisCustom(thisUserInfo){
        thisUserInfo.shop_id="";
        thisUserInfo.mobile_phone="";
        thisUserInfo.coustom_id="";
        thisUserInfo.coustom_id =thisUserInfo.custom_id;//两个平台的custom_id字段名转换
        thisUserInfo.mobile_phone =thisUserInfo.custom_mobile;
        thisUserInfo.shop_id=shopId;
        //点击关联
        /*  "open_id":open_id,
         "app_id":reAppId,
         "coustom_id":reCustomId,
         "check_code":reCheckCode,
         "main_id":reMainId,
         "mobile_phone":rePhone,
         "shop_id":shopId*/
        $.post(requestUrl.user.relate,thisUserInfo,function(data){
            if(data.status==200){
                layer.msg('关联成功',2, 1);
                //   association_htmlEl.html('取消关联');//修改单曲a的值
                var curPages =location.hash.replace('#!page=', '') || 1;//当前页
                getSelectCondition(curPages);
                closeTc(); //关闭弹窗
            }else{
                layer.msg(data.errorMessage,1, 3);
                closeTc();
            }
        });
    }


    /***
     * 获取顾客的编号
     */
    function getAddCustomId(thisUserInfo){

        //点击关联
        $.ajax({
            url:requestUrl.user.queryCustomerId,
            type:'get',
            data:{access_token :accessToken},
            dataType:'json',
            //async:false,
            success:function(data){
                if(data.status===200 && data.content){
                    //获取到顾客customer_id; 添加
                    var customer_id = JSON.parse($.base64.decode(data.content,"utf-8"));

                    thisUserInfo.customer_id =customer_id;//传入入参

                    //添加
                    addCustomer(thisUserInfo) ;
                }else{
                    layer.msg(data.errorMessage,1, 3);

                }
            }
        });
    }

    /***
     * 添加顾客并关联
     */
    function addCustomer(UserInfos){

        UserInfos.access_token = accessToken;
        var param ={
            "open_id" : UserInfos.open_id,
            "mobile_phone" : UserInfos.custom_mobile,
            "customer_name" : UserInfos.custom_name,
            "customer_id" : UserInfos.customer_id
        };
        $.ajax({
            url:requestUrl.user.addCustomer,
            //url:"http://192.168.2.18:8080/wechat/o2o/user/add",
            type:'post',
            data:param,
            dataType:'json',
            //async:false,
            success:function(data){
                if(data.status===200){
                    //关联顾客
                    //  relationThisCustom(UserInfos) ;
                    layer.msg('关联成功',2, 1);
                    var curPages =location.hash.replace('#!page=', '') || 1;//当前页
                    getSelectCondition(curPages);
                    closeTc(); //关闭弹窗
                }else{
                    layer.msg(data.errorMessage,1, 3);
                }
            }
        });
    }


    /**
     * 检测前后时间
     * @param  {[type]} num [天数]
     * @return {[type]}     [description]
     */
    function checkDatediff(num){
        if (num < 0) {
            layer.msg("结束时就不能小于开始时间",2, 3);
            return ;
        }if (num >= 0) {
            if (num == 0) {
                startDate +=" 00:00:00";
                endDate +=" 23:59:59";
            }
            //转毫秒
            startDate = (new Date(startDate)).getTime();
            endDate = (new Date(endDate)).getTime();
        }

    }

    /**
     * 时间控件初始化
     * @return {[type]} [description]
     */
    function initDateRangpick(){
        //时间时间控件
        $(_pageId + "#config-demo").daterangepicker({
            language:  'zh-CN',
            autoApply: true,//自动选择时间间隔
            startDate: new Date('2014/01/01'),
            endDate: moment(),
            minDate :new Date('2014/01/01 00:00:00'),
            maxDate : moment(), //最大时间 当前时间
            showDropdowns : true,
            showWeekNumbers : false, //是否显示第几周
            timePicker : false, //是否显示小时和分钟
            timePickerIncrement : 60, //时间的增量，单位为分钟
            opens : 'center', //日期选择框的弹出位置
            buttonClasses : [ 'btn btn-default' ],
            applyClass : 'btn-small btn-primary blue',
            cancelClass : 'btn-small',
            format : 'YYYY-MM-DD ', //控件中from和to 显示的日期格式
            separator : ' to ',
            locale : {
                applyLabel : '确定',
                cancelLabel : '取消',
                fromLabel : '起始时间',
                toLabel : '结束时间',
                customRangeLabel : '自定义',
                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                firstDay : 1
            }

        },function(start, end, label) {
            //获取开始时间和结束时间
            startDate = start.format('YYYY-MM-DD');
            endDate = end.format('YYYY-MM-DD');
            $("#startDate").val(startDate);//隐藏域
            $("#endDate").val(endDate);
            //console.info('开始时间'+startDate+"结束时间"+endDate);
            //  console.info('最终入参时间开始时间'+startDate+"结束时间"+endDate);

        });

        $("[class=input-mini]").siblings("i").remove();
        $("[class=input-mini]").after('<i class="icon-weixinmenu-calendar" id="dateInit" style="margin-top:-5px;margin-left:-5px;">');
    }



    /**
     * 时间比较，返回天数
     * @param  {[type]} startDate [开始时间 string]
     * @param  {[type]} endDate   [结束时间 string]
     * @return {[type]}           [description]
     */
    function diffDate(startDate,endDate){
        var newStartDate =new Date(startDate);
        var newEndDate =new Date(endDate);
        var mmSec = (newEndDate.getTime() - newStartDate.getTime()); //得到时间戳相减 得到以毫秒为单位的差
        return (mmSec / 3600000 / 24); //单位转换为天并返回

    }


    /**
     * 手机格式验证
     * @param  {[type]} tel [description]
     * @return {[type]}     [description]
     */
    function checkPhone(tel){
        var errMsg ='';
        if (tel) {
            if (tel.length<11) {
                errMsg ='请输入正确的号码格式！';
            }
        }
        return errMsg;
    }

    //点击取消关联
    function cancelAssociation(){

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
                html:'<div class="weixinUs_unlinktise_tc"><p class="p1">如需取消关联，请联系美丽加客服：4007-889-166</p>'
                +'<p class="p2"><a href="javascript:;"style="margin-left:100px;" class="butsbase butblue01" onclick="layer.closeAll();">知道了</a></p></div>'
            }
        });

    }

    /***
     * 生成Emoji表情
     *//*
     function createEmoji(str){
     var emoji = new EmojiConvertor();
     emoji.img_sets = {
     'apple'    : {'path' : 'http://127.0.0.1:8080/o2o/resources/img/img-apple-64/'   , 'sheet' : 'http://127.0.0.1:8080/o2o/resources/img/img-apple-64/sheet_apple_64.png','mask' : 1 },
     'google'   : {'path' : 'http://my-cdn.com/js-emoji/build/emoji-data/img-google-64/'  , 'sheet' : 'http://my-cdn.com/js-emoji/build/emoji-data/sheet_google_64.png',   'mask' : 2 },
     'twitter'  : {'path' : 'http://my-cdn.com/js-emoji/build/emoji-data/img-twitter-64/' , 'sheet' : 'http://my-cdn.com/js-emoji/build/emoji-data/sheet_twitter_64.png',  'mask' : 4 },
     'emojione' : {'path' : 'http://my-cdn.com/js-emoji/build/emoji-data/img-emojione-64/', 'sheet' : 'http://my-cdn.com/js-emoji/build/emoji-data/sheet_emojione_64.png', 'mask' : 8 }
     };

     emoji.use_sheet = true;
     emoji.init_env();
     emoji.use_sheet = true;
     var auto_mode = emoji.replace_mode;
     emoji.img_set = 'apple';
     emoji.text_mode = "unified" == 'text';
     //生成emoji表情  \u{1F604} 解析字符串
     // var output1 = emoji.replace_unified(str);

     // replaces :smile: with platform appropriate content
     var output1 = emoji.replace_colons(str);
     return output1;

     // $(_pageId +"#emoji").html( output1);



     }*/

    /***
     * 关闭搜索弹窗
     */
    function closeTc(){
        //关闭搜索弹框
        $(_pageId + '#search_cont').val('');
        $(_pageId + '#search_boxshade').hide();
        $(_pageId + '#search_box').hide();
        $(_pageId + '#searchResultNo').hide();
        $(_pageId + '#searchTc').hide();
    }






    /**********************************************/
    manageControl.init();//执行
    /**********************************************/

});
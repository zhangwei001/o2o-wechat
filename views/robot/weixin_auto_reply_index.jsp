<%@page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include  page="../layout_main/header.html" />

<link href="${resourcesPath}/css/jquery.ui.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap/bootstrap.min.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap/plus.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/javascript/layer/skin/layer.css?v=${fileVersion}" rel="stylesheet" type="text/css" /> 

<link href="${resourcesPath}/css/bootstrap/plus_v1.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap/percentage_tc.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap/weixin_tc.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap/dialog.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/css/bootstrap/base_v1.css?v=${fileVersion}" rel="stylesheet" type="text/css" />

<link href="${resourcesPath}/css/bootstrap3/mymiljia.css?v=${fileVersion}" rel="stylesheet" type="text/css" />
<link href="${resourcesPath}/javascript/library/artDialog/skins/default.css?v=${fileVersion}" rel="stylesheet" type="text/css" /> 
<link href="${resourcesPath}/javascript/library/laypage/skin/laypage.css?v=${fileVersion}" rel="stylesheet" type="text/css" />

<style>
.a2p .poi2{margin-top:0px;}
</style>
</head>

<jsp:include  page="../layout_base/top.html" />
<input type="hidden" value="${shopUserId}" id="shopUserId">
<input type="hidden" value="${limit}" id="limit"/>

<div class="container weixinptmain" id="w1000">
	<ul class="jilumanu mt10">
	    <li  ><a id="sendWXInfo">发微信内容</a></li>
	    <li class="weixinyhtit"><a href="<%=request.getContextPath()%>/route/${shopSid}/promotions-release_promotion_activity">发布优惠活动</a></li>
		<li ><a href="<%=request.getContextPath()%>/route/${shopSid}/manage-weixin_custom_index">微信用户管理</a></li>
		<li  class="activ"><a href="<%=request.getContextPath()%>/route/${shopSid}/robot-weixin_auto_reply_index">自动回复</a></li>
    	<li ><a href="<%=request.getContextPath()%>/route/${shopSid}/customized-creat_mass_message_index">自定义发消息</a></li>
<%--      	<li ><a href="<%=request.getContextPath()%>/${shopId}/weixin/">微信对话</a></li> --%>
     	<li><a href="<%=request.getContextPath()%>/route/${shopSid}/fodder-wechat_fodder_index">素材库</a></li> 
       
	</ul>
</div>

<div class="container mt5 weixinptmain wxminh500" id="w998">
<ul class="weixinffadd">
	<li class="a3"><a class="weixinaddbut">+新增自动回复</a></li>
</ul>

<ul class="weixinpt_soubar">
<li class="ml25">回复类型</li>	
        <li class="ml15">
			<select  name="type" >
				<option value="-1">请选择回复类型</option>
				<option value="0">文字消息</option>
				<option value="1">图片消息</option>
				<option value="4">图文消息</option>
			</select>
		</li>
      
		<li class=" ml30">关键字</li>
		<li class="ml15">
			<input name="keyWords" type="text" placeholder="请输入关键字">
		</li>
		<li class="ml30">规则名称</li>
		<li class="ml15">
			<input name="ruleWords" type="text" placeholder="请输入关键字">
		</li>
		<li class="ml30"><a class="weixinpt_soubut" id="search">搜索</a></li>	
</ul>
<p class="wxdh_tise wxdh_cxjg ml0" id="totalNumber">0条规则</p>

<div id="containerDiv">

<div class="ebderror_tise">
	<img src="${ staticImage_Url}/mljia/dengpao_r2_c2.gif" width="16" height="22">暂无自动回复规则，请新增
</div>

</div>

<div class="fenyeademain3x pl15" id="pageFenye"></div>
 		
</div>
<script type="text/html" id="sendSuccessTipsTmpl">
<div class="wxzdhf_optise wxzdhf_optise_box5">
	<p><i class="icon-optise02"></i></p>
	<p class="txt01">{{tips}}</p>
	<!--<a><i class="icon-editup06 fr"></i></a>-->
</div>
</script>

<script type="text/html" id="sendErrorTipsTmpl">
<div class="wxzdhf_optise wxzdhf_optise_box3">
	<p><i class="icon-optise01"></i></p>
	<p class="txt01">{{tips}}</p>
	<!--<a onclick="layer.closeAll();"><i class="icon-editup06 fr"></i></a>-->
</div>
</script>


<script type="text/html" id="replyListTmpl">
{{# for(var i=0;i<d.items.length ;  i++){ }}
{{# var item=d.items[i]; }}
<div class="weixintaptype01">
<div class="tatle">
	<span class="ml25">规则{{ (d.total-(d.page-1)*d.rows -i) }} : {{ item.rule_name}}</span>
	<span class="fr mr20"><a data-update="true" data-id="{{item.id}}" data-val="0"><i class="icon-wxffdw"></i></a></span>
	<span style="display:none;">{{ JSON.stringify(item) }}</span>
</div>
<ul class="weixint1ul1" data-id="{{item.id}}" data-code="{{item.check_code}}">
	<li class="a1">关键字</li>
	<li class="a2  box750">
	{{# for(var j=0;j<item.word_list.length;j++){ }}
		<p>{{ item.word_list[j].key_word}}</p>
	{{# } }}
	</li>
	<li class="a3 fr mr20" data-pi="true" data-flag="0">
{{# if(item.key_type==0){ }}
	<p class="poi1"><a class="but0 weixinbut1" data-type="{{item.key_type}}">已全匹配</a></p>
	<p class="poi2"><a class="but0 weixinbut2" data-type="1">未全匹配</a></p>
{{# }else{ }}
	<p class="poi1"><a class="but0 weixinbut1" data-type="{{item.key_type}}">未全匹配</a></p>
	<p class="poi2"><a class="but0 weixinbut2" data-type="0">已全匹配</a></p>
{{# } }}
	</li>
</ul>
<ul class="weixint1ul1 weixint1ul2">
	<li class="a1">回复</li>
{{#if(item.type==0){ }}
<li class="a2 mr15"><a class="wxff_aruru " style="cursor:default"><i class="icon-autoruru03"></i>文字消息</a></li>
{{# }else if(item.type==1){ }}
<li class="a2 mr15"><a class="wxff_aruru " style="cursor:default"><i class="icon-autoruru01"></i>图片消息</a></li>
{{# }else if(item.type==4){ }}
<li class="a2 mr15"><a class="wxff_aruru " style="cursor:default"><i class="icon-autoruru02"></i>图文消息</a></li>
{{# }else{ }}
<li class="a2 mr15"><a class="wxff_aruru " style="cursor:default"><i class="icon-autoruru02"></i>错误</a></li>
{{# } }}
</ul>
</div>
{{# } }}
</script>

<script type="text/html" id="addReplyTmpl">
<div class="weixintaptype01 weixinruruedit" id="addReplyDiv" style="display:none;">
<div class="tatle">
<span class="ml25">新增规则</span>
<span class="fr mr20"><i class="icon-wxffup"></i></span>
</div>

<ul class="weixint1ul1">
<li class="a1">规则名</li>
<li class="a2p">
<p><input name="rlueName" type="text" maxLength="60"></p>
<p class="poi2">规则名最多60个字</p>
</li>
</ul>
<ul class="weixint1ul1 weixint1ul2">
<li class="a1">关键字</li>
<li class="a2 box750" id="keyView"></li>
<li class="a3 fr mr20"><a data-add-key="true">+新建关键字</a></li>
</ul>

<ul class="weixint1ul1 weixint1ul3">
	<li class="a1">关键字类型</li>
	<li class="a2"><input name="lik" type="radio" value="0">已全匹配</li>
	<li class="a3"><input name="lik" type="radio" value="1" checked>未全匹配</li>
</ul>
<ul class="weixint1ul1 weixint1ul3">
	<li class="a1">回复</li>
	<li data-index="true" data-type="4" class="a2 mr15 "><a class="wxff_aruru "><i class="icon-autoruru02"></i>图文消息</a></li>
	<li data-index="true" data-type="0" class="a3 mr15"><a class="wxff_aruru "><i class="icon-autoruru03"></i>文字</a></li>
	<li data-index="true" data-type="1" class="a3 "><a class="wxff_aruru "><i class="icon-autoruru01"></i>图片</a></li>
</ul>

<div class="poi1 wxsc_selete_item" id="containerContent">
<p class="wxqf_ul03_menu poi2">
	<a data-update-container="true"><i class="icon-wxsucaizw03"></i></a>
	<a data-del-container="true"><i class="icon-wxsucaizw02"></i></a>
</p>
<p class="wxqf_text04"></p>
<ul class="wxqf_ul04 poi1 ovf"></ul>

</div>

<p class="weixint1ul5">
	<a class="butbase but1" onclick="addReplyFun();">保存</a>
	<a class="butbase but2" onclick="$('#addReplyDiv').remove();">取消</a>
</p>

</div>
</script>

 

<script type="text/html" id="updateReplyTmpl">
<div class="weixintaptype01 weixinruruedit" id="updateReplyDiv{{d.item.id}}" style="display:none;">
<div class="tatle">
	<span class="ml25">修改规则</span>
	<span class="fr mr20"><a  data-update="true" data-id="{{d.item.id}}" data-val="1"><i class="icon-wxffup"></i></a></span>
	<span style="display:none;">{{d.divContent}}</span>
</div>

<ul class="weixint1ul1">
<li class="a1">规则名</li>
<li class="a2p">
<p><input name="rlueName" type="text"  value="{{d.item.rule_name}}" maxLength="60"></p>
<p class="poi2">规则名最多60个字</p>
</li>
</ul>
<ul class="weixint1ul1 weixint1ul2">
<li class="a1">关键字</li>
<li class="a2  box750" data-key-id="{{d.item.id}}">
{{# for(var i=0;i<d.item.word_list.length;i++){ }}
	<p>{{ d.item.word_list[i].key_word }}</p>
{{# } }}
</li>
<li class="a3 fr mr20"><a data-add-key="true" data-id="{{d.item.id}}">+新建关键字</a></li>
</ul>

<ul class="weixint1ul1 weixint1ul3">
	<li class="a1">关键字类型</li>
{{# if(d.item.key_type==0){ }}
	<li class="a2"><input name="lik" type="radio" value="0" checked>已全匹配</li>
	<li class="a3"><input name="lik" type="radio" value="1">未全匹配</li>
{{# }else{ }}
	<li class="a2"><input name="lik" type="radio" value="0">已全匹配</li>
	<li class="a3"><input name="lik" type="radio" value="1"  checked>未全匹配</li>
{{# } }}
</ul>
<ul class="weixint1ul1 weixint1ul3">
	<li class="a1">回复</li>
	<li data-index="true"  data-id="{{d.item.id}}" data-type="4" class="a2 mr15 {{d.item.type==4?'activ':''}}"><a class="wxff_aruru "><i class="icon-autoruru02"></i>图文消息</a></li>
	<li data-index="true"  data-id="{{d.item.id}}" data-type="0" class="a3 mr15 {{d.item.type==0?'activ':''}}"><a class="wxff_aruru "><i class="icon-autoruru03"></i>文字</a></li>
	<li data-index="true"  data-id="{{d.item.id}}" data-type="1" class="a3 {{d.item.type==1?'activ':''}}"><a class="wxff_aruru "><i class="icon-autoruru01"></i>图片</a></li>
</ul>

<div class="poi1 wxsc_selete_item overflow_y_s" id="containerContent{{d.item.id}}" data-type="{{d.item.type}}" data-id="{{d.item.material_id}}">
<p class="wxqf_ul03_menu poi2" style="display: block">
	<a data-update-container="true"><i class="icon-wxsucaizw03"></i></a>
	<a data-del-container="true"><i class="icon-wxsucaizw02"></i></a>
</p>
<p class="wxqf_text04">{{ d.item.reply_content || ''}}</p>
<ul class="wxqf_ul04 poi1 ovf"></ul>

</div>

<p class="weixint1ul5">
	<a class="butbase but1" onclick="updateReplyFun({{d.item.id}},'{{d.item.check_code}}');">保存</a>
	<a class="butbase but2" onclick="delReplyFun({{d.item.id}},'{{d.item.check_code}}');">删除</a>
</p>

</div>
</script>



<!-- 添加关键词窗口 -->
<script type="text/html" id="addKeyWordsTmpl">
<div class="wxpt_openqr wxpt_addkeyw">
<ul class="wxpt_tatle">
	<li class="a1"><img src="${staticImage_Url}/mljia/yinyelogo_r2_c2.png" width="97" height="55"></li>
	<li class="a2">添加关键词</li>
	<li class="a3"><a onclick="layer.closeAll();"><img src="${staticImage_Url}/mljia/bigcross_r2_c2.gif" width="24" height="24"></a></li>
</ul>
<div class="ebderror_tise"><img src="${staticImage_Url}/mljia/dengpao_r2_c2.gif" width="16" height="22">每行一个关键词，最多10个，每个关键词不超过30字符。</div>
<div class="wxpt_zw wxpt_txtinput">
	<input type="text" name="words" maxLength="30" autofocus/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<input type="text" name="words" maxLength="30"/>
	<p class="text-right mr8">0/600</p>
</div>
	<p class="wxqf_openqrul2 wxpt_opbuts wxpt_keysbuts">
  		<a class="but0 but1" onclick="addKeyWordsFun({{d.id}});">确认</a>
  		<a class="but0 but2" onclick="layer.closeAll();">取消</a>
	</p>
</div>

</script>

<!-- 文字消息窗口 -->
<script type="text/html" id="artTextLayerTmpl">
<div class="wxpt_openqr">
<ul class="wxpt_tatle">
	<li class="a1"><img src="${staticImage_Url}/mljia/yinyelogo_r2_c2.png" width="97" height="55"></li>
	<li class="a2">添加文字消息</li>
	<li class="a3"><a onclick="layer.closeAll();"><img src="${staticImage_Url}/mljia/bigcross_r2_c2.gif" width="24" height="24"></a></li>
</ul>
<div class="wxpt_zw wxpt_keyw poi1">
	<textarea name="content" cols="3" rows="6" style="height:280px;">{{d.text}}</textarea>
	<p class="text-right poi2"><span id="lessWords">0</span>/600</p>
</div>
<p class="wxqf_openqrul2 wxpt_opbuts">
	<a class="but0 but1" onclick="addTextContentFun({{d.id}});">确认</a>
	<a class="but0 but2" onclick="layer.closeAll();">取消</a>
</p>
</div>
</script>

<!-- 图文消息窗口 -->
<script type="text/html" id="artImageTextLayerTmpl">
<div class="wxpt_openqr">
<ul class="wxpt_tatle">
	<li class="a1"><img src="${staticImage_Url}/mljia/yinyelogo_r2_c2.png" width="97" height="55"></li>
	<li class="a2">选择图文消息</li>
	<li class="a3"><a href="<%=request.getContextPath()%>/${shopId}/weixin/source/add/image/text" target="_blank" class="but1">+新建图文消息</a></li>
	<li class="a4p"><span><input name="seachWords" type="text" placeholder="标题/作者/摘要"></span>
	<span><a id="seachKeys"><img src="${ staticImage_Url}/mljia/weixinpt_sou.gif" width="15" height="15"></a></span>
	</li>
</ul>

<div class="wxpt_zw wxpt_tuwen">
{{# if(d.items.length>0){ }}
<ul class="wxpt_tuwenmain">
 {{# for(var i=0;i<d.items.length;i++){ }}
    {{# var item=d.items[i];}}
<li class="wxsc_li item  poi1" data-id="{{ item.id}}" data-sync={{ item.is_sync}}>
	<p class="a1"><img src="{{d.download_url}}{{ item.cover_file_id }}" width="204" height="135"></p>
	<p class="a2 fz18">{{ item.title}}</p>
	<p class="a3">{{ item.create_time}}</p>
	{{# if(item.description && item.description.length>1 && item.sub_list.length==0){ }}
		<p class="a4" title="{{item.description}}">{{ item.description.substring(0, 50) }}</p>
	{{# } }}
	{{# for(var j=0;j<item.sub_list.length;j++){ }}
		{{# var ite=item.sub_list[j];}}
		<p class="a6"><span class="fl fz16 wordsbase" title="{{ite.title}}" style="width:100px;" >{{ite.title}}</span><span class="fr"><img src="{{d.download_url}}/{{ ite.cover_file_id}}" width="204" height="135"></span></p>
	{{# } }}
</li>
 {{# } }}
</ul>
 {{# }else{ }}
<div class="wxpt_tuwenmain wxpt_picupff">
	<p class="fz24 a1">暂无图文素材，<a  href="<%=request.getContextPath()%>/${shopId}/weixin/source/add/image/text" target="_blank">去新增</a></p>
</div>

 {{# } }}
</div>
<p class="wxqf_openqrul2 wxpt_opbuts">
	<a class="but0 but1" onclick="addImageTextFun({{d.id}});">确认</a>
	<a class="but0 but2" onclick="layer.closeAll();">取消</a>
</p>
</div>
</script>

<script type="text/html" id="seachImageTextTmpl">
{{# if(d.items.length>0){ }}
<ul class="wxpt_tuwenmain">
 {{# for(var i=0;i<d.items.length;i++){ }}
    {{# var item=d.items[i];}}
<li class="wxsc_li item  poi1" data-id="{{ item.id}}" data-sync={{ item.is_sync}}>
	<p class="a1"><img src="{{d.download_url}}{{ item.cover_file_id }}" width="204" height="135"></p>
	<p class="a2 fz18">{{ item.title}}</p>
	<p class="a3">{{ item.create_time}}</p>
	{{# if(item.description && item.description.length>1 && item.sub_list.length==0){ }}
		<p class="a4" title="{{item.description}}">{{ item.description.substring(0, 50) }}</p>
	{{# } }}
	{{# for(var j=0;j<item.sub_list.length;j++){ }}
		{{# var ite=item.sub_list[j];}}
		<p class="a6"><span class="fl fz16 wordsbase" title="{{ite.title}}" style="width:100px;" >{{ite.title}}</span><span class="fr"><img src="{{d.download_url}}/{{ ite.cover_file_id}}" width="204" height="135"></span></p>
	{{# } }}
</li>
 {{# } }}
</ul>
 {{# }else{ }}
<div class="wxpt_tuwenmain wxpt_picupff">
	<p class="fz24 a1">搜索无结果，<a id="getAll">查看全部</a></p>
</div>

 {{# } }}
</script>




<script type="text/html" id="liTmpl">
 {{# for(var i=0;i<d.items.length;i++){ }}
    {{# var item=d.items[i];}}	
<li class="wxsc_li item poi1" data-id="{{ item.id}}" data-sync={{ item.is_sync}}>
	<p class="a1"><img src="{{d.download_url}}{{ item.cover_file_id }}" width="204" height="135"></p>
	<p class="a2 fz18">{{ item.title}}</p>
	<p class="a3">{{ item.create_time}}</p>
	{{# if(item.description && item.description.length>1 && item.sub_list.length==0){ }}
		<p class="a4" title="{{item.description}}">{{ item.description.substring(0, 50) }}</p>
	{{# } }}
	{{# for(var j=0;j<item.sub_list.length;j++){ }}
		{{# var ite=item.sub_list[j];}}
		<p class="a6"><span class="fl fz16" title="{{ite.title}}">{{(ite.title.length>6)? (ite.title.substring(0,6)+'...') :ite.title }}</span><span class="fr"><img src="{{d.download_url}}/{{ ite.cover_file_id}}" width="204" height="135"></span></p>
	{{# } }}
</li>
 {{# } }}
</script>


<!-- 图片消息窗口 -->
<script type="text/html" id="artImageLayerTmpl">
<div class="wxpt_openqr">
<ul class="wxpt_tatle">
	<li class="a1"><img src="${ staticImage_Url}/mljia/yinyelogo_r2_c2.png" width="97" height="55"></li>
	<li class="a2">添加图片回复</li>
	<li class="a3"><a class="but1" style="position: relative;">上传图片
	<input data-id="fileUpload" type="file" name="files[]" multiple="multiple" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:999;opacity:0;filter:alpha(opacity=0);"/>
	</a></li>
	<li class="a4">大小不超过2M</li>
</ul>

<div class="wxpt_zw wxpt_tuwen">
{{# if(d.items.length>0){ }}
	<ul id="containerUl" class="wxpt_tuwenmain wxpt_uppicmain">
		{{# for(var j=0;j<d.items.length;j++){ }}
			{{# var item=d.items[j]; }}
			<li class="wxpt_picli poi1" data-id="{{ item.id}}">
  				<img src="{{d.download_url}}{{ item.file_id}}" width="204" height="135"> 
			</li>
		{{# } }}
	</ul>
{{# }else{ }}
<div id="empty" class="wxpt_tuwenmain wxpt_picupff">
	<p class="fz24 a1">暂无图片素材，<a style="position: relative;">立即上传
	<input data-id="fileUpload" type="file" name="files[]" multiple="multiple" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:999;opacity:0;filter:alpha(opacity=0);"/>
	</a></p>
</div>
{{# } }}

</div>

<p class="wxqf_openqrul2 wxpt_opbuts">
	<a class="but0 but1"  onclick="addImageFun({{d.id}});">确认</a>
	<a class="but0 but2"  onclick="layer.closeAll();">取消</a>
</p>

</div>

</script>

<script type="text/html" id="imageTextInfoTmpl">
{{# var item=d.item;}}
<li class="wxsc_li item masonry_brick" data-id="{{item.id}}">
	<p class="a1"><img src="{{d.download_url}}{{ item.cover_file_id }}" width="204" height="135"></p>
	<p class="a2 fz16">{{ item.title}}</p>
	<p class="a3">{{ item.create_time}}</p>
	{{# if(item.description && item.description.length>1 && item.sub_list.length==0){ }}
		<p class="a4" title="{{item.description}}">{{ item.description.substring(0, 50) }}</p>
	{{# } }}
	{{# for(var j=0;j<item.sub_list.length;j++){ }}
		{{# var ite=item.sub_list[j];}}
		<p class="a6"><span class="fl fz16" title="{{ite.title}}">{{(ite.title.length>6)? (ite.title.substring(0,6)+'...') :ite.title }}</span><span class="fr"><img src="{{d.download_url}}/{{ ite.cover_file_id}}" width="204" height="135"></span></p>
	{{# } }}
	 
</li>
</script>


<script type="text/html" id="confirmTmpl">
<div class="wxqf_openqr wxqf_pic_delta">
<ul class="wxqf_openqrul1">
	<li class="li1"><a onclick="layer.closeAll();"><i class="icon-editup06 fr"></i></a></li>
	<li class="li2">
		<p class="tatle">删除提醒</p>
		<p><i class="icon-picdelta_op"></i>确定删除当前自动回复？</p>
	</li>
</ul>
<p class="wxpt_upicbuts">
	<a class="but0 but1" onclick="confrimDelFun({{d.id}},'{{d.checkCode}}');">确认</a>
	<a class="but0 but2" onclick="layer.closeAll();">取消</a>
</p>
</div>
</script>



<script type="text/html" id="yingdaoTemp">
	 <div class="container weixingginfo">
		<div class="wXinfotop">
	        <p class="fz18 fl"><i class="icon-wXinfotop01 mr10"></i>公众号信息</p>
	        <p class="fl txthui ml10 mt2"><i class="icon-wXinfotop02"></i>点击“更新”字样即可将微信公众号的名称、头像、二维码、公众号类型信息同步为最新状态。<a id="refreshEvent">更新 <span class="fsongti">>></span></a></p>
        </div>

        <ul class="gginfomain">
            <li class="a1 poi1">
                <p class="txt1">公众号类型：</p>
                <p>{{ ( d.content.service_type_info==0 || d.content.service_type_info==1) ? "订阅号" : " "}}</p>
                 {{# if(d.content.service_type_info==0 || d.content.service_type_info==1 || d.content.verify_type_info==-1) { }}
				  <p class="wXinfoTese poi2" ><i class="icon-wXinfotop03"></i>您需要更换公众号类型为【服务号】，才可使用全部微信服务。<a class="upgradeLink" target="_blank">如何更换？</a></p>
                 {{# } }}
            </li>

            <li class="a2 poi1">
                <p class="txt1">是否认证：</p>
                <p>{{ d.verify_type_info==-1 ? "未认证" : "已认证"}}</p>
				<p class="wXinfoTese poi2"  ><i class="icon-wXinfotop03"></i>您需要【认证】服务号，才可使用全部微信服务。<a class="authLink" target="_blank">如何认证？</a></p>
            </li>
            
            <li class="a1">
                <p class="txt1">公众号名称：</p>
                <p>{{d.content.nick_name}}</p>


            </li>
            <li class="a3 poi1 downBcodeMain">
                <p class="txt1">二维码：</p>
                <p><img src="{{d.qrCodeImg}}" width="168" height="168"></p>
                <p class="poi2 downBcode"><a class="downLoadCodeImg">下载高清二维码</a></p>
            </li>
            <li class="a5">
                <p class="txt1">公众号头像：</p>
                <p><img src="{{d.content.head_image}}" width="168" height="168"></p>
            </li>
            <li class="tise2">
                <p class="ml40">如需解除绑定，请联系4007889166</p>
            </li>
        </ul>
    </div>
  </div>

</script>

<script type="text/javascript" src="<%=request.getContextPath()%>/resources/javascript/library/jquery.fileupload.js?v=${fileVersion}"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/resources/javascript/library/laypage/laypage.js?v=${fileVersion}"></script>

<script src="<%=request.getContextPath()%>/resources/javascript/wechat/robot/weixin_auto_reply_index.js?v=${fileVersion}"></script>
<script src="<%=request.getContextPath()%>/resources/javascript/wechat/base/mljia_wx_userUtil.js?v=${fileVersion}"></script>
<jsp:include  page="../layout_base/footer.html" />


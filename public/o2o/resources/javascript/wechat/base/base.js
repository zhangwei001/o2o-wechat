 
/** 
@Name：laytpl-v1.1 精妙的js模板引擎 
@Author：贤心 - 2014-08-16
@Site：http://sentsin.com/layui/laytpl 
@License：MIT license
*/
;!function(){"use strict";var f,b={open:"{{",close:"}}"},c={exp:function(a){return new RegExp(a,"g")},query:function(a,c,e){var f=["#([\\s\\S])+?","([^{#}])*?"][a||0];return d((c||"")+b.open+f+b.close+(e||""))},escape:function(a){return String(a||"").replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")},error:function(a,b){var c="Laytpl Error：";return"object"==typeof console&&console.error(c+a+"\n"+(b||"")),c+a}},d=c.exp,e=function(a){this.tpl=a};e.pt=e.prototype,e.pt.parse=function(a,e){var f=this,g=a,h=d("^"+b.open+"#",""),i=d(b.close+"$","");a=a.replace(/[\r\t\n]/g," ").replace(d(b.open+"#"),b.open+"# ").replace(d(b.close+"}"),"} "+b.close).replace(/\\/g,"\\\\").replace(/(?="|')/g,"\\").replace(c.query(),function(a){return a=a.replace(h,"").replace(i,""),'";'+a.replace(/\\/g,"")+'; view+="'}).replace(c.query(1),function(a){var c='"+(';return a.replace(/\s/g,"")===b.open+b.close?"":(a=a.replace(d(b.open+"|"+b.close),""),/^=/.test(a)&&(a=a.replace(/^=/,""),c='"+_escape_('),c+a.replace(/\\/g,"")+')+"')}),a='"use strict";var view = "'+a+'";return view;';try{return f.cache=a=new Function("d, _escape_",a),a(e,c.escape)}catch(j){return delete f.cache,c.error(j,g)}},e.pt.render=function(a,b){var e,d=this;return a?(e=d.cache?d.cache(a,c.escape):d.parse(d.tpl,a),b?(b(e),void 0):e):c.error("no data")},f=function(a){return"string"!=typeof a?c.error("Template not found"):new e(a)},f.config=function(a){a=a||{};for(var c in a)b[c]=a[c]},f.v="1.1","function"==typeof define?define(function(){return f}):"undefined"!=typeof exports?module.exports=f:window.laytpl=f}();
 
/*
 * jQuery Date Selector Plugin
 * 日期联动选择插件
 * 增加时分，改成24小时 修改人：battle
 * Demo:
        $("#calendar").DateSelector({
                ctlYearId: <年控件id>,
                ctlMonthId: <月控件id>,
                ctlDayId: <日控件id>,
                ctlHourId:<时控件id>,
            	ctlMinuteId:<分控件id>,
                defYear: <默认年>,
                defMonth: <默认月>,
                defDay: <默认日>,
                defHour: <默认时>,
            	defMinute: <默认分>,
                minYear: <最小年|默认为1882年>,
                maxYear: <最大年|默认为本年>
        });

   HTML:<div id="calendar"><SELECT id=idYear></SELECT>年 <SELECT id=idMonth></SELECT>月 <SELECT id=idDay></SELECT>日</div>
 */
(function ($) {
    //SELECT控件设置函数
    function setSelectControl(defSetting, oSelect, iStart, iLength, iIndex) {
    	oSelect.empty();
    	var htm='';
    	if(defSetting){
            for (var i = 0; i < iLength; i++) {
            	var stm=((parseInt(iStart) + i)<10?("0"+(parseInt(iStart) + i)):(parseInt(iStart) + i));
                if ((parseInt(iStart) + i) == iIndex){
                	htm=htm+("<option selected='selected' value='" + stm + "'>" + stm + "</option>");
                }else{
                	htm=htm+("<option value='" + stm + "'>" + stm + "</option>");
                }
            }
            htm=htm+'<option  value="1904">不限 </option>';
    	}else{
    		
            for (var i = 0; i < iLength; i++) {
            	var stm=((parseInt(iStart) + i)<10?("0"+(parseInt(iStart) + i)):(parseInt(iStart) + i));
                if ((parseInt(iStart) + i) == iIndex)
                	htm=htm+("<option  value='" + stm + "'>" + stm + "</option>");
                else
                	htm=htm+("<option value='" + stm + "'>" + stm + "</option>");
            }
            htm=htm+'<option  selected="selected" value="1904">不限 </option>';
    	}

        oSelect.append(htm);
    }

    $.fn.DateSelector = function (options) {
        options = options || {};

        //初始化
        this._options = {
        	defSetting:true,
            ctlYearId: null,
            ctlMonthId: null,
            ctlDayId: null,
            ctlHourId:null,
            ctlMinuteId:null,
            defYear: 0,
            defMonth: 0,
            defDay: 0,
            defHour: 0,
            defMinute: 0,
            minYear: 1882,
            maxYear: new Date().getFullYear()
        };

        for (var property in options) {
            this._options[property] = options[property];
        }

        this.yearValueId = $("#" + this._options.ctlYearId);
        this.monthValueId = $("#" + this._options.ctlMonthId);
        this.dayValueId = $("#" + this._options.ctlDayId);
        this.hourValueId = $("#" + this._options.ctlHourId);
        this.minuteValueId = $("#" + this._options.ctlMinuteId);
        this.defSetting = this._options.defSetting;
        
        var dt = new Date(),
        iMonth = parseInt(this.monthValueId.attr("data-val") || this._options.defMonth),
        iDay = parseInt(this.dayValueId.attr("data-val") || this._options.defDay),
        iHour = parseInt(this.hourValueId.attr("data-val") || this._options.defHour),
        iMinute = parseInt(this.minuteValueId.attr("data-val") || this._options.defMinute),
        iMinYear = parseInt(this._options.minYear),
        iMaxYear = parseInt(this._options.maxYear);

        this.Year = parseInt(this.yearValueId.attr("data-val") || this._options.defYear) || dt.getFullYear();
        this.Month = 1 <= iMonth && iMonth <= 12 ? iMonth : dt.getMonth() + 1;
        this.Day = iDay > 0 ? iDay : dt.getDate();
        this.minYear = iMinYear && iMinYear < this.Year ? iMinYear : this.Year;
        this.maxYear = iMaxYear && iMaxYear > this.Year ? iMaxYear : this.Year;
        this.Hour = iHour || "9";
        this.Minute = iMinute || "0";
        
        //初始化控件
        //设置年
        setSelectControl(this.defSetting, this.yearValueId, this.minYear, this.maxYear - this.minYear + 1, this.Year);
        //设置月
        setSelectControl(this.defSetting, this.monthValueId, 1, 12, this.Month);
        //设置日
        var daysInMonth = new Date(this.Year, this.Month, 0).getDate(); //获取指定年月的当月天数[new Date(year, month, 0).getDate()]
        if (this.Day > daysInMonth) { this.Day = daysInMonth; };
        setSelectControl(this.defSetting, this.dayValueId, 1, daysInMonth, this.Day);
        //设置小时
        setSelectControl(this.defSetting, this.hourValueId, 1, 24, this.Hour);
        //设置分钟
        setSelectControl(this.defSetting, this.minuteValueId, 0, 60, this.Minute);
        
        var oThis = this;
        //绑定控件事件
        this.yearValueId.change(function () {
            oThis.Year = $(this).val();
            setSelectControl(this.defSetting, oThis.monthValueId, 1, 12, oThis.Month);
            oThis.monthValueId.change();
        });
        this.monthValueId.change(function () {
            oThis.Month = $(this).val();
            var daysInMonth = new Date(oThis.Year, oThis.Month, 0).getDate();
            if (oThis.Day > daysInMonth) { oThis.Day = daysInMonth; };
            setSelectControl(this.defSetting, oThis.dayValueId, 1, daysInMonth, oThis.Day);
        });
        this.dayValueId.change(function () {
            oThis.Day = $(this).val();
        });
    };
})(jQuery);

(function(toMonitor,mljia,fun,$){

	fun("基础服务函数");
	mljia("全局空间函数");
	toMonitor($);
	
	function getToken(){
		$.get(webRoot+'/'+shopId+'/business/get/session/token',function(resData){
			if(resData.status==200){
				if($("#CN_MLJIA_CLIENT_TOKEN").length>1){
					console.log("token:出现多个对象");
				}
				$("#CN_MLJIA_CLIENT_TOKEN").val(resData.data);
			}else{
				console.log(":",resData);
			}
		});
	}
	
window.getToken=getToken;
 

////////////////////////////////////////////
if(location.hash.indexOf('debug')>-1){
	//进入调试模式
	if(window.localStorage){
		localStorage.debug='true';
	}
}
if(location.hash.indexOf('cancel')>-1){
	//进入调试模式
	if(window.localStorage){
		localStorage.debug='';
	}
}
if(window.localStorage && localStorage.debug){
	console.log('进入调试模式！！');
//	$.getScript('http://dev.mljia.cn/vorlon/vorlon.js', function(){});
}
////////////////////////////////////////////
})(function(e){
	if(!window.toMonitor){
	var  index=0,count=0;
	
	e(document).ajaxSend(function(event, request, settings){
		var url=settings.url.split("?")[0];
		if(url.indexOf("poll")==-1 && url.indexOf("selectEarnest")==-1 && url.indexOf("countTimeOutOrder")==-1 && url.indexOf("/upload")==-1){
			index=$.layer({type:3,title:false,shade:[0],border:[0],bgcolor:"",loading:{type:2}});
		}
	}).ajaxSuccess(function(event, request, settings){
		callBack(1, request, settings);
	}).ajaxError(function(event, request, settings,thrownError){
		callBack(0, request, settings,thrownError);
	});
	
		function callBack(flag, request, settings,thrownError){
			layer.close(index);
			count++;
			var url=settings.url.split("?")[0];
			if(url.indexOf('resources')>-1){
				console.log(''+count,flag?'success':'error','请求路径：',url);
			}else{
				try {
					var json=JSON.parse(request.responseText)||{};
					if(json.status!=200){
						console.log(''+count,flag?'success':'error','请求路径：',url,'返回数据：',request.responseText);
					}
				} catch (e) {
					console.log(''+count,flag?'success':'error','请求路径：',url,'返回数据非json：',request.responseText);
				}
				
					
			}
			
		}
		
		window.toMonitor=function(){
			
		};
	}
	
	

	 
},function(m){
	  /**
	    * ===========================================
	    * 功能：定义一个全局对象 
	    * 作者：battle
	    * 时间：2015-04-03
		* 描述：添加功能模块的命名空间,禁止在其他命名空间下赋值
		* 	（命名空间 shop 下放的是店铺基础信息 不允许被占用）
		* 其他 命名空间 可根据开发人员 自行定义
		* 示例：MLJIA.namespace("business");
		*	  MLJIA.business.shop=1182;
		* ===========================================
		*/
	var MLJIA={};
		MLJIA.namespace=function(str){
		var arr=str.split("."),o=MLJIA;
		for(var i=(arr[0]=="MLJIA") ? 1 : 0; i<arr.length; i++){
			o[arr[i]]=o[arr[i]] || {};
			o=o[arr[i]];
	     }
		};
		if(!window.MLJIA){
		 window.MLJIA=MLJIA;
	    }
		MLJIA.namespace("shopSet");//存储店铺全局参数信息（）
		
},function(m){
	/**
	 * 作者：battle
	 * js基础服务类
	 * 日期：2015-04-15
	 * 
	 */
	//基本类：通过function扩展类型：提高语言的表现力（因为javascript原型继承的本质，所有的原型方法立刻被赋予到所有的实例）
	Function.prototype.method=function(name,fn){
	    if(!this.prototype[name]){
	        this.prototype[name]=fn;
	        return this;
	    }
	};
	
	//提取数字中的整数部分 示例：(-10/3).integer(); //-3 
	if(!Number.prototype.integer){
		 Number.method('integer',function(){
		    return Math[this < 0 ? 'ceil' : 'floor'](this);
		});
	}
	
	//去除字符串[左右]的空格 示例：" 12 a si 56 ".trim(); //12 as i56
	if(!String.prototype.trim){
		String.method('trim',function(){
		    return this.replace(/^\s+/,'').replace(/^\s+$/,'');
		});
	}
	//去除全部空格
	if(!String.prototype.noSpace){
		String.method('noSpace',function(){
		    return this.replace(/\s+/g, "");
		});
	}
 
	
	//高效JS数组乱序（为Array.prototype添加了一个函数） 调用arr.shuffle();
	if (!Array.prototype.shuffle) { 
		Array.prototype.shuffle = function() {    
			for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x); 
			return this; 
			};
	}
	
	// 对Date的扩展，将 Date 转化为指定格式的String   
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
	// 例子：   
	// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
	// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	 if(!Date.prototype.format){
			Date.prototype.format =function(format){
				var o = {
				"M+" : this.getMonth()+1, //month
				"d+" : this.getDate(), //day
				"h+" : this.getHours(), //hour
				"m+" : this.getMinutes(), //minute
				"s+" : this.getSeconds(), //second
				"q+" : Math.floor((this.getMonth()+3)/3), //quarter
				"S" : this.getMilliseconds() //millisecond
				};
				if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
				(this.getFullYear()+"").substr(4- RegExp.$1.length));
				for(var k in o)if(new RegExp("("+ k +")").test(format))
				format = format.replace(RegExp.$1,
				RegExp.$1.length==1? o[k] :
				("00"+ o[k]).substr((""+ o[k]).length));
				return format;
			};
	 }

	//浮点数加法运算
	var FloatAdd=function(arg1, arg2) {
		var r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		return (arg1 * m + arg2 * m) / m;
	};
	if(!window.FloatAdd){
		window.FloatAdd=FloatAdd;
	}
	// 浮点数减法运算
	var FloatSub=function (arg1, arg2) {
		var r1, r2, m, n;
		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		// 动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return ((arg1 * m - arg2 * m) / m).toFixed(n);
	};
	if(!window.FloatSub){
		window.FloatSub=FloatSub;
	}
	//格式化金额，截取金额小数点位数
	var formatMoney=function (s, n){   
	   n = n > 0 && n <= 20 ? n : 2;   
	   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	   var l = s.split(".")[0].split("").reverse(),   
	   r = s.split(".")[1];   
	   t = "";   
	   for(var i = 0; i < l.length; i ++ )   
	   {   
	      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	   }   
	   return t.split("").reverse().join("") + "." + r;   
	};
 
	
	if(!window.formatMoney){
		window.formatMoney=formatMoney;
	}
	function checkNum(obj) {  
		obj.value = obj.value.replace(/[^\d.]/g, "");  
		obj.value = obj.value.replace(/^\./g, "");  
		obj.value = obj.value.replace(/\.{2,}/g, ".");  
		obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$",".");
//		obj.value = Number(obj.value).toFixed(2);
		 
	}
	if(!window.checkNum){
		window.checkNum=checkNum;
	}
//	return 1+2000*m;
	
	
},jQuery);



(function($){
 //全局监听AJAX请求事件
 	var startTime='',endTime='',lisObj=[];
    $(document).ajaxStart(function(){
         startTime=new Date().getTime();
    }).ajaxSend(function(event, xhr, settings) {
    	 url=settings.url.split("?")[0];
         var ajaxSendObj={ url:url,startTime:new Date().getTime()};
         lisObj.push(ajaxSendObj);
    }).ajaxSuccess(function(event, xhr, settings) {
    }).ajaxError(function(event, jqxhr, settings, exception) {
         toMonitorError(event, jqxhr, settings, exception);
    }).ajaxStop(function() {
         endTime=new Date().getTime();
         console.log("AJAX请求长耗时："+(endTime-startTime)+"毫秒");
         lisObj=[];//清空
    });
    
    var toMonitor=function(url,data){
     	  for(var m=0;m<lisObj.length;m++){
     	      if(lisObj[m].url == url){
     	       console.log(url+"耗时:"+(new Date().getTime()-lisObj[m].startTime)+"毫秒");
     	       break;
     	      }
     	  }
     	  if(data!=null && data.status && data.status==400){
     		 console.log("错误信息："+data.msg);
     	  }
    };
    
    var toMonitorError=function(event, jqxhr, settings, exception){
    	   console.log("请求错误exception："+exception);
//           console.log("请求错误responseText："+jqxhr.responseText);
    };
    
    
  window.toMonitor=toMonitor;
})(jQuery);


function getRightList(userLevel_id){
	var url2=webRoot+"/"+shopId+"/parameter/getRightList/"+userLevel_id+"";
	$.ajax({
		type:"get",
		dataType:"json",
		url:url2,
		async:false,
		success:function(msg){
			document.cookie="rightId"+shopId+"="+msg+";path=/"}
	})
}
function validationRight1(right_id){
	var isOk=false;var rightId=getCookie("rightId"+shopId);
	if(rightId!=null&&rightId!=""){
		var arry=rightId.split(",");
		for(var i=0;i<arry.length;i++){
			if(arry[i]==right_id||arry[i]==1){
				isOk=true;
				break
			}
		}
	}
	return isOk
}
function validationRight2(userLevel_id,right_id){
	var isOk=false;
	var rightId=getCookie("rightId"+shopId);
	if(rightId!=null&&rightId!=""){
		var arry=rightId.split(",");
		for(var i=0;i<arry.length;i++){
			if(arry[i]==right_id||arry[i]==1){
				return true
			}
		}
	}
	var url1=webRoot+"/"+shopId+"/parameter/validationRight/"+userLevel_id+"/"+right_id+"";
	$.ajax({
		type:"get",
		dataType:"json",
		url:url1,
		async:false,
		success:function(msg){
			if(msg==200){
				isOk=true
			}
			cleanCookie("rightId"+shopId);
			checkCookie(userLevel_id)
		}
	});
	return isOk
}
function getCookie(c_name){if(document.cookie.length>0){var c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;var c_end=document.cookie.indexOf(";",c_start);if(c_end==-1){c_end=document.cookie.length}return unescape(document.cookie.substring(c_start,c_end))}}return""}function checkCookie(userLevel_id){var rightId=getCookie("rightId"+shopId);if(rightId==null||rightId==""){getRightList(userLevel_id)}}function exit(){if(cleanCookieByManager()){window.location.href=webRoot+"/exit"}else{alert("退出失败")}}function cleanCookieByManager(){var exp=new Date();exp.setTime(exp.getTime()-1);var keys=document.cookie.match(/[^ =;]+(?=\=)/g);if(keys){for(var i=keys.length;i--;){var rightId=getCookie(keys[i]);document.cookie=keys[i]+"="+rightId+";expires="+exp.toGMTString()+";path=/"}}return true}function cleanCookie(c_name){var exp=new Date();exp.setTime(exp.getTime()-1);var rightId=getCookie("rightId"+shopId);document.cookie=c_name+"="+rightId+";expires="+exp.toGMTString()+";path=/";return true}window.onscroll=function(){try{var oBlack=document.getElementById("toTop");var topHeight=document.documentElement.scrollTop||document.body.scrollTop;if(topHeight>0){oBlack.style.display="block"}else{oBlack.style.display="none"}oBlack.onclick=function(){document.documentElement.scrollTop=0;document.body.scrollTop=0}}catch(e){}};
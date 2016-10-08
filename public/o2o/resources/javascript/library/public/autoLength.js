

$(document).ready(
				function() {
						var which=document.getElementById("announcementContent");
						var maxChars = 200; //
					    if (which.value.length > maxChars)
					    {
					    	
					        // 超过限制的字数了就将 文本框中的内容按规定的字数 截取
					        which.value = which.value.substring(0,maxChars);
					        return false;
					    }
					    else
					    {
					    	
					    	var pattern = new RegExp("[#$^|\\<>#&*]") 
					    	var rs="";
					    	for (var i = 0; i < which.value.length; i++) { 
					    		rs = rs+which.value.substr(i, 1).replace(pattern, ''); 
					    	}
					    	which.value=rs;
					        var curr = maxChars - which.value.length; //250 减去 当前输入的
					        document.getElementById("sy").innerHTML = curr.toString();
					        return true;
					    }
					
				});
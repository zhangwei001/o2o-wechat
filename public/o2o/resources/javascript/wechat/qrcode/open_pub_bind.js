/**
 * Created by Administrator on 2016/8/29.
 */
$(function(){
    var shopSid = $("body").attr("data-item-shopSid");
    var userId =  $("body").attr("data-item-userId");
    var authCode = $("body").attr("data-item-authCode");
    var expiresIn =$("body").attr("data-item-expiresIn");

    $.ajax({
        url:requestUrl.user.checkIsRegister,
        data:{
            auth_code:authCode,
            expires_in:expiresIn,
            user_id:userId
        },
        type:"post",
        dataType:"json",
        success:function(data){
            if(data.status==200){
                location.href = "/o2o/route/"+shopSid +"/qrcode-open_pub_succeed?userId="+ userId
            }else {
                location.href="/o2o/route/"+shopSid+"/qrcode-open_pub_fail"
            }

        },
        fail:function(data){
            layer.msg(data.error_message,1, 3);
        }


    });




});

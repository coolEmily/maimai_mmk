requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib) {
	lib = new lib();
	lib.ajx(lib.getReq().ser + "/memberAuthority/getAuthorityInfo.action",{},function(data){
    	if(data.infocode == 0){//0：查询成功 1：系统错误 2:未找到该会员的授权信息 3:会员未登录
    		$("#authorityNo").html(data.info.authorityNo);//授权编号
    		$("#memberName").html(data.info.memberName);//会员名称
    		$("#authorityName").html(data.info.authorityName);//授权名称
    		$("#authorityRange").html(data.info.authorityRange);//授权期限
    		$("#authorityYear").html(data.info.authorityYear);//授权日期_年
    		$("#authorityMonth").html(data.info.authorityMonth);//授权日期_月
    		$("#authorityDay").html(data.info.authorityDay);//授权日期_日
    	}if(data.infocode == 1){
    		alert("请求失败，请检查网络连接");
    	}if(data.infocode == 2){
    		alert("未找到该会员的授权信息");
    	}if(data.infocode == 3){
    		window.location.href="/login/denglu.html?backUrl="+lib.getBackUrl();
    	}
    }, errorFn);
    function errorFn(){
    	alert("请求失败，请检查网络连接");
    }
    //返回上一级
    $("#back").click(function(){
    	history.go(-1);
    });
});
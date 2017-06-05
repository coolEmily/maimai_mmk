require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var xyyh={};
   $(function () {
    $.extend(xyyh, {
    	api:lib.getReq().ser+"/rLocation/getRLocationInfo.action",
    	oid:128,
    	init:function(){
    		this.list();
    		this.weixin();
    	},
    	weixin:function() {
            if(!lib.checkWeiXin()){
                $(".right").text("下载买买商城APP");
            }
    		$(".right").click(function(e){
    			if(lib.checkWeiXin()){
    				window.location.href="./follow.html";

    			}else{
    				window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.example.maimai";
    			}
    		})
    	},
    	list:function(){
    		var that=this;
    		lib.ajx(that.api, {
    		rLocationId:that.oid
    		}, function(data){
                if(data.infocode == 0){//可以领取
                   var msg=data.info.List_rLg;
                  	msg.forEach(function(value,index){
                  		var html='<a class="list" href="/g?mId=&gId='+value.goodsId+'"><div class="imglist" style="background:url('+lib.getReq().imgPath+value.mainPictureJPG+');background-size:cover;"></div><p class="title">'+value.chName+'</p><p class="price">￥'+value.sellingPrice+'</p><p class="hongbao">红包抵用'+value.limitcoupon+'元</p></a>';
                  		$(".listbox").append(html)
                  	})
                }
            },function(){
                alert("请求失败，请检查网络连接");
            });
    	}
    });
    xyyh.init();
})
});
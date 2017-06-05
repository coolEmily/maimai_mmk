require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var fId = lib.getUrlParam('id');
    var cuxiao = {};
    $(function(){
    	$.extend(cuxiao,{
    		init:function(){
    			var _t = this;
    			_t.getPromotion(fId);
    		},
    		getPromotion:function(fId){
    			lib.ajx(lib.getReq().ser + "adPlan/getAdPlanInfo.action?adLocationId="+fId,{},function(data){
    				var list = data.info.List_adSource;
    				if(data.infocode === '0'){
    					var htmlStr = "";
    					for(var i=0;i<list.length;i++){
    						htmlStr = '<div class="cx_ban">'+
    									'<a href="'+list[i].adLink+'">'+
    										'<img src="'+lib.getReq().imgPath+list[i].pictureUrl+'" />'+
    									'</a>'+
    								  '</div>';
    						$(".cxiao").append(htmlStr);
    					}

    				}
    			},function(){
    				alert("系统错误");
    			});
    		}
    	});
    });
    cuxiao.init();
});
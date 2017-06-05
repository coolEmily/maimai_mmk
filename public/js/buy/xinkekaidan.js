require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', 'wxReg'], function($, lib, wxReg){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
	var remai = {};
	$(function(){
		$.extend(remai,{
		    activeId: common.tools.getUrlParam("acId"),
            memberId: common.tools.getUrlParam('mId') === '' ? '1' : common.tools.getUrlParam('mId'),
			init:function(){
				var _t = this;
				_t.bindEnvt();
				_t.getHotSale();
			},
			bindEnvt: function(){
			    var _t = this; 
		        $(document).on("tap", ".ind_sx_cart i", function(){
                    var goodsId = $(this).parent().attr("data-Id");
                    location.href = "/g?mid=" + _t.memberId + "&gId=" + goodsId +"&acId=" + _t.activeId;
                    /*if(lib.checkWeiXin() && $.cookie("member_loginName").length !== 11){
                        location = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                        return;
                    }
                    lib.ajx(lib.getReq().ser + "/shoppingCart/toBalanceForFirst.action",{'goodsId':goodsId, 'activeId':  _t.activeId},function(data){
                        if(data.infocode === "0"){
						    location.href = "/buyer/order/dingdanqr_new.html?acId=" + _t.activeId + "&gId=" + goodsId;
                        }else{
                            alert(data.info);
                            if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                        }
                    }, function(){
                        alert("系统错误");
                    });*/
                });   
			},
			getHotSale:function(){
				var _t = this;
				lib.ajx(lib.getReq().ser + "/shoppingCart/getGoodsForFirst.action",{'activeId': _t.activeId},function(data){
					var list = data.info.goodsList;
					if(data.infocode === '0'){
						var htmlStr = "";
						if(data.info.activeImg){
						    $(".ind_sx").before('<img src="'+ lib.getReq().imgPath + data.info.activeImg +'" style="width:100%;max-width:640px">');
						}
						for(var i=0;i<list.length;i++){
							htmlStr = '<div class="ind_sx_list clearfix">'+
							    '<a href="'+ "/g?mid=" + _t.memberId + "&gId=" + list[i].goodsId +"&acId=" + _t.activeId +'" class="ind_sx_img"><img src="'+lib.getReq().imgPath+lib.getImgSize(list[i].goodsImg, "B")+'" style="height:120px" /></a>'+
							    '<div class="ind_sx_r">'+
							    	'<a href="'+ "/g?mid=" + _t.memberId + "&gId=" + list[i].goodsId +"&acId=" + _t.activeId +'">'+
								        '<h3>'+list[i].goodsName+'</h3>'+
								        /*'<h4><a href="'+url+'"><nobr>'+list[i].enName+'</nobr></a></h4>'+*/
								        '<p class="dred">￥'+list[i].price+'<span>'+(list[i].limitcoupon  ? "红包立减" + list[i].limitcoupon  + "元" : "")+'</span></p>'+
							        '</a>'+
							    '</div>'+
							    '<a href="javascript:;" class="ind_sx_cart" data-Id="'+list[i].goodsId+'"><i></i></a>'+
							'</div>';
							$(".ind_sx").append(htmlStr);
						}
					}else if(data.infocode === '1'){
						if(lib.checkWeiXin() && data.infocode === "1")
                            wxReg.reg(_t.memberId, '0', _t.activeId);
                        else{
                            alert(data.info);
                            if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                        }
					}
				},function(){
    				alert("系统错误");
    			});
			}
		});
		remai.init();
	});
});
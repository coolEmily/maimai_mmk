require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', 'wxshare', 'wxReg'], function ($, lib, wxshare, wxReg) {
    lib = new lib();
    var spqliebiao = {};
     $(function () {
        $.extend(spqliebiao, {
            init: function () {
                var _t = this;
                sessionStorage.mm_mId = lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1;
                if(sessionStorage.mm_mId == 1){
                    $("title").html("买买携手天津电视台，壕送现金券");
                    $("#title").html("买买携手天津电视台，壕送现金券");
                }
                _t.getspqliebiao();
                setTimeout(function () {
                    _t.setWxShare();
                }, 1000);			
            },
            getspqliebiao:function(){
                var _t = this;
                var goodsCouponTypeId = lib.getUrlParam('goodsCouponTypeId');
                lib.ajx(lib.getReq().ser + "/shoppingCart/getGoodsByGoodsCouponTypeId.action", {'goodsCouponTypeId': goodsCouponTypeId}, function (data) {
                    if (data.infocode === '0') {
                        var list = data.info;
                        var htmlStr = "";
                        if(data.info.activeImg){
                            $(".ind_sx").append('<img src="' + lib.getReq().imgPath + data.info.activeImg + '" style="width:100%;max-width: 640px">');
                        }
                        for (var i = 0; i < list.length; i++) {
                            _t.shareImg = lib.getReq().imgPath + list[i].activeImg;
                            var url = '/g?mId=' + lib.getUrlParam('mId') + "&gId=" + list[i].goodsId;
                            $(".ind_sx").append('<img class="ui-per-goods" data-Id="' + list[i].goodsId + '" src="' + lib.getReq().imgPath + list[i].activeImg + '" style="width:100%;max-width: 640px">');
                        }
                        $(".ui-per-goods").off().on("click", function () {
                            var goodsId = $(this).attr("data-Id");
                           
                            _t.toBalanceForFree(goodsCouponTypeId, goodsId);
                        });
                    } else if (data.infocode === '1') {
                        if(lib.checkWeiXin())
                            wxReg.reg(sessionStorage.mm_mId, '0', lib.getUrlParam('goodsCouponTypeId'));
                        else{
                            alert(data.info);
                            
                        }
                    } else if (data.infocode === '2') {
                        //alert("暂无更多商品");
                        _t.noMore = true;
                    }
                }, function () {
                    alert("系统错误");
                });
            },
            toBalanceForFree: function (goodsCouponTypeId, goodsId) {
                var _t = this;
                if(lib.checkWeiXin() && $.cookie("member_loginName") && $.cookie("member_loginName").length !== 11){
                    location.href = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                    return;
                }
                lib.ajx(lib.getReq().ser + "shoppingCart/toBalanceForGoodsCoupon.action", {
                    goodsCouponTypeId: goodsCouponTypeId,
                    goodsId: goodsId
                }, function (data) {
                    if (data.infocode === '0') {
                        location.href = "/buyer/order/dingdanqr_new.html?gType=1&acId=" + goodsCouponTypeId + "&gId=" + goodsId;
                    } else {
                        alert(data.info);
                        if (data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                    }
                });
            },
            setWxShare: function () {
	            if (lib.checkWeiXin()) {
	                var _t = this;
	                var memberId = $.cookie("member_memberId");
	                var memberTypeId = $.cookie("member_memberTypeId");
	                if(!memberTypeId){
	                    memberId = lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1;
	                }else if (Number(memberTypeId) < 2) {
	                    memberId = 1;
	                }
	                dataForWeixin.imgUrl = _t.shareImg;
	                dataForWeixin.title = "买买携手心理学家大会，壕送现金券";
	                dataForWeixin.desc = "活动期间100元现金券任性送，直抵现金，更多惊喜";
	                dataForWeixin.link = location.protocol + "//" + location.host + '/buyer/spqliebiao.html?goodsCouponTypeId=6&mId=' + memberId;
	                wxshare();
	            }
	        }
        });
        spqliebiao.init();
	});   
});

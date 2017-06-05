require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', 'wxshare', 'wxReg'], function ($, lib, wxshare, wxReg) {
    lib = new lib();
    var shangpinquan = {};
    $(function () {
        $.extend(shangpinquan, {
            goodsCouponTypeId: lib.getUrlParam("acId") ? lib.getUrlParam("acId") : 1,
            init: function () {
                var _t = this;
                if(_t.goodsCouponTypeId == 6){
	            	$("#title").html("十届代表专享福利");
	            }else if(_t.goodsCouponTypeId == 7){
                    $("#title").html("买买携手天津电视台，壕送现金券");
                }else{
	            	$("#title").html("摇一摇专享福利");
	            }
                sessionStorage.mm_mId = lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1;
                _t.getLingyuangou();
                setTimeout(function () {
                    _t.setWxShare();
                }, 1000);

            },
            getLingyuangou: function () {
                var _t = this;
                lib.ajx(lib.getReq().ser + "shoppingCart/toActiveByGoodsCouponTypeId.action", {'goodsCouponTypeId': _t.goodsCouponTypeId}, function (data) {
                    if (data.infocode === '0') {
                        var list = data.info;
                        _t.shareImg = lib.getReq().imgPath + list.activeImg;
                        $(".ind_sx").append('<img class="ui-per-goods" data-Id="' + list.goodsId + '" src="' + lib.getReq().imgPath + list.activeImg + '" style="width:100%;max-width: 640px">');
                        $(".ui-per-goods").off().on("click", function () {
                            var goodsId = $(this).attr("data-Id");
                            //location.href = "/g?mId=" + sessionStorage.mm_mId + "&gId=" + goodsId + "&acId=" + _t.goodsCouponTypeId + "&gType=1";
                            if(_t.goodsCouponTypeId == 6){
                            	location.href ="/buyer/spqliebiao.html?goodsCouponTypeId="  + _t.goodsCouponTypeId + '&mId=' + sessionStorage.mm_mId;
                            	return;
                            }
                            location.href = "/buyer/order/dingdanqr_new.html?mId=" + sessionStorage.mm_mId + "&gId=" + goodsId + "&acId=" + _t.goodsCouponTypeId + "&gType=1";
                        });
                        //acId:1 更多调至列表
                        if(_t.goodsCouponTypeId == 7){
                            $('.more').show();
                            $('.more').off().on('tap', function (){
                                    location.href ="/buyer/spqliebiao.html?goodsCouponTypeId="  + _t.goodsCouponTypeId + '&mId=' + sessionStorage.mm_mId;
                                    return;
                            });
                        }

                    } else if (data.infocode === '1') {
                        if(lib.checkWeiXin())
                            wxReg.reg(sessionStorage.mm_mId, '0', lib.getUrlParam('acId'));
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
            setWxShare: function () {
                var _t = this;
                if (lib.checkWeiXin()) {
                    var memberId = $.cookie("member_memberId");
                    var memberTypeId = $.cookie("member_memberTypeId");
                    if (!memberId || !memberTypeId || memberTypeId < 2) {
                        memberId = 1;
                    }
                    var title = '';
                    var desc = '';
                    var url = '';
                    if(_t.goodsCouponTypeId == 6){
                        title = '买买携手心理学家大会，壕送现金券';
                        desc = '活动期间100元现金券任性送，直抵现金，更多惊喜..';
                        url = '/buyer/shangpinquan.html?acId=6&mId=' + memberId;
                    }else{
                        title = '摇一摇专享福利';
                        desc = '活动期间200元现金券任性送，直抵现金，更多惊喜..';
                        url = '/buyer/shangpinquan.html?acId=1&mId=' + memberId;
                    }
                    dataForWeixin.imgUrl = _t.shareImg;
                    dataForWeixin.title = title;
                    dataForWeixin.desc = desc;
                    dataForWeixin.link = location.protocol + "//" + location.host + url;
                    wxshare();
                }
            }
        });
        shangpinquan.init();
    });
});
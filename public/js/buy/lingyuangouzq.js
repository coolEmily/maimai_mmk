require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', 'wxshare', 'wxReg','rememberThePosition','visitor-logs'], function ($, lib, wxshare, wxReg,remosition,vl) {
    lib = new lib();
    var lingyuangouzq = {};
    $(function () {
        $.extend(lingyuangouzq, {
            init: function () {
                var _t = this;
                sessionStorage.mm_mId = lib.getUrlParam("mId") ? lib.getUrlParam("mId") : 1;
                _t.getLingyuangou();
                vl.setLog(window.location.href, 2);//会员访问日志
                setTimeout(function () {
                    _t.setWxShare();
                }, 1000);
								remosition.init(false);
            },
            getLingyuangou: function () {
                var _t = this;
                var activeId = lib.getUrlParam('activeId');
                lib.ajx(lib.getReq().ser + "shoppingCart/getGoodsForFree.action", {'activeId': activeId}, function (data) {
                    if (data.infocode === '0') {
                        var list = data.info.goodsList;
                        var htmlStr = "";
                        if(data.info.bannerImg){
                            $(".ind_sx").append('<img src="' + lib.getReq().imgPath + data.info.bannerImg + '" style="width:100%;max-width: 640px">');
                        }
                        for (var i = 0; i < list.length; i++) {
                            var url = '/g?mId=' + lib.getUrlParam('mId') + "&gId=" + list[i].goodsId;
                            /*htmlStr = '<div class="ind_sx_list clearfix">' +
                                '<a class="ind_sx_img"><img src="' + lib.getReq().imgPath + lib.getImgSize(list[i].goodsImg, "E") + '" style="height:120px" /></a>' +
                                '<div class="ind_sx_r">' +
                                '<a>' +
                                '<h3>' + list[i].goodsName + '</h3>' +
                                /*'<h4><a href="'+url+'"><nobr>'+list[i].enName+'</nobr></a></h4>'+
                                '<p class="dred">￥0<span>市场价:￥' + list[i].maimPrice + '</span></p>' +
                                '</a>' +
                                '</div>' +
                                '<a class="ind_sx_cart" data-Id="' + list[i].goodsId + '"><i></i></a>' +
                                '</div>';*/
                            $(".ind_sx").append('<img class="ui-per-goods" data-Id="' + list[i].goodsId + '" src="' + lib.getReq().imgPath + list[i].designPicture + '" style="width:100%;max-width: 640px">');
                        }
                        if(data.info.ruleImg){
                            $(".ind_sx").append('<img class="" src="'+lib.getReq().imgPath+data.info.ruleImg+'" style="width:100%;max-width: 640px">');//规则图片
                        }

                        $(".ui-per-goods").off().on("click", function () {
                            var goodsId = $(this).attr("data-Id");
                            location.href = "/g?mId=" + sessionStorage.mm_mId + "&gId=" + goodsId + "&acId=" + activeId;
                            //_t.toBalanceForFree(activeId, goodsId);
                        });
                    } else if (data.infocode === '1') {
                        if(lib.checkWeiXin())
                            wxReg.reg(sessionStorage.mm_mId, '0', lib.getUrlParam('activeId'));
                        else{
                            alert(data.info);

                        }
                    } else if (data.infocode === '2') {
                        //alert("暂无更多商品");
                        _t.noMore = true;
                    }
                }, function () {
                    alert("网路超时，请刷新重新请求");
                });
            },
            toBalanceForFree: function (activeId, goodsId) {
                var _t = this;
                if(lib.checkWeiXin() && $.cookie("member_loginName").length !== 11){
                    location = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                    return;
                }
                lib.ajx(lib.getReq().ser + "shoppingCart/toBalanceForFree.action", {
                    activeId: activeId,
                    goodsId: goodsId
                }, function (data) {
                    if (data.infocode === '0') {
                        location.href = "/buyer/order/dingdanqr_n.html?ac=" + activeId + "&gId=" + goodsId;
                    } else {
                        alert(data.info);
                        if (data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                    }
                });
            },
            setWxShare: function () {
                if (lib.checkWeiXin()) {
                    var memberId = $.cookie("member_memberId");
                    var memberTypeId = $.cookie("member_memberTypeId");
                    if (!memberId || !memberTypeId || memberTypeId < 2) {
                        memberId = 1;
                    }
                    // dataForWeixin.imgUrl = "";
                    dataForWeixin.title = "零元购 - 无需砍价既订即得|买买";
                    dataForWeixin.desc = "全新零元购物体验，无需砍价，既订即得";
                    dataForWeixin.link = location.protocol + "//" + location.host + "/buyer/lingyuangouzq.html?activeId="+ lib.getUrlParam('activeId') +"&mId=" + memberId;
                    wxshare();
                }
            }
        });
        lingyuangouzq.init();
    });
});

/**
 * Created by yehongfeng on 17/5/25.
 */
require.config({baseUrl: '/js/lib', urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    var reqUrl = lib.getReq(), object = {};
    $(function () {
        $.extend(object, {
            typeId: lib.getUrlParam("activeMissVoteTypeId"),
            playerId: lib.getUrlParam("activeMissVotePlayerId"),
            player: null,
            init: function () {
                this.initPlayerInfo();
                this.bindEvent();
                if (lib.checkWeiXin()) {
                    $("#wx").show();
                    $("#wx span").addClass("selected");
                    $("#yl").show();
                } else {
                    $("#alipay").show();
                    $("#alipay span").addClass("selected");
                    $("#yl").show();
                }
            },
            initPlayerInfo: function () {
                var _pi = this;
                lib.ajx(reqUrl.ser + " /missVote/getPlayerDetailInfo.action", {
                    activeMissVoteTypeId: _pi.typeId,
                    activeMissVotePlayerId: _pi.playerId
                }, function (data) {
                    if (data.infocode === "0") {
                        var info = data.info;
                        _pi.player = info.player;
                        var number = info.player.sortValue >= 10 ? info.player.sortValue : ("0" + info.player.sortValue);
                        $("#player_head").attr("src", reqUrl.imgPath + info.player.imgUrl);
                        $("#title").html("给" + info.player.playerName + "送鲜花");
                        $("#player_number").html(number + "<br><samp>编号</samp>");
                        $("#flower_number").html(info.player.flowerNum + "<br><samp>鲜花</samp>");
                        $("#vote_number").html(info.player.votedNum + "<br><samp>票数</samp>");

                    } else {
                        console.log(data.info);
                    }
                }, function () {
                    alert("网络异常！");
                });
            },
            bindEvent: function () {
                var _pi = this;
                // 禁止滚屏操作
                var banTouchMove = function () {
                    $(document).on("touchmove",function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                };

                // 购物送鲜花——购物页
                $("#give_flower").on("click", function () {
                    location.href = "/tv/sl_shop.html?activeMissVoteTypeId=" + _pi.typeId + "&activeMissVotePlayerId=" + _pi.playerId;
                });

                // 选择购买的鲜花项
                $(".buy_flower_item span").on("click", function () {
                    $(".buy_flower_item span.selected").removeClass("selected");
                    $(this).addClass("selected");
                });

                // 选择支付类型
                $(".pay_type div").on("click", function () {
                    $(".pay_type div span.selected").removeClass("selected");
                    $(this).children("span").addClass("selected");
                });

                // 购物送鲜花
                $("#sure_confirm").on("click", function () {
                    // 判断商品与支付方式是否为空
                    if (document.querySelector(".buy_flower_item span.selected") === null) {
                        $(".b1 span").html("您没有选择购买鲜花！");
                        $(".dialog_box").show();
                        banTouchMove();
                        $(".b1").show();
                    } else if (document.querySelector(".pay_type div span.selected") === null) {
                        $(".b1 span").html("您没有选择支付方式！");
                        $(".dialog_box").show();
                        banTouchMove();
                        $(".b1").show();
                    } else {
                        // 调用支付接口
                        var payTypeNum = 0;
                        var payType = $(".pay_type div span.selected").attr("data-name");
                        var goodsId = $(".buy_flower_item span.selected").attr("data-id");
                        if (payType === "wx") {
                            payTypeNum = 18;
                        } else if (payType === "alipay") {
                            payTypeNum = 17;
                        } else if (payType === "yl") {
                            payTypeNum = 20;
                        }
                        lib.ajx(reqUrl.ser + " /shoppingCart/submitOrderForFlower.action", {
                            activeId: _pi.typeId,
                            goodsId: goodsId,
                            goodsNum: 1,
                            payTypeId: payTypeNum,
                            playerId: _pi.playerId
                        }, function (data) {
                            if (data.infocode === "0") {
                                if (data.info.isPay === 0) {
                                    var redirect_uri = "";
                                    if (data.info.payTypeId === 17) {
                                        lib.onLoading();
                                        _pi.alipay(data.info);
                                    } else if (data.info.payTypeId === 18) {
                                        redirect_uri = lib.getReq().ser + 'pay/wxPay.action';
                                        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + reqUrl.appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state=" + data.info.orderId + "#wechat_redirect";
                                    } else {
                                        redirect_uri = lib.getReq().ser + 'unionpay/toPay.action?orderId=' + data.info.orderId;
                                        location.href = redirect_uri;
                                    }
                                }
                            } else {
                                alert(data.info);
                            }
                        }, function () {
                            alert("网络异常！");
                        });
                    }
                });

                $("#confirm").on("click", function () {
                    $(".dialog_box").hide();
                    $(".b1").hide();
                    $(document).off('touchmove');
                    $(".b1 span").html("");
                });
            },
            alipay: function (order_info) {
                lib.ajx(reqUrl.ser + "pay/alipay.action", {
                    orderId: order_info.orderId,
                    originType: 1
                }, function (data) {
                    if (data.infocode === "0") {
                        location.href = data.info;
                    } else {
                        alert(data.info);
                        if (data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                    }
                }, function () {
                    alert("请求失败");
                });
            }
        });
        object.init();
    });
});
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    if ("3" === $.cookie("member_memberTypeId")) {
        alert("您已是大咖，无需升级");
        history.go(-1);
        return;
    }
    var ajaxData = {};
    ajaxData.payTypeId = 17;
    ajaxData.upgradeTypeId = 1;
    var orderId = '0';
    if (lib.checkWeiXin()) {
        ajaxData.payTypeId = 18;
    }
    //判断是否有未支付的升级订单
    lib.ajx(lib.getReq().ser + 'member/getNotPayUpgradeOrder.action', {}, function (data) {
        if ("0" === data.infocode) {
            orderId = data.info.orderId;
            pay(orderId);
        } else if ("1" === data.infocode) {
            alert(data.info);
        } else if ("2" === data.infocode) {
            alert(data.info);
            location.href = "/login/denglu.html?backUrl=" + lib.getBackUrl();
        } else if ("3" === data.infocode) {
            lib.ajx(lib.getReq().ser + 'member/makeUpgradeOrder.action', ajaxData, function (data) {
                if ("0" === data.infocode) {
                    orderId = data.info.orderId;
                    pay(orderId);
                } else {
                    alert(data.info);
                    if ("2" === data.infocode) location.href = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                }
            }, function () {
                console.log("请求失败");
            });
        }
    }, function () {
        console.log("请求失败");
    });


    function pay(orderId) {
        if (lib.checkWeiXin()) {
            var redirect_uri = lib.getReq().ser+'pay/wxPay.action';
            $(".ui-oneKey-buy").attr("href", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + lib.getReq().appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state=" + orderId + "#wechat_redirect");
        }else{
            lib.ajx(lib.getReq().ser + "pay/alipay.action", {orderId: orderId, originType: 1}, function (d) {
                if (d.infocode === "0") {
                    $(".ui-oneKey-buy").attr("href", d.info);
                } else {
                    alert(d.info);
                    if (d.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                }
            }, function () {
                console.log("请求失败");
            });
        }
    }
});

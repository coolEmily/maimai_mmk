require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanzhifu = {};
    $.extend(dingdanzhifu, {
        oId: lib.getUrlParam("oId"),
        orderInfoFN: function(){
          if(sessionStorage.orderInfo){
            this.orderInfo = JSON.parse(sessionStorage.orderInfo);
          }else{
            this.getOrderInfo();
            this.orderInfo = null;
          }
        },
        init: function(){
            var _t = this;
            _t.orderInfoFN();
            _t.orderInfo && _t.initPage();
        },
        getOrderInfo: function(){
          var _t = this;
          lib.onLoading();
          common.js.ajx(reqUrl.ser+"order/getPayInfo.action",{orderId: _t.oId}, function(data){
              lib.offLoading();
            if(data.infocode === "0"){
                _t.orderInfo = data.info;
                _t.initPage();
            }else{
                alert(data.info);
            }
          }, function(){
              lib.offLoading();
              alert("请求失败");
          });
        },
        initPage: function(){
            var _t = this;
            var appid = reqUrl.appid;
            if(!_t.orderInfo){
                location.href = "/buyer/liebiao.html";
                return;
            }

            var h = '<div><div style="line-height: 40px;border-bottom: 1px #f1f1f1 solid;padding: 0 20px;">订单号：'+  _t.orderInfo.orderNo +'</div>'+ 
                    '<div style="line-height: 40px;padding: 0 20px;">总金额：'+  _t.orderInfo.orderMoney +'</div></div>';
            $(".ui-body.main").append(h);
            _t.orderInfo.payTypeId === 17 ? $(".button.ui_btn").text("支付宝支付") : (_t.orderInfo.payTypeId === 18 ? $(".button.ui_btn").text("微信支付") : $(".button.ui_btn").text("银联支付"));
            if(_t.orderInfo.payTypeId === 17){
                lib.onLoading();
                common.js.ajx(reqUrl.ser+"pay/alipay.action",{orderId: _t.orderInfo.orderId,originType:1}, function(data){
                    if(data.infocode === "0"){
                        $(".button.ui_btn").attr("href", data.info);
                    }else{
                        alert(data.info);
                        if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, function(){
                    alert("请求失败");
                });
            }else if(_t.orderInfo.payTypeId === 18){
                var redirect_uri = lib.getReq().ser+'pay/wxPay.action';
                $(".button.ui_btn").attr("href", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri="+ redirect_uri +"&response_type=code&scope=snsapi_base&state=" + _t.orderInfo.orderId + "#wechat_redirect");
            }else{
                var redirect_uri = lib.getReq().ser+'unionpay/toPay.action?orderId=' + _t.orderInfo.orderId;
                $(".button.ui_btn").attr("href", redirect_uri)
            }
        }
    });
    dingdanzhifu.init();
});
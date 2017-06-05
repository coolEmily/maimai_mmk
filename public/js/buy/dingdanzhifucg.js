require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanzhifucg = {};
    $.extend(dingdanzhifucg, {
        sId: common.tools.getUrlParam("sId") || $.cookie("maimaicn_s_id"),
        orderId: common.tools.getUrlParam("tradeNo"),
        tradeStatus: common.tools.getUrlParam("tradeStatus"),
        orderType: common.tools.getUrlParam("orderType"),
        memberType: common.tools.getUrlParam("mtId") ? common.tools.getUrlParam("mtId") : $.cookie("member_memberTypeId"),
        init: function(){
            var _t = this;
            if(_t.sId ==  "425160"){
              $("a:contains(关注买买)").text("关注天视商城");
              $("li:contains(买买电商官方公众号)").next().children().attr("src", "/images/buy/tianshishangcheng.jpg");
              $("li:contains(买买电商官方公众号)").text("天视商城官方公众号");
              $("a:contains(下载买买电商APP)").attr("href", "http://a.app.qq.com/o/simple.jsp?pkgname=com.maimaicn.tianshi").text("下载天视商城APP");
            }
            if(!lib.checkMobile()){
                if(location.href.indexOf("m.maimaicn.com") > -1){
                    location.href = "http://www.maimaicn.com/order/paysucc.html";
                    return;
                }else{
                    location.href = "http://pc.maimaicn.com/order/paysucc.html";
                    return;
                }
            }
            
            if(_t.orderType === "1"){
                $.cookie("member_memberTypeId", _t.memberType, {path:"/", domain: '.maimaicn.com',expires: new Date("2084-06-10T13:19:38.097Z")});
                $("#viewOder").html('返回卖家中心');
                $("#viewOder").attr("href", "/mjzhongxin.html");
            }
            $("#orderNo_p strong").text(_t.orderId);
            if("success" === _t.tradeStatus){
                $("#pay_suc").show();
            }else{
                $("title").text("订单支付失败");
                $("#pay_err").show();
                
            }
            
            $(".bott40").show();
            
            lib.ajx(lib.getReq().ser + 'shoppingCart/orderInfoForFlower.action', {orderId: _t.orderId}, function(data){
              if(data.infocode === "0"){
                sessionStorage.orderInfo = JSON.stringify(data.info);
                location.href = '/buyer/order/flowerpaysucc.html';
                return;
              }
               $("body").show();
            },  function(){
              $("body").show();
            });
        }
    });
    dingdanzhifucg.init();
});
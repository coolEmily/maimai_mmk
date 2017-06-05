require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanzhifucg = {};
    $.extend(dingdanzhifucg, {
        orderId: common.tools.getUrlParam("tradeNo"),
        tradeStatus: common.tools.getUrlParam("tradeStatus"),
        init: function(){
          var _t = this;
          $("#orderNo_p strong").text(_t.orderId);
          if(sessionStorage.isApp !== "0"){
            $("#viewOder").attr("href", "javascript:push.pushViewController('查看订单')");
            $("#conShop").attr("href", "javascript:push.pushViewController('回首页')");
          }
            
        }
    });
    dingdanzhifucg.init();
});
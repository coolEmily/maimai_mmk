require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), tuihuojj = {};
    $.extend(tuihuojj, {
        oId: common.tools.getUrlParam("oId"),
        backType: common.tools.getUrlParam("bt"),
        init: function(){
            var _t = this;
            _t.bindEvent();
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".ui-jujue-reason", function(){
                var _this = this;
                var reason = $("textarea").val().trim();
                if("" === reason){
                    alert("请输入拒绝原因");
                    return;
                }
                common.js.ajx(reqUrl.ser+"order/rejectBackBySeller.action", {orderId: _t.oId, reason: reason, backType: _t.backType}, function(data){
                    alert(data.info);
                    if(data.infocode === "0"){
                        location.href = "tuihuo.html";
                    } 
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }, function(){
                    alert("数据请求失败");         
                });
            });
        }
        
    });
    
    tuihuojj.init();
});
require.config({baseUrl: '/js/lib'});
require(["zepto", "lib"], function ($, lib) {
    lib = new lib();
    var reqUrl = lib.getReq();
    var templateId = lib.getUrlParam("templateId");
    var duanxinxq = {};
    $.extend(duanxinxq, {
        init: function () {
            var _t = this;
            lib.ajx(reqUrl.ser + "/smsTemplate/showSMSTemplate.action", {templateId: templateId}, function (data) {
                if (data.infocode === "0") {
                    $("#sms_txt").text(data.info);
                } else if (data.infocode == 2) {
                    alert(data.info);
                    location.href = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                } else {
                    $("#template").remove();
                    $("#hint").remove();
                    alert(data.info);
                }
            }, _t.errFn);
        },
        errFn: function () {
            alert("请求数据失败");
        }
    });
    duanxinxq.init();
});

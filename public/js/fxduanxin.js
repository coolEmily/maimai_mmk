require.config({baseUrl: '/js/lib'});
require(["zepto", "lib"], function ($, lib) {
    lib = new lib();
    var reqUrl = lib.getReq();
    var duanxin = {};
    $.extend(duanxin, {
        pageNo: 1,
        pageSize: 15,
        noMore: false,
        init: function () {
            var _t = this;
            _t.initPage();
            _t.roll();
        },
        initPage: function () {
            var _t = this;
            lib.ajx(reqUrl.ser + "/smsTemplate/getSMSTemplatePage.action", {
                pageNo: _t.pageNo,
                pageSize: _t.pageSize
            }, function (data) {
                if (data.infocode === "0") {
                    var h = "";
                    if (data.info.totalCount === "0") $("#template").remove();
                    if (data.info.dataList.length === "0") {
                        _t.noMore = true;
                        return;
                    }
                    _t.pageNo++;
                    $.each(data.info.dataList, function (k, v) {
                        h += '<li class="template_list"><a href="duanxinxq.html?templateId=' + v.templateId + '"><p>' + v.title + '</p><span class="triangle"></span></a></li>';
                    });
                    $("#template ul").append(h);
                } else {
                    alert(data.info);
                }
            }, _t.errFn);
        },
        errFn: function () {
            alert("请求失败！");
        },
        roll: function () {
            var _t = this;
            $(window).scroll(function () {
                if (!_t.noMore && $(window).scrollTop() > $(document).height() - $(window).height() - 10) {
                    _t.initPage();
                }
            });
        }
    });
    duanxin.init();
});

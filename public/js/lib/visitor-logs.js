//name:访问日志js,param:当前页面链接(window.location.href),return:none,author:lichengyu,Date:20160418
define(['lib'], function (lib) {
    lib = new lib();
    function getStrParam(url, param) {
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        var r = (url.substring(url.indexOf("?"))).substr(1).match(reg);
        var reStr = (r !== null ? decodeURI(r[2]) : "");
        return reStr;
    }

    return {
        setLog: function (url, type) {
            if (url === '' || url === null || url === undefined)return;
            var pageUrl = url.substring(0, url.indexOf("?")) || url;
            var pageMemberId = getStrParam(url, 'mId') || ( $.cookie("maimaicn_f_id") || '1');
            var goodsId = (type == '1' ? getStrParam(url, 'gId') : '1');
            var paramdata = {
                pageMemberId: pageMemberId,
                pageUrl: pageUrl,
                pageType: type,
                goodsId: goodsId,
                originType: 0
            };
            lib.ajx(lib.getReq().ser + "/visitLog/saveVisitLog.action", paramdata, function (data) {
            }, function () {
            });
        }
    };
});
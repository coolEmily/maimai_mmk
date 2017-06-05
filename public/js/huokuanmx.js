require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var zydd = {};
        $.extend(zydd, {
            page: 1,
            rows: 20,
            noMore: false,
            init: function(){
                var _t = this;
                _t.getTotalGoodsMoney();
                _t.updatePageDat();
                _t.scroll();
            },
            getTotalGoodsMoney: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser+"order/getTotalGoodsMoney.action",{},function(data){
                    if(data.infocode === "0"){
                        $("span[name=getTotalGoodsMoney]").text(data.info.totalGoodsMoney + '元');
                    }
                }, _t.errFn);
            },
            updatePageDat: function(url){
                var _t = this; 
                common.js.ajx(reqUrl.ser + 'order/getGoodsMoneyDetail.action', {page: _t.page, rows: _t.rows}, function(data){
                    if(data.infocode === '0'){
                        var h = "";
                        _t.page++;
                        if(data.info.length === 0) _t.noMore = true;
                        $.each(data.info, function(k, v) {
                        	h +='<li><span>'+ v.chName +'</span><span>'+ v.goodsNum +'</span><span>'+ v.payMoney +'元</span></li>';
                        });
                        $(".listul ul").append(h);
                    }else {
                        alert(data.info);
                        if(data.infocode === '3') location.href = '/login/denglu.html?backUrl='+common.tools.getBackUrl();
                    }
                }, _t.errFn);
                
            },
            scroll: function(){
                var _t = this;
                $(window).scroll(function (){
                    if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        _t.updatePageDat();
                    }
                });
            },
            errFn: function(e){
                alert("数据请求失败");
            }
        });
        zydd.init();    
    })();
});
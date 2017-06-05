require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var _lib = new lib();
    var common = {"js": _lib, "tools": _lib}, reqUrl = _lib.getReq();
    (function(){
        var fanyong = {};
        $.extend(fanyong, {
            data: {orderNo: "", pageNo: 0, pageSize: 20},
            noMoreGoods: false,
            isLoading: false,
            rebateType: {"1": "商品返利","2": "会员升级返利"},
            init: function(){
                var _t = this;
                _t.initData(_t.data);
                _t.bindEvent();
                _t.roll();
            },
            initData: function(data){
                var _t = this;
                if(_t.isLoading){
                    return;
                }
                _t.isisLoading = true;
                _t.data.pageNo++;
                common.js.ajx(reqUrl.ser + "member/getPageForOrderRebate.action", data, function(data){
                    if(data.infocode === "0"){
                        if(_t.data.pageNo === 1){
                            $(".itemul ul").empty();
                        }
                        if(data.info.length === 0 ){
                            _t.noMoreGoods = true;
                            if(_t.data.pageNo === 1){
                                $("input[name=orderNo]").val().trim()?$(".ui-nothing-find dt").text("没有查到关于该订单的任何返利"):$(".ui-nothing-find dt").text("没有查到任何返利");
                                $(".ui-nothing-find").show();
                            }
                            return;
                        }
                        var h = "";
                        $.each(data.info, function(k, v){
                            h += '<li><div>'+ _t.rebateType[v.rebateType] +'<br><span>'+ v.operateTime +'</span></div>' + 
                                '<div>订单号：'+ v.orderNo +'<br><span>+￥'+ v.rebateMoney +'</span></div></li>';
                        });
                        $(".itemul ul").append(h);
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                    _t.isisLoading = false;
                }, _t.errFn);
            },
            bindEvent: function(){
                var _t = this;
                $(document).on("tap", ".button", function(){
                    _t.noMoreGoods = false;
                    $(".ui-nothing-find").hide();
                    $.extend(_t.data, {orderNo: $("input[name=orderNo]").val(), pageNo: 1});
                    _t.initData(_t.data);
                });
            },
            roll: function(){
                var _t = this;
                $(window).scroll(function (){
                    if(!_t.noMoreGoods &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        _t.initData(_t.data);
                    }
                });
            },
            errFn: function(){
                _t.isisLoading = false;
                alert("数据请求失败");
            }
        });
        fanyong.init();
    })();
});
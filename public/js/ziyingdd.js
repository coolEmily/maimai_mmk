require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var zydd = {};
        $.extend(zydd, {
            type: 0,
            requestOrder: 0,
            page: 1,
            rows: 20,
            noMore: false,
            url: {0: "order/getSellerOrderInfo.action", 1: "order/getUnpaySellerOrder.action"},
            seperateFlag: {0: '未拆单', 1: '已拆单'},
            color: { 1: 'ui-', 10: 'ui-err', 20: 'ui-err', 50: 'ui-', 80: 'ui-'},
            orderStatus: { 1: '已取消', 10: '待付款', 20: '待发货', 50: '已发货', 80: '已完成' },
            init: function(){
                var _t = this;
                _t.getTotalGoodsMoney();
                _t.bindEvent();
                _t.updatePageDat(_t.url[0]);
                _t.scroll();
            },
            getTotalGoodsMoney: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser+"order/getTotalGoodsMoney.action",{},function(data){
                    if(data.infocode === "0"){
                        $(".ui-total-price span").text(data.info ? data.info.totalGoodsMoney : 0);
                    }
                }, _t.errFn);
            },
            bindEvent: function(){
                var _t = this;
                /*筛选订单*/
                $("#titword").on("tap",function(){
                    if($("#select_box").is(":visible") === true){
                        $("#select_box").hide();
                        $("#trianglered").hide();
                        $("#triangle").show();  
                    }else{
                        $("#select_box").show();
                        $("#trianglered").show();
                        $("#triangle").hide();    
                    }         
                });
    
                $("#itemcon li").on("touchend",function(event){
                    event.preventDefault();
                    if(_t.requestOrder === $(this).index()) return;
                    _t.requestOrder = $(this).index();
                    var con=$(this).html();
                    $(this).addClass("cur").siblings().removeClass("cur");
        
                    $(this).siblings().find("span").remove();
                    $('<span class="radioimg"></span>').appendTo($(this));
        
                    $("#select_box").hide();
                    $("#titword_text").html("自营"+con);
                    $("#trianglered").hide();
                    $("#triangle").show();
                    _t.page = 1;
                    _t.noMore = false;
                    if(_t.requestOrder === 2){
                        _t.updatePageDat(_t.url[1]);
                        return;
                    }
                    _t.updatePageDat(_t.url[0]);
                });
            },
            errFn: function(e){
                alert("数据请求失败");
            },
            updatePageDat: function(url){
                var _t = this; 
                common.js.ajx(reqUrl.ser + url, {page: _t.page, rows: _t.rows, requestOrder: _t.requestOrder}, function(data){
                    if(data.infocode === '0'){
                        $(".ui-nothing-find").hide();
                        if(_t.page++ === 1) $(".ui-list").empty();
                        if(data.info.length === 0 && _t.page === 2){
                            $(".detail_wrap_none").show();
                            $(".ui-nothing-find").show();
                            $(".ui-total-price").hide();
                            return;
                        }
                        if(data.info.length === 0) _t.noMore = true;
                        
                        var h = '';
                        $.each(data.info, function(k, v){
                            h +=  '<a href="ziyingxq.html?orderId='+ v.orderId +'&unPay='+ v.unPay +'" class="ui-list-detail"><div><div class="ui-status '+ (_t.color[v.orderStatus] ?  _t.color[v.orderStatus] : v.orderStatus >10 && v.orderStatus < 30 ? _t.color[20] : _t.color[50])+'">'+ (_t.orderStatus[v.orderStatus] ?  _t.orderStatus[v.orderStatus] : v.orderStatus >10 && v.orderStatus < 30 ? _t.orderStatus[20] : _t.orderStatus[50]) +'</div>'+
                                  '<div class="ui-dingdan-code">订单号：'+ v.orderNO +'</div></div><div>'+
                                  '<div class="ui-d-num">共有'+ (v.goodsNum ? v.goodsNum : 0) +'件商品</div>'+
                                  '<div class="ui-d-price">合计: <span>￥'+ v.payMoney +'</span></div></div></a>';
                                if(v.orderStatus > 10 && v.orderStatus < 30)
                                    h += '<div class="ui-fanhuo-button"><a href="/order/fahuo.html" class="button">进入发货管理</a></div>';
                                else if(v.orderStatus  === 41)
                                    h += '<div class="ui-fanhuo-button"><a href="tuihuo.html?oId='+ v.orderId +'" class="button">退货</a></div>';
                        });
                        $(".ui-list").append(h);
                    }else{
                        if(_t.page === 1) $(".ui-list").empty();
                        alert(data.info);
                        if(data.infocode === '3') location.href = '/login/denglu.html?backUrl='+common.tools.getBackUrl();
                    }
                }, _t.errFn);
                
            },
            scroll: function(){
                var _t = this;
                $(window).scroll(function (){
                    if(!_t.noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        _t.updatePageDat(_t.url[_t.type]);
                    }
                });
            }
        });
        zydd.init();    
    })();
});
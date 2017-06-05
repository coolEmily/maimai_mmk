require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var fydd = {};
        $.extend(fydd, {
            type: 0,
            requestOrder: 0,
            page: 1,
            rows: 20,
            noMore: false,
            isLoading: false,
            url: {0: "order/getRebateOrderDetail.action", 1: "order/getDirectRebateOrderDetail.action", 2: "order/getIndirectRebateOrderDetail.action"},
            fList: {0: "getRebateOrderDetail", 1: 'getDirectRebateOrderDetail', 2: 'getIndirectRebateOrderDetail'},
            seperateFlag: {0: '未拆单', 1: '已拆单'},
            color: { 1: 'ui-err', 10: 'ui-err', 20: 'ui-err', 50: 'ui-err', 80: 'ui-'},
            orderStatus: { 1: '已取消', 10: '待付款', 20: '待发货', 50: '已发货', 80: '已完成' },
            init: function(){
                var _t = this;
                _t.bindEvent();
                _t.getFanT();
                _t.updatePageDat(_t.url[_t.type]);
                _t.scroll();
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
                    $("#titword_text").html("返佣"+con);
                    $("#trianglered").hide();
                    $("#triangle").show();
                    _t.page = 1;
                    _t.noMore = false;
                    _t.updatePageDat(_t.url[_t.type]);
                });
    
                /*分销和自营切换*/
                $("#project div").on("tap",function(){
                    $(this).addClass("cur");
                    $(this).siblings().removeClass("cur");
                });
                
                $(document).on("tap", ".ui-fan-type > div", function(){
                    $(this).addClass("active").siblings().removeClass("active");
                    if(_t.type !== ($(this).index())){
                        _t.type = $(this).index();
                        _t.page = 1;
                        _t.noMore = false;
                        _t.updatePageDat(_t.url[_t.type]);
                    }
                });
            },
            getFanT: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser+"memberTotalMessage/getRebateInfoByMemberId.action",{}, function(data){
                    if(data.infocode === "0"){
                        $(".ui-get-price").text(data.info.totalRebate ? data.info.totalRebate : 0);
                        $(".ui-dai-price").text(data.info.pendingRebate ? data.info.pendingRebate : 0);
                    }else{
                        console.log(data.info);
                        if(data.infocode === "3") location.href = "/login/denglu.html?backUrl="+common.tools.getBackUrl();
                    }
                }, _t.errFn);
            },
            errFn: function(e){
                _t.isisLoading = false;
                alert("数据请求失败");
            },
            updatePageDat: function(url){
                var _t = this;
                if(_t.isLoading){
                    return;
                }
                console.log(_t.isLoading);
                _t.isisLoading = true;
                common.js.ajx(reqUrl.ser + url, {page: _t.page++, rows: _t.rows, requestOrder: _t.requestOrder}, function(data){
                    if(data.infocode === '0'){
                        if(_t.page === 2) $(".ui-list").empty();
                        if(data.info.length === 0) _t.noMore = true;
                        var h = '';
                        $.each(data.info, function(k, v){
                            h += '<a href="fanyongxq.html?orderId='+ v.orderId +'&seperateFlag='+ v.seperateFlag +'" class="ui-list-detail"><div><div class="ui-status '+ (_t.color[v.orderStatus] ?  _t.color[v.orderStatus] : v.orderStatus >10 && v.orderStatus < 30 ? _t.color[20] : _t.color[50])+'">'+ (_t.orderStatus[v.orderStatus] ?  _t.orderStatus[v.orderStatus] : v.orderStatus >10 && v.orderStatus < 30 ? _t.orderStatus[20] : _t.orderStatus[50]) +'</div>'+ 
                               '<div class="ui-dingdan-code">订单号：'+ v.orderNO +'</div></div><div>'+ 
                               '<div class="ui-d-num">共有'+ (v.goodsNum?v.goodsNum:1) +'件商品</div><div class="ui-d-fan">'+ ((v.directMemberRebate || v.directMemberRebate === 0) && v.directMemberRebate !== -1 ? "直接返利" : '间接返利') +': <span>￥'+ ((v.directMemberRebate || v.directMemberRebate === 0) && v.directMemberRebate !== -1 ? v.directMemberRebate : v.indirectMemberRebate) +'</span></div>'+ 
                               '<div class="ui-d-price">合计: <span>￥'+ v.payMoney +'</span></div></div></a>';
                        });
                        $(".ui-list").append(h);
                    }else{
                        if(_t.page === 1) $(".ui-list").empty();
                        alert(data.info);
                    }
                    _t.isisLoading = false;
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
        fydd.init();    
    })();
});
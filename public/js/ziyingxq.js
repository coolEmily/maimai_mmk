require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var fyxq = {};
        $.extend(fyxq, {
            orderId: common.tools.getUrlParam("orderId"),
            unPay: common.tools.getUrlParam("unPay"),
            seperateFlag: common.tools.getUrlParam("seperateFlag"),
            color: { 1: 'ui-err', 10: 'ui-err', 20: 'ui-err', 50: 'ui-ing', 80: 'ui-'},
            orderStatus: { 1: '已取消', 10: '待付款', 20: '待发货', 50: '已发货', 80: '已完成' },
            init: function(){
                this.getRebateOrderInfo();
            },
            getRebateOrderInfo: function(){
                var _t = this;
                common.js.ajx(reqUrl.ser+"order/getSellerOrderItem.action", {orderId: _t.orderId,unPay:_t.unPay}, function(data){
                    if(data.infocode === "0"){
                        var infos =  data.info;
                        var h = "", mj = "";
                        h += '<div><div class="ui-order-status '+ (_t.color[infos.orderStatus] ? _t.color[infos.orderStatus]: infos.orderStatus > 10 && infos.orderStatus < 30 ? _t.color[20] : _t.color[50]) +'">'+ (_t.orderStatus[infos.orderStatus] ? _t.orderStatus[infos.orderStatus]: infos.orderStatus > 10 && infos.orderStatus < 30 ? _t.orderStatus[20] : _t.orderStatus[50]) +'</div><div class="ui-order-code">订单号：'+ infos.orderNO +'</div></div>';
                        h += '<div style="display: table;width: 100%;box-sizing: border-box;">'+
                             '<div style="float:right"><span class="ui-shou-info">收货电话：</span>'+ infos.mobile +'</div><div><span class="ui-shou-info">收货人：</span>'+ infos.receiveName +'</div>'+
                             '<div><div style="float: left;" class="ui-shou-info">收货地址：</div>'+
                             '<div style="display: table;overflow: hidden;word-break: break-all;line-height: normal;padding: 12px 0;">'+ infos.detailAddress +'</div></div></div>';
                        h += '<div>订单时间：'+ infos.createDate +'</div>';
                        var mjl = [];
                        $.each(infos.orderGoods, function(K, V) {
                        	h += '<div class="ui-goods-list"><div class="ui-goods-info"><div class="ui-img">'+
                                 '<img src="'+ reqUrl.imgPath + V.mainPictureJPG +'"></div><div class="ui-desc">'+
                                 '<p>'+ V.orderGoodsName +'</p><p>'+ V.enName +'</p><p><span style="margin-right:50px;color:#ff5050;font-size:16px">￥'+ V.orderPrice +'</span>x'+ V.goodsNum +'</p></div></div>';
                            $.each(V.giftGoods, function(k, v) {
                            	if(V.activeType === 1)
                                    h += '<div class="ui-zeng">【买赠】 '+ v.giftGoodsName +'订单完成后自动发放） X'+ v.giftGoodsNum +'</div>';
                            });   
                            
                            h += '</div>';
                            
                            if(mjl.indexOf(V.activeId) === -1 && V.activeType === 3){
                                mjl.push(V.activeId);
                                mj += '<div><div>【满减】</div><div>'+V.activeName+'</div></div>';
                            }
                        });
                        h += '<div class="ui-order-subtotal"><div>共有'+ infos.totalNum +'件商品</div><div>合计: <span>￥'+ infos.payMoney +'</span></div></div>';
                        $(".ui-order-info").html(h);
                        
                        
                        $(".ui-manjian").html(mj);
                    }else{
                        alert(data.info);
                        if(data.infocode === "3") location.href = "/login/denglu.html?backUrl="+common.tools.getBackUrl();
                    }
                },function(){
                    alert("数据请求失败");
                });
            }
        });
        fyxq.init();    
    })();
});
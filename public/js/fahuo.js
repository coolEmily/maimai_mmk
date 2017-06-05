require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var fahuo = {};
    $.extend(fahuo, {
        rows: 20,
        page: 1,
        dc: "", //获取快递公司信息
        noMore: false,
        init: function(){
            var _t = this;
            _t.getDeliveryCompany();
            _t.bindEvent();
            _t.roll();
        },
        initData: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "order/goToDelivery.action", {page: _t.page,rows: _t.rows}, function(data){
                if(data.infocode === "0"){
                    if (data.info.length === 0){
                        _t.noMore = true;
                        return;
                    }
                    _t.page ++;
                    $.each(data.info, function(K, V) {
                        var h = "";
                        var id = V.orderNO + V.orderId;
                    	if(V.isDelivery === 1){
                            h += '<div class="ui-not-send" data-orderId="'+ V.orderId +'"><div class="refund"><div class="refund_mold"><span>订单号: &nbsp;</span>' +
                                   '<p class="">'+ V.orderNO +'</p></div><div class="refund_mold"><span>快递公司:</span>' +
                                   '<div class="ui-transd-999" class="ui-kuaidi"><select>'+ _t.dc +'</select></div></div>' +
                                   '<div class="refund_mold"><span>快递单号:</span><div><input type="tel" placeholder="输入您的快递单号"/></div></div>';
                                $.each(V.orderGoodsList, function(k, v){
                                    h += '<div class="ui-per-goods"><div class="ui-goods-img">' +
                                        '<img src="'+ reqUrl.imgPath + v.mainPictureJPG +'" /></div><div class="ui-goods-desc">' +
                                        '<p>'+ v.orderGoodsName +'</p><p>'+ v.enName +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                                });
                                
                            h += '</div><div class="button" style="margin-top: 20px;">确认发货</div></div>';
                        }else{
                            h += '<div class="ui-sended" data-orderId="'+ V.orderId +'" id="u'+ id +'">'  +
                                '<div class="refund"><div class="refund_mold"><span>订单号: &nbsp;</span>' +
                                '<p class="">'+ V.orderNO +'</p></div><div class="refund_mold"><span>快递公司:</span>' +
                                '<div class="ui-transd-999" class="ui-kuaidi"><select>'+ _t.dc +'</select></div></div>' +
                                '<div class="refund_mold"><span>快递单号:</span><div><input type="tel" placeholder="输入您的快递单号" value="'+ V.deliveryNo +'"/></div></div>';
                                $.each(V.orderGoodsList, function(k, v){
                                    h += '<div class="ui-per-goods"><div class="ui-goods-img">'  +
                                        '<img src="'+ reqUrl.imgPath + v.mainPictureJPG +'" /></div><div class="ui-goods-desc">' +
                                        '<p>'+ v.orderGoodsName +'</p><p>'+ v.enName +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                                });
                            h += '</div><div class="button" style="margin-top: 20px;">修改订单</div>';
                            h += '<div class="ui-order-completion">最新： '+V.logitics+'<a href="fahuoxq.html?oId='+ V.orderId +'" >查看</a></div>';
                        }
                        $(".main_bg").append(h);
                        if(V.isDelivery === 2)
                            $("#u" + id + " select").val(V.deliveryCompanyId);
                            
                    });
                    
                }else{
                    alert(data.info);
                    if(data.infocode === "2"){
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    } 
                }
            },function(){
                alert("数据请求失败");
            });
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".button:not(.ui-ing)", function(){
                var _this = this;
                $(this).addClass("ui-ing");
                var pObj = $(this).parent();
                var data = {};
                data.orderId = $(pObj).attr("data-orderId");
                data.deliveryCompanyId = $(pObj).find("select option:selected").val();
                data.deliveryNo = $(pObj).find("input").val().trim();
                if("" === data.deliveryNo){
                    alert("请填写订单号");
                    $(this).removeClass("ui-ing");
                    return;
                }
                common.js.ajx(reqUrl.ser + "order/fillInDeliveryNo.action", data, function(data){
                    alert(data.info);
                    if(data.infocode != "0")
                        $(_this).removeClass("ui-ing");
                    else
                        $(_this).css("background","#999");
                },function(){
                    $(_this).removeClass("ui-ing");
                    alert("请求失败");
                });
            });
            
        },
        getDeliveryCompany: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "deliveryCompany/getDeliveryCompany.action", {}, function(data){
                if(data.infocode === "0"){
                    var h = "";
                    $.each(data.info, function(k, v){
                        h += '<option value="'+ v.deliveryCompanyId +'">'+ v.companyName +'</option>';
                    });
                    _t.dc = h;
                    _t.initData();
                }else{
                    alert(data.info);
                }
            },function(){
                alert("数据请求失败");
            });
            
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMore &&　$(window).scrollTop() === $(document).height() - $(window).height()){
                    _t.initData();
                }
            });
        }
    });
    fahuo.init();
});
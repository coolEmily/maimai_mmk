require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var fahuoxq = {};
    $.extend(fahuoxq, {
        oId: common.tools.getUrlParam("oId") ? common.tools.getUrlParam("oId") : 0,
        dc: "", //获取快递公司信息
        init: function(){
            var _t = this;
            _t.getDeliveryCompany();
        },
        initData: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "order/goToDelivery.action", {page: 1,rows: 1,orderId: _t.oId}, function(data){
                if(data.infocode === "0"){
                    $.each(data.info, function(K, V) {
                        var h = "";
                        var id = V.orderNO + V.orderId;
                        h += '<divclass="ui-sended" id="u'+ id +'">' + 
                            '<div style="background:#f1f1f1" class="refund"><div class="refund_mold"><span>订单号: &nbsp;</span>' + 
                            '<p class="">'+ V.orderNO +'</p></div><div class="refund_mold"><span>快递公司:</span>' + 
                            '<div class="ui-transd-999" class="ui-kuaidi"><select>'+ _t.dc +'</select></div></div>' + 
                            '<div class="refund_mold"><span>快递单号:</span><div>'+ V.deliveryNo +'</div></div>';
                            $.each(V.orderGoodsList, function(k, v){
                                h += '<div class="ui-per-goods"><div class="ui-goods-img">' + 
                                    '<img src="'+ reqUrl.imgPath + v.mainPictureJPG +'" /></div><div class="ui-goods-desc">' + 
                                    '<p>'+ v.orderGoodsName +'</p><p>'+ v.enName +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                            });
                        h += '<div class="refund_schedule" style="margin:0;padding-right:15px;margin-top:20px"><ul></ul></div></div></div>';
                        $(".main_bg").append(h);
                        if(V.isDelivery === 2)
                            $("#u" + id + " select").val(V.deliveryCompanyId);
                        _t.getDetails(V.orderId);
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
        getDetails: function(sonOrderId){//获取物流信息
              var _t = this;
            common.js.ajx(reqUrl.ser + "express/getDetails.action", {sonOrderId:sonOrderId,type:1}, function(data){
                if(data.infocode === "0"){
                    var h = "";
                    $.each(data.info, function(k, v){
                        if(k === 0){
                            h += '<li class="new"><i></i><div><p>'+ v.context +'</p><p>'+ v.time +'</p></div></li>';
                        }
                         h += '<li><p>'+ v.context +'</p><p>'+ v.time +'</p></li>';
                    });
                    
                    $(".refund_schedule ul").html(h);
                }else{
                    $(".refund_schedule ul").html('<p style="padding-bottom: 5%;text-align: center;">'+data.info+'</p>');
                }
            },function(){
                alert("数据请求失败");
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
            
        }
    });
    fahuoxq.init();
});
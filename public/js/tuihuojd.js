require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), tuihuo = {};
    $.extend(tuihuo, {
        oId: common.tools.getUrlParam("oId"),
        backType: common.tools.getUrlParam("bt"),
        url: 'order/confirmRefund.action',
        init: function(){
            var _t = this;
            lib.onLoading();
            _t.bindEvent();
            if(_t.backType === "2"){
                _t.url = '/order/agreeRefund.action';
                $("title").text("退款进度");
                $("nav").html('<a href="javascript:;" class="back _goback"></a>退款进度');
                _t.getBackPayOrderInfo();
            }else{
                _t.getBackOrderById();
            }
             
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".ui-tuihuo-confirm", function(){
                var _this = this;
                common.js.ajx(reqUrl.ser+ _t.url, {orderId: _t.oId}, function(data){
                    alert(data.info);
                    if(data.infocode === "0"){
                        $(_this).removeClass("ui-tuihuo-confirm").css("background", "#999");
                        location.href = "tuihuo.html";
                    } 
                    if(data.infocode === "3") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }, function(){
                    alert("数据请求失败");         
                });
            });
        },
        getBackOrderById: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + 'order/getBackLogiticsInfo.action', {orderId: _t.oId}, function(data){
                if(data.infocode === "0"){
                    var v = data.info;
                    var h = '<div style="margin: 0 20px;height:40px;line-height:40px;border-bottom: 1px solid #f1f1f1;"><span style="float:right;color:#999">'+ v.createDate +'</span>订单号:'+ v.orderNO +'</div>';
                    h += '<div class="mana_gl_1 mana_gl_6 clearfix"><div class="mana_gl_l">'+
                         '<a href="javascript:;"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'"></a>'+
                         '</div><div class="mana_gl_r"><h2><a href="javasctipt:;">'+
                         '<nobr>'+ v.chName +'</nobr></a></h2>'+
                         '<h3><a href="javasctipt:;"><nobr>'+ v.enName +'</nobr></a></h3>'+
                         '<p class="dred"><a href="javasctipt:;">￥'+ v.orderPrice +'</a><span style="display:none;margin-left: 50px;color:#949494;font-size:13px">X'+ v.goodsNum +'</span></p></div></div>';
                    h += '<div class="mana_gl_2 mana_gl_6">退款金额：￥'+ v.backMoney +'</div>';
                    h += '<div class="mana_gl_6 button mana_gl_8 ui-tuihuo-confirm" style="background: -webkit-linear-gradient(top, #ff5959,#ff3d3d);"><a href="javascript:;">确认退款</a></div>';
                    $(".mana_gl").html(h);
                    
                    if(v.isOK !== 1){
                        $(".refund_schedule ul").html('<p style="padding-bottom: 5%">'+ v.error +'</p>');
                        return;
                    }
                    if(!v.logitics || 'null' === v.logitics){
                        $(".refund_schedule ul").html('<p style="padding-bottom: 5%">暂无物流信息</p>');
                        return;
                    }
                    _t.getDetails(v.logitics);
                    
                }else{
                    alert(data.info);
                    if(data.infocode === "3") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, function(){
               alert("获取信息失败");
            });
        },
        getBackPayOrderInfo: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + 'order/getBackPayOrderInfo.action', {orderId: _t.oId}, function(data){
                if(data.infocode === "0"){
                    var v = data.info;
                    var h = '<div style="margin: 0 20px;height:40px;line-height:40px;border-bottom: 1px solid #f1f1f1;"><span style="float:right;color:#999">'+ v.createDate +'</span>订单号:'+ v.orderNO +'</div>';
                    h += '<div class="mana_gl_1 mana_gl_6 clearfix"><div class="mana_gl_l">'+
                         '<a href="javascript:;"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'"></a>'+
                         '</div><div class="mana_gl_r"><h2><a href="javasctipt:;">'+
                         '<nobr>'+ v.chName +'</nobr></a></h2>'+
                         '<h3><a href="javasctipt:;"><nobr>'+ v.enName +'</nobr></a></h3>'+
                         '<p class="dred"><a href="javasctipt:;">￥'+ v.orderPrice +'</a><span style="display:none;margin-left: 50px;color:#949494;font-size:13px">X'+ v.goodsNum +'</span></p></div></div>' ;
                    h += '<div class="mana_gl_2 mana_gl_6">退款金额：￥'+ v.payMoney +'</div>';
                    h += '<div class="mana_gl_6 button mana_gl_8 ui-tuihuo-confirm" style="background: -webkit-linear-gradient(top, #ff5959,#ff3d3d);"><a href="javascript:;">确认退款</a></div>';
                    $(".mana_gl").html(h);
                    $(".refund_schedule").remove();
                }else{
                    alert(data.info);
                    if(data.infocode === "3") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            }, function(){
               alert("获取信息失败");
            });
        },
        getDetails: function(logitics){
            var h = "";
            $.each(logitics, function(k, v){
                if(k === 0){
                    h += '<li class="new"><i></i><div><p>'+ v.context +'</p><p>'+ v.time +'</p></div></li>';
                }
                 h += '<li><p>'+ v.context +'</p><p>'+ v.time +'</p></li>';
            });
            $(".refund_schedule ul").html(h);
            
        }
        
    });
    
    tuihuo.init();
});
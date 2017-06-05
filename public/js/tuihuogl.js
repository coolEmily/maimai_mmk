require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), tuihuogl = {};
    $.extend(tuihuogl, {
        oId: common.tools.getUrlParam("oId"),
        payOnline: 0,
        noMore: false,
        page: 1,
        rows: 20,
        init: function(){
            var _t = this;
            _t.bindEvent();
            _t.getSellerBackOrder();
            _t.roll();
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".ui-agree-tuihuo", function(){
                if(!confirm("是否确认退货？")){
                    return;
                }
                var _this = this;
                var orderId = $(this).attr('data-oId');
                common.js.ajx(reqUrl.ser + 'order/agreeBackBySeller.action', {orderId: orderId}, function(data){
                    alert(data.info);
                    if(data.infocode === "0"){
                        $(_this).parent().html('<div class="mana_gl_7 button"><a href="tuihuojd.html?oId='+ orderId +'">查看退货进度</a></div>');
                    }
                });
            });
        },
        getSellerBackOrder: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser+"/order/getSellerBackOrder.action", {page: _t.page, rows: _t.rows}, function(data){
                if(data.infocode === "0"){
                    var h = "";
                    if(data.info.length === 0){
                        _t.noMore = true;
                        return;
                    }
                    _t.page++;
                    $.each(data.info, function(k, v) {
                    	if(v.backType === 1){ //1是退货 2是退款
                    	    h += '<div class="mana_gl"><div style="padding:0 20px;height:40px;line-height:40px;text-align:right;color:#999;border-bottom:1px solid #f1f1f1;border-top:1px solid #f1f1f1"><span style="float:left;color:#333">订单号:'+ v.orderNO +'</span>'+ v.createDate +'</div>'+
                    	         '<div class="mana_gl_1 mana_gl_6 clearfix"><div class="mana_gl_l">'+
                                 '<a href="javascript:;"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'" /></a></div><div class="mana_gl_r">'+
                                 '<h2><a href="javasctipt:;"><nobr>'+ v.chName +'</nobr></a></h2>'+
                                 '<h3><a href="javasctipt:;"><nobr>'+ v.enName +'</nobr></a></h3>'+
                                 '<p class="dred"><a href="javasctipt:;">￥'+ v.orderPrice +'</a></p></div></div>'+
                                 '<div class="mana_gl_2 mana_gl_6">退款金额：￥'+ v.backMoney +'</div>';
                            h += '<div class="mana_gl_3 mana_gl_6"><span class="mana_gl_l">退货原因:</span>'+
                                 '<p class="mana_gl_r">'+ v.backReason +'</p></div>';
                            if(v.backIsRefuse === 3){
                                h += '<div class="mana_gl_3 mana_gl_6"><span class="mana_gl_l">拒绝理由:</span>'+
                                     '<p class="mana_gl_r">'+ v.backRefuseReason +'</p></div>';
                            }
                            if((v.backPicA || 'null' === v.backPicA) || (v.backPicB || 'null' === v.backPicB)){
                                h += '<div class="mana_gl_4 mana_gl_6"><span class="mana_gl_i">商品图片:</span><div class="mana_gl_img">';
                                if(v.backPicA){
                                    h += '<p><img src="'+ reqUrl.imgPath + v.backPicA +'" /></p>';
                                }
                                if(v.backPicB){
                                    h += '<p><img src="'+ reqUrl.imgPath + v.backPicB +'" /></p>';
                                }
                                h += '</div></div>';
                            }
                            if(v.backIsRefuse === 2 || (v.backIsRefuse === 4 && (v.backPayIsRefuse !== 2 && v.backPayIsRefuse !== 3 && v.backPayIsRefuse !== 5))){
                                h += '<div class="mana_gl_7 button"><a href="tuihuojd.html?oId='+ v.orderId +'">查看退货进度</a></div>';
                            }else if(v.backIsRefuse === 3){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">已拒绝退货</a></div>';
                            }else if(v.backIsRefuse === 4  && v.backPayIsRefuse === 2){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">退款进行中</a></div>';
                            }else if(v.backIsRefuse === 4  && v.backPayIsRefuse === 3){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">拒绝退款</a></div>';
                            }else if(v.backIsRefuse === 4  && v.backPayIsRefuse === 5){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">已完成退货</a></div>';
                            }else{
                                h += '<div class="mana_gl_5 mana_gl_6">'+
                                 '<a href="javascript:;" class="button ui-agree-tuihuo" data-oId="'+ v.orderId +'">同意退货</a><a href="tuihuojj.html?oId='+ v.orderId +'&bt=1" class="button">拒绝退货</a>'+
                                 '</div></div>';
                            }
                            
                    	}else{
                    	    h += '<div class="mana_gl"><div style="padding:0 20px;height:40px;line-height:40px;text-align:right;color:#999;border-bottom:1px solid #f1f1f1;border-top:1px solid #f1f1f1"><span style="float:left;color:#333">订单号:'+ v.orderNO +'</span>'+ v.createDate +'</div>'+
                                 '<div class="mana_gl_1 mana_gl_6 clearfix"><div class="mana_gl_l">'+
                                 '<a href="javascript:;"><img src="'+ reqUrl.imgPath + v.mainPictureJPG +'" /></a></div><div class="mana_gl_r">'+
                                 '<h2><a href="javasctipt:;"><nobr>'+ v.chName +'</nobr></a></h2>'+
                                 '<h3><a href="javasctipt:;"><nobr>'+ v.enName +'</nobr></a></h3>'+
                                 '<p class="dred"><a href="javasctipt:;">￥'+ v.orderPrice +'</a></p></div></div>'+
                                 '<div class="mana_gl_2 mana_gl_6">退款金额：￥'+ v.payMoney +'</div>';
                            h += '<div class="mana_gl_3 mana_gl_6"><span class="mana_gl_l">退货原因:</span>'+
                                 '<p class="mana_gl_r">'+ v.payRemark +'</p></div>';
                            if(v.backPayIsRefuse === 3){
                                h += '<div class="mana_gl_3 mana_gl_6"><span class="mana_gl_l">拒绝理由:</span>'+
                                     '<p class="mana_gl_r">'+ v.payRefuseReason +'</p></div>';
                            }
                            if((v.backPayPicA || 'null' === v.backPayPicA) && (v.backPayPicB || 'null' === v.backPayPicB)){
                                h += '<div class="mana_gl_4 mana_gl_6"><span class="mana_gl_i">商品图片:</span><div class="mana_gl_img">';
                                if(v.backPayPicA){
                                    h += '<p><img src="'+ reqUrl.imgPath + v.backPayPicA +'" /></p>';
                                }
                                if(v.backPayPicB){
                                    h += '<p><img src="'+ reqUrl.imgPath + v.backPayPicB +'" /></p>';
                                }
                                h += '</div></div>';
                            }
                            if(v.backPayIsRefuse === 2){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">退款进行中</a></div>';
                            }else if(v.backPayIsRefuse === 3){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">已拒绝退款</a></div>';
                            }else if(v.backPayIsRefuse === 5){
                                h += '<div class="mana_gl_6 button mana_gl_8"><a href="javascript:;">已完成退货</a></div>';
                            }else{
                                h += '<div class="mana_gl_5 mana_gl_6">'+
                                 '<a href="tuihuojd.html?oId='+ v.orderId +'&bt=2" class="button ui-agree-tuikuan">同意退款</a><a href="tuihuojj.html?oId='+ v.orderId +'&bt=2" class="button">拒绝退款</a>'+
                                 '</div></div>';
                            }
                    	}
                    });
                    $(".mana_y").append(h);
                }else{
                    alert(data.info);
                    if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
                    
            }, function(){
                alert("数据请求失败");         
            });
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if(!_t.noMore &&　$(window).scrollTop() === $(document).height() - $(window).height()){
                    _t.getSellerBackOrder();
                }
            });
        }
        
    });
    
    tuihuogl.init();
});
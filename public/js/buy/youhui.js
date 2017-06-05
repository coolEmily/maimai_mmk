require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), youhui = {};
    $.extend(youhui, {
        init: function(){
            var _t = this;
            _t.bindEvent();
            _t.initPage();
            sessionStorage.removeItem("coupon");
            sessionStorage.removeItem("giftCard");
            if(sessionStorage.couponForOrder === '1' && sessionStorage.giftCardForOrder === '1'){
                $(".lipin").show();
                $(".youhui").show();
            }else if(sessionStorage.couponForOrder === '1' && sessionStorage.giftCardForOrder !== '1'){
                $(".lipin").remove();
                $(".youhui").show();
            }else if(sessionStorage.giftCardForOrder === '1' && sessionStorage.couponForOrder !== '1'){
                $(".youhui").remove();
                $(".lipin").show();
            }
        },
        bindEvent: function(){
           var _t = this;
            $(document).on("tap", ".yh_add", function(){
                $('.yh_add i').hasClass('error') ? $('.yh_add i').removeClass('error') : $('.yh_add i').addClass('error');
                $(this).next().toggle(); 
            });
            
            $(document).on("tap", ".button.yh_btn", function(){
                if($(this).parents(".youhui").length > 0){
                    if($("input[name=youhuiN]").val().trim() === ""){
                        _t.showErrorMessage($(this).prev().prev(), '优惠券券号不能为空');
                        return;
                    }
                    _t.bindCoupon({'couponNo': $("input[name=youhuiN]").val().trim()});
                }else{
                    if($("input[name=cardN]").val().trim() === ""){
                        _t.showErrorMessage($(this).prev().prev(), '请输入礼品卡卡号');
                        return;
                    }
                    if($("input[name=cardP]").val().trim() === ""){
                        _t.showErrorMessage($(this).prev().prev(), '请输入礼品卡密码');
                        return;
                    }
                    _t.bindGiftCard({'giftCardNo': $("input[name=cardN]").val().trim(),'password':$("input[name=cardP]").val().trim()});
                }
                    
            });
            
            $(document).on("tap", ".yh_money:not(.disabled)", function(){
                $(this).siblings().find("i").removeClass("on");
                $(this).find("i").addClass("on");
            });
            $(document).on("tap", ".lp_add", function(){
                $(this).find("i").hasClass("on") ? $(this).find("i").removeClass("on") : $(this).find("i").addClass("on");
            });
            $(document).on("tap", ".yh_money.disabled", function(){
                alert("当前所购商品的总价值不能使用该优惠券");
            });
            
            $(document).on("tap", ".button.fs_btn", function(){
                var tp = 0;
                sessionStorage.giftCard = "";
                $.each($(".lipin i.on"), function(k, v) {
                    tp += Number($(v).parents('.lp_add ').attr('data-info').split('_')[1]);
                	sessionStorage.giftCard += $(v).parents('.lp_add ').attr('data-info') + "^";
                });
                if(sessionStorage.giftCard)
                    sessionStorage.giftCardForOrder === "1" ? sessionStorage.giftCard += "^" + tp : '';
                else{
                    sessionStorage.removeItem("giftCard");
                }
                if($(".youhui i.on").parents('.yh_money ').length > 0)    
                    sessionStorage.couponForOrder === "1" ? sessionStorage.coupon = $(".youhui i.on").parents('.yh_money ').attr('data-info') : '';
                location.href = common.tools.getUrlParam("backUrl");

            });
        },
        showErrorMessage: function(obj, message, flag){
            obj.text(message);
            obj.removeClass('login_error').removeClass('login_succ');
            var timeOut = setTimeout(function(){
                flag ? obj.addClass('login_succ') : obj.addClass('login_error');
                obj.show();
            },10);
        },
        initPage: function(){
            common.js.ajx(reqUrl.ser+'shoppingCart/getCouponAndGiftCard.action',{},function(data){
                if(data.infocode === "0"){
                    var h = "";
                    if(sessionStorage.couponForOrder === '1'){
                        h = "";
                        $.each(data.info.couponList, function(k, v){
                            if(v.isUse === 1)
                                h += '<div data-info="'+ v.couponId + '_' + v.faceValue +'" class="yh_money '+ (Number(sessionStorage.totalP) > v.useFor ? "" : "disabled") +'"><div class="yh_money_l">面额</div><i class="yh_money_r"></i>'+
                                 '<div class="yh_money_c">'+ v.couponName +'<span style="margin-left: 30px">'+ v.endDate +'</span></div></div>';
                        });
                        $(".yh_money").remove();
                        $(".youhui").append(h);
                    }
                    
                    if(sessionStorage.giftCardForOrder === '1'){
                        h = "";
                        $.each(data.info.giftCardList, function(k, v){
                            
                            h += '<div class="lp_add" data-info="'+ v.giftCardId + '_' + v.balance +'"><ul><li><span class="lp_li_l">卡号</span>'+
                                 '<span>'+ v.giftCardNo +'</span></li><li><span class="lp_li_l">面值</span>'+
                                 '<span>￥'+ v.faceValue +'</span></li><li><span class="lp_li_l">所剩余额</span>'+
                                 '<span>￥'+ v.balance +'</span></li><li><span class="lp_li_l">有效日期</span>'+
                                 '<span>'+ v.effectiveDate +'</span></li></ul><div class="lp_add_r"><i></i></div></div>';
                        });
                        $(".lp_add").remove();
                        $(".lipin").append(h);
                    }
                }else{
                    alert(data.info);
                    if(data.infocode === '1') location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                }
            }, function(){
               console.log("数据请求失败"); 
            });
        },
        bindGiftCard: function(data){
            var _t = this;
            common.js.ajx(reqUrl.ser+'giftCard/bindGiftCard.action', data,function(data){
                if(data.infocode === "0"){
                    _t.initPage();
                    $(".lipin input").val("");
                    _t.showErrorMessage($(".lipin .ui-message"), data.info, true);
                }else{
                    _t.showErrorMessage($(".lipin .ui-message"), data.info);
                    if(data.infocode === '1') location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                }
            }, function(){
               console.log("数据请求失败"); 
            });
        },
        bindCoupon: function(data){
            var _t = this;
            common.js.ajx(reqUrl.ser+'coupon/bindCoupon.action', data,function(data){
                if(data.infocode === "0"){
                    $(".youhui input").val("");
                    _t.initPage();
                    _t.showErrorMessage($(".youhui .ui-message"), data.info, true);
                }else{
                    _t.showErrorMessage($(".youhui .ui-message"), data.info);
                    if(data.infocode === '1') location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                }
            }, function(){
               console.log("数据请求失败"); 
            });
        }
    });
    youhui.init();
});
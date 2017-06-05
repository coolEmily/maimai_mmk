require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanqr = {};
    $.extend(dingdanqr, {
        isUseRedPacket: 1, 
        isUseVirtualPay: 1, 
        isUseBalance: 1,
        accountMaxPay: null,
        isHavePsw: 0, 
        payId: '',
        data: {},
        init: function(){
            var _t = this;
            _t.initPage();
            _t.bindEvent();
        },
        bindEvent: function(){
            var _t = this;
            $(document).on("tap", ".ui-confirm-pay:not(.ui-ing)", function(){
                $(this).addClass("ui-ing").text("提交中...");
                _t.submitOrderValidata(this);
            });
            
            $(document).on("tap", '#ui-pay-type .js_day', function(){
              $(this).children('i').addClass("on");
              $(this).siblings().children('i').removeClass("on");
              _t.payId = $(this).children('i').attr("data-payId");
            });
            
            $(document).on("tap", ".ui-show-address",  function(){
                location.href = "/buyer/home/dizhi.html?backUrl=" + common.tools.getBackUrl(); 
            });
            $(document).on("tap", "#ui-shouhuo-shijian > div", function(){
                $(this).siblings().find('i').removeClass("on");
                $(this).find('i').addClass("on");
                sessionStorage.shsj = $(this).index();
            });
            
            $(document).on("tap", ".ui-jindou-button,.ui-hongbao-button,.ui-balance-button",  function(event){
                event.preventDefault();
                if($(this).children().hasClass("dis")){
                  return;
                }
                if($(this).children().hasClass("on")){
                    $(this).children().removeClass("on");
                }else{
                    $(this).children().addClass("on");
                }
                if($(this).attr("class").indexOf("ui-hongbao-button") > -1)
                  _t.isUseRedPacket = $(this).children().hasClass("on") ? 1 : 0;
                else if($(this).attr("class").indexOf("ui-jindou-button") > -1)
                  _t.isUseVirtualPay = $(this).children().hasClass("on") ? 1 : 0;
                else if($(this).attr("class").indexOf("ui-balance-button") > -1){
                  _t.isUseBalance = $(this).children().hasClass("on") ? 1 : 0;
                }
              _t.initPage();
            });
            $(document).on("touchend", ".ui-settlement-freight", function(event){
                event.preventDefault();
                $(".ui-yunfei-bc").css("display", "block");
            });
            $(document).on("touchend", ".ui-yunfei-hide", function(event){
                event.preventDefault();
                $(".ui-yunfei-bc").css("display", "none");
            });
            
            $(document).on("tap", "#ui-hongbaoduihuan", function(){
              location.href = "/buyer/home/hongbaoduihuan.html";
            });
            
            //关闭弹窗
            $(document).on("tap", ".dialog_wrap .close", function(){
              $(this).parents(".dialog_wrap").hide();
              $('.ui-confirm-pay').removeClass("ui-ing").text("确认支付");
            });
            
            $(document).on("tap", "#active_btn", function(){
              var pass = lib.trim($("#ui-pass-value").val());
              $("#ui-pass-error").text("");
              if(!pass){
                $("#ui-pass-error").text("请输入支付密码");
                return;
              }
              _t.data.psw = pass;
              _t.submitOrder(_t.data);
            });
        },
        submitOrderValidata: function(obj){
            var data = {}, _t=this;
            data.addressId = $(".ui-show-address").attr("data-addr");
            if(data.addressId === ""){
                $("body").scrollTop($(".ui-show-address")[0].offsetTop);
                alert("请添加收货信息");
                $(obj).removeClass("ui-ing").text("确认支付");
                return;
            }
            
            data.payTypeId = $("#ui-pay-type .js_day i.on").attr("data-payId") || (lib.checkWeiXin() ? 18 : 17);
            data.deliveryDateType = Math.abs($(".js_day i.on").parent().index() - 3);
            data.isUseRedPacket = $(".ui-hongbao-button i").hasClass("on") ? 1 : 0;
            data.isUseVirtualPay = $(".ui-jindou-button i").hasClass("on") ? 1 : 0;
            data.accountPay = _t.accountMaxPay;
            _t.data = data;
            
            if((_t.isUseVirtualPay && $(".ui-jindou-button i").hasClass("on")) || (_t.accountMaxPay && $(".ui-balance-button i").hasClass("on"))){
              if(!_t.isHavePsw){
                $("#ui-no-pass").show();
                return;
              }
              $("#ui-input-pass").show();
              return;
            }
            _t.submitOrder(data);
        },
        submitOrder: function(data){
            lib.onLoading();
            common.js.ajx(reqUrl.ser + "shoppingCart/submitOrder.action", data, function(data){
                if(data.infocode === "0"){
                  sessionStorage.removeItem("coupon");
                  sessionStorage.removeItem("giftCard");
                  sessionStorage.orderInfo = JSON.stringify(data.info);
                  if(data.info.isPay === 1){
                      location.href = "dingdanzhifucg.html?tradeNo="+ data.info.orderNo +"&tradeStatus=success";
                      return;
                  }
                   
                  location.href = "dingdanzhifu.html?oId="+ data.info.orderId;       
                }else if(["9","10","11"].indexOf(data.infocode) === -1){
                  $(".dialog_wrap").hide();
                  $(".ui-error-dialog").text(data.info);
                  $(".ui-error-dialog").css("display", "block");
                  if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getUrlParam();
                  if(data.infocode === "99") location.href = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                  $('.ui-confirm-pay').removeClass("ui-ing").text("确认支付");
                  setTimeout(function(){
                    $(".ui-error-dialog").css("display", "none");
                  }, 1000);
                }else{
                  $("#ui-pass-error").text(data.info);
                  $('.ui-confirm-pay').removeClass("ui-ing").text("确认支付");
                  
                }
            }, function(){
                console.log("数据请求失败"); 
            });
        },
        initPage: function(){
            var _t = this;
            /*商品信息*/
            common.js.ajx(reqUrl.ser+'shoppingCart/toBalance.action',{isUseRedPacket: _t.isUseRedPacket, isUseVirtualPay: _t.isUseVirtualPay},function(data){
                if(data.infocode === "0"){
                    _t.accountMaxPay = null;
                    _t.isHavePsw = data.info.isHavePsw;
                    var totalPrice = Number(data.info.cartData.goodsPriceTotal) + Number(data.info.cartData.freightTotal);
                    if(_t.isUseRedPacket )
                      totalPrice -= Number(data.info.redPacketMaxPay);
                    if(_t.isUseVirtualPay ){
                      totalPrice -= Number(data.info.virtualMaxPay);
                    }
                    if(_t.isUseBalance && Number(totalPrice) && Number(data.info.accountMaxPay)){
                      totalPrice -= Number(data.info.accountMaxPay);
                      _t.accountMaxPay = Number(data.info.accountMaxPay);                       
                    }
                    totalPrice = totalPrice.toFixed(2);
                        
                    $(".ui-pay-total").text('￥' + _t.parserFloatString(totalPrice));
                    var addr = '', h = '';
                    if(data.info.addressList.length !== 0){
                        var dz = data.info.addressList[0];
                        addr += '<div class="ui-show-address ui-transr-999" style="margin-top: 15px;" data-addr="'+ dz.addressId +'">'+
                          '<div><span>收货电话:&nbsp;</span><span>'+ dz.mobile +'</span></div>'+
                          '<div><span>收货人:&nbsp;</span><span>'+ dz.receiverName +'</span></div>'+
                          '<div><span>收货地址:&nbsp;</span><span>'+ dz.areaName.replace(/-/g, " ") + ' ' + dz.detailAddress +'</span></div></div>';
                    }else{
                        addr += '<div class="ui-show-address" style="margin-top: 15px;position:relative;height:60px" data-addr="">'+
                              '<div style="position: absolute; width: 40px;height:4px;background-color:#f1f1f1;top:40%;left:50%;margin-left: -20px;margin-top:-2px;padding:0"></div>'+
                              '<div style="position: absolute; width: 4px;height:40px;background-color:#f1f1f1;top:40%;left:50%;margin-left: -2px;margin-top:-20px;padding:0"></div>'+
                              '<span style="font-size:12;color:#ddd;position:absolute;bottom:10px;left:50%;margin-left:-36px">新增收货地址</span>'+
                              '</div>';
                    }
                    
                    addr += '<div class="ui-order-list" id="ui-shouhuo-shijian"> <div class="jiesuan" >配送方式</div> <div class="js_day"> <span class="time">不限时</span> <i class="on"></i> <div class="week">周一至周日</div> </div> <div class="js_day"> <span class="time">工作日</span> <i></i> <div class="week">周一至周五</div> </div> <div class="js_day"> <span class="time">双休日</span> <i></i> <div class="week">周六和周日</div> </div> </div>';
                    
                    if(lib.checkWeiXin()){
                        addr += '<div class="ui-order-list" id="ui-pay-type"><div class="jiesuan" >支付方式</div><div class="js_day"><i class="'+ ( _t.payId === "20" ? '' : 'on' ) + '" data-payId="18"></i><div class="week">微信支付</div></div><div class="js_day"><i class="'+ ( _t.payId !== "20" ? '' : 'on' ) + '" data-payId="20"></i><div class="week">银联支付</div></div></div>';
                    }else{
                        addr += '<div class="ui-order-list" id="ui-pay-type"><div class="jiesuan" >支付方式</div><div class="js_day"><i class="'+ ( _t.payId === "20" ? '' : 'on' ) + '" data-payId="17"></i><div class="week">支付宝支付</div></div><div class="js_day"><i class="'+ ( _t.payId !== "20" ? '' : 'on' ) + '" data-payId="20"></i><div class="week">银联支付</div></div></div>';
                    }
                    
                    //商品列表
              	    $(".ui-per-shop").remove();
                    $.each(data.info.cartData.sellerInfoList, function(K, V) {
                    	/*正常商品*/
                    	if(V.sellerName !== '跨店铺满减'){
                    	   $(".ui-yunfei-hide").before('<div class="ui-per-shop"><span>'+ V.sellerName +'</span>运费：￥'+ V.freightOneSeller +'</div>');
                    	}
                    	if(V.normalList.length || V.bindList.length || V.priceReduceList.length || V.manJianList.length || V.buyGiftList.length || V.flashList.length){
                        	h += '<div class="ui-order-list"><div class="ui-detail-icon" >'+ V.sellerName +'</div><div class="ui-order-detail">';
                            $.each(V.normalList, function(k, v){
                                h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                                  '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                                  '<p class="ui-now-p">￥'+ v.btcPrice +'</p><em class="ui-org-p">'+ (v.limitcoupon !== "0.00"  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</em></div><div class="ui-goods-desc">'+
                                  '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                            });
                            /*捆绑*/
                            $.each(V.bindList, function(k, v){
                                h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                                  '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                                  '<p class="ui-now-p">￥'+ v.btcPrice +'</p><em class="ui-org-p">'+ (v.limitcoupon !== "0.00"  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</em></div><div class="ui-goods-desc">'+
                                  '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                            });
                             /*减价*/
                            $.each(V.priceReduceList, function(k, v){
                                 h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                                  '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                                  '<p class="ui-now-p">￥'+ v.btcPrice +'</p><em class="ui-org-p">'+ (v.limitcoupon !== "0.00"  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</em></div><div class="ui-goods-desc">'+
                                  '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                            });
                            
                             /*满减*/
                            $.each(V.manJianList, function(k1, v1){
                                h += '<div name="ui-manjian" class="cart_list_mj clearfix" ';
                                if(V.manJianList.length){   /*是否有满减*/
                                    h += '>';
                                    if(v1.reduce){
                                       h += '<div>【满减】: '+ v1.desc +'</div>';       
                                    }
                                }else{
                                    h += 'style="display:none">';
                                }
                                h += '</div>';
                                
                                $.each(v1.goodsList, function(k, v){
                                    h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                                      '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                                      '<p class="ui-now-p">￥'+ v.btcPrice +'</p><em class="ui-org-p">'+ (v.limitcoupon !== "0.00"  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</em></div><div class="ui-goods-desc">'+
                                      '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                                });
                                     
                            });
                            /*买赠*/
                            $.each(V.buyGiftList, function(k, v){
                                h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                                      '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                                      '<p class="ui-now-p">￥'+ v.btcPrice +'</p><em class="ui-org-p">'+ (v.limitcoupon !== "0.00"  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</em></div><div class="ui-goods-desc">'+
                                      '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                                
                                h += '<div name="ui-maizeng" style="text-align: center;" class="cart_list_mj clearfix"';
                                if(v.buyGiftItemList){
                                    h += ">";
                                    $.each(v.buyGiftItemList, function(i, val){
                                            h += '<div style="color:#ff7800">【买赠】'+ val.freeName +'（订单完成后自动发放） X'+ val.freeNum +'</div>';  
                                    });
                                }else{
                                    h += "style='display: none'>";
                                }
                                h += '</div>';            
                            });
                            /*闪购*/
                            $.each(V.flashList, function(k, v){
                                h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                                      '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                                      '<p class="ui-now-p">￥'+ v.btcPrice +'</p><em class="ui-org-p">'+ (v.limitcoupon !== "0.00"  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</em></div><div class="ui-goods-desc">'+
                                      '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                            });
                            h += '</div></div>';
                        }
                    });
                    var mx = '<div class="ui-total" style="height: 40px;line-height:40px;font-size:14px;margin-bottom:0;padding:0 15px"><span>订单金额</span><span style="float: right;color:#ff3c3c">￥'+ _t.parserFloatString(totalPrice) +'</span></div><div class="ui-settlement" style="height: auto;">'+
                         '<div class="ui-settlement-detail" style="height: 100%;"></div><div>'+
                         '<div class="ui-hongbao" style="height: 30px;"><span>商品总计</span><span>￥'+ data.info.cartData.goodsPriceTotal +'</span></div>'+
                         '<div class="ui-settlement-freight" style="height: 30px;"><span>运费</span><span>￥'+ _t.parserFloatString(data.info.cartData.freightTotal) +'</span></div>';
                    if(_t.isUseRedPacket && Number(data.info.redPacketMaxPay))  
                      mx += '<div class="ui-hongbao" style="height: 30px;"><span>红包立减</span><span>-￥'+ _t.parserFloatString(data.info.redPacketMaxPay) +'</span></div>';
                    if(_t.isUseVirtualPay && Number(data.info.virtualMaxPay))
                      mx += '<div class="ui-hongbao" style="height: 30px;"><span>金豆支付</span><span>-￥'+ _t.parserFloatString(data.info.virtualMaxPay) +'</span></div>';
                    if(_t.isUseBalance && _t.accountMaxPay)
                      mx += '<div class="ui-hongbao" style="height: 30px;"><span>余额支付</span><span>-￥'+ _t.parserFloatString(data.info.accountMaxPay ) +'</span></div>';
                   
                    if(data.info.cartData.manJianCouponTotal)
                        mx   += '<div class="ui-payNub" style="height: 30px;"><span>满减总额</span><span>-￥'+ _t.parserFloatString(data.info.cartData.manJianCouponTotal) +'</span></div>';
                    mx   += '</div></div>';
                    mx += '<div class="ui-order-list"><div class="js_day ui-hongbao-button"><a href="/buyer/home/hongbao.html?jhhb=1" class="ui-jihuo-a">激活</a><i class="'+ (_t.isUseRedPacket && Number(data.info.redPacketMaxPay) ? 'on' : (Number(data.info.redPacketMaxPay) ? '' : 'dis')) +'" style="float:left"></i><div class="week">红包余额：￥'+ data.info.redPacketBalance +'</div></div>';
                    mx += '<div class="ui-order-list"><div class="js_day ui-jindou-button"><a href="/buyer/home/huiyuanzx.html?beanS=1" class="ui-jihuo-a">激活</a><i class="'+ (_t.isUseVirtualPay && Number(data.info.virtualMaxPay)  ? 'on' : (Number(data.info.virtualMaxPay) ? '' : 'dis')) +'" style="float:left"></i><div class="week">金豆余额：￥'+ data.info.virtualBalance  +'</div></div>';
                    mx += '<div class="ui-order-list"><div class="js_day ui-balance-button"><a href="/buyer/home/zhanghuyue.html?yecz=1" class="ui-jihuo-a">充值</a><i class="'+ (_t.isUseBalance && Number(data.info.accountMaxPay) ? 'on' : (Number(data.info.accountMaxPay) ? '' : 'dis')) +'" style="float:left"></i><div class="week">账户余额：￥'+ data.info.balance  +'</div></div>';
                    
                    $(".ui-body.main").empty().append(addr+h+mx);
                    
                    //初始化配送方式
                    if(sessionStorage.shsj){
                        $("#ui-shouhuo-shijian .js_day").find('i').removeClass("on");
                        $("#ui-shouhuo-shijian .js_day:eq("+ (Number(sessionStorage.shsj)-1) +")").find('i').addClass("on");
                    }
                         
                }else{
                    alert(data.info);
                    if(data.infocode === '1') location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                    if(data.infocode === '2') location.href = "/buyer/liebiao.html";
                }
            }, function(){
               console.log("数据请求失败"); 
            });
        },
        parserFloatString: function(num){
            num = Number(num).toString();
            var xs = num.split(".");
            if(xs.length === 1){
                return num + ".00";
            }else if(xs.length === 2){
                if(xs[1].length === 1){
                    return num + "0";
                }
                if(xs[1].length >= 2){
                    return xs[0] + "." + xs[1].substring(0,2);
                }
                
            }
        }
    });
    dingdanqr.init();
});
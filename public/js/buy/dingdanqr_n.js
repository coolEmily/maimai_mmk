require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanqr = {};
    $.extend(dingdanqr, {
        activeId: common.tools.getUrlParam("acId"),
        acIdN: common.tools.getUrlParam("acIdN"),
        goodsId: common.tools.getUrlParam("gId"),
        goodsNum: common.tools.getUrlParam("gN"),
        init: function(){
            var _t = this;
            _t.initPage();
            _t.bindEvent();
        },
        bindEvent: function(){
            var _t = this;
            $(".ui-confirm-pay:not(.ui-ing)").off().on("tap", function(){
                $(this).addClass("ui-ing").text("提交中...");
                _t.submitOrder(this);
            });
            $(document).on("tap", ".ui-show-address",  function(){
                location.href = "/buyer/home/dizhi.html?backUrl=" + common.tools.getBackUrl(); 
            });
            $(document).on("tap", "#ui-shouhuo-shijian > div", function(){
                $(this).siblings().find('i').removeClass("on");
                $(this).find('i').addClass("on");
                sessionStorage.shsj = $(this).index();
            });
            
            $(document).on("tap", "#ui-use-youhui",  function(){
                location.href = "/buyer/order/youhui.html?backUrl=" + common.tools.getBackUrl();
            });
            
            $(document).on("tap", '#ui-pay-type .js_day', function(){
              $(this).children('i').addClass("on");
              $(this).siblings().children('i').removeClass("on");
            });
        },
        submitOrder: function(obj){
            var data = {}, _t = this,url="/shoppingCart/submitOrderForFree.action";
            data.addressId = $(".ui-show-address").attr("data-addr");
            if(data.addressId === ""){
                $("body").scrollTop($(".ui-show-address")[0].offsetTop);
                alert("请添加收货信息");
                $(obj).removeClass("ui-ing").text("确认支付");
                return;
            }
            
            data.payTypeId = $("#ui-pay-type .js_day i.on").attr("data-payId") || (lib.checkWeiXin() ? 18 : 17);
            data.deliveryDateType = Math.abs($(".js_day i.on").parent().index() - 3);
            data.activeId = _t.activeId;
            data.goodsId = _t.goodsId;
            data.goodsNum = _t.goodsNum;
            lib.onLoading();
            if(_t.acIdN){
              url = "/shoppingCart/submitOrderForNewFree.action";
              data.activeId = _t.acIdN;
            }
            common.js.ajx(reqUrl.ser + url, data, function(data){
                if(data.infocode === "0"){
                    sessionStorage.orderInfo = JSON.stringify(data.info);
                    if(data.info.isPay === 1){
                        location.href = "dingdanzhifucg.html?tradeNo="+ data.info.orderNo +"&tradeStatus=success";
                        return;
                    }
                    location.href = "dingdanzhifu.html?oId="+ data.info.orderId;       
                }else{
                    alert(data.info);
                    if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getUrlParam();
                    if(data.infocode === "99") location.href = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                    $(obj).removeClass("ui-ing").text("确认支付");
                }
            }, function(){
                console.log("数据请求失败"); 
            });
        },
        initPage: function(){
            
            /*商品信息*/
            var _t = this;
            var url = '/shoppingCart/toBalanceForFree.action', data = {activeId: _t.activeId, goodsId: _t.goodsId,goodsNum:_t.goodsNum};
            if(_t.acIdN){
              url = '/shoppingCart/toBalanceForNewFree.action';
              data = {activeId: _t.acIdN, goodsId: _t.goodsId,goodsNum:_t.goodsNum}; 
            }
            common.js.ajx(reqUrl.ser+url, data,function(data){
                if(data.infocode === "0"){
                    
                    $(".ui-pay-total").text('￥' + _t.parserFloatString(data.info.freight));
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
                        addr += '<div class="ui-order-list" id="ui-pay-type"><div class="jiesuan" >支付方式</div><div class="js_day"><i class="on" data-payId="18"></i><div class="week">微信支付</div></div><div class="js_day"><i class="" data-payId="20"></i><div class="week">银联支付</div></div></div>';
                    }else{
                        addr += '<div class="ui-order-list" id="ui-pay-type"><div class="jiesuan" >支付方式</div><div class="js_day"><i class="on" data-payId="17"></i><div class="week">支付宝支付</div></div><div class="js_day"><i class="" data-payId="20"></i><div class="week">银联支付</div></div></div>';
                    }
                    
                    //商品列表
                	h += '<div class="ui-order-list"><div class="ui-detail-icon" >'+ data.info.sellerName +'</div><div class="ui-order-detail">';
                    h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                      '<img src="'+ reqUrl.imgPath + lib.getImgSize(data.info.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                      '<p class="ui-now-p">￥'+ 0 +'</p></div><div class="ui-goods-desc">'+
                      '<p>'+ data.info.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ data.info.goodsNum +'</p></div></div>';
                    
                    var mx = "";
                    mx += '<div class="ui-settlement" style="height: auto;">'+
                         '<div class="ui-settlement-detail" style="height: 100%;">消费明细</div>'+
                         '<div><div class="ui-settlement-freight" style="height: 30px;"><span>运费</span><span>￥'+ _t.parserFloatString(data.info.freight) +'</span></div>';
                    mx   += '<div class="ui-total" style="height: 30px;"><span>需付金额</span><span>￥'+ _t.parserFloatString(data.info.freight) +'</span></div></div></div>';
                    $(".ui-body.main").empty().append(addr+h+mx);
                    
                    //初始化配送方式
                    if(sessionStorage.shsj){
                        $("#ui-shouhuo-shijian .js_day").find('i').removeClass("on");
                        $("#ui-shouhuo-shijian .js_day:eq("+ (Number(sessionStorage.shsj)-1) +")").find('i').addClass("on");
                    }
                }else{
                    alert(data.info);
                    var logInUrl= "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                    if(data.infocode === '1') location.href = logInUrl;
                    if(data.infocode === "4" || data.infocode === "3") {
                        document.referrer.indexOf(logInUrl)!==-1?history.go(-3) : history.back();//如果从登录过来，返回上上级页面
                    }
                    //if(data.infocode === '2') location.href = "/buyer/liebiao.html";
                }
            }, function(){
               console.log("数据请求失败"); 
            });
        },
        parserFloatString: function(num){
            num = num.toString();
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
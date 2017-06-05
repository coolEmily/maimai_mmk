require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanqr = {};
    $.extend(dingdanqr, {
        goodsStr: common.tools.getUrlParam("goodsStr"),
        //支付密码
        paymima:0,
        init: function(){
            var _t = this;
            _t.initPage();
            _t.bindEvent();
            _t.fouce();
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
            var data = {}, _t = this;
            data.addressId = $(".ui-show-address").attr("data-addr");
            if(data.addressId === ""){
                $("body").scrollTop($(".ui-show-address")[0].offsetTop);
                alert("请添加收货信息");
                $(obj).removeClass("ui-ing").text("确认支付");
                return;
            }
            if(!sessionStorage.getItem('goodstr')){
                alert("已经支付过了");
                $(obj).removeClass("ui-ing").text("确认支付");
                return false;
            }
            data.goodsStr = _t.goodsStr;
            if($.trim($(".pays").val())==""){
              alert("请输入支付密码");
               $(obj).removeClass("ui-ing").text("确认支付");
              return false;
            }
            data.psw=$.trim($(".pays").val());
            lib.onLoading();
             common.js.ajx(reqUrl.ser + "/shoppingCart/submitOrderForGoldBean.action", data, function(data){
                if(data.infocode === "0"){
                    sessionStorage.orderInfo = JSON.stringify(data.info);
                    if(data.info.isPay === 1){
                        sessionStorage.removeItem('goodstr');
                        sessionStorage.removeItem('goodstrings');
                        location.href = "dingdanzhifucg.html?tradeNo="+ data.info.orderNo +"&tradeStatus=success";
                        return;
                    }
                    location.href = "dingdanzhifu.html?oId="+ data.info.orderId;       
                }else if(data.infocode === "8"){
                    $(".dingshow").show();
                    $(".jj").css({"padding":"10px 20px 30px"});
                    $(obj).removeClass("ui-ing").text("确认支付");
                }else{
                    alert(data.info);
                    if(data.infocode === "1") location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getUrlParam();
                    $(obj).removeClass("ui-ing").text("确认支付");
                }
            }, function(){
                console.log("数据请求失败"); 
            });
        },
        initPage: function(){
            /*商品信息*/
            var _t = this;
            common.js.ajx(reqUrl.ser+'/shoppingCart/toBalanceForGoldBean.action',{goodsStr:_t.goodsStr},function(data){
                if(data.infocode === "0"){
                    var list=data.info.sellerList;
                    $(".ui-pay-total").text(data.info.goldBean+'个');
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
                    //商品列表
                    list.forEach(function(val,ind) {
                   h+='<div class="ui-order-list"><div class="ui-detail-icon">北京首晟科技有限公司的店铺</div><div class="ui-order-detail">';
                   val.goodsList.forEach(function(value,index){
                    h+='<div class="ui-per-goods"><div class="ui-goods-img"><img src="'+reqUrl.imgPath + lib.getImgSize(value.goodsImg, "B") +'"></div><div class="ui-goods-price">';
                    h+='<p class="ui-now-p">'+value.goldBeanPrice+'金豆</p><em class="ui-org-p">￥'+_t.parserFloatString(value.sellingPrice)+'</em></div>';
                    h+='<div class="ui-goods-desc"><p>'+value.goodsName+'</p><p></p><p>x'+value.goodsNum+'</p></div></div>';
                   })
                   h+='</div></div>';
                    });
                    var fs="";
                    fs+='<div class="ui-order-list" id="ui-pay-type"><div class="jiesuan">支付方式<span>金豆<span></div></div>';
                     var mx = "";
                    mx += '<div class="ui-order-list"><div class="ui-settlement" style="height: auto;">'+
                          '<div class="ui-settlement-detail" style="height: 100%;">消费明细</div>'+
                          '<div><div class="ui-settlement-freight" style="height: 30px;"><span>金豆</span><span>'+ data.info.goldBean +'个</span></div></div></div></div>';
                    //支付mimaddr
                    var paymi="";
                    _t.paymima=data.info.isHavePsw;
                    if(data.info.isHavePsw){
                         paymi+='<div class="ui-order-list" style="position: relative;"><div class="clearfix jj"><div style="width:70%;float:left;"><input class="pays" type="password" value="" placeholder="请输入支付密码"/></div><a href="/buyer/home/payPass.html?qiyong=1&backUrl='+common.tools.getBackUrl()+'" style="float:right;line-height:40px;color:#999;">忘记密码?</a><span class="dingshow">支付输入密码错误，请重新输入</span></div></div>';
                    }else{
                         paymi+='<div class="ui-order-list" style="position: relative;"><div class="clearfix jj"><div style="width:70%;float:left;"><input class="pays" type="password" value="" placeholder="你还未设置支付密码" disabled="disabled"/></div><a href="/buyer/home/payPass.html?backUrl='+common.tools.getBackUrl()+'" style="float:right;line-height:40px;color:#285ab4;">设置支付密码</a></div></div>';
                    }
                    $(".ui-body.main").empty().append(addr+h+fs+mx+paymi);
                    
                    //初始化配送方式
                    if(sessionStorage.shsj){
                        $("#ui-shouhuo-shijian .js_day").find('i').removeClass("on");
                        $("#ui-shouhuo-shijian .js_day:eq("+ (Number(sessionStorage.shsj)-1) +")").find('i').addClass("on");
                    }
                         
                }else{
                    alert(data.info);
                    if(data.infocode === '1') location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                    if(data.infocode === "4" || data.infocode === "3") history.back();
                    if(data.infocode === '2') location.href = "/buyer/bank/exchange_zone.html";
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
        },
        fouce:function(){
            $("body").on("focus",".jj input",function(){
                $(".dingshow").hide();
                 $(".jj").css({"padding":""});
            })
        }
    });
    dingdanqr.init();
});
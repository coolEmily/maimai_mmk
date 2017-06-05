require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanqr = {};
    $.extend(dingdanqr, {
        data: {realCardNo: lib.getUrlParam('rcNo') ? lib.getUrlParam('rcNo') : 'THK169328', password: lib.getUrlParam('pass') ? lib.getUrlParam('pass') : '0abf92ba'},
        init: function(){
            var _t = this;
            _t.initPage();
            _t.bindEvent();
        },
        bindEvent: function(){
            var _t = this;
            $("footer:not(.ui-ing)").off().on("tap", function(){
                $(this).addClass("ui-ing").text("提交中...");
                _t.submitOrder(this);
            });
            
            /*地址修改*/
            $(document).on("tap", ".ui-show-address",  function(){
                location.href = "/buyer/home/dizhi.html?backUrl=" + common.tools.getBackUrl(); 
            });
            
        },
        submitOrder: function(obj){
            var data = this.data;
            data.addressId = $(".ui-show-address").attr("data-addr");
            if(data.addressId === ""){
                $("body").scrollTop($(".ui-show-address")[0].offsetTop);
                alert("请添加收货信息");
                $(obj).removeClass("ui-ing").text("确认支付");
                return;
            }
            
            lib.onLoading();
            common.js.ajx(reqUrl.ser + "shoppingCart/submitOrderForRealCard.action", data, function(data){
                if(data.infocode === "0"){
                    if(data.info.isPay === 1){
                        location.href = "tihuocg.html?tradeNo="+ data.info.orderNo +"&tradeStatus=success";
                        return;
                    }
                    
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
            var _t = this;
            /*商品信息*/
            common.js.ajx(reqUrl.ser+'shoppingCart/toBalanceForRealCard.action', _t.data,function(data){
                if(data.infocode === "0"){
                    
                    var addr = '', h = '<div style="border-bottom:1px solid #f1f1f1;line-height: 40px;font-size: 14px;color: #333;margin-bottom:0;text-indent: 10px;">当前提货的商品</div>';
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
                   
                    
                    //商品列表
                    $.each(data.info.goodsList, function(k, v) {
                      h += '<div class="ui-per-goods"><div class="ui-goods-img">'+
                        '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.goodsImg, "B") +'" /></div><div class="ui-goods-price">'+
                        '<p class="ui-now-p">￥'+ v.sellingPrice +'</p><em class="ui-org-p"></em></div><div class="ui-goods-desc">'+
                        '<p>'+ v.goodsName +'</p><p>'+ /*v.goodsEnName*/"" +'</p><p>x'+ v.goodsNum +'</p></div></div>';
                    });
                    $(".ui-body.main").empty().append(addr+h);     
                }else{
                    alert(data.info);
                    if(data.infocode === '1') location.href = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                    if(data.infocode === '2' || data.infocode === '3') location.href = "/buyer/home/tihuoka.html";
                }
            }, function(){
               console.log("数据请求失败"); 
            });
        }
    });
    dingdanqr.init();
});
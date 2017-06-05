require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib) {
     lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanqr = {};
    var dPath="/g?"+lib.getMid()+"&gId=";
    $(function() {
        var orderdetailUrl = reqUrl.ser+'order/getBuyOrderItem.action',//订单详情
            cancelUrl=reqUrl.ser+'order/cancelOrder.action',//取消订单
            confirmUrl=reqUrl.ser+'order/confirmOrder.action';//确认收货

        var orderId=lib.getUrlParam('oId'),//订单id
            sflag=lib.getUrlParam('sflag');//拆单标识

             ajaxFun();

        //请求数据
        function ajaxFun() {
            var parmObj = {orderId:orderId,seperateFlag:sflag};
            $("#noneList").hide();
            common.js.ajx(orderdetailUrl, parmObj, function (data) {
                if (data.infocode === "0") {
                    if (data.info.length === 0) {
                       alert("无信息！");
                    } else {
                        createHtml(data.info);
                    }
                }else if(data.infocode == 2) {//未登录
                    alert("会员未登录！");
                    location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                }else{
                    alert(data.info);
                }
            }, function () {
                alert("订单信息加载失败！");
            });
        }

        //填充页面
        function createHtml(dInfo) {
            var listStr = "";
            //收货人信息
            $("#phone_num").html(dInfo.mobile);
            $("#peo_name").html(dInfo.receiveName);
            $("#peo_place").html(dInfo.detailAddress);
           // var _imgH = (document.documentElement.clientWidth > 640) ? "160px" :
            // (document.documentElement.clientWidth * 0.25) + "px";
            

            $("#number_time").html('订单号：<span>'+dInfo.orderNO+'</span><span>'+dInfo.createDate+'</span>');//订单号和时间

            dInfo.reduceMoneyOrder!==0?$("#minus_money").html("-￥"+dInfo.reduceMoneyOrder).parent().show():"";//满减金额
            dInfo.goodsMoney!==0?$("#all_money").html("￥"+dInfo.goodsMoney).parent().show():"";//商品总金额
//            dInfo.payGiftCard!==0?$("#giftCard").html("-￥"+dInfo.payGiftCard).parent().show():"";//礼品卡
            dInfo.payCoupon!==0?$("#couPon").html("-￥"+dInfo.payCoupon).parent().show():"";//优惠券
            dInfo.payRedPacket!==0?$("#wallet").html("-￥"+dInfo.payRedPacket).parent().show():"";//红包
            dInfo.payBalance!==0?$("#payBalance").html("-￥"+dInfo.payBalance).parent().show():"";//已用账户余额
            dInfo.payVirtualMoney!==0?$("#payVirtual").html("-￥"+dInfo.payVirtualMoney).parent().show():"";//金豆支付
            $("#payTypeName").html(dInfo.payTypeName);//支付方式名称

            $("#deliver_pay").html("￥"+dInfo.postageMoney);//运费
            $("#pay_money").attr("money",dInfo.payOnline).attr('balance',dInfo.payBalance).html("￥"+dInfo.payOnline);//实付款
            var ostatus=""; //订单状态
            if(dInfo.backStatus===0){//0正常订单
                    if(dInfo.orderStatus==10){// 10 待付款
                        ostatus='<span>待付款</span>';
                        $("#pay_money").prev().text("应付款");
                        $("#cancel").show();
                        $("#payOnce").addClass("active").show();
                    }else if(dInfo.orderStatus==20){//20待审核--ps:20、25、30都显示为出库中，30状态下不可取消订单
                        ostatus='<span>出库中</span>';
                        $("#cancel").show();
                    }else if(dInfo.orderStatus==25){//25待发货--ps:20、25、30都显示为出库中，30状态下不可取消订单
                        ostatus='<span>出库中</span>';
                        $("#cancel").show();
                    }else if(dInfo.orderStatus==30){//30出库中
                        ostatus='<span>出库中</span>';
                        $("#cancel").show().attr("ifCan","no");
                    }else if(dInfo.orderStatus==35){//35为待收货
                        ostatus='<span>待收货</span>';
                        $("#delivery").show();
                    }else if(dInfo.orderStatus==40){//40已签收
                        ostatus='<span>已签收</span>';
                        dealPlat(dInfo.isSolving);
                        $("#applyBack").show();
                        $("#confirm").addClass("active").show();
                    }else if(dInfo.orderStatus==41){//41已拒收,退款中
                        ostatus='<span>退款中</span>';
                        dealPlat(dInfo.isSolving);
                    }else if(dInfo.orderStatus==1){//1已取消
                        ostatus='<span style="color:#999">已取消</span>';
                    }else if(dInfo.orderStatus==80) {// 80 已完成
                        ostatus = '<span style="color:#999">已完成</span>';
                        $("footer").hide();
                    }
            }else{//退款订单
                ostatus='<span>'+dInfo.backStatusValue+'</span>';
                if(dInfo.backStatus==3 || dInfo.backStatus==1){//1退款审核中 3退货审核中
                    dealPlat(dInfo.isSolving);
                }else if(dInfo.backStatus==5){//5 退货审核通过
                    dealPlat(dInfo.isSolving);
                    dInfo.isFillDeliveryNo==1?$("#deliverNum").addClass("active").show():$("#processBack").addClass("active").show();//是否填写运单号
                }else if(dInfo.backStatus==4){//4 拒绝退款
                    dealPlat(dInfo.isSolving);
                    $("#confirm").show();
                    $("#processBack").show().html("退款进度");
                }else if(dInfo.backStatus==6){//拒绝退货
                    dealPlat(dInfo.isSolving);
                    $("#confirm").show();
                    $("#processBack").show();
                }

            }
            //orderType为3 或4的时候不可以取消 或者退货退款 没有对应的按钮--鲜花支付
            if(dInfo.orderType === 3 || dInfo.orderType === 4 ){
                $("#applyBack").hide();
                $("#cancel").hide();
            }

            dInfo.payTypeId === 9 && $(".ui-hide-tihuo").hide();
            //显示平台介入--平台处理中
            function dealPlat(isSolving){
                isSolving==1?$("#platform").show():$("#dealPlatform").show();
            }

            $.each(dInfo.mallList,function(i,v){
                var giftStr="";
                listStr+='<div class="ui-detail-icon">'+v.mallName+ostatus+'</div>';
                $.each(v.goodsList,function(i,v){
                    if(v.activeName!==""){
                        $.each(v.giftGoods,function(i1,v1){
                            giftStr+='<div class="gift_box">【'+ v.activeName+'】<a href="'+dPath+v1.giftGoodsId+'">'+v1.giftGoodsName+'</a><br/>（订单完成后自动发放）'+' X'+ v1.giftGoodsNum+'</div>';
                        });
                    }

                    var orderPrice ="￥"+ v.orderPrice;
                    if(v.virtualMoneyOrNomal == 1){//0-正常；1 混合支付
                        orderPrice='金豆 '+ v.orderPrice;
                        dPath="/g?"+lib.getMid()+"&gcoin=1&gId=";//跳转-金豆兑换详情页
                    }

                    var limitcoupon=v.limitcoupon?'红包立减'+v.limitcoupon+'元':"";
                    var remindWords = dInfo.redPacketRemind?dInfo.redPacketRemind:dInfo.flowerRemind;//鲜花提示或红包提示
                        remindWords=remindWords?remindWords:"";
                    listStr+='<div class="ui-per-goods"><div class="ui-goods-img"><a href="'+dPath+v.goodsId+'"><img src="'+reqUrl.imgPath+ v.mainPictureJPG+'" /></a></div><div class="ui-goods-price"><p class="ui-now-p">'+orderPrice+'</p><span class="ui-org-p">'+limitcoupon+'</span></div><div class="ui-goods-desc"><p><a href="'+dPath+v.goodsId+'">'+v.orderGoodsName+'</a></p><p><a href="'+dPath+v.goodsId+'">'+v.enName+'</a></p><p>'+remindWords+'</p><p>x'+v.goodsNum+'</p></div></div>'+giftStr;
                });
            });

            $("#ui-order-detail").html(listStr);
            dealEvent(dInfo.orderStatus);//填充数据后，事件处理,传订单状态
        }

        //事件
        function dealEvent(orderStatus){
            var orderNo=$("#number_time").find(":first").html(),
                orderMoney=$("#pay_money").attr("money"),
                orderBalance=$("#pay_money").attr("balance"),
                payTypeId=lib.checkWeiXin()?18:17;//17--支付宝；18--微信

            //取消订单
            $("#cancel").unbind("tap");
            $("#cancel").on("tap",function(){
                var ifCan=$(this).attr("ifCan");
                if(ifCan=="no"){
                    alert("此状态下，不可以取消订单");
                }else{
                    if(confirm("是否取消订单吗？")){
                        common.js.ajx(cancelUrl,{orderStatus:orderStatus,orderId:orderId,seperateFlag:sflag},function(data){
                            if(data.infocode==="0"){
                                alert("取消成功！");
                                location.reload();//页面重新加载
                            }else{
                                alert(data.info);
                            }
                        },function(){
                            alert("取消失败！");
                        });
                    }
                }

            });

            //确认收货
            $("#confirm").unbind("tap");
            $("#confirm").on("tap",function(){
                if(confirm("是否确定收货？")) {
                    common.js.ajx(confirmUrl, {orderId: orderId}, function (data) {
                        if (data.infocode === "0") {
                            alert("确认收货成功！");
                            location.reload();//页面重新加载
                        }
                    }, function () {
                        alert("确认失败！");
                    });
                }
            });

            //订单支付
            $("#payOnce").unbind("tap");
            $("#payOnce").on("tap",function(){
                var objInfo={orderId:orderId,orderNo:orderNo,orderMoney:orderMoney,payTypeId:payTypeId};
                //订单信息
                window.sessionStorage.orderInfo=JSON.stringify(objInfo);
                location="/buyer/order/dingdanzhifu.html?oId="+orderId;//跳转支付页面
            });

            //填写运单号
            $("#deliverNum").unbind("tap");
            $("#deliverNum").on("tap",function(){
               location="/buyer/order/tuikuandh.html?oId="+orderId+"&money="+orderMoney;
            });

            //申请退款
            $("#applyBack").unbind("tap");
            $("#applyBack").on("tap",function(){
                location="/buyer/order/tuikuansq.html?oId="+orderId+"&money="+(Number(orderMoney)+Number(orderBalance));//退款的时候，退的是实付+余额
            });

            //查看物流
            $("#delivery").unbind("tap");
            $("#delivery").on("tap",function(){
                location="/buyer/order/wuliu.html?oId="+orderId;
            });

            //退货进度
            $("#processBack").unbind("tap");
            $("#processBack").on("tap",function(){
                location="/buyer/order/tuikuanjd.html?oId="+orderId+"&money="+(Number(orderMoney)+Number(orderBalance));//退款的时候，退的是实付+余额
            });

            //平台进入
            $("#platform").unbind("tap");
            $("#platform").on("tap",function(){
                location="/buyer/order/jieru.html?oId="+orderId;
            });
        }

    });
});
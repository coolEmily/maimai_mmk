require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib',"rememberThePosition"], function($, lib,remosition) {
     lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), dingdanqr = {};
    $(function() {
        var orderlistUrl = reqUrl.ser+'order/getBuyOrderInfo.action',//订单列表
            cancelUrl=reqUrl.ser+'order/cancelOrder.action',//取消订单
            confirmUrl=reqUrl.ser+'/order/confirmOrder.action',//确认收货
            pageNo = 1,//第几页
            rows = 4,//一页几条
            allPages = true,//判断页数是否加载完
            requestOrder =common.tools.getUrlParam('type')?common.tools.getUrlParam('type'):0,//订单状态
            requestTime = common.tools.getUrlParam('time')?common.tools.getUrlParam('time'):0;//订单时间
            ajaxFun();
						remosition.init(false);
        //初始化订单状态
       if(requestOrder!==0){
           var curItem=$("#select_box .itemcon:eq(0)").find("li").eq(requestOrder);
               curItem.addClass("cur").siblings().removeClass("cur");
               curItem.append('<span class="radioimg"></span>').siblings().find("span").remove();
               $("#project div:eq(0)").html(curItem.html()).removeClass("show_transd");
       }
        //筛选条件
        $(".itemcon li").on("click", function () {
            var con = $(this).html();
            var index=$(this).index();
            var pIndex=$(this).parents(".itemcon").index();
            $("#noMore").hide();

            $("#select_box").hide();
            $(this).parents(".itemcon").hide();

            $(this).addClass("cur").siblings().removeClass("cur");
            $("#project div:eq("+pIndex+")").html(con).removeClass("show_transd");

            $(this).siblings().find("span").remove();
            $('<span class="radioimg"></span>').appendTo($(this));

            $("#select_box").hide();
            $("#select_box div").hide();

            if(pIndex===0){
                requestOrder=index;
            }else{
                requestTime=index;
            }
            pageNo = 1;
            allPages = true;
            ajaxFun();
        });

        //筛选条件切换
        $("#project div").on("click", function () {
            var index = $(this).index();
            var indexdiv = $("#select_box div").eq(index);

            $(this).addClass("show_transd");
            $(this).siblings().removeClass("show_transd");

            if (indexdiv.is(":visible") === true) {
                $("#select_box").hide();
                indexdiv.hide();
                $(this).removeClass("show_transd");
            } else {
                $("#select_box").show();
                indexdiv.show().siblings().hide();
            }
        });

        roll();//下滑
        preventFun();
        //下滑自动加载
        function roll() {
            $(window).scroll(function () {
                if ((allPages) && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)) {
                    ++pageNo;
                    ajaxFun();//获取数据
                    $(window).scrollTop($(document).height() - $(window).height() - 50);
                }
            });
        }
        //阻止默认touchmove事件
        function preventFun(){
            document.body.addEventListener('touchmove', function (event) {//遮罩层出现的情况下，禁止页面滚动
                if( $("#select_box").is(":visible")){
                    event.preventDefault();
                }
            }, false);
        }
        //请求数据
        function ajaxFun() {
            var parmObj = {page: pageNo, rows: rows, requestOrder: requestOrder, requestTime: requestTime};
            $("#noneList").hide();
            common.js.ajx(orderlistUrl, parmObj, function (data) {
                if (data.infocode === "0") {
                    if (data.info.length===0) {
                        if (pageNo == 1) {
                            $("#list_wrap").html("");
                            $("#noneList").show();
                        } else {
                            allPages = false;
                            $("#noMore").show();
                        }
                    } else {
                        createHtml(data.info);
                    }
                } else if (data.infocode == 3) {//未登录
                    location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                } else {
                    alert(data.info);
                }
            }, function () {
                //alert("订单列表加载失败！");
            });
        }

        //填充页面
        function createHtml(dInfo) {
            var listStr = "";
           $.each(dInfo, function (i, d) {
               var goodStr="";//商品列表
               var endStr="";//不同订单状态，不同处理按钮
               var ostatus="";//订单状态
               var payTitle = "实付";
               var herfDetail='href="/buyer/order/dingdanxq.html?oId='+d.orderId+'&sflag='+d.seperateFlag+'"';//跳转到订单详情页

               if(d.orderStatus==10){// 10 待付款
                   payTitle = "应付";
                   ostatus='<span class="orderstate">待付款</span>';

                   if(d.orderType == 3 || d.orderType == 4){//orderType为3 或4的时候不可以取消 或者退货退款 没有对应的按钮--鲜花支付
                       endStr='<div class="deal_order"><p class="wait_pay"><a '+herfDetail+'>立即支付</a></div>';
                   }else{
                       endStr='<div class="deal_order"><p class="wait_pay"><a '+herfDetail+'>立即支付</a><a '+herfDetail+'>取消订单</a></p></div>';
                   }

               }else if(d.orderStatus<80 &&　d.orderStatus>10){//10到80之间为待收货
                   ostatus='<span class="orderstate nopay">待收货</span>';
                   endStr='<div class="deal_order"><p class="wait_receive"><a '+herfDetail+'>确认收货</a></p></div>';
               }else if(d.orderStatus==1){//1已取消
                   ostatus='<span class="orderstate">已取消</span>';
               }else if(d.orderStatus==80){// 80 已完成
                   ostatus='<span class="orderstate">已完成</span>';
               }

               $.each(d.orderGoods,function(i,v){
                   var orderPrice ="￥"+ v.orderPrice;
                   if(v.virtualMoneyOrNomal== 1){//0-正常；1 混合支付
                       orderPrice='金豆 '+ v.orderPrice;
                   }
                var remindWords = d.redPacketRemind==""?d.flowerRemind:d.redPacketRemind;//鲜花提示或红包提示
                    remindWords=remindWords?remindWords:"";
                   goodStr+='<dl><dt><a '+herfDetail+'><img src="'+reqUrl.imgPath+v.mainPictureJPG+'"></a></dt><dd><ul>	<li><a '+herfDetail+'>'+v.orderGoodsName+'</a></li><li>'+orderPrice+'</li></ul><div><span>'+remindWords+'</span><span>x'+v.goodsNum+'</span></div></dd></dl>';

               });

                  listStr+= '<div class="orderunit" id="'+d.orderId+'" orderno="'+d.orderNO+'" sflag="'+d.seperateFlag+'" status="'+d.orderStatus+'" money="'+d.payOnline+'"><div class="unithead"><span>订单编号：'+ d.orderNO+'</span>'+ostatus+'</div><div class="goodslist">'+goodStr+'</div><div class="unitfoot"><ul><li>'+ d.createDate +'&nbsp;&nbsp;共有<span> '+d.totalNum+' </span>件商品</li><li>'+ payTitle +'：<span>￥'+d.payOnline+'</span></li></ul></div>'+endStr+'</div>';

            });

            //获取数据追加到列表
            if(pageNo===1){
                $("#list_wrap").html(listStr);
            }else{
                $("#list_wrap").append(listStr);
            }
           // dealEvent();//填充数据后，事件处理;//后改：列表页的任何操作都不执行，直接跳转到详情页
        }

        //事件
        function dealEvent(){
            //取消订单
            $("#list_wrap .wait_pay span").unbind("tap");
            $("#list_wrap .wait_pay span").on("tap",function(){
                var wrapbox=$(this).parents(".orderunit"),
                    orderStatus=wrapbox.attr("status"),
                    orderId=wrapbox.attr("id"),
                    seperateFlag=wrapbox.attr("sflag");

                if(confirm("是否取消订单吗？")){
                    common.js.ajx(cancelUrl,{orderStatus:orderStatus,orderId:orderId,seperateFlag:seperateFlag},function(data){
                        if(data.infocode==="0"){
                            alert("取消成功！");
                            location.reload();//页面重新加载
                        }
                    },function(){
                        alert("取消失败！");
                    });
                }
            });

            //确认收货
            $("#list_wrap .wait_receive span").unbind("tap");
            $("#list_wrap .wait_receive span").on("tap",function(){
                var wrapbox=$(this).parents(".orderunit"),
                    orderId=wrapbox.attr("id");
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
            $("#list_wrap .wait_pay a").unbind("tap");
            $("#list_wrap .wait_pay a").on("tap",function(){
                var wrapbox=$(this).parents(".orderunit"),
                    orderId=wrapbox.attr("id"),
                    orderNo=wrapbox.attr("orderno"),
                    orderMoney=wrapbox.attr("money"),
                    payTypeId=lib.checkWeiXin()?18:17;//17--支付宝；18--微信
                var objInfo={orderId:orderId,orderNo:orderNo,orderMoney:orderMoney,payTypeId:payTypeId};
               //订单信息
                window.sessionStorage.orderInfo=JSON.stringify(objInfo);
                location="/buyer/order/dingdanzhifu.html?oId="+orderId;//跳转支付页面
            });

        }

    });
});

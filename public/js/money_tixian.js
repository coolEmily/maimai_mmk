require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib}, reqUrl = lib.getReq();
    (function(){
        var index = {};
        $.extend(index, {
           init: function(){
               this.initPage();
               $("#ui-yue").text("￥"+ (sessionStorage.balance ? sessionStorage.balance : 0));
           },
           initPage: function(){
                $(document).on("tap", ".ui-complete", function(){
                    $(".ui-complete").removeClass("active");
                    $(this).addClass("active");
                    if($(".ui-complete").hasClass("active")){
                        $(".button.ui-undo").removeClass("ui-undo");
                    }
                    //$(".button:not(.ui-undo)").attr("href", "tixian.html?id=" + $(this).data('id'));
                });
                
                /*初始化提现方式的信息*/
                common.js.ajx(reqUrl.ser + "memberBalance/getMemberDrawCashType.action", {}, function(data){
                   if(data.infocode === "0"){
                       $.each(data.info, function(k, v){
                            if(v.drawCashType === 1){
                                $(".ui-zhibubao div.ui-nothing").addClass("ui-complete").removeClass('ui-nothing').attr("data-id", v.drawCashTypeId).html("支付宝后四位：" + v.accountNo + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" + v.accountName);
                                $(".ui-zhibubao div.ui-complete").prev().text("修改");
                            }else{
                                $(".ui-bank div.ui-nothing").addClass("ui-complete").removeClass('ui-nothing').attr("data-id", v.drawCashTypeId).html("银行卡后四位：" + v.accountNo + "&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;" + v.accountName);
                                $(".ui-bank div.ui-complete").prev().text("修改");
                            }
                        });
                    }
                },function(){
                   alert("请求失败");
                });
                
                /*//初始化余额
               common.js.ajx(reqUrl.ser + "memberBalance/getBalanceInfo.action", {}, function(data){
                    if(data.infocode === "0"){
                        $("#ui-yue").text("￥"+data.info.balance);
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                },function(){
                   alert("请求失败");
                });*/
                
                $(document).on("tap", ".button:not(.ui-undo)", function(){
                    common.js.ajx(reqUrl.ser + "memberBalance/applyDrawCash.action", {money: (sessionStorage.balance ? sessionStorage.balance : 0), drawCashTypeId:$(".ui-complete.active").data('id')}, function(data){
                        alert(data.info);
                        if(data.infocode === "0"){
                            sessionStorage.removeItem('balance');
                            location.href = "chenggong.html";
                        }else if(data.infocode === "2"){
                            location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                        }else if(data.infocode === "3"){
                            location.href = "index.html";
                        }
                    });    
                });
            }
        });
        index.init();
    })();
});
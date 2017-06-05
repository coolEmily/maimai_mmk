require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var shenqi = {};
    $.extend(shenqi, {
        status: {0: '未认证', 1: '审核中', 2: '已认证', 3: '认证不通过', null: '未认证'},
        init: function(){
            sessionStorage.shenQingStatus = 0;
            this.initPage();
        },
        initPage: function(){
            var _t = this;
            lib.ajx(lib.getReq().ser+"seller/toVerifyManager.action", {}, function(data){
                if(data.infocode === "0"){
                    if(2 === data.info.sellerShop && 2 === data.info.sellerVerify){
                        sessionStorage.shenQingStatus = 1;
                        location.href = "/admin/ziying.html";
                        return;
                    }
                    if(2 !== data.info.sellerShop){
                        $(".ui-ziying .ui-status").text(_t.status[data.info.sellerShop]);
                        if(1 === data.info.sellerShop){
                            $(".ui-ziying .button").css("background","#999").attr("href", "javascript:;");
                        }else if(3 === data.info.sellerShop){
                            $(".ui-ziying .button").text("修改");
                        }
                    }else{
                        $(".ui-ziying").remove();
                    }
                    
                    if(2 !== data.info.sellerVerify){
                        $(".ui-shiti .ui-status").text(_t.status[data.info.sellerVerify]);
                        if(1 === data.info.sellerVerify){
                            $(".ui-shiti .button").css("background","#999").attr("href", "javascript:;");
                        }else if(3 === data.info.sellerVerify){
                            $(".ui-shiti .button").text("修改");
                        }
                    }else{
                        $(".ui-shiti").html('<a href="/admin/ziying.html" class="button" style="margin-top:50px">自营管理</a>').css("background","#f1f1f1");
                    }
                }else{
                    alert(data.info);
                    if(data.infocode === "1") location.href = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    if(data.infocode === "2") location.href = "/mjzhongxin.html";
                }
                $(".ui-show").show();
            },function(){
                alert("请求失败");
                $(".ui-show").show();
            });
        }
    });
    shenqi.init();
});
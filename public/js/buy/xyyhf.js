require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var xyyh={};
    var obind=lib.getUrlParam("bankId");
   $(function () {
    $.extend(xyyh, {
    	aps:lib.getReq().ser+"/bankActive/getBankInfo.action",
        apa:lib.getReq().ser+'/bankActive/vilidateBank.action',
        goap:lib.getReq().ser+'/redPacket/takeRedPacketAndMarkMember.action',
    	oid:9,
    	init:function(){
    		this.apnd();
    		this.show();
            this.quxiao();
            this.goto();
    	},
    	apnd:function() {
             var that=this;
    		$(".btn").click(function(){
                if($.trim($("input").val()).length==9){
                    if(/^[0-9]{9}$/.test($.trim($("input").val()))){
                        lib.ajx(that.apa, {
                        bankId:obind,
                        cardNo:$.trim($("input").val()),
                        },function(data){
                             $(".alert").show();
                            if(data.infocode == 0){//可以领取
                                $(".success").show();
                            }else if(data.infocode == 2){
                                $(".error").show();
                            }else{
                                 $(".alert").hide();
                                alert("卡号错误");
                            }
                        },function(){
                alert("请求失败，请检查网络连接");
            });
                    }else{
                         $(".title").show().text("卡号为数字");
                    }
                }else{
                    $(".title").show().text("请输入9位卡号");
               }

            })
    	},
    	show:function(){
            var that=this;
            lib.ajx(that.aps, {
            bankId:obind,
            },function(data){
                if(data.infocode == 0){//可以领取
                    $("input").val(lib.getUrlParam("cardNo"));
                  $(".box").css({background:"url("+lib.getReq().imgPath+data.info.activeImg+") no-repeat center center",backgroundSize:"cover"});
                  var title=data.info.activeTitle+"客户专区";
                  $(".nav").text(title);
                  document.title=title
                }
            });
    	},
        quxiao:function(){
            $("body").on("click",".cha",function(e){
                $(e.target).parent("div").hide();
                $(".success").hide();
                $(".warning").hide();
                $(".error").hide();
                 $(".alert").hide();
            })
            $("input").focus(function(){
                $(".title").hide();
            })
        },
        goto:function(){
            var that=this;
            $(".btn2").click(function(e){
                e.preventDefault();
                 lib.ajx(that.goap,{
                bankId:obind,
            },function(data){
                // infocode    0：数据 1：参数有误 2：您来晚了，已经领完了 3：您还没有登录 4：每个会员只能领取1次 5： 系统错误
                if(data.infocode == 0){
                   window.location.href="/buyer/bank/succ.html";
                }else if(data.infocode == 3){
                 window.location.href="/login/denglu.html?backUrl="+window.location.pathname+"?bankId="+obind+"&cardNo="+$.trim($("input").val());
                }else if(data.infocode == 4){
                    $(".alert").show();
                    $(".success").hide();
                   $(".warning").show()
                }else{
                    $(".alert").hide();
                    alert("请输入正确的卡号");
                }
            },function(){
                alert("请求失败，请检查网络连接");
            });
            })
        }
    });
    xyyh.init();
})
});
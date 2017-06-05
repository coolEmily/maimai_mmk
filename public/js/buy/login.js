require.config({baseUrl: '/js/lib', urlArgs: "v0.0.4"});
require(['zepto', 'lib', "log"], function ($, lib, log, bindPhone) {
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var login={
        sId: $.cookie("maimaicn_s_id") ? $.cookie("maimaicn_s_id") : 1,
        init:function(){
            this.checkphone();
            this.checkpas();
            this.reg();
            this.logclic();
            this.showIn();
            this.clicklink();
            this.weiin();
        },
         //微信隐藏
        weiin:function(){
             if(lib.checkWeiXin()){
                $(".main_head").css({"opacity":"0"})
             }
        },
        //验证第一个
        showIn:function(a){
             this.clic();
            var that=this;
            lib.ajx(lib.getReq().ser + "/member/getSellernameAndLogo.action", {
                   sellerId:a ? 1:that.sId,
                }, function (data) {
                    if(data.infocode=="0"){
                        document.title=a?a:data.info.sellerName;
                        if(!data.info.sellerLogo){
                            that.showIn(data.info.sellerName)
                            return false;
                        }
                        $(".login").css({"background": 'url("'+lib.getReq().imgPath+data.info.sellerLogo+'") no-repeat center center',
    "background-size": 'contain'});

                    }
                }) 
        //**************** */
           



        },
        //验证
        checkphone:function(){
            var that=this;
            //检测第一个
        $("input:eq(0)").on("blur",function(e){
           var num= $.trim($(this).val());
            if(!that.numReg.test(num)){
                $(".icon1").show();
                $('.mes').show().text("手机号格式错误，请重新输入");
            }
        });
            $("input:eq(0)").on("focus",function(e){
                    $(".icon1").hide();
                    $('.mes').hide();
            });
            $("input:eq(1)").on("focus",function(e){
                if($('.mes').text()!="手机号格式错误，请重新输入"){
                     $('.mes').hide();
                }    
            });
            $('input').on("input propertychange",function(){
                 that.clic();
            })
        },
        checkpas:function(){
            var that=this;
              var pas= $.trim($(this).val());
            $("input:eq(1)").on("focus",function(e){
                $(".icon2").css("opacity","1");
            });
            $("input:eq(1)").on("blur",function(e){
                $(".icon2").css("opacity","0");
            });
            $(".icon2").on("tap",function(){
                $("input:eq(1)").val("");
            })

            $(".icont").on("tap",function(e){
                e.stopPropagation();
                e.preventDefault();
                if($("input:eq(1)").attr("type")==="text"){
                    $("input:eq(1)").attr("type","password");
                   $(this).addClass("icon3").removeClass("icon4");
                }else{
                    $("input:eq(1)").attr("type","text");
                     $(this).addClass("icon4").removeClass("icon3");   
                }
            })
        },
        //正则
        reg:function(){
        this.numReg = /^1[3,4,5,7,8]\d{9}$/;
    },
    //登陆按钮可点击
    clic:function(){
         if(this.numReg.test($("input:eq(0)").val()) && $("input:eq(1)").val().length!=0){
            $(".btn").css("background","#c33").data("ng",true);
         }else{
            $(".btn").css("background","").data("ng",false);
         }
    },
    //登陆点击
    logclic:function(){
        $(".btn").click(function(){
            if($(this).data("ng")){
                lib.ajx(lib.getReq().ser + "/member/login.action", {
                    loginName:$.trim($("input:eq(0)").val()),
                    pass:$.trim($("input:eq(1)").val()),
                }, function (data) {
                        if(data.infocode=='0'){
                             if(lib.getUrlParam("backUrl")){
                                location.href = lib.getUrlParam("backUrl");
                             }else{
                                 location.href="/";
                             }
                        }else if(data.infocode=="1"){
                            $('.mes').show().text(data.info);
                        }else{
                            $('.mes').show().text("手机号或密码输入错误，请重新输入");
                        }
                })     
            }
        })
    },
    //点击链接
    clicklink:function(){
        $(".link span").click(function(){
            var link=$(this).data("m");
            if(link){
                //注册
                if(lib.getUrlParam("backUrl")){
                    location.href="/buyer/login/register.html?backUrl=" + lib.getUrlParam("backUrl");
                }else{
                     location.href="/buyer/login/register.html";
                }   
            }else{
                //密码
                 if(lib.getUrlParam("backUrl")){
                    location.href="/login/findpwd.html?backUrl=" + lib.getUrlParam("backUrl");
                }else{
                     location.href="/login/findpwd.html";
                }   
            }
        })
    }
    };
    login.init();
    
});
require.config({baseUrl: '/js/lib', urlArgs: "v0.0.4"});
require(['zepto', 'lib', "log"], function ($, lib, log, bindPhone) {
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var login={
        init:function(){
            //验证码
            this.checkphone();
            this.closechen();
            this.showin();
          
            this.reg();
            
           

            this.duibi();
           // 下一步按钮是否可点击
             this.clic();
            //点击下一步按钮
            this.locf1();
            //微信
            this.weiin(); 
            //按键监听
            this.checkkey();
            //验证码
            this.verifyCode();
            //协议同意
            this.agree();
        },
        //微信隐藏
        weiin:function(){
             if(lib.checkWeiXin()){
                $(".main_head").css({"display":"none"})
             }
        },
        //验证码
        verifyCode:function(){
            $(".f1 .icon3").css({"background":'url("'+lib.getReq().ser+'/verifyCode/getImage.action?data='+new Date().getTime()+'") no-repeat center center','background-size':'contain'}); 
            $(".f1 .icon3").on("tap",function(){
                 $(this).css({"background":'url("'+lib.getReq().ser+'/verifyCode/getImage.action?data='+new Date().getTime()+'") no-repeat center center','background-size':'contain'}); 
            });
        },
        //首次加载
        showin:function(){
            var that=this;
            $(".f2 .icon2").on("tap",function(){
                $(".f2 input").val("");
            })
             $(".f2 .icont").on("tap",function(e){
                if($(".f2 input").attr("type")==="text"){
                    $(".f2 input").attr("type","password");
                     $(this).addClass("icon3").removeClass("icon4");
                }else{
                    $(".f2 input").attr("type","text");
                    $(this).addClass("icon4").removeClass("icon3");
                     
                }
              
            })
              $(".f2 input").on("blur",function(){
               if(!that.pawnum.test($(".f2 input").val())){
                $(".f2 .mes").show().text("密码需设置在6-16位之间");
               }
              });
              $(".f2 input").on("focus",function(){
                $(".f2 .mes").hide();
              });
        },
        //用户协议同意
        agree:function(){
            var that=this;
            $(".link .iconpan").on("tap",function(){
                if(!$(this).hasClass("default")){
                    $(this).addClass("default");
                }else{
                    $(this).removeClass("default");
                }
                if($(".f1").css("display")=='none'){
                    that.clic('f2');
                }else{
                     that.clic('f1');
                }
            })
        },
        //验证码
        checkphone:function(){
        var that=this;
        //检测第一个
        $(".f1 input:eq(0)").on("blur",function(e){
           var num= $.trim($(this).val());
            if(!that.numReg.test(num)){
                $(".icon1").show();
                $(this).siblings('.mes').show().text("手机号格式错误，请重新输入");
            }else{

                lib.ajx(lib.getReq().ser + "/member/isRegisted.action", {
                   mobile:$.trim($(".f1 input:eq(0)").val()),
                }, function (data) {
                        if(data.infocode=='3' || data.infocode=="2"){
                           $(".comiform").show();
                        }
                });   
            }

        });
        $("input").on("focus",function(e){
                if($(this).parents("section").hasClass("phone")){
                $(".icon1").hide();
                }
                $(this).siblings('.mes').hide();
        });
    },
    //检验键盘事件
    checkkey:function(){
        var that=this;
        $('.f1,.f2').on("input propertychange",function(e){
        if($(this).hasClass('f1')){that.clic("f1");}else{that.clic("f2");}
        if($(".comiform").css("display")!='none'){
           $(e.target).val("").trigger("blur");
        } 
        })
    },
    //下一步按钮是否可点击
    clic:function(z){
        if(z=="f1"){
         if(this.numReg.test($(".f1 input:eq(0)").val()) && $("input:eq(1)").val().length!=0 && !$(".iconpan").hasClass("default") && $(".f1 input:eq(2)").val().length!=0 ){
            $(".btn").css("background","#c33").data("ng",true);
         }else{
            $(".btn").css("background","").data("ng",false);
         }
        }else if(z=="f2"){
        $(".f2 .icon2").css("opacity","1");
        if(!$(".iconpan").hasClass("default")){
                  $(".btn").css("background","#c33").data("ng",true);
         }else{
            $(".btn").css("background","").data("ng",false);
         }
        }
    },
    //正则
    reg:function(){
        this.numReg = /^1[3,4,5,7,8]\d{9}$/;
        this.imgReg=/^\w{4}$/;
        this.phnenum=/^\d{4,10}$/;
        this.pawnum=/^\S{6,16}$/;
    },
    //下一步按钮是否可点击
    locf1:function(){
        var this_=this;
         $(".btn").click(function(){
             var tx=$(this).data("bg");
            if($(this).data("ng") && tx=="f1"){
                var mId = $.cookie('maimaicn_f_id');
                if (!mId) {
                    mId = sessionStorage.mm_mId ? sessionStorage.mm_mId : 1;
                }
                lib.ajx(lib.getReq().ser + "/member/bindMobile.action", {
                    mobile:$.trim($(".f1 input:eq(0)").val()),
                   verifyCode:$.trim($(".f1 input:eq(2)").val()),
                   directId:mId,
                }, function (data) {
                        if(data.infocode=='0'){
                            $(".f2").css("display","block");
                            $(".f1").hide();
                            $(".btn").css("background","").data("ng",false);
                        }else if(data.infocode=="4" || data.infocode=="5" || data.infocode=="6"){
                            $(".f1 .mes:eq(2)").css({"display":"block"}).text("手机验证码输入错误，请重新输入");
                        }else{
                            $(".f1 .mes:eq(2)").css({"display":"block"}).text(data.info);
                            $(".f1 .icon3").trigger('tap');
                        }
                })   
            }else if($(this).data("ng") && tx=="f2" && this_.pawnum.test($(".f2 input").val())){
                lib.ajx(lib.getReq().ser + "/member/completeInfo.action", {
                    pass:$.trim($(".f2 input").val()),
                },function(data){
                    if(data.infocode=="0"){
                if(lib.getUrlParam("backUrl")){
                    location.href=lib.getUrlParam("backUrl");
                }else{
                     location.href="/";
                }  
                    }else{
                        $(".f2 .mes").css({"display":"block"}).text(data.info);
                    }

                },function(err){})
            }

        })
    },
    //关闭弹出层
    closechen:function(){
        $(".comiform").click(function(e){
            e.preventDefault();
        })
        $(".comiform .cdel").click(function(){
            $(".f1 input:eq(0)").trigger('focus');
            $(".comiform").hide();
        })
        $(".comiform .btn").click(function(){
             if(lib.getUrlParam("backUrl")){
                    location.href="/buyer/login/dlzc.html?backUrl=" + lib.getUrlParam("backUrl");
                }else{
                     location.href="/buyer/login/dlzc.html";
                }   
        })
    },
    //对比验证吗
duibi:function(){
    var this_=this;
     $(".yan").on("tap",function(){
        var that=$(this);
        if(!this_.numReg.test($.trim($(".f1 input:eq(0)").val()))){
            $(".f1 input:eq(0)").siblings('.mes').css({"display":"block"}).text("手机号格式错误，请重新输入");
             $(".icon1").show();
             return false;
        }
        if(!that.data("ngfa")){
            if(!this_.imgReg.test($.trim($(".f1 input:eq(1)").val()))){
                 $(".f1 input:eq(1)").siblings('.mes').css({"display":"block"}).text("请输入图形验证码");
            }
            return false;
        }
        if(this_.imgReg.test($.trim($(".f1 input:eq(1)").val()))){
         lib.ajx(lib.getReq().ser + "/verifyCode/sendSmsCode.action", {
                phone:$.trim($(".f1 input:eq(0)").val()),
                verifyCode:$.trim($(".f1 input:eq(1)").val()),
            },function(data){
                if(data.infocode=="0"){
                    that.data("ngfa",false);
                    var num=120;
                    var time=setInterval(function(){
                        num--;
                        that.css("background","#ccc").text(num+"s");
                        if(num==0){
                            num=120;
                             that.data("ngfa",true);
                            that.css("background","#c33").text("重新获取");
                            clearInterval(time);
                        }   
                    },1000);
                    $(".alert").css("display","block");
                    var times=setTimeout(function(){
                         $(".alert").css("display","none");
                         clearTimeout(times);
                    },2000);
                }else if(data.infocode=="4"){
                     $(".f1 input:eq(2)").siblings('.mes').css({"display":"block"}).text(data.info);
                }else{
                    $(".f1 input:eq(1)").siblings('.mes').css({"display":"block"}).text('图形验证码错误，请重新输入');
                     $(".f1 .icon3").trigger('tap');
                }
             },function(){});
        }else{
             $(".f1 input:eq(1)").siblings('.mes').css({"display":"block"}).text("请输入图形验证码");
        }
     });
}
};


    login.init();
    
});
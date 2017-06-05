require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    var leb = new lib();
    var Url =leb.getReq().ser;
    var res={
        //密码正则
        pass:/^\w{6,18}$/
    };
    var pay={
        sendSmsCode:"/verifyCode/sendSmsCode.action",
        //校验短信验证码
        checkSmsCode:"/verifyCode/checkSmsCode.action",
        //设置验证码
        setPayPass:"/memberCenter/setPayPass.action",
        //初始化
        //当前绑定
        checkSmsCodeForLogin:"/verifyCode/checkSmsCodeForLogin.action",
        sendSmsCodeForLoginMem:"/verifyCode/sendSmsCodeForLoginMem.action",
        init:function(){
            this.yanzheng();
            this.clickY();
            this.clikcyanzheng();
            this.duanxin();
            //倒计时,
            this.exec();
        },
        //加载验证码
        clickY:function(){
            $(".btn1").click(function(){
                $(this).css({"background":"#fff url('"+Url+"verifyCode/getImage.action?"+(new Date).getTime()+"') center 50% no-repeat","backgroundSize":"contain"});
            });
            $(".safety").on("focus","input",function () {
                if($(this).parents("li").hasClass("border")){
                    $(".formList>li").removeClass("border");
                    $(".formList1>li").removeClass("border");
                    $(".message").hide();
                }
            });
        },
        //密码正则
        exec:function(){
            $(".formList1").on("blur","input",function () {
                if($(this).val()===""){
                    $(this).parents("li").addClass("border");
                    $(".message").show().text("请输入密码");
                    return false;
                }
                if(!res.pass.test($(this).val())){
                    $(this).parents("li").addClass("border");
                    $(".message").show().text("密码是6~18位的字符、数字和下划线");
                    return false;
                }
                if($(this).data("index")===1){
                    if($(".formList1 li").eq(0).find("input").val()!==$(".formList1 li").eq(1).find("input").val()){
                        $(this).parents("li").addClass("border");
                        $(".message").show().text("两次密码请输入相同");
                        $(".address").attr("index",false);
                    }else{
                        $(".address").attr("index",true);
                    }
                }
            });
            //******************
        },
        //验证
        yanzheng:function(){
            if(leb.getUrlParam("qiyong")=="1"){
                $("#addr_title").text("修改支付密码");
            }else{
                $("#addr_title").text("设置支付密码");
            }
            $(".formList li").eq(0).find("input").val($.cookie("member_loginName"));
            $(".btn1").css({"background":"#fff url('"+Url+"verifyCode/getImage.action?"+(new Date).getTime()+"') center 50% no-repeat","backgroundSize":"contain"});
        },
        //验证验证码
        clikcyanzheng:function(){
            var self=this;
            $(".btn2").click(function(){
                if(!$.trim($(".formList li").eq(1).find("input").val())){
                    $(".message").show().text("请填写验证码");
                    $(".formList li").addClass("border");
                }else if($(this).data("book")){
                    leb.ajx(Url+pay.sendSmsCode,{
                        "verifyCode":$.trim($(".formList li").eq(1).find("input").val()),
                        "phone":$.trim($(".formList li").eq(0).find("input").val())
                    },function(data){
                        if(data.infocode=="0"){
                            alert(data.info);
                            self.Ntime(120,$(".btn2"));
                            $(".address").data("test",true);
                        }else{
                            self.yanzheng();
                            alert(data.info);
                        }
                    },function(){

                    })
                }
            });
        },
        //倒计时
        Ntime:function(time,_self){
            _self.data("book",false);
            _self.text(time + "s");
            _self.css({"backgroundColor": "#999", "color": "#fff"});
            var settime10;
            settime10 = setInterval(function () {
                time--;
                if (time < 0) {
                    clearInterval(settime10);
                    _self.data("book",true);
                    _self.css({"backgroundColor": "", "color": ""});
                    _self.text("获取验证码");
                } else {
                    _self.text(time + "s");
                }
            }, 1000);
        },
        duanxin:function(){
            var self=this;
            $(".address").click(function(){
                if($(".address").data("page")===0){
                    if($(".address").data("test") && ($.trim($(".formList li").eq(2).find("input").val()))){
                        leb.ajx(Url+pay.checkSmsCodeForLogin,{
                            smsCode:$.trim($(".formList li").eq(2).find("input").val()),
                        },function(data){
                            if(data.infocode=="0"){
                                $("button").data("page",1);
                                $("button").data("token",data.info);
                                $(".safetyIcon").css({"background":"url('/images/safetyCenter/payPass2.png') no-repeat center center;","backgroundSize": "80%"});
                                $(".formList").css({"display":"none"});
                                $(".formList1").css({"display":"block"});
                            }else{
                                alert(data.info);
                            }
                        },function(){

                        });
                    }else{
                        $(".message").show().text("请填写验证码");
                        $(".formList li").addClass("border");
                    }
                    return false;
                }else if($("button").data("page")===1){
                    if($(this).attr("index") && !($(".formList1 li").hasClass("border"))){
                        leb.ajx(Url+pay.setPayPass,{
                            "token":$("button").data("token"),
                            "payPass":$.trim($(".formList1 li").eq(1).find("input").val()),
                        },function(data){
                            if(data.infocode=="0"){
                                $("button").data("page",2);
                                $(".formList").css({"display":"none"});
                                $(".formList1").css({"display":"none"});
                                $(".safetyIcon").css({"background":"url('/images/safetyCenter/payPass3.png') no-repeat center center;","backgroundSize": "80%"});
                                $(".safetyFrom").css({"background":"url('/images/safetyCenter/win.png') no-repeat center center;","backgroundSize": "50%"});
                                $(".title").css({"display":"block"});
                                $(".address").text("去购物");
                                leb.getUrlParam('backUrl') ? location.href = leb.getUrlParam('backUrl') : "";
                            }else{
                                alert(data.info);
                            }
                        },function(){
                        });
                    }else{
                        $(".message").show().text("请输入密码");
                        $(".formList1 li").addClass("border");
                    }
                }else if($("button").data("page")===2){
                     if(window.isApp !== 0){
                            push.pushViewController("去购物");
                            return;
                        }else{
                    location.href = '/';
                        }
                }
            });
        }
    }
    pay.init();
});

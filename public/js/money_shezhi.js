require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var shezhi = {};
        $.extend(shezhi, {
            time: 0,
            flag: true,
            id: common.tools.getUrlParam("id"),
            init: function(){
                this.changeCode();
                this.getPhoneCode();
                this.initPage();
                this.save();
                $("#_verifyCode").attr("src", lib.getReq().ser+"verifyCode/getImage.action?timestamp="+new Date().getTime());
            },
            initPage: function(){
                var _t =this;
                $(document).on("tap", ".ui-nothing.ui-complete", function(){
                    $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active");
                });
                if(_t.id === "9999"){
                    $(".ui-account-info.ui-zhifubao-info").remove();
                    $(".ui-account-info.ui-bank-info").show();
                    $(".ui-acc-info").append('<div class="ui-bank"><div class="ui-nothing ui-complete active"></div></div>');
                    /*初始化银行列表*/
                    common.js.ajx(reqUrl.ser + "payType/getAllBank.action", {}, function(data){
                        if(data.infocode === "0"){
                            var options = "";
                            $.each(data.info, function(k,v){
                                options += "<option data-id='" + v.payTypeId + "'>"+ v.payTypeName +"</option>";
                            });
                            $("#ui-bank-select").append(options);
                        }else if(data.infocode !== "2"){
                            aler(data.info);
                        }
                    }, function(){
                        alert("请求失败");
                    });

                }else{
                    $(".ui-account-info.ui-zhifubao-info").show();
                    $(".ui-account-info.ui-bank-info").remove();
                    $(".ui-acc-info").append('<div class="ui-zhifubao"><div class="ui-nothing ui-complete active"></div></div>');
                }
                /*初始化账户信息*/
                common.js.ajx(reqUrl.ser + "memberBalance/getDrawCashTypeInfo.action",{drawCashType: _t.id === "9999"?2:1},function(data){
                    if(data.infocode === "0"){
                        $("input[name=userName]").val(data.info.accountName);
                        $("input[name=userCard]").val(data.info.accountNo);
                        $("input[name=userTel]").val(data.info.mobile);
                        if(_t.id === "9999"){
                            $.each($("#ui-bank-select option"), function(v){
                                if($(this).data("id") === data.info.payTypeId)
                                    $(this).attr("selected",'selected');
                                return;
                            });
                        }
                    }else if(data.infocode === "2"){
                        alert(data.info);
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, function(){
                    alert("请求失败");
                });

                /*获取用户绑定的手机号*/
                common.js.ajx(reqUrl.ser + "/member/getBindMobile.action",{drawCashType: _t.id === "9999"?2:1},function(data){
                    if(data.infocode === "0"){
                        $("input[name=userTel]").val(data.info);
                    }else if(data.infocode === "3"){
                        alert(data.info);
                        location.href = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, function(){
                    alert("请求失败");
                });
            },
            changeCode: function(){
                $(document).on("tap", ".ui-vcode img", function(){
                    $(this).attr("src", lib.getReq().ser+"verifyCode/getImage.action?timestamp="+new Date().getTime());
                });
            },
            getPhoneCode: function(){
                var _t = this;
                $(document).on("tap", ".ui-ph-code:not(.ui-undo)", function(){
                    var _this = this;
                    if(_t.time > 0 || !_t.flag) return;
                    var imgVal = $("input[name=userCode]").val().trim();

                    if(imgVal.length < 4){
                        alert("请输入正确的图片验证码");
                        return;
                    }
                    $(_this).addClass("ui-undo").text("120's");
                    _t.time = 120;
                    var tineInterval = setInterval(function(){
                        _t.time --;
                        $(_this).text((_t.time >= 0 ? _t.time : 0) + "'s");
                        if(_t.time <=0){
                            clearInterval(tineInterval);
                            $(_this).removeClass("ui-undo").text("获取验证码");
                        }
                    }, 1000);
                    common.js.ajx(reqUrl.ser + "verifyCode/sendSmsCodeForLoginMem.action", {verifyCode:imgVal}, function(data){
                        if(data.infocode !== '0'){
                            _t.time = 0;
                            clearInterval(tineInterval);
                            $(_this).removeClass("ui-undo").text("获取验证码");
                            alert(data.info);
                        }
                        $(".ui-vcode img").attr("src", lib.getReq().ser+"verifyCode/getImage.action?timestamp="+new Date().getTime());
                    },function(){
                        _t.time = 0;
                        clearInterval(tineInterval);
                        $(_this).removeClass("ui-undo").text("获取验证码");
                        alert("请求失败");
                        $(".ui-vcode img").attr("src", lib.getReq().ser+"verifyCode/getImage.action?timestamp="+new Date().getTime());
                    });

                });
            },
            save: function(){
                var _t = this;
                $(document).on("tap", ".ui-submit.button", function(){
                    var data = {};
                    data.accountName = $("input[name=userName]").val().trim();
                    data.smsCode = $("input[name=userPhcode]").val().trim();
                    data.accountNo = $("input[name=userCard]").val().trim();
                    if(_t.id === "9999"){
                        data.drawCashType = 2;
                        data.payTypeId = $("#ui-bank-select option:selected").data("id");
                    }else{
                        data.drawCashType = 1;
                    }
                    if(data.accountNo === ""){
                        _t.id === "9999" ? alert("请输入银行卡号") : alert("请输入支付宝账户");
                        return;
                    }
                    if(data.accountName === ""){
                        _t.id === "9999" ? alert("请输入卡户人姓名") : alert("请输入收款人");
                        return;
                    }
                    if(data.smsCode === ""){
                        alert("请输入手机验证码");
                        return;
                    }
                    common.js.ajx(reqUrl.ser + "memberBalance/setDrawCashType.action", data, function(data){
                        alert(data.info);
                        if(data.infocode === "0"){
                            location.href = "tixian.html";
                        }else if(data.infocode === "2"){
                            location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                        }
                    },function(){
                        alert("请求失败");
                    });
                });
            }
        });
        shezhi.init();
    })();
});
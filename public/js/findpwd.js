require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    var phoneNum = null;
    var sendPhoneMsg = lib.getReq().ser + "/verifyCode/sendSmsCode.action";//发送手机短信
    var verifyPhone = lib.getReq().ser + "member/isRegisted.action";//验证手机是否注册
    var verifyPhoneCode = lib.getReq().ser + "/member/getBackPass_checkSmsCode.action";//校验手机验证码
    var setPassWord = lib.getReq().ser + "/member/getBackPass_setNewPass.action"; //设置新密码
    var flag = false;
    var smsFlag = false;
    var imgCode = null;
    var findpwd = {};
    var verify = {
        checkPhone: function () {
            var self = this;
            var reg = /^1[34578]\d{9}$/;

            $(".login-tel").off("blur").on("blur", function () {
                flag = false;
                var pNum = $(this).val().trim();
                phoneNum = pNum;
                if (!reg.test(pNum)) {
                    $(".err-i").show();
                    flag = false;
                    self.errMsg({warningObj: $(".f-tab1 .err-warning1"), img: "", text: "手机号格式错误，请重新输入"});
                    return;
                }
                lib.ajx(verifyPhone, {mobile: pNum}, function (data) {
                    if (data.infocode === "0") {
                        self.errMsg({warningObj: $(".f-tab1 .err-warning1"), img: "", text: "该手机号未注册"});
                        $(".err-i").show();
                    } else if (data.infocode === "2" || data.infocode === "3") {
                        flag = true;
                        $(".err-i").hide();
                    } else {
                        self.errMsg({warningObj: $(".f-tab1 .err-warning1"), img: "", text: data.info})
                    }
                }, function () {
                    self.errMsg({warningObj: $(".f-tab1 .err-warning1"), img: "", text: "请求失败请重试"})
                })
            })
        },
        checkPhoneCode: function () {
            var self = this;
            $(".f-tab1 .f-btn").on("click", function () {
                var codeVal = $(".smsCode").val().trim();
                smsFlag = false;
                if(codeVal.length < 6){
                    self.errMsg({warningObj: $(".f-tab1 .err-warning3"), img: "", text: "短信验证码错误，请重新输入"});
                    return
                }
                if (flag && imgCode && codeVal.length === 6) {
                    lib.ajx(verifyPhoneCode, {smsCode: codeVal, phone: phoneNum}, function (data) {
                        if (data.infocode === "0") {
                            smsFlag = true;
                            $(".f-tab1").hide();
                            $(".f-tab3").show()
                        } else if (data.infocode === "2" || data.infocode === "3") {
                            self.errMsg({warningObj: $(".f-tab1 .err-warning3"), img: "", text: data.info})
                        } else if (data.infocode === "4") {
                            self.errMsg({warningObj: $(".f-tab1 .err-warning3"), img: "", text: "短信验证码错误，请重新输入"})
                        }else {
                            self.errMsg({warningObj: $(".f-tab1 .err-warning3"), img: "", text: "验证异常"})
                        }
                    }, function () {
                        self.errMsg({warningObj: $(".f-tab1 .err-warning3"), img: "", text: "验证异常"})
                    })
                }
            })
        },
        errMsg: function (obj) {
            obj["warningObj"].empty().text(obj.text);
        }
    };
    $.extend(findpwd, {
        init: function () {
            var _t = this;
            if (lib.checkWeiXin()) {
                $(".main_head").css("visibility", "hidden")
            }
            _t.getImgCode({id: $("#imgCodeFir")});
            verify.checkPhone();
            verify.checkPhoneCode();
            _t.sendPhoneMsg();
            _t.setPassWord();
            _t.bindEvent()
        },
        getImgCode: function (_o) {//获取验证码
            _o.id.attr("src", lib.getReq().ser + "/verifyCode/getImage.action?timestamp=" + new Date().getTime());
            _o.id.on("tap", function () {
                $(this).attr("src", lib.getReq().ser + "/verifyCode/getImage.action?timestamp=" + new Date().getTime());
            });
        },

        sendPhoneMsg: function () {
            var _t = this;
            var sec = 120;
            $(".r-pcode").on("click", function () {
                if (sec < 120) return;
                var reg = /^1[34578]\d{9}$/;
                if (!reg.test(phoneNum)) {
                    verify.errMsg({warningObj: $(".f-tab1 .err-warning1"), img: "", text: "手机号格式错误，请重新输入"});
                    return
                }
                if ( imgCode == null || imgCode.length < 4) {
                    verify.errMsg({warningObj: $(".f-tab1 .err-warning2"), img: "", text: "图形验证码错误，请重新输入"});
                    return;
                }
                lib.ajx(sendPhoneMsg, {phone: phoneNum, verifyCode: imgCode}, function (data) {
                    if (data.infocode === "0") {
                        $(".hintmsg").show();
                        setTimeout(function () {
                            $(".hintmsg").fadeOut();
                        }, 2000);
                        timeOut();
                    } else if (data.infocode === "2" || data.infocode === "3") {
                        verify.errMsg({warningObj: $(".f-tab1 .err-warning2"), img: "", text: "图形验证码错误，请重新输入"});
                        _t.getImgCode({id: $("#imgCodeFir")});
                    } else {
                        verify.errMsg({warningObj: $(".f-tab1 .err-warning3"), img: "", text: data.info});
                    }
                }, function () {
                    verify.errMsg({warningObj: $(".f-tab1 .err-warning2"), img: "", text: "发送验证码失败"});
                });

                function timeOut() {
                    sec--;
                    clearTimeout(timer);
                    $(".r-pcode").addClass("r-pcode-act").text(sec + "s");
                    if (sec > 0) {
                        var timer = setTimeout(timeOut, 1000)
                    } else {
                        $(".r-pcode").removeClass("r-pcode-act").text("重新获取");
                        sec = 120;
                    }
                }
            });
        },
        setPassWord: function () {
            $(".btn-done").on("click", function () {
                var pwdVal = $(".pwdInp").val();
                if (pwdVal.length > 5 && pwdVal.length < 17) {
                    lib.ajx(setPassWord, {newPass: pwdVal}, function (data) {
                        if (data.infocode === "0") {
                            location.href = lib.getUrlParam("backUrl") || "/buyer/login/dlzc.html";
                        } else {
                            verify.errMsg({warningObj: $(".f-tab3 .err-warning1"), img: "", text: data.info});
                            $(".btn-done").removeClass("btn-act");
                        }
                    }, function () {
                        verify.errMsg({warningObj: $(".f-tab3 .err-warning1"), img: "", text: "密码需设置在6-16位之间"});
                    })
                } else {
                    verify.errMsg({warningObj: $(".f-tab3 .err-warning1"), img: "", text: "密码需设置在6-16位之间"});
                }
            })
        },

        bindEvent: function () {
            $(".imgCode").off("keyup").on("keyup", function () {
                var codeVal = $(this).val().trim();
                if (flag) imgCode = codeVal;
            });

            $(".f-tab1 .smsCode").on("focus",function () {
                if(flag && imgCode){
                    $(".f-tab1 .f-btn").addClass("btn-act");
                }else{
                    $(".f-tab1 .f-btn").removeClass("btn-act");
                }
            });

            $(".r-eye").on("click", function () {
                $(this).toggleClass("r-see");
                if ($(this).hasClass("r-see")) {
                    $(".pwdInp").attr("type", "text")
                } else {
                    $(".pwdInp").attr("type", "password")
                }
            });

            $(".pwdInp").on("focus", function () {
                $(".btn-done").addClass("btn-act");
            });

            $(".inp01").on("focus", function () {
                $(".err-warning1").empty();
                if ($(this).hasClass("login-tel")) {
                    $(".err-i").hide()
                }
            });

            $(".inp02").on("focus", function () {
                $(".err-warning2").empty();
            });

            $(".inp03").on("focus", function () {
                $(".err-warning3").empty();
            })
        }
    });
    findpwd.init();
});

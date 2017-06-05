require.config({baseUrl: '/js/lib', urlArgs: "v0.0.4"});
require(['zepto', 'lib', "log", "phone_code"], function ($, lib, log, bindPhone) {
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    //选项卡
    var tab = function () {
        var tabIndex = lib.getUrlParam('zc') ? 1 : 0;//红包组Id
        tabDeal(tabIndex);
        var phoneOrigin = sessionStorage.phoneNum ? sessionStorage.phoneNum : "";//红包页面带回电话号码
        $(".pNumber").val(phoneOrigin);

        $('.reg_tab span').tap(function () {
            var n = $(this).index();
            tabDeal(n);
        });

        function tabDeal(n) {
            $('.reg_tab span').eq(n).addClass('active').siblings().removeClass("active");
            $('.reg_box .reg_cont').eq(n).addClass('on').siblings().removeClass("on");
            $(".login_form").removeClass("login_form_w");
            $(".login_make").remove();
            $(".login_hd_i").remove();
            $("#ui-set-password").hide();
            $("input").val("");
        }

    };
    $(function () {
        var sid = $.cookie("maimaicn_s_id");
        $(".nav-title").empty().text(sid == "425160" ? "天视商城" : "买买");
        tab();//选项卡
        var login1 = new log.login($("input[name=userName]"), $("input[name=password]"));
        //showResult.isUsing(login1, $("input[name=userName]"), true);
        $(document).on("touchend", "#login_button", function (e) {
            e.preventDefault();
            locationFun("login");//跳转对应页面
        });
        $(document).on("tap", "#imgNum", function () {
            $(this).attr("src", reqUrl.ser + "verifyCode/getImage.action?timestamp=" + new Date().getTime());
        });
        bindPhone.init();
        bindPhone.bindPhone($("#reg_button"), null, null, function () {
            $("#ui-set-password").show();
            $('.reg_box .reg_cont').removeClass("on");
            $(".login_form").removeClass("login_form_w");
            $(document).on("touchend", "#regSetPassword:not(.undo)", function (event) {
                //new log.resetPassword($("input[name=regPassword]"), $("input[name=regRPassword]")).resetPass("member/completeInfo.action", location.href);
                event.preventDefault();
                var _t = login1;
                $(".login_form").removeClass("login_form_w");
                $(".login_make").remove();
                var newPass = $("input[name=regPassword]").val();
                var newPassR = $("input[name=regRPassword]").val();
                if (newPass.length < 6) {
                    _t.showMessage("密码至少6位", false, _t.np);
                    return;
                }
                if (newPassR !== newPass) {
                    _t.showMessage("两次密码不一致", false, _t.rnp);
                    return;
                }
                var mId = $.cookie('maimaicn_f_id');
                if (!mId) {
                    mId = sessionStorage.mm_mId ? sessionStorage.mm_mId : 1;
                }
                lib.ajx(lib.getReq().ser + "member/completeInfo.action", {
                    pass: newPass,
                    directId: mId
                }, function (data) {
                    if (data.infocode === "0") {
                        alert(data.info);
                        locationFun("register");//跳转对应页面
                    } else if (data.infocode === "4") {
                        _t.showMessage(data.info, false, $("input[name=regPassword]"));
                    } else {
                        _t.showMessage(data.info, false);
                    }
                }, function () {
                    alert("请求失败");
                });
            });
        });
        //登录注册完成后，跳转到相应页面
        function locationFun(type) {
            var currentUrl = common.tools.getUrlParam("backUrl") ? common.tools.getUrlParam("backUrl") : "/buyer/home/huiyuanzx.html",
                targetUrl = "/buyer/egghit.html";
            if (currentUrl.indexOf(targetUrl) > -1 && sessionStorage.linkUrl) {//从砸金蛋页面跳转来的，首次领取&成功后到红包页面

                currentUrl = sessionStorage.linkUrl;//跳转到红包页面
                if (type == "login") {//登录
                    login1.login('/buyer/home/hongbao.html', function () {
                        lib.ajx(lib.getReq().ser + "draw/bindRedPacketFromSession.action", {}, function (data) {
                            location.href = currentUrl;
                        }, function () {
                            alert("领取红包fail");
                        });
                    });
                } else {//注册
                    lib.ajx(lib.getReq().ser + "draw/bindRedPacketFromSession.action", {}, function (data) {
                        location.href = currentUrl;
                    }, function () {
                        alert("领取红包fail");
                    });
                }

            } else {
                if (type == "login") {//登录
                    login1.login(currentUrl);
                } else {//注册
                    location.href = currentUrl;
                }
            }
        }

        $("#imgNum").click();
    });
});
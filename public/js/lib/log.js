define(['zepto', 'lib'], function ($,lib) {
    lib = new lib();
    var log = {};
    function showResult(){
        /*记录手机号是否被使用 true 已被使用,  false 没被使用*/
        this.flag = true;
    }
    /*当手机号失去焦点时验证手机号
     *flag 根据false或true 去判断手机状态的正确与否
     * obj 要被校验的对象
     * classO showResult的子类对象
     * */
    showResult.isUsing = function(classO, obj, flag){
        var _t = classO;
        $(obj).on("blur", function(){
            var mobile = $(this).val().trim();
            var numReg = /^1[3,4,5,7,8]\d{9}$/;
            if(!numReg.test(mobile)){
                _t.showMessage("请输入正确的手机号", false, obj);
                return;
            }
            lib.ajx(lib.getReq().ser + "member/isRegisted.action", {mobile:mobile},function(data){
                if(flag){
                    if(data.infocode === '0'){
                        _t.showMessage("该手机号不存在", false, obj);
                        _t.flag = false;
                    }else if(data.infocode === '2' || data.infocode === '3'){
                        _t.flag = true;
                    }else{
                        _t.showMessage(data.info, false);
                    }
                }else{
                    if(data.infocode === '0'){
                        _t.flag = false;
                    }else if(data.infocode === '2' || data.infocode === '3'){
                        _t.showMessage("该手机号已被使用", false, obj);
                        _t.flag = true;
                    }else{
                        _t.showMessage(data.info, false);
                    }
                }
            },errorFn);
        });
    };

    showResult.prototype.showMessage = function(content, flag, obj){
        $("input").blur();
        $(".ui-message").removeClass("login_error").removeClass("login_succ");
        $(".ui-message").show();
        setTimeout(function(){
            if(flag){
                $(".ui-message").text(content).addClass("login_succ").removeClass("login_error");
            }else{
                $(".ui-message").text(content).addClass("login_error").removeClass("login_succ");
                $(".login_form").addClass("login_form_w");
                if(obj)
                    $(obj).parent().append('<i class="login_make"></i>');
            }
        }, 1);
    };
    /*登陆操作*/
    log.login = function(userNameObj, passwordObj){
        this.uo = userNameObj;
        this.po = passwordObj;
    };
    log.login.prototype = new showResult();
    log.login.prototype.login = function(url,backfun){
        var _t = this;
        if(!lib.checkWeiXin()){
            _t.payFunUrl=lib.getReq().ser+"/pay/alipay.action";
        }else{
            _t.payFunUrl="https://open.weixin.qq.com/connect/oauth2/authorize";
        }
        $(".login_form").removeClass("login_form_w");
        $(".login_make").remove();
        var loginName = _t.uo.val().trim();
        var pass = _t.po.val().trim();
        var telReg = /^(1[3,4,5,7,8]\d{9})|(590\d{8})$/;
        if(!telReg.test(loginName)){
            _t.showMessage("请输入正确的手机号", false, _t.uo);
            return;
        }
        if(pass === ""){
            _t.showMessage("请输入密码", false, _t.po);
            return;
        }
        lib.ajx(lib.getReq().ser + "member/login.action", {loginName:loginName,pass:pass}, function(data){
            if(data.infocode === "0"){
                if(backfun){//有回调函数，证明是从砸金蛋页面过来的，执行回调return；
                    backfun();
                    return;
                }
                //买家登录 还是卖家登录
                if(location.href.indexOf("/buyer/login/dlzc") > -1){
                    location.href = url;
                    return;
                }
                if("1" === $.cookie("member_memberTypeId")){
                    //如果是买手才去请求有没订单
                    lib.ajx(lib.getReq().ser+"member/getNotPayUpgradeOrder.action", {}, function(data){
                        if(data.infocode === "0"){
                            var orderId = data.info.orderId;
                            //根据页面会跳的地址判断来源
                            var wechatStr = "";
                            if(url.indexOf("ziliao.html") > -1){
                                if(!lib.checkWeiXin()){
                                    lib.ajx(_t.payFunUrl,{orderId:orderId,originType:1},function(data){
                                        if(data.infocode==="0"){
                                            location=data.info;
                                        }else{
                                            _t.showMessage("登录超时，请重试", false);
                                        }
                                    },function(){
                                        _t.showMessage("登录超时，请重试", false);
                                    });
                                }else{
                                    wechatStr=_t.payFunUrl+"?appid=" + lib.getReq().appid + "&redirect_uri="+lib.getReq().ser+"pay/wxPay.action&response_type=code&scope=snsapi_base&state="+orderId+"#wechat_redirect";
                                    // if((window.location.href).indexOf("m.maimaicn.com") === -1){
                                    //     //线下链接勿改
                                    //     wechatStr=_t.payFunUrl+"?appid=wx19a29141ad9f0609&redirect_uri=http://mmkyf.maim9.com/mmjmanager/pay/wxPay.action/&response_type=code&scope=snsapi_base&state="+orderId+"#wechat_redirect";
                                    // }
                                    location=wechatStr;
                                }
                                return;
                            }else if(url.indexOf("ziliao.html") === -1){
                                //跳邀请页面
                                var payPath = "";
                                if(!lib.checkWeiXin()){
                                    lib.ajx(_t.payFunUrl,{orderId:orderId,originType:1},function(data){
                                        if(data.infocode==="0"){
                                            payPath=data.info;
                                            if(data.info.nmtId === "3"){
                                                location.href = "/login/yaoqingdk.html?payPath="+payPath;
                                            }else{
                                                location.href = "/login/yaoqing.html?payPath="+payPath;
                                            }
                                        }else{
                                            _t.showMessage("登录超时，请重试", false);
                                        }
                                    },function(){
                                        _t.showMessage("登录超时，请重试", false);
                                    });
                                }else{
                                    wechatStr=_t.payFunUrl+"?appid=" + lib.getReq().appid + "&redirect_uri="+lib.getReq().ser+"pay/wxPay.action&response_type=code&scope=snsapi_base&state="+orderId+"#wechat_redirect";
                                    // if((window.location.href).indexOf("m.maimaicn.com") === -1){
                                    //     //线下链接勿改
                                    //     wechatStr=_t.payFunUrl+"?appid=wx19a29141ad9f0609&redirect_uri=http://mmkyf.maim9.com/mmjmanager/pay/wxPay.action/&response_type=code&scope=snsapi_base&state="+orderId+"#wechat_redirect";
                                    // }
                                    payPath=wechatStr;
                                    if(data.info.nmtId === "3"){
                                        location.href = "/login/yaoqingdk.html?payPath="+payPath;
                                    }else{
                                        location.href = "/login/yaoqing.html?payPath="+payPath;
                                    }
                                }


                            }
                        }else if(data.infocode === "3"){
                            //如果没有订单 且会跳地址是完善资料页面  则调回完善资料页面
                            if(url.indexOf("ziliao.html") > -1){
                                sessionStorage.bindPhone=loginName.substr(0,3)+"****"+loginName.substr(8,4);
                                location.href = url;
                                return;
                            }
                            //如果没有订单
                            location.href = "/buyer/home/huiyuanzx.html";
                            return;
                        }else{
                            _t.showMessage("登录超时，请重试", false);
                        }
                    }, function(){
                        _t.showMessage("登录超时，请重试", false);
                    });
                }else{
                    //买咖或大咖登录直接到卖家中心
                    if(url.indexOf("ziliao.html") > -1){
                        location.href = "/mjzhongxin.html";
                        return;
                    }
                    location.href = url;
                    return;
                }
            }else if(data.infocode === '3' || data.infocode === '4'){
                _t.showMessage(data.info, false, _t.uo);
            }else if(data.infocode === '5' || data.infocode === '2'){
                _t.showMessage(data.info, false, _t.po);
            }else{
                _t.showMessage(data.info, false);
            }
        }, errorFn);
    };
    /*找回密码*/
    log.resetPassword = function(passwordObj, rPasswordObj){
        this.p = passwordObj;
        this.rp = rPasswordObj;
    };
    log.resetPassword.prototype = new showResult();
    log.resetPassword.prototype.resetPass = function(rUrl, succUrl){
        var _t = this;
        $(".login_form").removeClass("login_form_w");
        $(".login_make").remove();
        var newPass = _t.p.val().trim();
        var newPassR = _t.rp.val().trim();
        if(newPass.length < 6){
            _t.showMessage("密码至少6位", false, _t.p);
            return;
        }
        if(newPassR !== newPass){
            _t.showMessage("两次密码不一致", false, _t.rp);
            return;
        }
        var url = "member/getBackPass_setNewPass.action";
        var data = {newPass:newPass};
        if(rUrl){
            url = rUrl;
            data = {pass: newPass, directId: lib.getUrlParam('mId')};
        }
        lib.ajx(lib.getReq().ser + url, data, function(data){
            if(data.infocode === "0"){
                if(rUrl == "member/completeInfo.action"){
                    _t.showMessage(data.info, true);
                    $("#ui-set-password .login_form").addClass("login_form_c");
                    $("#ui-set-password input").after('<i class="login_make_c"></i>');
                    $("#regSetPassword").addClass("undo");
                    var time =3;
                    $("#regSetPassword a").text(time + '秒后自动返回登录页面');
                    var interval = setInterval(function(){
                        $("#regSetPassword a").text(--time < 0? 0 : time + '秒后自动返回登录页面');
                        if(time < 0){
                            location.href = succUrl;
                            clearInterval(interval);
                        }
                    }, 1000);
                }else
                    location.href = succUrl;
            }else{
                _t.showMessage(data.info, false);
            }
        }, errorFn);
    };

    /*修改密码*/
    log.updatePassword = function(oldPassword, newPassword, rNewPasswordObj){
        this.op = oldPassword;
        this.np = newPassword;
        this.rnp = rNewPasswordObj;
    };
    /*继承自showResult*/
    log.updatePassword.prototype = new showResult();
    log.updatePassword.prototype.updatePass = function(){
        var _t = this;
        $(".login_form").removeClass("login_form_w");
        $(".login_make").remove();
        var oldPass = _t.op.val().trim();
        var newPass = _t.np.val().trim();
        var newPassR = _t.rnp.val().trim();
        if(oldPass === ""){
            _t.showMessage("请输入原始密码", false, _t.op);
            return;
        }
        if(newPass.length < 6){
            _t.showMessage("密码至少6位", false, _t.np);
            return;
        }
        if(newPassR !== newPass){
            _t.showMessage("两次密码不一致", false, _t.rnp);
            return;
        }
        lib.ajx(lib.getReq().ser + "member/updatePass.action", {oldPass: oldPass, newPass: newPass}, function(data){
            if(data.infocode === "0"){
                alert(data.info);
                if(lib.getUrlParam("ly") === "1"){
                    location.href = "/buyer/login/dlzc.html";
                    return;
                }
                location.href = "/login/denglu.html";
            }else if(data.infocode === "4"){
                _t.showMessage(data.info, false, this.op);
            }else{
                _t.showMessage(data.info, false);
            }
        }, errorFn);
    };

    /*当获取焦点是的操作*/
    var foucs = function(){
        $(".login_form input").on("focus", function(){
            $(this).next(".login_make").remove();
            if($(".login_make").length <= 0){
                $(".login_form").removeClass("login_form_w");
            }
        });
    };
    foucs();

    /*请求失败是的提示*/
    var errorFn = function(e){
        new showResult().showMessage("系统繁忙", false);
    };
    if(document.body.clientHeight <= 372){
        $(".login_auto").css({'top':0,"margin-top": '50px'});
    }
    return log;
});



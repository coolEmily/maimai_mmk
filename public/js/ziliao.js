require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    $(function(){
        var info={};
        $.extend(info,{
            init:function(){
                var _t=this;
                _t.storage=window.sessionStorage?window.sessionStorage:"";
                _t.payType=lib.checkWeiXin()?18:17;//17--支付宝；18--微信

                //邀请链接中的参数
                _t.directId=common.tools.getUrlParam("directId")?common.tools.getUrlParam("directId"):1;
                _t.upgradeTypeId=common.tools.getUrlParam("upgradeTypeId")?common.tools.getUrlParam("upgradeTypeId"):0;

                _t.getNotPayUpgradeOrder();

                _t.allInfoUrl=reqUrl.ser+"member/completeInfo.action";//整体信息提交
                _t.realNameUrl=reqUrl.ser+"member/getRealnameByMemberId.action";//真实姓名
                _t.photoUrl=reqUrl.ser+"member/getSimpleInfo.action";//头像信息
                _t.updateUrl=reqUrl.ser+"member/makeUpgradeOrder.action";//会员升级接口

                _t.parameterObj={};//提交信息时参数集

                _t.realNamePhoto();//真实姓名获取
                _t.sumbitAllInfo();//整体信息提交

                //通过支付类型，判断支付借口
                if(_t.payType==17){
                    _t.payFunUrl=reqUrl.ser+"/pay/alipay.action";
                }else if(_t.payType==18){
                    _t.payFunUrl="https://open.weixin.qq.com/connect/oauth2/authorize";
                }

                //判断手机是否绑定
                if(_t.storage.bindPhone){
                    $("#phoneli input").val(_t.storage.bindPhone);
                    $("#phoneli .bindbtn").html("已绑定").css("color","#999");
                }else{
                    $("#bindbtn").on("tap",function(){
                        location="/login/bangding.html?num="+$(this).prev("input").val()+"&backUrl="+common.tools.getBackUrl();
                    });
                }
            },
            getNotPayUpgradeOrder: function(){
                var _t=this;
                common.js.ajx(reqUrl.ser+"member/getNotPayUpgradeOrder.action", {}, function(data){
                    if(data.infocode === "0"){
                        _t.payFun(data.info.orderId);
                    }
                });

            },
            sumbitAllInfo:function(){
                var _t=this;
                var payButton=$("#payButton"),
                    errorInfo=$("#error_info");

                payButton.on("click",function(){
                    var weixin=$("#weixin").val(),
                        password=$("#password").val(),
                        confirmPass=$("#confirmPass").val(),
                        realName=$("#real_name").val();

                    if(!_t.storage.bindPhone){
                        errorInfo.html("请先绑定手机号码");
                    }else if(weixin==="" || password==="" || confirmPass===""){
                        errorInfo.html("请填写完整信息");
                    }else if(password.length<6 || password.length>15){
                        errorInfo.html("请填写正确的密码6-15个字符");
                    }else if(password!=confirmPass){
                        errorInfo.html("密码和确认密码不一致");
                    }else{
                        _t.parameterObj={
                            directId:_t.directId,//推荐人id
                            weixin:weixin,
                            pass:password,
                            realName:realName
                        };
                        submitFun();
                    }
                });

                //向后台提交信息
                function submitFun(){
                    common.js.ajx(_t.allInfoUrl,_t.parameterObj,function(data){
                        if(data.infocode==="0"){
                            /*alert("注册成功！");*/
                            _t.updateFun();//会员升级接口
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("提交信息失败");
                    });
                }
            },
            //会员升级
            updateFun:function(){
                var _t=this;
                common.js.ajx(_t.updateUrl,{payTypeId:_t.payType,upgradeTypeId:_t.upgradeTypeId},function(data){
                    if(data.infocode==="0"){
                        _t.payFun(data.info.orderId);//得到升级订单id，调取支付接口
                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("会员升级失败");
                });
            },
            //支付
            payFun:function(orderId){
                var _t=this;
                if(_t.payType==17){
                    common.js.ajx(_t.payFunUrl,{orderId:orderId,originType:1},function(data){
                        if(data.infocode==="0"){
                            location=data.info;
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("支付失败");
                    });
                }else if(_t.payType==18){
                    var wechatStr=_t.payFunUrl+"?appid=" + lib.getReq().appid + "&redirect_uri="+lib.getReq().ser+"pay/wxPay.action&response_type=code&scope=snsapi_base&state="+orderId+"#wechat_redirect";
                    // if((window.location.href).indexOf("m.maimaicn.com") === -1){
                    //     //线下链接勿改
                    //     wechatStr=_t.payFunUrl+"?appid=wx19a29141ad9f0609&redirect_uri=http://mmkyf.maim9.com/mmjmanager/pay/wxPay.action/&response_type=code&scope=snsapi_base&state="+orderId+"#wechat_redirect";
                    // }
                    location=wechatStr;
                }
            },
            realNamePhoto:function(){
                var _t=this;
                var realNameBox=$("#recommend_name");
                common.js.ajx(_t.realNameUrl,{memberId:_t.directId},function(data){
                    if(data.infocode==="0"){
                        realNameBox.html(data.info);
                    }else{
                        alert(data.info);
                    }
                },function(){
                    alert("获取推荐人姓名失败！");
                });

                if(_t.payType==18){//微信下获取头像信息

                    common.js.ajx(_t.photoUrl,{},function(data){
                        if(data.infocode==="0"){
                            $("#nick_name").parent().show();
                            $("#watch_photo").attr("src",reqUrl.imgPath+data.info.headPic);
                            $("#nick_name").html(data.info.nickname);
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("获取头像信息失败");
                    });
                }

            }
        });
        info.init();
    });
});
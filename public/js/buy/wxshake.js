require.config({baseUrl: 'http://m.maimaicn.com/js/lib', urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    var reqUrl = lib.getReq(), wxshake = {}, baseTask = null;
    $(function () {
        $.extend(wxshake, {
            activeTVId: lib.getUrlParam("acId") || $('#active_id').val(),
            init: function () {
                if (!lib.checkWeiXin()) {
                    document.getElementById("div_subscribe_area").style.display = "none";
                    $(".main").css("height", "100%");
                    if (lib.getUrlParam("isApp")) {
                        window.appHideEle(1);
                    }
                    if (window.isApp === 0) {
                        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + lib.getReq().appid +
                            '&redirect_uri='+lib.getReq().ser+'member/wxAccredit.action' +
                            '&response_type=code&scope=snsapi_userinfo' +
                            '&state=http://m.maimaicn.com' + location.pathname+"#wechat_redirect";
                        return;
                    }
                }
                this.initInterface();
                this.bindEvent();
            },
            initInterface: function () {
                var _w = this;
                lib.ajx(lib.getReq().ser + "activeTV/getFristImgAndTime.action", {activeTVId: this.activeTVId}, function (data) {
                    document.title = data.info.activeName;
                    $(".back").html(data.info.activeName);
                    if ($.cookie("maimaicn_s_id")) {
                        if (data.info.memberId && $.cookie("maimaicn_s_id") !== data.info.memberId) {
                            document.cookie = "maimaicn_s_id=" + data.info.memberId;
                        }
                    } else {
                        if (data.info.memberId) {
                            document.cookie = "maimaicn_s_id=" + data.info.memberId;
                        } else {
                            document.cookie = "maimaicn_s_id=1";
                        }
                    }
                    $(".main").css("background", "url(\"" + reqUrl.imgPath + data.info.activeFirstImg + "\") no-repeat 0 0/100% 100%");
                    clearInterval(baseTask);
                    if (data.infocode === "1") {
                        setBgAndEndTime(data.info);
                    } else if (data.infocode === "2") {
                        $("#timeBox").html("活动已结束");
                        $("#activePerson").html("参与人数&#58;0人");
                    } else if (data.infocode === "0" || data.infocode === "3") {
                        alert("出错啦！错误码：" + data.infocode);
                    }
                    if (lib.checkWeiXin()) {
                        shaketv.subscribe({
                            appid: data.info.wxNumber,
                            selector: "#div_subscribe_area",
                            type: 1
                        }, function (returnData) {
                            // 一键关注bar消失后会调用回调函数，在此处理bar消失后带来的样式问题
                            console.log(JSON.stringify(returnData));
                            $(".main").css("height", "100%");
                        });
                    }
                }, function () {
                    alert("网络异常！");
                });

                var timeDifference = function (time_parameter, nowtime) {
                    var timeVal = (new Date(Date.parse(time_parameter.replace(/-/g, "/"))).getTime()) - (new Date(Date.parse(nowtime.replace(/-/g, "/"))).getTime());
                    return timeVal;
                };

                var setBgAndEndTime = function (obj) {
                    var start_timeVal = timeDifference(obj.startTime, obj.nowTime);
                    var end_timeVal = timeDifference(obj.endTime, obj.nowTime);

                    var hh = mm = ss = 0;
                    var timeStr = "";
                    var countDownTime = function (type, timeVal) {
                        hh = parseInt(timeVal / 1000 / 60 / 60 / 24 * 24, 10);
                        mm = parseInt(timeVal / 1000 / 60 % 60, 10);
                        ss = parseInt(timeVal / 1000 % 60, 10);
                        timeStr = (type === "start" ? "距离开始" : "距离结束");
                        timeStr += "&nbsp;<span><i>" + (hh < 10 ? ("0" + hh) : hh) + "</i>&#58;";
                        timeStr += "<i>" + (mm < 10 ? ("0" + mm) : mm) + "</i>&#58;";
                        timeStr += "<i>" + (ss < 10 ? ("0" + ss) : ss) + "</i><span>";
                        $("#timeBox").html(timeStr);
                    };

                    var timeInterval = null;
                    var setCountDownTime = function (countDownType, timeVal) {
                        timeInterval = setInterval(function () {
                            if (timeVal <= 0) {
                                _w.initInterface();
                                clearInterval(timeInterval);
                                return;
                            }
                            countDownTime(countDownType, (timeVal -= 1000));
                        }, 1000);
                        _w.personNum(obj.baseNum);
                    };
                    if (start_timeVal > 0) {
                        setCountDownTime("start", start_timeVal);
                    } else if (start_timeVal <= 0 && end_timeVal > 0) {
                        setCountDownTime("end", end_timeVal);
                    }
                }
            },
            bindEvent: function () {
                var _w = this;
                document.getElementById("activeBtn").addEventListener("touchstart", function () {
                    _czc.push(["_trackEvent", "首页", "立即参与", "/", 1, "activeBtn"]);
                    location.href = "http://m.maimaicn.com/buyer/wxshake_main.html?active_id=" + _w.activeTVId;
                });

                window.onorientationchange = function () {
                    switch (window.orientation) {
                        case -90:
                        case 90:
                            alert("请用竖屏浏览页面");
                            break;
                    }
                }
            },
            personNum: function (baseNum) {
                var personNum = 0;
                var fun = function () {
                    personNum = (baseNum + lib.getRandom(baseNum));
                    personNum = (personNum >= 100000000 ? (personNum / 100000000).toFixed(2) + "亿人" : (personNum >= 100000 ? (personNum / 10000).toFixed(0) + "&nbsp;" + (personNum % 10000) : personNum) + "人");
                    $("#activePerson").html("参与人数&#58;" + personNum + "");
                };
                fun();
                baseTask = setInterval(fun, 3000);
            }
        });
        wxshake.init();
    });
});
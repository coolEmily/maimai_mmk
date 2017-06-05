require.config({baseUrl: '/js/lib', urlArgs: "v0.0.2"});
require(['zepto', 'lib', 'shake', 'wxReg'], function ($, lib, shakes, wxReg) {
    lib = new lib();
    var reqUrl = lib.getReq(), shakeObj = {};
    var isCanShake = false;
    var draw_prompt = null;
    var winning_prompt = null;
    var user_province = "";
    var flag = true;
    var prizeObj = null;
    var baseTask = null;
    $(function () {
        $.extend(shakeObj, {
            activeTVId: lib.getUrlParam("acId") || lib.getUrlParam("active_id"),
            activeTVPlanId: 0,
            url: window.location.href.indexOf("?") > 0 ? (window.location.href.substring(0, window.location.href.indexOf("?"))) : window.location.href,
            memberId: $.cookie("member_memberId"),
            popularize_memberId: 0,
            giftList: null,
            prize: null,
            init: function () {
                this.initInterface();
                this.wxConfig();
                this.bindEvent();
            },
            initInterface: function () {
                var _w = this;
                // 加载底图和活动时间
                lib.ajx(reqUrl.ser + "activeTV/getActiveInfo.action", {activeTVId: _w.activeTVId}, function (data) {
                    $(".container").css("background", "url(\"" + reqUrl.imgPath + data.info.activeImg + "\") no-repeat 0 0/100% 100%");
                    document.title = data.info.activeName;
                    $(".back").html(data.info.activeName);
                    clearInterval(baseTask); // 清除参与人数的定时任务
                    // 是微信浏览器，则微信注册登陆
                    if (lib.checkWeiXin() && !$.cookie("member_memberId")) {
                        wxReg.reg(data.info.memberId, '0', _w.activeTVId, "snsapi_userinfo");
                    } else {
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
                        if (data.infocode === "1") {
                            _w.activeTVPlanId = data.info.activeTVPlanId;
                            _w.popularize_memberId = data.info.memberId;
                            _w.backFunc();
                            setBgAndEndTime(data.info); // 设置倒计时
                            _w.initCrewList(); // 中奖人员名单列表
                        } else if (data.infocode === "2") {
                            isCanShake = false;
                            $(".active-time>div").html("<span>活动已结束</span>");
                            $(".active-time>span").html("参与人数&#58;0人");
                        } else if (data.infocode === "0" || data.infocode === "3") {
                            _w.alertPrompt("出错啦！");
                        }
                    }
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });

                var timeDifference = function (time_parameter, nowtime) {
                    var timeVal = (new Date(Date.parse(time_parameter.replace(/-/g, "/"))).getTime()) - (new Date(Date.parse(nowtime.replace(/-/g, "/"))).getTime());
                    return timeVal;
                };

                var setBgAndEndTime = function (obj) {
                    // 时间差计算
                    var start_timeVal = timeDifference(obj.startTime, obj.nowTime);
                    var end_timeVal = timeDifference(obj.endTime, obj.nowTime);
                    // 倒计时输出语句格式转化
                    var hh = mm = ss = 0;
                    var timeStr = "";
                    var countDownTime = function (type, timeVal) {
                        hh = parseInt(timeVal / 1000 / 60 / 60 / 24 * 24, 10);
                        mm = parseInt(timeVal / 1000 / 60 % 60, 10);
                        ss = parseInt(timeVal / 1000 % 60, 10);
                        timeStr = (type === "start" ? "<span>距离开始</span>" : "<span>距离结束</span>");
                        timeStr += "<span><i>" + (hh < 10 ? ("0" + hh) : hh) + "</i>&#58;";
                        timeStr += "<i>" + (mm < 10 ? ("0" + mm) : mm) + "</i>&#58;";
                        timeStr += "<i>" + (ss < 10 ? ("0" + ss) : ss) + "</i></span>";
                        $(".active-time > div").html(timeStr);
                    };

                    var timeInterval = null;
                    var setCountDownTime = function (boolSwitch, countDownType, timeVal) {
                        isCanShake = boolSwitch;
                        timeInterval = setInterval(function () {
                            if (timeVal <= 0) {
                                _w.initInterface();
                                clearInterval(timeInterval);
                                return;
                            }
                            countDownTime(countDownType, (timeVal -= 1000));
                        }, 1000);
                    };

                    if (start_timeVal > 0) {
                        setCountDownTime(false, "start", start_timeVal); // 未开始
                    } else if (start_timeVal <= 0 && end_timeVal > 0) {
                        setCountDownTime(true, "end", end_timeVal); // 已开始未结束
                        _w.personNum(obj.baseNum);
                    }
                }
            },
            initCrewList: function () {
                var _w = this;
                lib.ajx(reqUrl.ser + "activeTV/getGiftList.action", {activeTVPlanId: this.activeTVPlanId}, function (data) {
                    if (data.infocode === "1") {
                        _w.alertPrompt("出错啦！");
                        return;
                    } else if (data.infocode === "0" && data.info.length > 0) {
                        _w.giftList = data.info;
                        _w.giftList.sort(function () {
                            return 0.5 - Math.random()
                        });
                        _w.fixedData();
                        joinCrewData(_w.giftList);
                    }
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });

                var joinCrewData = function (persons) {
                    var i = 0;
                    var copyStr = "";
                    var liStr = "";
                    var crewDivStr = "<ul>";
                    for (; i < persons.length;) {
                        liStr += "<li><img class='head-img' src='" + reqUrl.imgPath + persons[i].imgUrl + "'>";
                        liStr += "<div class='group-right'><div class='name-draw-info'><span>" + persons[i].memberName + "</span>";
                        liStr += "<span>" + persons[i].provinceName + "&nbsp;&nbsp;" + persons[i].cityName + "</span></div>";
                        liStr += "<div class='address-time'><span>" + persons[i].giftName + "</span><span>刚刚</span></div></div></li>";
                        if (i === 2) {
                            copyStr += liStr;
                        }
                        i++;
                    }
                    liStr += copyStr;
                    crewDivStr += (liStr + "</ul>");
                    $(".scroll_box").html(crewDivStr);
                    $(".scroll").scrollTop($(".scroll_box").height());
                    setInterval(Marquee, 50);
                }
                var Marquee = function () {
                    var copyHt = ($(".scroll_box").height() * 0.04);
                    if ($(".scroll").scrollTop() < copyHt) {
                        $(".scroll").scrollTop($(".scroll_box").height());
                    } else {
                        $(".scroll").scrollTop($(".scroll").scrollTop() - 1);
                    }
                }
            },
            fixedData: function () {
                var _w = this;
                var fixedDefault = function () {
                    var obj = null;
                    if (flag) {
                        obj = _w.giftList[Math.floor(Math.random() * _w.giftList.length)];
                    } else {
                        obj = prizeObj;
                        flag = true;
                    }
                    var infoDivStr = "<img class=\"img_box\" src='" + reqUrl.imgPath + obj.imgUrl + "'>";
                    infoDivStr += "<div class=\"win_info\">";
                    infoDivStr += "<span class=\"user_info\">" + obj.memberName + "<em>" + obj.provinceName + obj.cityName + "</em></span>";
                    infoDivStr += "<span class=\"goods_info\">" + obj.giftName + "</span></div>";
                    if (obj.giftName.indexOf("红包") > 0) {
                        infoDivStr += "<img id='winer-img' src='/images/buy/shake_red_envelope.png' style='bottom: 5px'>";
                    } else if (obj.giftName.indexOf("金豆") > 0) {
                        infoDivStr += "<img id='winer-img' src='/images/buy/shake_fortunella_venosa.png' style='bottom: 10px'>";
                    } else {
                        infoDivStr += "<img id='winer-img' src='/images/buy/shake_gift.png' style='bottom: 2px;width: 15%;'>";
                    }
                    $('#drawInfoBar').html(infoDivStr).show().removeClass().addClass('fadeInRightBig animated');
                    setTimeout(function () {
                        $('#drawInfoBar').removeClass().addClass('fadeOutLeftBig animated');
                    }, 3000);
                }
                fixedDefault();
                $('body').on("webkitAnimationEnd", "#drawInfoBar", function (e) {
                    if (e.animationName == "fadeOutLeftBig") {
                        fixedDefault();
                    }
                });
            },
            wxConfig: function () {
                var _w = this;
                lib.ajx(reqUrl.ser + "/wxjssdk/getSignature.action", {url: this.url}, function (data) {
                    if (data.infocode === "0") {
                        setConfig(data.info);
                    } else {
                        _w.alertPrompt("微信config获取异常！");
                        isCanShake = false;
                    }
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });

                var setConfig = function (visaInfo) {
                    wx.config({
                        debug: false,// 开启调试模式。
                        appId: visaInfo.appId,// 必填，公众号的唯一标识
                        timestamp: visaInfo.timestamp,// 必填，生成签名的时间戳
                        nonceStr: visaInfo.noncestr,// 必填，生成签名的随机串
                        signature: visaInfo.signature,// 必填，签名，见附录1
                        jsApiList: [
                            'addCard'
                        ]
                    });

                    wx.ready(function () {
                        draw_prompt = document.getElementById('audio');
                        winning_prompt = document.getElementById("warn_tone");
                        draw_prompt.play();
                        draw_prompt.pause();
                        winning_prompt.play();
                        winning_prompt.pause();
                    });
                }
            },
            bindEvent: function () {
                // 继续摇一摇
                document.getElementById("ontinuec_active").addEventListener("touchstart", function () {
                    $("#dailog_box").hide();
                    $("#dailog_title").hide();
                    isCanShake = true;
                });
                window.onorientationchange = function () {
                    switch (window.orientation) {
                        case -90:
                        case 90:
                            alert("请用竖屏浏览页面");
                            break;
                    }
                }
                window.addEventListener("shake", this.shake_listener, false);
            },
            shake_listener: function () {
                var _w = shakeObj;
                if (!isCanShake) return;
                isCanShake = false;
                try {
                    // 是否是APP
                    if (window.isApp !== 0) {
                        if (lib.checkAndroid()) {
                            push.pushViewController("摇奖音频");
                        } else if (lib.checkIos()) {
                            window.location.href = "pss://playShakeSound";
                        }
                        setTimeout(function () {
                            _czc.push(["_trackEvent", "活动页", "摇一摇", "/", 1, "main"]);
                            _w.selectedPrize();
                        }, 1000);
                    } else {
                        draw_prompt.play();
                        draw_prompt.onended = function () {
                            _czc.push(["_trackEvent", "活动页", "摇一摇", "/", 1, "main"]);
                            _w.selectedPrize();
                        };
                    }
                } catch (error) {
                }
            },
            showLayer: function () {
                var _w = this;
                var prize = _w.prize;
                // 奖品内容
                var className = (prize.itemType <= 1 || prize.itemType === 4 || prize.itemType === 5) ? "gift_card" : (prize.itemType === 2 ? "red_envelope" : "fortunella_venosa");
                var imgName = (prize.itemType <= 1 || prize.itemType === 4 || prize.itemType === 5) ? "shake_winning_gift" : (prize.itemType === 2 ? "shake_winning_hb" : "shake_winning_jd");
                var goodsDivStr = "<div class='" + className + "'>";
                goodsDivStr += "<a id='close_btn'></a>";
                goodsDivStr += "<div class='winning_info'>";
                goodsDivStr += "<img src='/images/buy/" + imgName + ".png'>";
                if (prize.itemType <= 1 || prize.itemType === 4 || prize.itemType === 5) {
                    goodsDivStr += "<span>" + prize.itemName + "</span>";
                }
                goodsDivStr += "</div>";
                if (prize.itemType === 2 || prize.itemType === 3) {
                    goodsDivStr += "<div class='prize_name'><span>" + prize.itemName + "</span></div>";
                }
                goodsDivStr += "<div class='btn_box'>";
                goodsDivStr += "<a id='onReceive' data-type='" + prize.itemType + "' data-url='" + prize.linkUrl + "'></a>";
                goodsDivStr += "<img src='/images/buy/shake_winning_foot.png'>";
                goodsDivStr += "</div>";
                goodsDivStr += "</div>";
                // 显示遮罩
                $("#dailog_box").show();
                $("#dailog_context").html(goodsDivStr).show();

                // 奖品展示层——事件
                _w.showLayerEvent();
            },
            showLayerEvent: function () {
                var _w = this;
                // 关闭事件
                document.getElementById("close_btn").addEventListener("click", function () {
                    _w.hideLayer();
                    isCanShake = true;
                    _czc.push(["_trackEvent", "中奖页", "关闭", "中奖提示页", 1, "close_btn"]);
                });

                // 领取奖品事件
                var isCanTouch = true;
                document.getElementById("onReceive").addEventListener("click", function () {
                    if (!isCanTouch) return;
                    isCanTouch = false;
                    _czc.push(["_trackEvent", "中奖页", "立即领取", "中奖提示页", 1, "onReceive"]);
                    if (_w.prize.itemType === 0) {
                        _w.getWxCardExt(_w.prize); // 微信卡券
                        _w.acceptRecord();
                        _w.hideLayer();
                        isCanShake = true;
                    } else if (_w.prize.itemType === 1) {
                        location.href = _w.prize.linkUrl; // 活动页
                        _w.acceptRecord();
                        _w.hideLayer();
                        isCanShake = true;
                    } else {
                        // 判断用户是否注册了
                        if ($.cookie("member_loginName") && ($.cookie("member_loginName").length === 11)) {
                            if (_w.prize.itemType === 2 || _w.prize.itemType === 3) {
                                _w.prize.itemType === 2 ? _w.receiveHB() : _w.receiveJD(); // 红包或金豆
                                _w.acceptRecord();
                                _w.hideLayer();
                            } else if (_w.prize.itemType === 4) {
                                location.href = "/buyer/home/mycards_show.html?id=" + _w.prize.itemId; // 买买卡券
                                _w.acceptRecord();
                                _w.hideLayer();
                                isCanShake = true;
                            } else if (_w.prize.itemType === 5) {
                                location.href = "/buyer/home/tihuoka.html?rcNo=" + _w.prize.realCardNo + "&pass=" + _w.prize.password; // 提货卡
                                _w.acceptRecord();
                                _w.hideLayer();
                                isCanShake = true;
                            }
                        } else {
                            location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl() + "&shakeTv=1&prize=" + JSON.stringify(_w.prize);
                            isCanTouch = true;
                        }
                    }
                });
            },
            hideLayer: function () {
                $("#dailog_box").hide();
                $("#dailog_context").hide();
                $("#dailog_context").html("");
            },
            selectedPrize: function () {
                var _w = this;
                lib.ajx(lib.getReq().ser + "/member/getWXProvince.action", {}, function (data) {
                    if (data.infocode === "0") {
                        user_province = data.info;
                    }
                    drawLottery();
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });

                var drawLottery = function () {
                    lib.ajx(lib.getReq().ser + "/activeTV/drawLottery.action", {
                        activeTVPlanId: _w.activeTVPlanId,
                        memberId: _w.memberId,
                        districtLimit: user_province
                    }, function (data) {
                        if (data.infocode === "3") {
                            _w.prize = data.info;
                            _w.showLayer();
                            try {
                                // 是否是APP
                                if (window.isApp !== 0) {
                                    if (lib.checkAndroid()) {
                                        push.pushViewController("中奖音频");
                                    } else if (lib.checkIos()) {
                                        window.location.href = "pss://playShakeSound";
                                    }
                                } else {
                                    winning_prompt.play();
                                }
                            } catch (error) {
                            }
                        } else if (data.infocode === "5") {
                            var thanks_tips = ['姿势摆的好，就能中大奖', '别灰心，继续加油！', '可能是姿势不对哦~', '加油~好运马上就来', '换个姿势，再来一次！', '再来一次，大奖在等你哦！'];
                            var number = lib.getRandom(thanks_tips.length - 1);
                            _w.alertPrompt(thanks_tips[number]);
                            isCanShake = true;
                        } else {
                            _w.alertPrompt("出错啦！参数为:" + data.infocode);
                        }
                    }, function () {
                        _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                    });
                }
            },
            addCard: function (cardExtInfo, dataInfo) {
                var _w = this;
                wx.addCard({
                    cardList: [{
                        cardId: dataInfo.itemId, // 卡券ID
                        cardExt: cardExtInfo
                    }],
                    success: function () {
                        _w.insertFixed();
                        _w.alertPrompt("已添加至您的卡包啦~");
                    }
                });
            },
            getWxCardExt: function (dataInfo) {
                var _w = this;
                lib.ajx(lib.getReq().ser + "/wxjssdk/getWXCardExt.action", {cardId: dataInfo.itemId}, function (data) {
                    if (data.infocode === "0") {
                        _w.addCard(JSON.stringify(data.info), dataInfo);
                    } else {
                        _w.alertPrompt("cardExt获取异常！");
                    }
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });
            },
            receiveJD: function () {
                var _w = this;
                lib.ajx(lib.getReq().ser + "virtualMoney/drawVirtualMoney.action", {virtualMoneyTypeId: _w.prize.itemId}, function (data) {
                    if (data.infocode === "0") {
                        _w.prizeUse();
                    } else {
                        _w.alertPrompt(data.info);
                        isCanShake = true;
                    }
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });
            },
            receiveHB: function () {
                var _w = this;
                lib.ajx(lib.getReq().ser + "redPacket/takeRedPacket.action", {
                    redPacketTypeId: _w.prize.itemId,
                    issueMemberId: _w.popularize_memberId
                }, function (data) {
                    if (data.infocode === "0") {
                        _w.prizeUse();
                    } else {
                        _w.alertPrompt(data.info)
                        isCanShake = true;
                    }
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });
            },
            prizeUse: function () {
                $("#dailog_box").show();
                $("#dailog_title").show();
                var _w = this;
                document.getElementById("employ").addEventListener("touchstart", function () {
                    if (_w.prize.itemType === 2) {
                        // 红包商城
                        location.href = "http://m.maimaicn.com/buyer/hongbaoshangpin.html";
                    } else if (_w.prize.itemType === 3) {
                        // 金豆兑换专区
                        location.href = "http://m.maimaicn.com/buyer/bank/exchange_zone.html";
                    }
                    setTimeout(function () {
                        $("#dailog_box").hide();
                        $("#dailog_title").hide();
                    }, 1000);
                    isCanShake = true;
                });
                this.insertFixed();
            },
            insertFixed: function () {
                var _w = this;
                var prize = _w.prize;
                prizeObj = {
                    imgUrl: $.cookie("member_headPic"),
                    memberName: $.cookie("member_nickname"),
                    provinceName: user_province,
                    cityName: "",
                    giftName: prize.itemName
                };
                flag = false;
            },
            alertPrompt: function (alertStr) {
                $("#fixedTitle").html(alertStr);
                $("#fixedTitle").show();
                $("#fixedTitle").removeClass().addClass('fadeInDown animated');
                setTimeout(function () {
                    $("#fixedTitle").removeClass().addClass('fadeOutUp animated');
                }, 1000);
            },
            personNum: function (baseNum) {
                var personNumber = 0;
                var fun = function () {
                    personNumber = (baseNum + lib.getRandom(baseNum));
                    personNumber = (personNumber >= 100000000 ? (personNumber / 100000000).toFixed(2) + "亿人" : (personNumber >= 100000 ? (personNumber / 10000).toFixed(0) + "&nbsp;" + (personNumber % 10000) : personNumber) + "人");
                    $(".active-time > span").html("参与人数&#58;" + personNumber + "");
                }
                fun();
                baseTask = setInterval(fun, 3000);
            },
            acceptRecord: function () {
                var _w = this;
                lib.ajx(lib.getReq().ser + "activeTV/changeMemberGiftNum.action", {
                    activeTVPlanItemId: _w.prize.activeTVPlanItemId,
                    memberId: _w.memberId,
                    activeTVGetGiftLogId: _w.prize.activeTVGetGiftLogId
                }, function (data) {
                    if (data.infocode === "0") _w.insertFixed();
                }, function () {
                    _w.alertPrompt("网络堵塞啦~ 刷新一下试试吧");
                });
            },
            backFunc: function () {
                var _w = this;
                if (lib.getUrlParam("shakeTv") && $.cookie("member_memberId") && $.cookie("member_loginName") && ($.cookie("member_loginName").length === 11)) {
                    var msg = sessionStorage.getItem("ALREADYRECEIVED");
                    if (!msg) {
                        sessionStorage.setItem("ALREADYRECEIVED", true);
                        _w.prize = JSON.parse(lib.getUrlParam("prize"));
                        _w.acceptRecord();
                        if (_w.prize.itemType === 2 || _w.prize.itemType === 3) {
                            _w.prize.itemType === 2 ? _w.receiveHB() : _w.receiveJD();
                        } else if (_w.prize.itemType === 4) {
                            location.href = "/buyer/home/mycards_show.html?id=" + _w.prize.itemId;
                        } else if (_w.prize.itemType === 5) {
                            location.href = "/buyer/home/tihuoka.html?rcNo=" + _w.prize.realCardNo + "&pass=" + _w.prize.password; // 提货卡
                        }
                    }
                }
            }
        });
        shakeObj.init();
    });
});
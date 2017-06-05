/**
 * Created by yehongfeng on 17/5/25.
 */
require.config({baseUrl: '/js/lib', urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    var reqUrl = lib.getReq(), object = {};
    $(function () {
        $.extend(object, {
            typeId: lib.getUrlParam("activeMissVoteTypeId"),
            playerId: lib.getUrlParam("activeMissVotePlayerId"),
            player: null,
            picPageNumber: 0,
            videoPageNumber: 0,
            init: function () {
                this.initPlayerInfo();
                this.bindEvent();
            },
            initPlayerInfo: function () {
                var _pi = this;
                lib.ajx(reqUrl.ser + " /missVote/getPlayerDetailInfo.action", {
                    activeMissVoteTypeId: _pi.typeId,
                    activeMissVotePlayerId: _pi.playerId
                }, function (data) {
                    if (data.infocode === "0") {
                        var info = data.info;
                        _pi.player = info.player;
                        $("nav > samp").html(info.player.playerName + "的美丽档案");
                        $("#cover_photo").css("background","url('" + reqUrl.imgPath + info.player.imgUrlDetail + "') no-repeat center center / contain");
                        $("#flower_number").html(info.player.flowerNum);
                        $("#vote_number").html(info.player.votedNum);
                        $("#player_name").html("姓名：" + info.player.playerName);
                        $("#nationality").html("国籍：" + info.player.nationality);
                        $("#weight").html("体重：" + info.player.weight + "kg");
                        $("#age").html("年龄：" + info.player.age);
                        $("#player_height").html("身高：" + info.player.height + "cm");
                        $("#threeDimensional").html("三围：" + info.player.threeDimensional);
                        $("#introduce div.info").html(info.player.remark);
                        // 高度/行高=文本行数
                        var rowNum = Math.round($("#introduce div.info").height() / parseFloat($("#introduce div.info").css('line-height')));
                        if (rowNum > 3) {
                            $("#introduce div.info").height(".6rem");
                            $("#show_more").show();
                        }
                        // 相册
                        if (info.imgUrlList.length > 0) {
                            _pi.picPageNumber = Math.round((info.imgUrlList.length / 5));
                            if (info.imgUrlList.length > 5) {
                                $("#photo_next").show();
                            }
                            var playerImg = "";
                            $.each(info.imgUrlList,function (key, value) {
                                playerImg += "<img src='" + reqUrl.imgPath + value.imgUrl + "'>";
                            });
                            $(".photo div.info .smalpic .smallbox").html(playerImg);
                        }
                        // 视频
                        if (info.vedioUrlList.length > 0) {

                            _pi.videoPageNumber = parseInt(info.vedioUrlList.length / 3) + ((info.vedioUrlList.length % 3) > 0 ? 1 : 0);
                            if (info.vedioUrlList.length > 3) {
                                $("#video_next").show();
                            }
                            $(".player_info_box .video").show();
                            var playerVideo = "";
                            $.each(info.vedioUrlList,function (key, value) {
                                playerVideo += "<div class='video_box' style='background:url(" + reqUrl.imgPath + value.imgUrl + ") no-repeat center / contain'><div><span></span></div></div>";
                            });
                            $(".video div.info .smalpic .smallbox").html(playerVideo);
                        }
                        // 合作伙伴
                        if (info.trademarkList.length > 0) {
                            var partnersLogo = "";
                            $.each(info.trademarkList, function (key, value) {
                                partnersLogo += "<li><img src='" + reqUrl.imgPath + value.imgUrl + "'></li>";
                            });
                            $(".partners div.info ul").html(partnersLogo);
                        }
                    } else {
                        console.log(data.info);
                    }
                }, function () {
                    alert("网络异常！");
                });
            },
            checkActionFun: function (type) {
                var _pi = this;
                lib.ajx(reqUrl.ser + " /missVote/clickVote.action", {
                    activeMissVoteTypeId: _pi.typeId,
                    activeMissVotePlayerId: _pi.playerId
                }, function (data) {
                    if (data.infocode === "0") {
                        if (type === "flower") {
                            location.href = "/tv/sl_buy_flower.html?activeMissVoteTypeId=" + _pi.typeId + "&activeMissVotePlayerId=" + _pi.playerId;
                        } else if (type === "vote") {
                            var number = _pi.player.sortValue >= 10 ? _pi.player.sortValue : ("0" + _pi.player.sortValue);
                            $(".b2 > span").html("确认为" + number + _pi.player.playerName + "投上一票？");
                            $(".dialog_box").show();
                            $(".b2").show();
                        }
                    } else {
                        if (data.infocode === "1") {
                            $(".dialog_box").show();
                            $(".b1").show();
                        } else {
                            alert(data.info);
                        }
                    }
                }, function () {
                    alert("网络异常！");
                });
            },
            bindEvent: function () {
                var _pi = this;
                var loginState = true;
                // 禁止滚屏操作
                var banTouchMove = function () {
                    $(document).on("touchmove",function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                };
                // 送花
                $("#flower_btn").on("click", function () {
                    loginState = checkedLogin();
                    if (loginState) {
                        _pi.checkActionFun("flower");
                    }
                });
                // 投票
                $("#vote_btn").on("click", function () {
                    loginState = checkedLogin();
                    if (loginState) {
                        _pi.checkActionFun("vote");
                    }
                });
                // 取消登陆
                $("#close_btn").on("click", function () {
                    hiedDialog();
                });
                // 去登陆
                $("#go_login").on("click", function () {
                    location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                });

                var checkedLogin = function () {
                    if (!$.cookie("member_loginName") || ($.cookie("member_loginName").length !== 11)) {
                        $(".dialog_box").show();
                        banTouchMove();
                        $(".b1").show();
                        return false;
                    } else {
                        return true;
                    }
                };

                // 介绍-更多
                $("#show_more").on("click", function () {
                    $("#introduce div.info").height("");
                    $("#show_more").hide();
                });

                // 取消投票
                $("#cancel").on("click", function () {
                    hiedDialog();
                });

                // 投票
                $("#confirm").on("click", function () {
                    lib.ajx(reqUrl.ser + " /missVote/confirmVote.action", {activeMissVotePlayerId: _pi.playerId}, function (data) {
                        if (data.infocode === "0") {
                            hiedDialog();
                            setTimeout(function () {
                                $(".b4").show();
                                $(".b4").addClass("fadeInDown animated");
                            }, 350);
                            $("#vote_number").html(_pi.player.votedNum + 1);
                            setTimeout(function () {
                                $(".b4").addClass("fadeOutUp animated");
                                setTimeout(function () {
                                    $(".b4").hide();
                                }, 300);
                            }, 2350);
                        } else {
                            console.log(data.info);
                            if (data.info === "2") {
                                $(".dialog_box").show();
                                banTouchMove();
                                $(".b3").show();
                            }
                        }
                    }, function () {
                        alert("网络异常！");
                    });
                });
                $("#determine").on('click', function () {
                    hiedDialog();
                });
                // 相册往前
                var picPage = 1, on_width = 3.2;
                $("#photo_pre").on("click", function () {
                    if (picPage === 1) {
                        return;
                    }
                    var pre_width = (Number($(".photo .smallbox").css("left").substring(0, $(".photo .smallbox").css("left").indexOf("r")))) + on_width;
                    $(".photo .smallbox").animate({left: pre_width + "rem"}, "slow");
                    picPage--;
                    if (picPage === 1) {
                        $("#photo_pre").hide();
                    }
                    if (picPage !== _pi.picPageNumber) {
                        $("#photo_next").show();
                    }
                });
                // 相册往后
                $("#photo_next").on("click", function () {
                    if (picPage >= _pi.picPageNumber) {
                        return;
                    }
                    var next_width = (Number($(".photo .smallbox").css("left").substring(0, $(".photo .smallbox").css("left").indexOf("r")))) - on_width;
                    $(".photo .smallbox").animate({left: next_width + "rem"}, "slow");
                    picPage++;
                    if (picPage !== 1) {
                        $("#photo_pre").show();
                    }
                    if (picPage === _pi.picPageNumber) {
                        $("#photo_next").hide();
                    }
                });
                // 视频前一页
                var videoPage = 1;
                $("#video_pre").on("click", function () {
                    if (videoPage === 1) {
                        return;
                    }
                    var pre_width = (Number($(".video .smallbox").css("left").substring(0, $(".video .smallbox").css("left").indexOf("r")))) + on_width;
                    $(".video .smallbox").animate({left: pre_width + "rem"}, "slow");
                    videoPage--;
                    if (videoPage === 1) {
                        $("#video_pre").hide();
                    }
                    if (videoPage !== _pi.videoPageNumber) {
                        $("#video_next").show();
                    }
                });
                // 视频后一页
                $("#video_next").on("click", function () {
                    if (videoPage >= _pi.videoPageNumber) {
                        return;
                    }
                    var next_width = (Number($(".video .smallbox").css("left").substring(0, $(".video .smallbox").css("left").indexOf("r")))) - on_width;
                    $(".video .smallbox").animate({left: next_width + "rem"}, "slow");
                    videoPage++;
                    if (videoPage !== 1) {
                        $("#video_pre").show();
                    }
                    if (videoPage === _pi.videoPageNumber) {
                        $("#video_next").hide();
                    }
                });

                var hiedDialog = function () {
                    $(".dialog_box").hide();
                    $(document).off('touchmove');
                    if ($(".b1").css("display") === "block") {
                        $(".b1").hide();
                    } else if ($(".b2").css("display") === "block") {
                        $(".b2").hide();
                    } else if ($(".b3").css("display") === "block") {
                        $(".b3").hide();
                    }
                };

            }
        });
        object.init();
    });
});
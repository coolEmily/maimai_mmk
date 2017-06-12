/**
 * Created by MMai9 on 2017/6/2.
 */
requirejs.config({baseUrl: '/js/lib', urlArgs: "v0.0.1", paths: {swiper: "swiper.min"}});
require(['zepto', 'lib', 'swiper'], function ($, lib, swiper) {
    lib = new lib();
    var reqUrl = lib.getReq().ser;
    var imgUrl = lib.getReq().imgPath;
    var activeMissVoteTypeId = lib.getUrlParam("activeId") ? lib.getUrlParam("activeId") : 1,
        activeMissVotePlayerId;
    var page = 1, rows = 6;
    var flag = false;
    var fg = true;
    var credit = {};

    $.extend(credit, {
        rollSwiper: function () {
            var _t = this;
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                speed: 800,
                autoplay: 9000,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                onInit: function (swiper) {
                    var len = $('.swiper-slide').length;
                    if (len <= 3) {
                        swiper.stopAutoplay();
                        swiper.lockSwipeToNext();
                        swiper.lockSwipeToPrev();
                    }
                },
                onTouchStart: function (swiper) {
                    _t.sTP = swiper.translate;
                },
                onTouchEnd: function (swiper) {
                    _t.eTP = swiper.translate;
                }
            })
        },
        getBanner: function (data) {
            data.forEach(function (val, ind) {
                var h = '';
                h += '<a class="swiper-slide" href="' + reqUrl + val.linkUrl + '"><img src="' + imgUrl + val.imgUrl + '"></a>'
                $('.swiper-wrapper').append(h);
            })
            this.rollSwiper();

        },
        paging: function () {
            var _t = this;
            $(window).on("scroll", function () {
                if (flag && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
                    _t.getpages(++page);
                }
            })
        },
        //分页
        getpages: function (pages) {
            var that = this;
            if (!fg) {
                return;
            }
            flag = false;
            lib.ajx(reqUrl + '/missVote/getMissVoteInfo.action', {
                activeMissVoteTypeId: activeMissVoteTypeId,
                page: pages,
                rows: rows
            }, function (data) {
                if (data.infocode == 0) {
                    //轮播
                    if (data.info.bannerList.length != 0 && page == 1) {
                        that.getBanner(data.info.bannerList);
                    }
                    //list
                    if (data.info.playerList.length != 0) {
                        if (data.info.playerList.length >= 6) {
                            flag = true;
                        } else {
                            fg = false;
                        }
                        that.getList(data.info.playerList);
                    }
                } else {
                    alert(data.info);
                }
            }, function (err) {
                if (err) {
                    alert(err)
                }
            })
        },
        getList: function (data) {
            var h = '';
            $.each(data, function (k, v) {
                h += '<div class="player"><a class="player_detail" data-typeid=' + v.activeMissVoteTypeId + ' data-playerid=' + v.activeMissVotePlayerId + '><img src="' + imgUrl + v.imgUrl + '" alt=""></a><div class="player_name"><span>' + v.sortValue + '</span><span>' + v.playerName + '</span></div><div class="butt"><a href="javascript:;" class="flower_btn"><img src="/images/tv/miss_world/shouye_flower@2x.png" alt=""></a><a href="javascript:;" class="vote_btn"><img src="/images/tv/miss_world/shouye_ticket@2x.png" alt=""></a></div><div class="qizi"><img src="/images/tv/miss_world/qizi_icon.png" alt=""><i>' + v.ranking + '</i></div><div class="give_flower"><img src="/images/tv/miss_world/_fresh-flower.png" alt=""><i>' + v.flowerNum + '</i></div><div class="toupiao"><img src="/images/tv/miss_world/writ.png" alt=""><i>' + v.votedNum + '</i></div></div>'
            });
            $('.lists').append(h);

        },
        bindEvent: function () {
            var _t = this;
            var loginState = true;
            //绑定跳转链接和参数
            $('.navs_icon > a').each(function () {
                $(this).attr('href', $(this).attr('href') + '?activeMissVoteTypeId=' + activeMissVoteTypeId)
            });
            //判断是否是app进入的商城并绑定跳转链接；
            $('.sl_shop').on('click',function(){
                var forwardUrl = "/buyer/shouye.html?sId=" + ($.cookie('maimaicn_s_id') ? $.cookie('maimaicn_s_id') : '1') + "&activeId=" + lib.getUrlParam('activeId');
                if(window.isApp !== 0){
                    $('.sl_shop').attr('href','');
                    push.pushViewController("回首页");
                }else{
                    $('.sl_shop').attr('href', forwardUrl);
                }
            })
            //检验登陆状态
            var checkedLogin = function () {
                if (!$.cookie("member_loginName") || ($.cookie("member_loginName").length !== 11)) {
                    $('.dialog_box').show();
                    $('.b1').show();
                    return false;
                } else {
                    return true;
                }
            };
            //点击图片跳转详情页
            $('body').on("tap",'.player_detail',function () {
                loginState = checkedLogin();
                if (loginState) {
                    activeMissVoteTypeId = $(this).attr('data-typeid');
                    activeMissVotePlayerId = $(this).attr('data-playerid');
                    location.href = '/tv/sl_player_info.html?activeMissVoteTypeId=' + activeMissVoteTypeId + '&activeMissVotePlayerId=' + activeMissVotePlayerId;
                }
            });
            // 送花
            $('body').on("tap", '.flower_btn',function () {
                loginState = checkedLogin();
                if (loginState) {
                    var typeid, playerid;
                    typeid = $(this).parents('.player').children('a:first-child').attr('data-typeid');
                    playerid = $(this).parents('.player').children('a:first-child').attr('data-playerid');
                    location.href = '/tv/sl_buy_flower.html?activeMissVoteTypeId=' + typeid + '&activeMissVotePlayerId=' + playerid;
                }
            });
            // 投票
            $("body").on("touchstart",'.vote_btn',function (e) {
                $(".confirm").data("cf", $(e.target));
                loginState = checkedLogin();
                var typeid, playerid;
                typeid = $(this).parents('.player').children('a:first-child').attr('data-typeid');
                playerid = $(this).parents('.player').children('a:first-child').attr('data-playerid');
                activeMissVotePlayerId=playerid;
                if (loginState) {
                    lib.ajx(reqUrl + '/missVote/clickVote.action', {
                        activeMissVoteTypeId: typeid,
                        activeMissVotePlayerId: playerid
                    }, function (data) {
                        if (data.infocode == "0") {
                            var number = data.info.sortValue >= 10 ? data.info.sortValue : ("0" + data.info.sortValue);
                            $(".b2 > span").text("确认为" + number + data.info.playerName + "投上一票？");
                            $(".dialog_box").fadeIn(250);
                            $('.b2').fadeIn(250);
                        } else if (data.infocode == "1") {
                            $('.dialog_box').fadeIn(250);
                            $('.b1').fadeIn(250);
                        } else {
                            alert(data.info);
                        }
                    }, function (err) {
                        if (err) {
                            alert(err)
                        }
                    })
                }
            });
            // 取消登陆
            $('body').on("tap",'.close_btn',function () {
                $('.dialog_box').fadeOut();
                $('.b1').fadeOut();
            });
            // 去登陆
            $('body').on("tap", '.go_login',function () {
                location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
            });

            // 取消投票按钮
            $('body').on("tap", '.cancel',function () {
                $(".dialog_box").fadeOut(250);
                $(".b2").fadeOut(250);
            });

            // 确认投票按钮
            $('.confirm').on('touchstart',function(){
                var that = $(this).data("cf").parents(".player").find(".toupiao>i");
                $(".dialog_box").hide();
                $('.b2').fadeOut(200);
                lib.ajx(reqUrl + " /missVote/confirmVote.action", {activeMissVotePlayerId: activeMissVotePlayerId}, function (data) {
                    if (data.infocode == "0") {
                        that.text(Number(that.text()) + 1);
                        $('.b4').fadeIn(200, function () {
                            setTimeout(function () {
                                $('.b4').fadeOut(200)
                            }, 500)
                        });
                    } else if (data.infocode == "2") {
                        // 每人每天只能一票
                        $(".dialog_box").fadeIn(250);
                        $(".b3").fadeIn(250);
                        $('#determine').on("tap", function () {
                            $(".dialog_box").fadeOut(250);
                            $(".b3").fadeOut(250);
                        });
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("网络异常！");
                });
            })

        }

    });

    credit.getpages(page);
    credit.bindEvent();
    credit.paging();

});

requirejs.config({baseUrl: '/js/lib', urlArgs: "v0.0.1", paths: {swiper: "swiper.min"}});
require(['zepto', 'lib', 'swiper', 'wxshare', 'wapshare'], function ($, lib, swiper, wxshare, wapshare) {
    lib = new lib();
    wapshare = new wapshare();
    var reqUrl = lib.getReq().ser;
    var imgUrl = lib.getReq().imgPath;
    var pageT = $('#credit-body').attr('pageT'); // 0 聚合页  1 列表页  2 详情页
    var page = 1, rows = 10;
    var flag = true;
    var mId = lib.getUrlParam('mId') ? lib.getUrlParam('mId') : $.cookie('member_memberId');
    var isLogin = $.cookie('member_loginName');
    var type = lib.getUrlParam('type');
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
        getBanner: function (param) {
            var _t = this;
            var h = '';
            lib.ajx(reqUrl + 'adPlan/getAdPlanInfo.action', {adLocationId: param}, function (data) {
                if (data.infocode == 0) {
                    $.each(data.info.List_adSource, function (k, v) {
                        h += '<a class="swiper-slide" href="' + v.adLink + '"><img src="' + imgUrl + v.pictureUrl + '"></a>'
                    });
                    $('.swiper-wrapper').append(h);
                    _t.rollSwiper();
                } else {
                    alert('请求数据失败')
                }
            }, function (err) {
                if (err) {
                    alert(err)
                }
            });
        },
        bindEvent: function () {
            var _t = this;
            $(document).on("click", ".applynow", function () {
                location.href = "/buyer/bank/credit_detail.html?creditCardTypeId=" + $(this).attr("data-creditCardTypeId")
            });
            $(window).on("scroll", function () {
                if (flag && pageT != 0 && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
                    _t.getList();
                }
            })
        },
        getList: function () {
            var h = '';
            if (type == 0) {
                $("#title").text("办理银行信用卡");
                $("#nav-title").append("办理银行信用卡");
            } else if (type == 1) {
                $("#title").text("办理银行信用卡+首刷");
                $("#nav-title").append("办理银行信用卡+首刷");
            }
            lib.ajx(reqUrl + '/cardType/getListInfo.action', {page: page, rows: rows, type: type}, function (data) {
                if (data.infocode == 0) {
                    if (data.info.list_cardType.length < rows) {
                        flag = false;
                    } else {
                        page++
                    }
                    $.each(data.info.list_cardType, function (k, v) {
                        h += '<div class="list clearfix" style="margin-top: 5px; margin-bottom: 0"><div class="card-pic"><img src="' + imgUrl + v.imgUrl + '"></div>' + '<div class="mes" style="position: relative;"><p class="font-1">' + v.creditCardName + '</p><p class="font-2">' + v.remark + '</p><p class="font-3"><span>' + v.vedioNum + '</span>人已申请</p></div> <a class="applynow" style="position: absolute" data-creditCardTypeId="' + v.creditCardTypeId + '" href="javascript:;"><img src="/images/credit_card_06.png"></a></div>'
                    });
                    $('#list').append(h);
                } else {
                    alert('请求数据失败')
                }
            }, function (err) {
                if (err) {
                    alert(err)
                }
            })
        },
        cardList: function () {
            var _t = this;
            _t.getBanner(186);
            _t.bindEvent();
            getList();
            function getList() {
                var str1 = str2 = "";
                lib.ajx(reqUrl + '/cardType/getTotalInfo.action', {page: page, rows: rows}, function (data) {
                    if (data.infocode == 0) {
                        if (data.info.list_cardType_onlyCard) {
                            $(".c-title1").show();
                            $.each(data.info.list_cardType_onlyCard, function (k, v) {
                                str1 += '<div class="list clearfix" ><div class="card-pic"><img src="' + imgUrl + v.imgUrl + '"></div>' + '<div class="mes" style="position: relative;"><p class="font-1">' + v.creditCardName + '</p><p class="font-2">' + v.remark + '</p><p class="font-3"><span>' + v.vedioNum + '</span>人已申请</p></div> <a class="applynow" style="position: absolute" data-creditCardTypeId="' + v.creditCardTypeId + '" href="javascript:;"><img src="/images/credit_card_06.png"></a></div>'
                            });
                            $('#list1').append(str1);
                        }
                        if (data.info.list_cardType_cardAndfirst) {
                            $(".c-title2").show();
                            $.each(data.info.list_cardType_cardAndfirst, function (k, v) {
                                str2 += '<div class="list clearfix" ><div class="card-pic"><img src="' + imgUrl + v.imgUrl + '"></div>' + '<div class="mes" style="position: relative;"><p class="font-1">' + v.creditCardName + '</p><p class="font-2">' + v.remark + '</p><p class="font-3"><span>' + v.vedioNum + '</span>人已申请</p></div> <a class="applynow" style="position: absolute" data-creditCardTypeId="' + v.creditCardTypeId + '" href="javascript:;"><img src="/images/credit_card_06.png"></a></div>'
                            });
                            $('#list2').append(str2);
                        }
                    } else {
                        alert('请求数据失败')
                    }
                }, function (err) {
                    if (err) {
                        alert(err)
                    }
                })
            }
        },
        cardListMain: function () {
            var _t = this;
            var paramsObj = {0: '184', 1: '185'};
            _t.getBanner(paramsObj[type]);
            _t.getList();
            _t.bindEvent();
        },
        cardDetail: function () {
            var _t = this;
            bindEvent();
            function bindEvent() {
                $(".share-btn").on("click", function () {
                    var cardId=lib.getUrlParam("creditCardTypeId");
                    var cardName=$(this).attr("title");
                    var desc=$(this).attr("desc");
                    var imgUrl=$(this).attr("data-url");
                    var param=cardId+","+cardName+","+desc+","+imgUrl;
                    if(window.isApp !== 0){
                        push.pushViewController(param);
                        return;
                    }
                    if (isLogin) {
                        initWXShare(this);
                        $(".fixed").show();
                    } else {
                        alert('请先登录');
                        location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                    }
                });
                $(".fixed").on("click", function (e) {
                    if (lib.checkWeiXin())
                        $(".fixed").css('display', 'none');
                    else {
                        var target = e.srcElement ? e.srcElement : e.target;
                        if (target.className.indexOf("fixed") != -1) {
                            $(".fixed").hide();
                        }
                    }
                });
                $(".apply-btn").on("click", function () {
                    $(".masking").show()
                });
                $(".masking").on("click", function (e) {
                    var target = e.srcElement ? e.srcElement : e.target;
                    if (target.className.indexOf("commit-btn") == -1) {
                        $(".masking").hide();
                    }
                });
                $(".commit-btn").on("click", function () {
                    $(".masking").hide();
                    if (isLogin) {
                        window.location.href = $(".apply-btn").attr("data-url")
                    } else {
                        location.href = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                    }
                });
            }

            //配置分享
            function initWXShare(obj) {
                var params = JSON.parse($(obj).attr("params")).creditCardTypeId;
                if (lib.checkWeiXin()) {
                    dataForWeixin.imgUrl = $(obj).attr("data-url");
                    dataForWeixin.title = $(obj).attr("title");
                    dataForWeixin.desc = $(obj).attr("desc");
                    dataForWeixin.link = location.protocol + '//' + location.host + '/buyer/bank/credit_detail.html?creditCardTypeId=' + params + '&mId=' + mId;
                    wxshare();
                } else {
                    wapshare.setting.pic = $(obj).attr("data-url");
                    wapshare.setting.title = $(obj).attr("title");
                    wapshare.setting.summary = $(obj).attr("desc");
                    wapshare.setting.url = location.protocol + '//' + location.host + '/buyer/bank/credit_detail.html?creditCardTypeId=' + params + '&mId=' + mId;
                    wapshare.loadScript();
                }
            }
        }
    });
    if (pageT == 0) {
        credit.cardList();
    } else if (pageT == 1) {
        credit.cardListMain();
    } else if (pageT == 2) {
        credit.cardDetail();
    }
});

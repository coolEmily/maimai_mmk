require.config({baseUrl: '/js/lib', urlArgs: "v0.0.1", paths: {swiper: "swiper.min"}});
require(['zepto', 'lib', 'visitor-logs', "wxReg", "swiper", "rememberThePosition"], function ($, lib, vl, wxReg, _, remosition) {
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), indexObj = {};
    $.extend(indexObj, {
        memberId: common.tools.getUrlParam('sId') || $.cookie("maimaicn_s_id"),
        slider1: "",
        slider: "",
        nav: "",
        timer: null,
        clientWidth: document.documentElement.clientWidth > 750 ? 750 : (document.documentElement.clientWidth < 320 ? 320 : document.documentElement.clientWidth),
        imgH: (document.documentElement.clientWidth * 0.8 * 0.495) + "px",
        maxImgH: (750 * 0.8 * 0.495) + "px",
        imgHt: (document.documentElement.clientWidth * 0.33) + "px",
        maxImgHt: (750 * 0.33) + "px",
        init: function () {
            if (!this.memberId) {
                location = "/buyer/shouye.html?sId=1";
            }
            lib.fixedFooter(0);//底部导航            
            var Oheight = $("body").height() / 2;
            this.scroll(Oheight);
            this.click();//回到顶部
            this.bindEvent();
            this.getAllInfo();

            if (window.sessionStorage && sessionStorage.mm_isApp === "NO") {
              $(".ui-app-hide").remove();
            }
            setTimeout(function () {
				$(".ui-app-hide").remove();
                sessionStorage.mm_isApp = "NO";
            }, 8000);
        },
        bindEvent: function () {
        	var _t = this;
            $(".ui-clsoe-d").on("tap", function () {
                $(this).parent().hide();
                if (window.sessionStorage) {
                    sessionStorage.mm_isApp = "NO";
                }
            });
            $(".ui-app-download").on("tap", function () {                
                common.js.ajx(reqUrl.ser + "/member/getMallDetailInfo.action", {memberId: _t.memberId}, function (data) {
                    if (data.infocode == 0) {
                        if (lib.checkIos()) {
                            location.href = data.info.iosAppDownUrl;
                        } else if (lib.checkAndroid()) {
                            location.href = data.info.androidDownUrl;
                        }
                    }else{
                    	alert(data.info);
                    }
                });
            });
        },
        click: function () {
            $.fn.scrollTo = function (options) {
                var defaults = {
                    toT: 0,    //滚动目标位置
                    durTime: 500,  //过渡动画时间
                    delay: 30,     //定时器时间
                    callback: null   //回调函数
                };
                var opts = $.extend(defaults, options),
                    timer = null,
                    _this = this,
                    curTop = _this.scrollTop(),//滚动条当前的位置
                    subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
                    index = 0,
                    dur = Math.round(opts.durTime / opts.delay),
                    smoothScroll = function (t) {
                        index++;
                        var per = Math.round(subTop / dur);
                        if (index >= dur) {
                            _this.scrollTop(t);
                            window.clearInterval(timer);
                            if (opts.callback && typeof opts.callback == 'function') {
                                opts.callback();
                            }
                            return;
                        } else {
                            _this.scrollTop(curTop + index * per);
                        }
                    };
                timer = window.setInterval(function () {
                    smoothScroll(opts.toT);
                }, opts.delay);
                return _this;
            };
            $("#return_top").on("click", function () {
                $("body").scrollTo({toT: 0});

            });
        },
        scroll: function (Oheight) {
            $(window).on("scroll", function () {
                if ($(this).scrollTop() > Oheight) {
                    $("#return_top").css({"opacity": 1});
                } else {
                    $("#return_top").css({"opacity": 0});
                }
            });
        },
        getAllInfo: function () {
            var _t = this;
            common.js.ajx(reqUrl.ser + "/mainPage/getHomePageInfo.action", {memberId: _t.memberId}, function (data) {
                var list = data.info.result;
                var flag = data.info.flag;
                if (data.infocode == 0) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].type == 1) {//搜索框
                            searchFun(i);
                        } else if (list[i].type == 2) {//banner图
                            lunboFun(i);
                        } else if (list[i].type == 3) {//频道
                            pingdaoFun(i);
                        } else if (list[i].type == 4) {//广告位
                            adverFun(i);
                        } else if (list[i].type == 5) {//推荐位楼层标题
                            titleFun(i);
                        } else if (list[i].type == 6) {//推荐位一行1一个
                            goodsListOne(i);
                        } else if (list[i].type == 7) {//推荐位 一行2个
                            goodsListTwo(i);
                        } else if (list[i].type == 8) {//一行三个
                            goodsListThree(i);
                        } else if (list[i].type == 9) {//猜你喜欢列表
                            likeFun(i);
                        } else if (list[i].type == 10) {//闪购
                            purchase(i);
                        } else if (list[i].type == 11) {//品牌墙
                            logoFun(i);
                        }
                    }
                }
                function searchFun(index) {//搜索框
                    var h = "";
                    h += '<div class="qm_search clearfix">' +
                        '<div class="qm_search_list">' +
                        '<a href="/buyer/message/shouye.html"><img src="/images/new.png" /></a>' +
                        '</div>' +
                        '<div class="qm_search_left">' +
                        '<div class="qm_search_con">' +
                        '<a class="btn" href="/buyer/search.html"></a>' +
                        '<form action="javascript:return true" method="get" id="searchForm">' +
                        '<input type="text" class="txt" value="' + list[index].text + '" />' +
                        '</form> ' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $(".qm_center").append(h);
                    $(".qm_search_con .txt").off().on("tap", function () {
                        $(".qm_search_con .txt").val();
                        location = "/buyer/search.html";
                    });
                    $(".qm_search_con .btn").on("tap", function () {
                        location = list[index].linkUrl === "" ? '/buyer/search.html' : list[index].linkUrl;
                    });
                    sessionStorage.text = list[index].text;
                    sessionStorage.linkUrl = list[index].linkUrl;
                }

                function lunboFun(index) {//banner图
                    var h = "";
                    var timestamp = parseInt(Math.random() * 100000);
                    h += '<div class="swiper-wrapper1 swiper-container' + timestamp + '" style="position:relative; overflow: hidden;">' +
                        '<ul class="swiper-wrapper">';
                    $.each(list[index].bannerList, function (k, v) {
                        if (v.imgUrl) {
                            h += '<li class="swiper-slide"><a href="' + v.linkUrl + '"><img src="' + reqUrl.imgPath + v.imgUrl + '" /></a></li>';
                        }
                    });
                    h += '</ul> ' +
                        '<div class="swiper-pagination swiper-pag' + timestamp + '"></div>' +
                        '</div>';
                    $(".qm_center").append(h);
                    $(".swiper-wrapper1 img").css({
                        "height": (document.documentElement.clientWidth / 750 * 422) + "px",
                        "max-height": "422px"
                    });
                    $(".swiper-wrapper1").css({
                        "height": (document.documentElement.clientWidth / 750 * 422) + "px",
                        "max-height": "422px"
                    });
                    $(".swiper-slide").css({
                        "background-image": "url(/images/buy/banner_bg.jpg)",
                        "background-repeat": "no-repeat",
                        "background-size": "cover",
                        "height": (document.documentElement.clientWidth / 750 * 422) + "px",
                        "max-height": "422px",
                        "display": "inline-block"
                    });
                    _t.slider = new Swiper('.swiper-container' + timestamp, {
                        autoplay: 5000,
                        pagination: '.swiper-pag' + timestamp,
                        loop: true
                    })

                }

                function pingdaoFun(index) {//频道
                    var h = "";
                    var imgHt = _t.getImgH(132);
                    var timestamp = Date.parse(new Date());
                    h += '<div class="qm_nav">' +
                        '<div class="swiper-container" id="swiper_nav' + timestamp + '">' +
                        '<div class="swiper-wrapper">';
                    $.each(list[index].channelList, function (k, v) {
                        if (v.imgAUrl) {
                            h += '<div class="swiper-slide"><a href="' + v.linkUrl + '"><img src="' + reqUrl.imgPath + v.imgAUrl + '" style="height:' + imgHt + ';max-height:120px"/></a></div>';
                        }
                    });
                    //console.log($(".swiper-slide").css('width'));
                    h += '<div class="swiper-slide"><a href="/buyer/compile.html?sId=' + _t.memberId + '&flag=' + flag + '" ><img src="/images/all_icon.png" style="height:' + imgHt + ';max-height:120px" /></a></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $(".qm_center").append(h);
                    _t.nav = new Swiper('#swiper_nav' + timestamp, {
                        slidesPerView: 'auto',
                        freeMode: true,
                        slidesPerView: 5.4
                    });
                }

                function adverFun(index) {//广告位
                    var mainPageSourceId = list[index].mainPageSourceId;
                    var readNum = list[index].readNum;
                    var showType = list[index].showType;
                    switch (showType) {
                        case 1://左上角标题，广告图片占据整屏
                            var h = '';
                            var imgHt = _t.getImgH(328);
                            h += '<div class="adver">' +
                                '<a href="' + list[index].linkUrl + '" class="SourceNum"  data-id="' + mainPageSourceId + '">' +
                                '<div class="title">' + list[index].title + '</div>' +
                                '<div><img src="' + reqUrl.imgPath + list[index].imgAUrl + '" style="height:' + imgHt + ';max-height:' + imgHt + '" /></div>' +
                                '<div class="con clearfix"><span>' + list[index].adName + '</span><span class="ll">' + readNum + '次浏览</span></div>' +
                                '</a>' +
                                '</div>';
                            $(".qm_center").append(h);
                            addSourceNum();
                            break;
                        case 2://左边是标题+文字描述 右边是图片
                            var h = '';
                            var imgHt = _t.getImgH(212);
                            h += '<div class="adver clearfix">' +
                                '<a href="' + list[index].linkUrl + '" class="SourceNum"  data-id="' + mainPageSourceId + '">' +
                                '<div class="adver_l"><img src="' + reqUrl.imgPath + list[index].imgAUrl + '" style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /></div>' +
                                '<div class="adver_r">' +
                                '<div class="title">' + list[index].title + '</div>' +
                                '<div class="con con1 clearfix">' +
                                '<span>' + list[index].adName + '</span><span class="ll">' + readNum + '次浏览</span>' +
                                '</div> ' +
                                '</div> ' +
                                '</div>' +
                                '</a>' +
                                '</div>';
                            $(".qm_center").append(h);
                            addSourceNum();
                            break;
                        case 3://左上是标题 2个图片在下
                            var h = '';
                            var imgHt = _t.getImgH(212);
                            h += '<div class="adver">' +
                                '<a href="' + list[index].linkUrl + '" class="SourceNum img_2"  data-id="' + mainPageSourceId + '">' +
                                '<div class="title">' + list[index].title + '</div>' +
                                '<div><img src="' + reqUrl.imgPath + list[index].imgAUrl + '" style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /><img src="' + reqUrl.imgPath + list[index].imgBUrl + '" style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /></div>' +
                                '<div class="con clearfix"><span>' + list[index].adName + '</span><span class="ll">' + readNum + '次浏览</span></div>' +
                                '</a>' +
                                '</div>';
                            $(".qm_center").append(h);
                            addSourceNum();
                            break;
                        case 4://左上是标题 3个图片在下
                            var h = '';
                            var imgHt = _t.getImgH(136);
                            h += '<div class="adver">' +
                                '<a href="' + list[index].linkUrl + '" class="SourceNum img_3"  data-id="' + mainPageSourceId + '">' +
                                '<div class="title">' + list[index].title + '</div>' +
                                '<div><img src="' + reqUrl.imgPath + list[index].imgAUrl + '" style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /><img src="' + reqUrl.imgPath + list[index].imgBUrl + '" style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /><img src="' + reqUrl.imgPath + list[index].imgCUrl + '" style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /><div>' +
                                '<div class="con clearfix"><span>' + list[index].adName + '</span><span class="ll">' + readNum + '次浏览</span></div>' +
                                '</a>' +
                                '</div>';
                            $(".qm_center").append(h);
                            addSourceNum();

                            break;
                    }

                    if (list[index].adName === "广告") {
                        $('.con span:first-child').attr('class', 'gg');
                    }

                    function addSourceNum() { //调取 广告浏览次数
                        $(".adver .SourceNum").off().one('tap', function () {
                            common.js.ajx(reqUrl.ser + "/mainPage/addSourceNum.action", {mainPageSourceId: $(this).attr("data-id")}, function (data) {
                                if (data.infocode === 0) {
                                    console.log("更新成功");
                                }
                            });
                        });
                    }
                }

                function titleFun(index) {//推荐位楼层标题
                    var sTime = list[index].endTime;
                    var h = "";
                    if (list[index].titleType == 1) {//推荐位标题
                        h += '<div class="titlefn"><a href="/buyer/goodslist.html?memberMainPageLocationId=' + list[index].memberMainPageLocationId + '&sId=' + _t.memberId + '&id=' + list[index].goodsClassId + '&lt=' + list[index].locationType + '&flag=' + flag + '"><img src="' + reqUrl.imgPath + list[index].imgUrl + '" /></a></div>';
                    } else if (list[index].titleType == 2) {//闪购活动标题
                        h += '<div class="titlefn">' +
                            '<a href="/buyer/flashshop.html?memberMainPageLocationId=' + list[index].memberMainPageLocationId + '&flashSaleId=' + list[index].flashSaleId + '&sId=' + _t.memberId + '&flag=' + flag + '">' +
                            '<img src="' + reqUrl.imgPath + list[index].imgUrl + '" />' +
                            '<div class="clock">' +
                            '<span>12</span>:<span>00</span>:<span>00</span>' +
                            '</div>' +
                            '</a>' +
                            '</div>';
                        countDown(sTime, ".clock");
                    } else if (list[index].titleType == 3) {//品牌墙标题
                        h += '<div class="titlefn"><a href="/buyer/brand.html?memberMainPageLocationId=' + list[index].memberMainPageLocationId + '&sId=' + _t.memberId + '&flag=' + flag + '"><img src="' + reqUrl.imgPath + list[index].imgUrl + '" /></a></div>';
                    } else {//空
                        h += '<div class="titlefn"><a href="#"><img src="' + reqUrl.imgPath + list[index].imgUrl + '" /></a></div>';
                    }
                    $(".qm_center").append(h);

                    function countDown(sTime, obj) {
                        var oDate = new Date(sTime.replace(/-/g, "/"));
                        var timer = null;
                        clearInterval(timer);
                        t();
                        timer = setInterval(function () {
                            t();
                        }, 1000);
                        function toDou(iNum) {
                            return iNum < 10 ? '0' + iNum : iNum;
                        }

                        function t() {
                            var t = oDate - new Date();
                            if (t <= 0) {
                                clearInterval(timer);
                                return;
                            }
                            var s = parseInt(t / 1000);
                            var h = parseInt(s / 3600);
                            s %= 3600;
                            var m = parseInt(s / 60);
                            s %= 60;
                            $(obj).html('<span>' + toDou(h) + '</span>:<span>' + toDou(m) + '</span>:<span>' + toDou(s) + '</span>');
                        }

                    }


                }

                function goodsListOne(index) {//一行1个
                    var h = "";
                    var imgHt = _t.getImgH(212);

                    h += '<div class="recommend clearfix">';
                    $.each(list[index].goodsList, function (k, v) {
                        if (v.mainPictureJPG) {
                            var PictureJPG = v.mainPicture1609 ? v.mainPicture1609 : v.mainPictureJPG;
                            h += '<div class="contant_1">' +
                                '<a href="/g?sId=' + _t.memberId + '&gId=' + v.goodsId + '">' +
                                '<div class="clearfix">' +
                                '<div class="con">' +
                                /*'<p class="brand"></p>'+  //品牌*/
                                '<p class="name">' + v.chName + '</p>' +
                                '<p class="money">￥<span><b>' + v.sellingPrice + '</b></span></p>' +
                                '<p class="reduce">' + (v.limitcoupon ? ('红包立减 ' + v.limitcoupon + '元') : '') + '</p>' +
                                '</div>' +
                                '<div class="goods"><img src="' + reqUrl.imgPath + PictureJPG + '" style="height:' + imgHt + ';max-height:' + imgHt + '" /></div>' +

                                '</div>     ' +
                                '</a>' +
                                '</div>  '
                        }
                    });
                    h += '</div>';
                    $(".qm_center").append(h);
                }

                function goodsListTwo(index) {//一行2个
                    var h = "";
                    var imgHt = _t.getImgH(212);
                    h += '<div class="recommend clearfix">' +
                        '<div class="contant_2">';
                    $.each(list[index].goodsList, function (k, v) {
                        if (v.mainPictureJPG) {
                            var PictureJPG = v.mainPicture1609 ? v.mainPicture1609 : v.mainPictureJPG;
                            h += '<a href="/g?sId=' + _t.memberId + '&gId=' + v.goodsId + '">' +
                                '<div class="goods"><img src="' + reqUrl.imgPath + PictureJPG + '" style="height:' + imgHt + ';max-height:' + imgHt + '" /></div>' +
                                /*'<p class="brand">溜溜梅</p>'+*/
                                '<p class="name">' + v.chName + '</p>' +
                                '<p class="money">￥<b>' + v.sellingPrice + '</b>' + (v.limitcoupon ? ('<span>红包立减 ' + v.limitcoupon + '元</span>') : '') + '</p>' +
                                '</a>';
                        }
                    });
                    h += '</div>';
                    '</div>';
                    $(".qm_center").append(h);
                }

                function goodsListThree(index) {//一行3个
                    var h = "";
                    var imgHt = _t.getImgH(136);
                    h += '<div class="recommend clearfix">' +
                        '<div class="contant_3">';
                    $.each(list[index].goodsList, function (k, v) {
                        if (v.mainPictureJPG) {
                            var PictureJPG = v.mainPicture1609 ? v.mainPicture1609 : v.mainPictureJPG;
                            h += '<a href="/g?sId=' + _t.memberId + '&gId=' + v.goodsId + '">' +
                                '<div class="goods"><img src="' + reqUrl.imgPath + PictureJPG + '" style="height:' + imgHt + ';max-height:' + imgHt + '" /></div>' +
                                /*'<p class="brand">溜溜梅</p>'+*/
                                '<p class="name">' + v.chName + '</p>' +
                                '<p class="money">￥<b>' + v.sellingPrice + '</b>元</span></p>' +
                                '<p class="reduce">' + (v.limitcoupon ? ('红包立减 <span>' + v.limitcoupon + '元</span>') : '') + '</p>' +
                                '</a>';
                        }
                    });
                    h += '</div>';
                    '</div>';
                    $(".qm_center").append(h);
                }

                function likeFun(index) {//猜你喜欢列表
                    var h = "";
                    h += '<div class="recommend clearfix">' +
                        '<div class="contant_2 contant_4">';
                    $.each(list[index].goodsList, function (k, v) {
                        if (v.mainPictureJPG) {
                            h += '<a href="/g?sId=' + _t.memberId + '&gId=' + v.goodsId + '">' +
                                '<div class="goods"><img src="' + reqUrl.imgPath + v.mainPictureJPG + '" style="height:' + _t.imgH + ';max-height:' + _t.maxImgH + '" /></div>' +
                                '<p class="name">' + v.chName + '</p>' +
                                '<p class="money">￥<b>' + v.sellingPrice + '</b><span>' + (v.limitcoupon ? ('红包立减 ' + v.limitcoupon + '元') : '' ) + '</span></p>' +
                                '</a>';
                        }
                    });

                    h += '</div>' +
                        '</div>';
                    $(".qm_center").append(h);
                }

                function purchase(index) {//闪购
                    var h = "";
                    var imgHt = _t.getImgH(190);
                    h += '<div class="recommend clearfix">' +
                        '<div class="contant_2">';
                    $.each(list[index].goodsList, function (k, v) {
                        if (v.mainPictureJPG) {
                            h += '<a href="/g?sId=' + _t.memberId + '&gId=' + v.goodsId + '">' +
                                '<div class="goods"><img src="' + reqUrl.imgPath + v.mainPictureJPG + '" style="height:' + imgHt + ';max-height:' + _t.maxImgH + '" /></div>' +
                                /*'<p class="brand">溜溜梅</p>'+*/
                                '<p class="name">' + v.chName + '</p>' +
                                '<p class="money">￥<b>' + v.sellingPrice + '</b></p>' +
                                '</a>';
                        }
                    });
                    h += '</div>' +
                        '</div>';
                    $(".qm_center").append(h);
                }

                function logoFun(index) {//品牌墙
                    var h = "";
                    var imgHt = _t.getImgH(136);
                    h += '<div class="recommend clearfix">' +
                        '<div class="logo_q clearfix">';
                    $.each(list[index].brandList, function (k, v) {
                        if (v.imgUrl) {
                            h += '<a href="' + v.linkUrl + '"><img src="' + reqUrl.imgPath + v.imgUrl + '"  style="height:' + imgHt + ';max-height:' + _t.maxImgHt + '" /></a>';
                        }
                    });
                    h += '</div>' +
                        '</div>';
                    $(".qm_center").append(h);
                }

            }, function (data) {
                console.log("失败");
            });
        },
        getImgH: function (h) {
            h = h || 180;
            var w = document.documentElement.clientWidth || document.body.clientWidth;
            w = w > 750 ? 750 : (w < 320 ? 320 : w);
            if (w % 2 != 0) {
                w = w - 1;
            }
            return Math.floor(w / 750 * h) + "px";
        },

    });
    indexObj.init();
});
define(function (require) {
    var $ = require('zepto');
    //cookie模块
    $.cookie = function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 60 * 60 * 1000)); //expires为1，就是一个小时， 为4 就是4个小时
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');

        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
    (function(){
      if(window.isApp !== 0 || (window.sessionStorage && window.sessionStorage.isApp !== "0")){
        $(".ui-app-show").show();
        $(".fixed_index").remove();
      }else
        $(".ui-app-hide").show();
    })();
    //判断浏览器版本
    var browser = {
        versions: function () {
            var ua = navigator.userAgent.toLowerCase();
            return {
                weixin: ua.indexOf('micromessenger') != -1,
                android: ua.indexOf('android') != -1,
                iPhone: ua.indexOf('iphone') != -1,
                iPad: ua.indexOf('ipad') != -1
            };
        }()
    };

    //绑定回退方法
    $("a[class*='_goback']").off().on("click", function () {
        if(history.state){
            window.history.back();
            window.history.back();
        }else{
            window.history.back();
        }

    });

    //延迟100ms加载第三方统计
    setTimeout(function () {
        //============================CNZZ=================================
        var element = document.createElement("script");
        element.src = 'http://w.cnzz.com/q_stat.php?id=1259476514&l=3';
        document.body.appendChild(element);
        //============================google-analytics=================================
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-91640568-1', 'auto');
        ga('send', 'pageview');
    }, 100);

    function lib() {
      var mId = this.getUrlParam("mId");
      var sId = this.getUrlParam("sId");
      if(mId){
          $.cookie("maimaicn_f_id", mId, {path:"/", domain: '.maimaicn.com',expires: new Date("2084-06-10T13:19:38.097Z")});
      }
      if(sId){
          $.cookie("maimaicn_s_id", sId, {path:"/", domain: '.maimaicn.com',expires: new Date("2084-06-10T13:19:38.097Z")});
      }else if(!$.cookie("maimaicn_s_id")){
          $.cookie("maimaicn_s_id", '1', {path:"/", domain: '.maimaicn.com',expires: new Date("2084-06-10T13:19:38.097Z")});
      }
    }

    lib.prototype = {
        //是否是线上
        getIsOnline: function () {
            return (location.href).indexOf("m.maimaicn.com") > -1 || (location.href).indexOf("wximg.gtimg.com") > -1;
        },
        //获取各个请求参数
        getReq: function () {
            var domain = "http://mmkyf.maimaicn.com/mmjmanager/";
            var appid = 'wx19a29141ad9f0609';
            if (this.getIsOnline()) {
                domain = 'http://api.maimaicn.com/mmjmanager/';
                appid = 'wxd7221902b2883fad';
            }
            var requestSer = new Array(domain, domain, domain, domain, domain);
            return {
                ser: requestSer[this.getRandom(4)],
                imgPath: "http://image.maimaicn.com/",
                image: "http://image.maimaicn.com:18888/",
                appid: appid
            };
        },
        getImgSize:function(imgUrl,type){
            if(imgUrl.indexOf("img")>-1){
                return imgUrl+'_'+type;
            }else{
                return imgUrl;
            }
        },
        //获取购物车数量
        getCartNum: function () {
            this.ajx(this.getReq().ser + 'shoppingCart/getCartNum.action', {}, function (data) {
                //console.log(data.info);
                if (data.infocode === '0') $("#cartNum").text(data.info);
            }, function () {
                console.log("数据请求失败");
            });
        },
        //返回max以内随机数
        getRandom: function (max) {
            return Math.floor(Math.random() * (max + 1));
        },
        //去左右两端空格
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        //取地址栏参数
        getUrlParam: function (param) {
            if ('backUrl' === param || 'payPath' === param) { /*解决backUrl&参数被过滤的问题*/
                return window.location.search.split(param + "=")[1];
            }
            var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            var reStr = (r !== null ? decodeURI(r[2]) : "");
            return reStr;
        },
        //取跳回地址
        getBackUrl: function () {
            var u = window.location.href;
            if (u.indexOf(".com") > -1 && u.indexOf(".com:") === -1) {
                return (u).substring((u).indexOf(".com") + 4);
            }
            return u;
        },
        //是否是移动设备
        checkMobile: function () {
            if (browser.versions.iPhone || browser.versions.iPad || browser.versions.android) {
                return true;
            }
            return false;
        },
        //是否是微信浏览器
        checkWeiXin: function () {
            if (browser.versions.weixin) {
                return true;
            }
            return false;
        },
        //是否是安卓设备
        checkAndroid: function () {
            if (browser.versions.android) {
                return true;
            }
            return false;
        },
        //是否是ios设备
        checkIos: function () {
            if (browser.versions.iPhone || browser.versions.iPad) {
                return true;
            }
            return false;
        },
        //返回顶部
        gotopFun: function () {
            var upBtn = $("#upBtn");
            $(window).scroll(function () {
                $(this).scrollTop() > 200 ? upBtn.show() : upBtn.hide();
            });
        },
        //ajax公用方法
        ajx: function (url, data, successfn, errorfn) {
            var _t = this;
            data = (data === null || data === "" || typeof(data) == "undefined") ? {"date": new Date().getTime()} : data;
            $.ajax({
                type: "get",
                //async: false,
                url: url,
                data: data,
                dataType: "jsonp",
                jsonp: "jsonpCallback",
                success: function (d) {
                    _t.offLoading();
                    successfn(d);
                },
                error: function (e) {
                    _t.offLoading();
                    errorfn(e);
                }
            });
        },
        //取mId公用方法
        getMid: function () {
            var mId = $.cookie('member_memberId');
            return mId === null ? 'mId=1' : 'mId=' + mId;
        },
        /*底部导航*/
        fixedFooter: function (index, flag) { //flag 存在且为true时 代表是后台
            var _t = this;
            var cartNum = $.cookie('cartNum');
            
            var footerStr = '<div class="fixed_wrap" id="fixed_wrap"><ul><li><div class="nav-class" go="/buyer/shouye"><span class="bgImg bgImg1"></span><span>首页</span></div></li><li><div class="nav-class" go="/buyer/fenlei"><span class="bgImg bgImg2"></span><span>分类</span></div></li><li><div class="nav-class" go="/buyer/gouwuche"><span class="bgImg bgImg3"><span class="cartNum"id="cartNum">' + cartNum + '</span></span><span>购物车</span></div></li><li><div class="nav-class" go="/buyer/home/huiyuanzx"><span class="bgImg bgImg4"></span><span>我的</span></div></li></ul></div>';
            if (flag)
                footerStr = '<div class="fixed_wrap fixed_wrap2" id="fixed_wrap"><ul> <li class="cur"> <div class="nav-class" go="/mjzhongxin"><span class="bgImg bgImg1"></span><span>首页</span></div> </li> <li class=""> <div class="nav-class" go="xiaoxi"><span class="bgImg bgImg2"></span><span>消息</span></div> </li> <li class=""> <div class="nav-class" go="/buyer/shouye"><span class="bgImg bgImg3"></span><span>店铺</span></div> </li> <li class=""> <div class="nav-class" go="/money/fanyong"><span class="bgImg bgImg4"></span><span>奖金</span></div> </li> </ul> </div>';
            $("body").append(footerStr);
            if (!cartNum || cartNum == 0) {
                $(".fixed_wrap .cartNum").hide();
            }
            $(".nav-class").on("click", function () {
                var p = $(this).parent();
                if (p.hasClass("cur") && p.index() <= 1) return;
                var page = $(this).attr("go");
                var mId = "mId=" + (_t.getUrlParam("mId") ? _t.getUrlParam("mId") : 1);
                if (flag) mId = _t.getMid();
                if(window.isApp !== 0 && page === "/mjzhongxin"){
                    push.pushViewController();
                    return;
                }
                if(flag){
                    window.location.href = page + ".html?" + mId;
                }else{
                    window.location.href = page + ".html";
                }
            });
            $("#fixed_wrap li").eq(index).addClass("cur").siblings().removeClass("cur");
            if (index == 3 && !flag) {//点进个人中心的时候，图标变为注销按钮，点注销退出，清空cookie
                $("#fixed_wrap li").eq(index).find("span:nth-child(2)").html("注销");
                $("#fixed_wrap li").eq(index).find("div").unbind("click");
                $("#fixed_wrap li").eq(index).click(function () {
                    _t.ajx(_t.getReq().ser + '/member/logout.action', {}, function (data) {
                        if (data.infocode === "0") {
                            window.location = "/buyer/login/dlzc.html";
                        }
                    }, function () {
                        alert("请求失败，请检查网络连接");
                    });
                });
            }
        },
        //loading图标
        onLoading: function () {
            if ($(".spinner").is(":hidden")) {
                $(".spinner").css("display", "block");
            }
        },
        offLoading: function () {
            $(".spinner").css("display", "none");
        }
    };
    return lib;
});
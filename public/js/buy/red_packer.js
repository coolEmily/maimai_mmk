require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "swiper.min",'visitor-logs'], function($, lib ,_,vl) {
    var lib = new lib(),
        reqUrl = lib.getReq().ser,
        imgUrl = lib.getReq().imgPath,
        rows=10,pid="",oobjj={"couponEsc":0},scrollTop1=0;
    var page=1,flag=true;
    var arr = {};
    var arrsesson=[];
    var redPack = {
        number: 1,
        noMore: false,
        memberId: lib.getUrlParam('mId') === '' ? '0' : lib.getUrlParam('mId'),
        rows: rows,
        //chushihua
        init: function () {
            var _t=this;
            var sid = $.cookie("maimaicn_s_id");
            $(".he_tilte").empty().text(sid == "425160" ? "天视商城" : "买买红包商城");
            this.shop_banner();
            //定位
            //判断是刷新还是跳转
            if(sessionStorage.getItem("mm_cp20160824")){
                if(sessionStorage.getItem("red_packer")){
                    var red_obj1=JSON.parse(sessionStorage.getItem("red_packer"));
                    for(var i in red_obj1){
                        if(i=="obz"){
                            oobjj=JSON.parse(red_obj1[i]);
                        }else if(i=="page1"){
                            page1= red_obj1[i];
                        }else if(i=="scrollTop1"){
                            scrollTop1=red_obj1[i];
                        }else if(i=="pid"){
                            pid=red_obj1[i];
                        }
                        _t.rows=page1*10;
                    }
                }
                _t.shop_show(1, pid, true,oobjj);
                var red_packer=JSON.stringify({'page1': 1, 'scrollTop1': $(window).scrollTop(),"pid":pid,"obz":JSON.stringify(oobjj)});
                sessionStorage.setItem("red_packer",red_packer);
            }else{
                _t.shop_show(1, pid, false,oobjj);
                var red_packer=JSON.stringify({'page1': 1, 'scrollTop1': $(window).scrollTop(),"pid":pid,"obz":JSON.stringify(oobjj)});
                sessionStorage.setItem("red_packer",red_packer);
            }

            //**************title**************************
            if(lib.getUrlParam('title')){
                var title=lib.getUrlParam("title");
                $(".he_tilte").text($.trim(title));
            }
            //********************************************
            this.nav_tap_click();
            this.selset_show();
            this.dropownD();
            this.sercher();
            this.returnTop();
            vl.setLog(window.location.href, 2);//会员访问日志
        },
        //回到顶部
        returnTop:function(){
            $.fn.scrollTo =function(options){
                var defaults = {
                    toT : 0,    //滚动目标位置
                    durTime : 500,  //过渡动画时间
                    delay : 30,     //定时器时间
                    callback:null   //回调函数
                };
                var opts = $.extend(defaults,options),
                    timer = null,
                    _this = this,
                    curTop = _this.scrollTop(),//滚动条当前的位置
                    subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
                    index = 0,
                    dur = Math.round(opts.durTime / opts.delay),
                    smoothScroll = function(t){
                        index++;
                        var per = Math.round(subTop/dur);
                        if(index >= dur){
                            _this.scrollTop(t);
                            window.clearInterval(timer);
                            if(opts.callback && typeof opts.callback == 'function'){
                                opts.callback();
                            }
                            return;
                        }else{
                            _this.scrollTop(curTop + index*per);
                        }
                    };
                timer = window.setInterval(function(){
                    smoothScroll(opts.toT);
                }, opts.delay);
                return _this;
            };
            // ****************
            $("#return_top").on("click",function(){
                $("body").scrollTo({toT:0});
            });
        },
        //节流
        throttle:function(func, wait, options) {
            /* options的默认值
             *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
             *  options.leading = true;
             * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
             *  options.trailing = true;
             * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
             */
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function() {
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var now = new Date().getTime()  ;
                if (!previous && options.leading === false) previous = now;
                // 计算剩余时间
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                // 当到达wait指定的时间间隔，则调用func函数
                // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
                if (remaining <= 0 || remaining > wait) {
                    // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    // options.trailing=true时，延时执行func函数
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        //选项卡展示
        selset_show: function () {
            var _t=this;
            lib.ajx(reqUrl + 'goodsClass/getGoodsClassInfoAll.action', {}, function (msg) {
                if (msg.infocode == "0") {
                    var data = msg.info.list_goodsClass;
                    var html = '<div class="t_box" data-vue="">全部商品</div>';
                    for (var i in data) {
                        html += '<div class="t_box" data-vue="' + data[i].classId + '">' + data[i].className + '</div>';
                    }
                    $(".s_con").html(html);
                }
            }, function () {
            });

            !function(){
                var flag=true;
                $(".s_title").click(function (e) {
                    e.stopPropagation();
                    if(flag){
                        $(".s_con").show(300);
                        flag=false;
                    }else{
                        $(".s_con").fadeOut(300);
                        flag=true;
                    }
                })
                $("#select").on("click",".s_con>div",function () {
                    $(window).off("scroll");
                    page=1;
                    _t.dropownD();
                    $(".s_title strong").text($(this).text());
                    $(".s_title strong").data({"vue":$(this).data("vue")});
                    $(this).css({"color":"#ff3c3c"}).siblings().css({"color":""});
                    //    *********************
                    var num= $(this).data("vue");
                    $("#article").empty();
                    var Zoid="";
                    var Zvlu="";
                    if(sessionStorage.getItem("red_packer")){
                        var obj=JSON.parse(JSON.parse(sessionStorage.getItem("red_packer"))["obz"]) || {};
                    }else{
                        var obj={};
                    }
                    $(".nav_con").each(function(){
                        if($(this).hasClass("active1")){
                            Zoid=1;
                            Zvlu=$(this).data("vue").toString();
                        }else if($(this).hasClass("active")){
                            Zoid=0;
                            Zvlu=$(this).data("vue").toString();
                        }
                    });
                    if(Zoid!=""){
                        obj[Zvlu]=Zoid;
                    }
                    var cont=$.trim($("#searchForm .txt").val());
                    obj["goodsKeywords"]=cont;
                    //*********************************************
                    _t.shop_show(1,num,false,obj);
                    var red_packer=JSON.stringify({'page1': 1, 'scrollTop1': $(window).scrollTop(),"pid":num,"obz":JSON.stringify(obj)});
                    sessionStorage.setItem("red_packer",red_packer);
                    $(".s_con").fadeOut(300);
                    flag=true;
                })
            }();
        },
        //展示层
        shop_show: function (opage, olimitcoupon,hs, obj) {
            var _t=this;
            var html="";
            var money="";
            hs?opage=1:opage=opage;
            //遍历对象
            var ajobj={
                page: opage,
                rows:_t.rows,
                limitcoupon: 1,
                pcId:olimitcoupon,
                infoId:56
            };
            for(var i in obj){
                ajobj[i]=obj[i];
            }
            lib.ajx(reqUrl + 'goodsBase/goodsBaseListByInfoId.action',ajobj, function (data) {
                //*****************************
                if (data.infocode == "0") {
                    var msg =  data.info.list_goodsBase;
                    for (var i in msg) {
                        msg[i].limitcoupon? money="红包立减"+msg[i].limitcoupon+"元" :money="";
                        if (i % 2 == "0") {
                            html += '<a href="/g?gId='+msg[i].goodsId +'&mId='+ _t.memberId +'" class="shopCon bord_1px fl"><div class="img_bg" style="background-image: url(' + imgUrl+lib.getImgSize(msg[i].mainPictureJPG,"D")+ ')"></div> <h5 class="shop_in">' + msg[i].chName + '</h5> <p class="money"> <i>￥' + msg[i].sellingPrice + '</i> <em>'+money+'</em></p></a>';
                        } else {
                            html += '<a  href="/g?gId='+ msg[i].goodsId +'&mId='+ _t.memberId +'" class="shopCon bord_1px fr"><div class="img_bg" style="background-image: url(' + imgUrl+lib.getImgSize(msg[i].mainPictureJPG,"D")+ ')"></div> <h5 class="shop_in">' + msg[i].chName + '</h5> <p class="money"> <i>￥' + msg[i].sellingPrice + '</i> <em>'+money+'</em></p></a>';
                        }
                    }
                    $("#article").append(html);
                    flag=true;
                    if(hs && sessionStorage.getItem("red_packer")){
                        if(_t.rows%10!=1){
                            page=_t.rows/10;
                        }
                        var time=setTimeout(function () {
                            _t.rows=10;
                            if(olimitcoupon){
                                $(".s_con .t_box").each(function () {
                                    if($(this).data("vue")==olimitcoupon){
                                        $(this).css({"color": "rgb(255, 60, 60)"}).siblings().css({"color":""});
                                        $(".s_title strong").text($(this).text());
                                    }
                                })
                            }
                            for(var i in obj){
                                $("#nav span").each(function(){
                                    if($(this).data("vue")==i){
                                        if(obj[i]){
                                            $(this).addClass("active1").siblings().removeClass("active");
                                            $(this).addClass("active1").siblings().removeClass("active1");
                                        }else{
                                            $(this).addClass("active").siblings().removeClass("active");
                                            $(this).addClass("active").siblings().removeClass("active1");
                                        }
                                    }
                                });
                                if(i=="goodsKeywords"){
                                    $(".txt").val($.trim(obj[i]));
                                }
                            }
                            var scrollTop=scrollTop1;
                            if($(document).height()>scrollTop){
                                $(window).scrollTop(scrollTop);
                            }else{
                                var time2=setTimeout(function () {
                                    $(window).scrollTop(scrollTop);
                                    clearTimeout(time2);
                                    clearTimeout(time);
                                },500)
                            }
                        },200);
                    }
                }else{
                    alert("网络错误");
                }
            }, function () {
            });
        },
        //轮播***********************************************
        shop_banner: function (data) {
            var _t = this;
            if(lib.getUrlParam("imgUrl")){
                var imgUrl=lib.getUrlParam("imgUrl");
                var  strHtml='<a href="javascript:void(0);" class="swiper-slide">' +
                    '<img src="' + lib.getReq().imgPath + imgUrl + '" />' +
                    '</a>';
            }else{
                var strHtml = "";
            }
            lib.ajx(reqUrl + 'adPlan/getShufflingAdPlanInfo.action', {adLocationId: 67, memberId: 0}, function (msg) {
                var data = msg.info.List_adSource;
                for (var i = 1; i < data.length; i++) {
                    strHtml += '<a href="' + data[i].adLink + '" class="swiper-slide">' +
                        '<img src="' + lib.getReq().imgPath + data[i].pictureUrl + '" />' +
                        '</a>';
                }
                $("#box_sw").html(strHtml);
                _t.slider_1 = new Swiper('.banner', {
                    loop: true,
                    autoplay: 3000,
                    speed: 800,
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplayDisableOnInteraction: false,
                    onTouchStart: function (swiper) {
                        _t.sTP = swiper.translate;
                    },
                    onTouchEnd: function (swiper) {
                        _t.eTP = swiper.translate;
                    }
                });
            }, function () {
            });

        },
        //搜索*****************************************************
        sercher:function () {
            var _t=this;
            $(".ind_search_r").on("tap",function () {
                $(window).off("scroll");
                page=1;
                _t.dropownD();
                var cont=$.trim($("#searchForm .txt").val());
                var Zoid="";
                var Zvlu="";
                if(sessionStorage.getItem("red_packer")){
                    var obj=JSON.parse(JSON.parse(sessionStorage.getItem("red_packer"))["obz"]) || {};
                }else{
                    var obj={};
                }
                $(".nav_con").each(function(){
                    if($(this).hasClass("active1")){
                        Zoid=1;
                        Zvlu=$(this).data("vue").toString();
                    }else if($(this).hasClass("active")){
                        Zoid=0;
                        Zvlu=$(this).data("vue").toString();
                    }
                });
                if(Zoid!=""){
                    obj[Zvlu]=Zoid;
                }
                var pid="";
                $(".s_con div").each(function () {
                    if($(this).text()==$(".s_title strong").text()){
                        pid=$(this).data("vue");
                    }
                })
                obj["goodsKeywords"]=cont;
                $("#article").html("");
                _t.shop_show(1,pid,false,obj);
                var red_packer=JSON.stringify({'page1': 1, 'scrollTop1': $(window).scrollTop(),"pid":pid,"obz":JSON.stringify(obj)});
                sessionStorage.setItem("red_packer",red_packer);
            })

        },
        //点击加载***************************************************
        nav_tap_click:function () {
            var _t=this;
            $("#nav").on("click",".nav_con",function () {
                $(window).off("scroll");
                page=1;
                _t.dropownD();
                var cont=$.trim($("#searchForm .txt").val());
                var class_t=$.trim($(".s_title strong").text());
                if($(this).hasClass("active") && !($(this).hasClass("active1"))){
                    if($(this).hasClass("active1") && !($(this).hasClass("active"))){
                        $(this).removeClass("active1").addClass("active");
                    }else{
                        $(this).addClass("active1").removeClass("active");
                    }
                }else if($(this).hasClass("active1")){
                    $(this).removeClass("active1").addClass("active");
                }else{
                    $(this).addClass("active").siblings().removeClass("active").removeClass("active1");
                }
                //    ************调用展示层*********************
                if($(this).hasClass("active")){
                    var oid=0;
                }else{
                    var oid=1;
                }
                var z=$(this).data("vue").toString();
                var obj={};
                obj[z]=oid;
                var cont=$.trim($("#searchForm .txt").val());
                obj["goodsKeywords"]=cont;
                var pid="";
                $(".s_con div").each(function () {
                    if($(this).text()==$(".s_title strong").text()){
                        pid=$(this).data("vue");
                    }
                })
                $("#article").html("");
                _t.shop_show(1,pid,false,obj);
                var red_packer=JSON.stringify({'page1': 1, 'scrollTop1': $(window).scrollTop(),"pid":pid,"obz":JSON.stringify(obj)});
                sessionStorage.setItem("red_packer",red_packer);
            })
        },
        //下拉加载**********************************************
        dropownD: function () {
            var _t = this;
            if(sessionStorage.getItem("red_packer")){
                var obj=JSON.parse(JSON.parse(sessionStorage.getItem("red_packer"))["obz"]) || {};
                var pid=JSON.parse(sessionStorage.getItem("red_packer"))["pid"] || "";
            }else{
                var obj={};
                var pid="";
            }
            var red_packer="";
            //**************铁定出路
            var scltop=$(".ind_search").offset().top;
            // *******************
            var throttled=_t.throttle(function(){
                page+=1;
                var cont=$.trim($("#searchForm .txt").val());
                var Zoid="";
                var Zvlu="";
                $(".nav_con").each(function(){
                    if($(this).hasClass("active1")){
                        Zoid=1;
                        Zvlu=$(this).data("vue").toString();
                    }else if($(this).hasClass("active")){
                        Zoid=0;
                        Zvlu=$(this).data("vue").toString();
                    }
                });
                if(Zoid=="0" || Zoid=="1"){
                    obj={};
                    obj[Zvlu]=Zoid;
                }
                $(".s_con div").each(function () {
                    if($(this).text()==$(".s_title strong").text()){
                        pid=$(this).data("vue");
                        obj["goodsKeywords"]=cont;
                    }
                });
                setTimeout(function(){
                    _t.shop_show(page,pid,false,obj);
                },0)
            },100,{});
            // ******************
            //****************** */
            $(window).on("scroll",function () {
                if(!( scltop>$(this).scrollTop())){
                    $(".ind_search").css({"position":"fixed","top":"0px"});
                }else{
                    $(".ind_search").css({"position":"","top":""});
                }
                if($(window).scrollTop()>500){
                    $("#return_top").css({"opacity":1});
                }else{
                    $("#return_top").css({"opacity":0});
                }
                //***********************************;
                if (flag && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
                    flag=false;
                    throttled();
                }
                var red_packer=JSON.stringify({'page1': page, 'scrollTop1': $(window).scrollTop(),"pid":pid,"obz":JSON.stringify(obj)});
                sessionStorage.setItem("red_packer",red_packer);
            });
        },
        //xuanxiangkshijain
    };
    redPack.init();
    window.onpopstate = function(){
        history.back();
    }
    window.onunload = function(){
        sessionStorage.removeItem("mm_cp20160824");
    }
    $('body').on("touchmove",function (e) {
        if ($(window).scrollTop() > $(document).height() - $(window).height() - 100) {
            e.preventDefault();
        }
    });
});

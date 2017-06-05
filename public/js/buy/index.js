require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs' , "wxReg" , "swiper","rememberThePosition"], function($, lib, vl, wxReg,_,remosition){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq(), indexObj = {};
    $.extend(indexObj, {
        classId: "",
        memberId: common.tools.getUrlParam('mId') === '' ? '0' : common.tools.getUrlParam('mId'),
        activeImgP: { 0: "/images/buy/list_0.png", 1: "/images/buy/list_1.png", 2: "/images/buy/list_2.png", 3: "/images/buy/list_3.png", 4: "/images/buy/list_5.png"},
        adLocationId: [1,2,5,6,7,8,3],
        slider1: "",
        slider: "",
        sTP: 0,
        eTP: 0,
        page: 1,
        rows: 20,
        noMore: false,
        timer: null,
        clientWidth: document.documentElement.clientWidth > 640 ? 640 : (document.documentElement.clientWidth < 320 ? 320 : document.documentElement.clientWidth),
        imgH: (document.documentElement.clientWidth * 0.8 * 0.495) + "px",
        maxImgH: (640* 0.8 * 0.495) + "px",
        init: function(){
            sessionStorage.mm_mId = common.tools.getUrlParam('mId') === '' ? '1' : common.tools.getUrlParam('mId');
            wxReg.reg(this.memberId,'0');//微信自动注册
            vl.setLog(window.location.href, '0');//会员访问日志
            this.sliderFN(); //轮播图滚动
            this.bindEvent();
            this.getShufflingAdPlanInfo();/*首页轮播图*/
            lib.fixedFooter(0);//底部导航
            this.getDaKaAdInfo();//大咖广告
            this.getAdPlanInfo();//排期广告
            this.roll();
            this.goodsFloorListFist();
            remosition.init(false);
            $(".ui-clsoe-d").css("height", (this.clientWidth / 640 * 60) + "px");
            //*****************
            var Oheight=$("body").height()/2;
          this.scroll(Oheight);
          this.click();//回到顶部

            var type=lib.getUrlParam('t')?lib.getUrlParam('t'):"";//是否为联想首页
            if(type=="lenovo")this.lenovoRedPocket();//联想首页领取红包弹窗
            if(window.sessionStorage && sessionStorage.mm_isApp === "NO"){
              $(".ui-app-hide").remove();
            }
            setTimeout(function(){
              $(".ui-app-hide").remove();
              sessionStorage.mm_isApp = "NO";
            }, 8000);

        },
        lenovoRedPocket:function(){//联想首页红包
            var redPocket=$("#redPocket"),
                redPocket_s=$("#redPocket_s"),
                getButton=$('#getButton'),
                pocketId=lib.getUrlParam('i')?lib.getUrlParam('i'):28,//红包Id
                issueMid=lib.getUrlParam('mId')?lib.getUrlParam('mId'):30071;//大咖Id

            sessionStorage.mm_mId=issueMid;//大咖Id写入session

            var ifGetUrl=lib.getReq().ser+"/redPacket/isTakeRedPacket.action",//判断是否领取过
                GetPocketUrl=lib.getReq().ser+"/redPacket/takeRedPacket.action";//领取红包

            if(!$.cookie("member_memberId")){//未登录状态
                redPocket.show()
            }else{//登录状态
                lib.ajx(ifGetUrl, {redPacketTypeId:pocketId,issueMemberId:issueMid}, function(data){
                    if(data.infocode == 0){//可以领取
                        redPocket.show();
                    }
                });
            }

            getButton.on("click",function(){//点击领取
                lib.ajx(GetPocketUrl, {redPacketTypeId:pocketId,issueMemberId:issueMid}, function(data){
                    if(data.infocode == 0){//领取红包成功
                        redPocket.hide();
                        redPocket_s.show();
                    }else if(data.infocode == 3){//未登录
                        //location = "/buyer/login/dlzc.html?backUrl=" +lib.getBackUrl();
                    }else{
                        alert(data.info);
                    }
                });

            });

            $(".close").on("click",function(){//关闭弹窗
                $(this).parent().parent().hide();
            })
        },
        sliderFN: function(){
            var _t=this;
            _t.slider1 = new Swiper('.swiper-container', {
                direction: 'vertical',
                slidesPerView: 'auto',
                freeMode: true,
                onTouchStart: function(swiper){
                    _t.sTP = swiper.translate;
                },
                onTouchEnd: function(swiper){
                    _t.eTP = swiper.translate;
                }
            });

        },
        bindEvent: function(){
            var curObj, _t = this;
            $(document).on("tap", ".ind_sx_cart i", function(){
                common.js.ajx(reqUrl.ser+"shoppingCart/addToCart.action", {goodsNum:1,goodsId:$(this).attr("data-goodsId")}, function(data){
                    if(data.infocode === "0"){
                        common.js.getCartNum();
                        alert("成功添加购物车");
                    }else{
                        alert(data.info);
                    }
                });
            });
            $("#searchForm input").focus(function(){
                $(this).val().length > 0 ? $(".ui-clear-input").show() : "";
            });
            $("#searchForm input").keyup(function(){
                $(this).val().length > 0 ? $(".ui-clear-input").show() : $(".ui-clear-input").hide();
            });
            $(".ui-clear-input").click(function(){
                $(this).hide();
                $("#searchForm input").val("");
                $("#searchForm input").focus();
            });
            $(document).on("tap", ".ind_search_r", function(){
                searchFun();
            });
            $("#searchForm").on("submit",function(){
                searchFun();
            });
            function searchFun(){
                var keyWord = $(".ind_search_cen input").val().trim();
                if(keyWord === "" && $(".ind_search_cen input").attr("placeholder") === ""){
                    alert("请输入搜索关键字");
                    return;
                }else if(keyWord === "" && $(".ind_search_cen input").attr("placeholder") !== ""){
                  location.href = $(".ind_search_cen input").attr("data-url");
                  return;
                }
                location.href = "/buyer/liebiao.html?goodsKeywords="+keyWord;
            }

            $(".ui-clsoe-d").on("tap", function(){
                $(this).parent().hide();
                $("body").animate({marginTop: 0}, 100);
                if(window.sessionStorage){
                  sessionStorage.mm_isApp = "NO";
                }
            });
        },
        //大咖 买咖 商品分类
        getMemberGoodsClassInfo: function(){
            var data = {}, _t = this;
            if("" !== _t.classId)
                data['classId'] = _t.classId;
            if("" !== _t.memberId)
                data['memberId'] = _t.memberId;
            common.js.ajx(reqUrl.ser + "goodsClass/getMemberGoodsClassInfo.action", data, function(data){
                if(data.infocode === '0'){
                    var h = '';
                    $("title").text(data.info.mallName);
                    $("nav").html('<a href="javascript:;" class="back _goback"></a>'+ data.info.mallName);
                    $(".ui-ce-nav").text(data.info.mallName);
                    if(data.info.list_goodsClass.length === 0){
                        $(".ind_search_list").hide();
                        return;
                    }
                    $.each(data.info.list_goodsClass, function(k, v) {
                        h += '<li class="ui-transd-999" data-id="'+ v.classId +'"><a href="javascript:;">'+ v.className +'</a></li>';
                    });
                    $(".ui-type-list").html(h);
                }else if(data.infocode === '2'){
                    $(".ind_search_list").hide();
                }
            }, _t.errFn);
        },
        errFn: function(){
            console.log("数据请求失败");
        },
        //获取商品列表
        goodsFloorListFist: function(){
            var _t = this;
            var data = {page: _t.page++,rows: _t.rows};
            if(_t.memberId) data['memberId'] = _t.memberId;
            var h = '';
            var imgH = _t.getImgH();
            common.js.ajx(reqUrl.ser+"adPlan/getAdPlanInfoAll.action?mapValue=68-b,69-b,70-b,71-b,72-b,181-b,182-b,144-b", data, function(data){
                if(data.infocode === '0'){
                    $("input.txt").attr("placeholder", data.info['144_b'][0].remark_adS);
                    $("input.txt").attr("data-url", data.info['144_b'][0].adLink);
                    delete data.info['144_b'];
                    $.each(data.info, function(K, V) {
                        h += "<div class='ui-per-floor'>";
                        $.each(V, function(k, v){
                           h += '<a href="'+ v.adLink +'" '+ (k===0 ? "class='ui-first'" : '') +'><img src="'+ lib.getReq().imgPath + v.pictureUrl  +'" style="'+ (k===0 ? "width:100%" :"height:" + imgH) +'"></a>';
                        });
                        h += "<div style='clear:both'></div></div>";
                    });
                    $(".ind_sx").append(h);
                    _t.goodsBaseListFist();
                }else{
                    _t.noMore = true;
                }
            }, _t.errFn);
        },
        goodsBaseListFist: function(){
            var _t = this;
            var data = {page: _t.page++, rows: _t.rows};
            if(_t.memberId) data['memberId'] = _t.memberId;
            var h = '';
            common.js.ajx(reqUrl.ser+"rLocation/getRLocationInfo.action?rLocationId=52", {}, function(data){
                if(data.infocode === '0'){
                    h += '<img src="'+ reqUrl.imgPath + data.info.pictureUrl_rL +'">';
                    $.each(data.info["List_rLg"], function(k, v) {
                        if(k%2 === 0) h += '<div class="ind_sx_h clearfix">';
                        h += '<div class="ind_sx_h_l"><a href="/g?gId='+ v.goodsId +'&mId='+ _t.memberId +'"><div class="ind_sx_lo">'+ (v.activeSignImg === "" ? "" : '<img src="'+ _t.activeImgP[v.activeSignImg] +'">') +'</div><div class="ind_sx_l_img">'+
                             '<img src="'+ reqUrl.imgPath + lib.getImgSize(v.mainPictureJPG, "C") +'" style="height:'+ _t.imgH +';max-height:'+ _t.maxImgH +'"></div>'+
                             '<h3>'+ v.chName +'</h3>'+
                             '<p class="dred"><em style="font-size:12px">￥</em>'+ v.sellingPrice +'<span>'+ (v.limitcoupon  ? "红包立减" + v.limitcoupon  + "元" : "")  +'</span></p></a></div>';
                        if(k%2 === 1 || k===data.info["List_rLg"].length-1) h += '</div>';
                    });
                    $(".ind_sx").append(h);

                }else{
                    _t.noMore = true;
                }
            }, _t.errFn);
        },
        roll: function(){
            var _t = this;
            $(window).scroll(function (){
                if($(window).scrollTop() > (document.documentElement.clientWidth / 640 * 360)){
                    $(".ind_search_1").addClass("active");
                }else{
                    $(".ind_search_1").removeClass("active");
                }

            });
        },
        getShufflingAdPlanInfo: function(){/*首页轮播图*/
            var _t = this, data = {adLocationId: _t.adLocationId[0]};
            if(_t.memberId) data['memberId'] = _t.memberId;
            common.js.ajx(reqUrl.ser+"adPlan/getShufflingAdPlanInfo.action", data, function(data){
                if(data.infocode === "0"){
                    var h = "";
                    $("#serial_number").empty();
                    $.each(data.info.List_adSource, function(k, v){
                        if(v.pictureUrl){
                            h += '<li class="swiper-slide"><a href="'+ v.adLink +'"><img src="'+ reqUrl.imgPath + v.pictureUrl + '" /></a></li>';
                            $("#serial_number").append('<span class="point"></span>');
                        }

                    });
                    $("#serial_number span:eq(0)").addClass("selected");
                    $("#slider_Img .swiper-wrapper").html(h);
                }
                _t.slider = new Swiper('#slider_Img', {
                    autoplay: 5000,//可选选项，自动滑动
                    autoplayDisableOnInteraction : false,
                    loop: true,
                    autoHeight: true,
                    onSlideChangeEnd: function(swiper){
                        $("#serial_number span").eq($("#slider_Img .swiper-slide.swiper-slide-active").attr('data-swiper-slide-index')).addClass('selected').siblings().removeClass('selected');
                    }
                });
            }, function(){
                _t.slider = new Swiper('#slider_Img', {
                    autoplay: 5000,//可选选项，自动滑动
                    autoplayDisableOnInteraction : false,
                    loop: true,
                    autoHeight: true,
                    onSlideChangeEnd: function(swiper){
                        $("#serial_number span").eq($("#slider_Img .swiper-slide.swiper-slide-active").attr('data-swiper-slide-index')).addClass('selected').siblings().removeClass('selected');
                    }
                });
                $("#slider_Img img").css({"height": (document.documentElement.clientWidth / 640 * 300) + "px","max-height": "300px"});
                $("#slider_Img").css({"height": (document.documentElement.clientWidth / 640 * 300) + "px","max-height": "300px"});
            });
        },
        //获取大咖广告位信息
        getDaKaAdInfo: function(){
            var _t = this, data = {};
            if(_t.memberId) data['memberId'] = _t.memberId;
            common.js.ajx(reqUrl.ser+"adPlan/getAdPlanMemberInfo.action", data, function(data){
                if(data.infocode === "0"){
                    if(data.info.list_Enty.length === 0 || ("" === data.info.list_Enty[0].mallPicture && "" === data.info.list_Enty[1].mallPicture)){
                        $(".ui-ad-1,.ui-ad-2").hide();
                        return;
                    }
                    $(".ui-ad-1,.ui-ad-2").css({height: (document.documentElement.clientWidth / 2) + "px", overflow: "hidden"});
                    $.each(data.info.list_Enty, function(k, v) {
                    	$(".ui-ad-"+(k+1)+" a").attr("href", "/g?mId="+ _t.memberId +"&gId=" + v.mallPictureURL);
                    	v.mallPicture ? $(".ui-ad-"+(k+1)+" img").attr("src", reqUrl.imgPath+v.mallPicture) : "";
                    });
                }else{
                    $(".ui-ad-1,.ui-ad-2").hide();
                    return;
                }

            }, _t.errFn);
            /*_t.slider2.onResize();*/
        },
        //获取排期广告
        getAdPlanInfo: function(){
            var _t = this, data = {};
            common.js.ajx(reqUrl.ser+'adPlan/getAdPlanInfo.action', {adLocationId: 12}, function(data){

                if(data.infocode === '0'){
                    var h = "";
                    $.each(data.info.List_adSource, function(k, v) {
                    	h += '<li><a href="'+ v.adLink +'"><img src="'+ reqUrl.imgPath + v.pictureUrl +'" /></a></li>';
                    });
                    $(".ind_nav ul").html(h);
                }
            }, _t.errFn);

            data = {adLocationId: 17};
            common.js.ajx(reqUrl.ser+'adPlan/getAdPlanInfo.action', data, function(data){
                if(data.infocode === '0'){
                    $(".ui-ad-"+(8)+" a").attr("href", (data.info.List_adSource)[0].adLink);
                    $(".ui-ad-"+(8)+" img").attr("src", reqUrl.imgPath+(data.info.List_adSource)[0].pictureUrl);
                }
            }, _t.errFn);

            $(".ui-ad-"+(9)).empty();
            data = {adLocationId: 19};
            common.js.ajx(reqUrl.ser+'adPlan/getAdPlanInfo.action', data, function(data){
                if(data.infocode === '0'){
                    $(".ui-ad-"+(9)).prepend('<a style="width:100%;float:left" href="'+ (data.info.List_adSource)[0].adLink +'"><img src='+ reqUrl.imgPath+(data.info.List_adSource)[0].pictureUrl +' />');
                }
            }, _t.errFn);

            data = {adLocationId: 20};
            common.js.ajx(reqUrl.ser+'adPlan/getAdPlanInfo.action', data, function(data){
                if(data.infocode === '0'){
                    $(".ui-ad-"+(9)).append('<a style="width:50%;float:left" href="'+ (data.info.List_adSource)[0].adLink +'"><img src='+ reqUrl.imgPath+(data.info.List_adSource)[0].pictureUrl +' />');
                }
            }, _t.errFn);

            data = {adLocationId: 21};
            common.js.ajx(reqUrl.ser+'adPlan/getAdPlanInfo.action', data, function(data){
                if(data.infocode === '0'){
                    $(".ui-ad-"+(9)).append('<a style="width:50%;float:left" href="'+ (data.info.List_adSource)[0].adLink +'"><img src='+ reqUrl.imgPath+(data.info.List_adSource)[0].pictureUrl +' />');
                }
            }, _t.errFn);
            /*_t.slider2.onResize();*/
        },
        getImgH: function(h){
            h = h || 180;
            var w = document.documentElement.clientWidth || document.body.clientWidth;
            w = w > 640 ? 640 : (w < 320 ? 320 : w);
            if(w % 2 != 0){
                w = w - 1;
            }
            return Math.floor(w / 640 * h) + "px"
        },
        getClientWidth: function(){
            return document.documentElement.clientWidth > 640 ? 640 : (document.documentElement.clientWidth < 320 ? 320 : document.documentElement.clientWidth);
        },
				//*******zetpo*****************
        click:function(){
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
              $("#return_top").on("click",function(){
						$("body").scrollTo({toT:0});

							});
							},
                scroll:function(Oheight){
                    $(window).on("scroll",function () {
                        if($(this).scrollTop()>Oheight){
                            $("#return_top").css({"opacity":1});
                        }else{
                            $("#return_top").css({"opacity":0});
                        }
                    });
                },
    });
    indexObj.init();

    window.addEventListener("orientationchange",function(){
        imgH = indexObj.getImgH();
        imgH2 = (indexObj.getClientWidth() * 0.8 * 0.495) + "px";
        $(".ui-first").siblings().children("img").css("height", imgH);
        $(".ind_sx_l_img img").css("height", imgH2);
        $(".ui-clsoe-d").css("height", (indexObj.getClientWidth() / 640 * 60) + "px");
    });

    window.onresize= function(){
        imgH = indexObj.getImgH();
        imgH2 = (indexObj.getClientWidth() * 0.8 * 0.495) + "px";
        $(".ui-first").siblings().children("img").css("height", imgH);
        $(".ind_sx_l_img img").css("height", imgH2);

        $(".ui-clsoe-d").css("height", (indexObj.getClientWidth() / 640 * 60) + "px");
    };
});

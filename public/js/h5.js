require.config({baseUrl: '/js/lib', urlArgs: "v0.0.5", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib', "wxshare", 'animate', 'wxReg' ,"swiper"], function($, lib, wxshare, animate, wxReg){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    $(function(){
        var h5={}, orientation = window.orientation, firstTouch = true, audio = document.getElementById("media");
        $.extend(h5,{
            swiper: "", 
            sTP: 0, //记录触摸开始时 的位置
            eTP: 0, //记录触摸结束时 的位置
            _h: (document.documentElement.clientHeight - 40) + "px", //计算除导航外 的可是屏幕高度 
            windowW: document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth,
            mrIndex: sessionStorage.goodsListLength,  //记录当前swiper的索引
            activityId: common.tools.getUrlParam("acId"),
            removeItem: ["desc", "erweima", "shopName", "goodsInfo", "picture"],
            flag: true,
            imgAnimate: ['rubberBand','rotateIn','bounceInDown', "zoomInLeft", "swing", "bounce", "flipInY", "fadeInLeftBig"],
            goodsIdList: [],
            direction: "horizontal", 
            init:function(){
                if(window.isApp === 0){
                    audio.src = "http://m.maim9.com/mp3/yq0KZFZep8-ARxAdAAcDkDe8v5Q190.mp3";
                    $(".ui-music").show();
                    audio.play();
                }
                var _t = this;
                if(_t.activityId !== ""){
                    _t._h = document.documentElement.clientHeight + "px";
                }
                wxReg.reg(common.tools.getUrlParam("mId"), 0, _t.activityId);
                if(document.documentElement.clientWidth > document.documentElement.clientHeight){
                    $(".swiper-container").hide();
                    $("body").addClass("ui-user-shuping");
                    return;
                }
                lib.onLoading();
                //alert(_t._h);
                $(".swiper-container, .ui-h5-share, .ui-first-sreen").css("height", _t._h);
                
                $(".ui-goods-show > div img").css("max-height", (_t.windowW * 0.7) + "px");
                //解决iphone4上商品显示的问题
                if(_t.activityId !== ""){
                    $(".ui-add-goods").remove();
                    _t.direction = "vertical";
                    _t.getH5Info(_t.activityId);
                    _t.bindEvent(true);
                    return;
                }
                _t.firstPageInit();
                _t.initPage();
                _t.bindEvent();
                if(parseInt(_t._h) < 441){
                    $(".ui-goods-show > div img").css("max-height", (_t.windowW * 0.42) + "px");
                    $(".ui-edit-div").css("margin-top", "5px");
                    $(".ui-goods-show > div img").css("width", "60%");
                    $(".ui-goods-show > div").css("margin", "0");
                }else if(parseInt(_t._h) < 490){
                    $(".ui-goods-show > div img").css("max-height", (_t.windowW * 0.56) + "px");
                    $(".ui-goods-show > div img").css("width", "80%");
                }
            },
            initPage: function(flag){
                //根据session信息初始化h5
                var _t = this;
                if(sessionStorage.shopName && "undefined" !== sessionStorage.shopName){
                   $(".ui-shop-name").text(sessionStorage.shopName);
                }else if(!flag){
                    _t.getShopInfo();
                }
                
                if(sessionStorage.erweima && "undefined" !== sessionStorage.erweima){
                   $('.weixinpay-erweima').html("<img style='width:45%;margin: 0 auto;' src='" + sessionStorage.erweima +  "'/>");
                }else if(!flag){
                    _t.getShopInfo();
                }
                
                if(sessionStorage.desc && "undefined" !== sessionStorage.desc){
                    _t.descInit(sessionStorage.desc);
                    $(".ui-desc-shuru input").val(sessionStorage.desc);
                    $(".ui-tap-edit").css("display", "none"); 
                    $(".ui-edit-area").css("display", "block"); 
                }
                
                //初始化商品信息
                if(sessionStorage.goodsInfo && "undefined" !== sessionStorage.goodsInfo){
                    var goodsList = JSON.parse(sessionStorage.goodsInfo);
                    $(".ui-first-sreen .ui-next-step").remove();
                    var h = "";
                    $.each(goodsList, function(k, v){
                        _t.goodsIdList.push(v.goodsId);
                        h += '<div class="swiper-slide ui-goods-bc"><div class="ui-goods-show"><div class="ani" swiper-animate-effect="'+ _t.imgAnimate[Math.floor(Math.random() * _t.imgAnimate.length)] +'" swiper-animate-duration="0.5s" swiper-animate-delay="0s">' +
                           '<img src="'+ reqUrl.imgPath + v.mainPictureJPG +'"/></div>' +
                           '<div class="ani" swiper-animate-effect="zoomInLeft" swiper-animate-duration="0.3s" swiper-animate-delay="0.5s">'+ v.chName +'</div><div class="ani" swiper-animate-effect="zoomInRight" swiper-animate-duration="0.3s" swiper-animate-delay="0.5s">'+ v.enName +'</div>' +
                           '<div class="ani" swiper-animate-effect="shake" swiper-animate-duration="0.3s" swiper-animate-delay="0.8s"><del>市场价：￥'+ v.marketPrice +'</del></div><div class="ani" swiper-animate-effect="bounceInUp" swiper-animate-duration="0.5s" swiper-animate-delay="1.1s">￥'+v.sellingPrice +'</div>' +
                           '</div><a href="/g?mId='+ common.tools.getUrlParam("mId") +'&gId='+ v.goodsId +'" class="ui-buy-button"></a>';
                        if(k === (goodsList.length - 1) && !flag)
                            h += '<span class="ui-all-wc">完成</span><span class="ui-next-step">下一步</span></div>';
                        else
                            h += '</div>';
                    });
                    $(".ui-first-sreen").after(h);
                    if(goodsList.length >= 5){
                        $(".ui-add-goods").remove();
                        $(".ui-next-step").remove();
                    }
                }
                if(parseInt(_t._h) < 441){
                    $(".ui-goods-show > div img").css("max-height", (_t.windowW * 0.42) + "px");
                    $(".ui-goods-show > div img").css("width", "60%");
                    $(".ui-goods-show > div").css("margin", "0");
                }else if(parseInt(_t._h) < 490){
                    $(".ui-goods-show > div img").css("max-height", (_t.windowW * 0.56) + "px");
                    $(".ui-goods-show > div img").css("width", "80%");
                }
                _t.firstPageInit();
                if(!flag){
                    _t.swiper = new Swiper('.swiper-container', {
                        direction : _t.direction,
                        onTouchStart: function(swiper){
                            _t.sTP = swiper.translate;
                        },
                        onTouchEnd: function(swiper){
                            _t.eTP = swiper.translate;
                        }
                    });
                }else{
                    _t.swiper = new Swiper('.swiper-container', {
                        direction : _t.direction,
                        onTouchStart: function(swiper){
                            _t.sTP = swiper.translate;
                        },
                        onTouchEnd: function(swiper){
                            _t.eTP = swiper.translate;
                        },
                        onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
                            console.log(animate);
                            animate[1](swiper); //隐藏动画元素 
                            animate[0](swiper); //初始化完成开始动画
                        }, 
                        onSlideChangeEnd: function(swiper){ 
                            animate[0](swiper); //每个slide切换结束时也运行当前slide动画
                        } 
                    });
                }
                
                lib.offLoading();
                $(".swiper-container").css("visibility", "visible");
                console.log(_t.mrIndex)
                if(!flag)
                    _t.swiper.slideTo(_t.mrIndex, 0, false);
            },
            firstPageInit: function(){
                var _t = this;
                $(".ui-edit-div").css("height", (_t.windowW * 0.38) + "px");
                /*解决iphone4上商品显示的问题*/
                if(parseInt(_t._h) < 360){
                    $("#ui-big-div").css("top", "5px");
                    $("#ui-big-div").css("margin-top", "0px");
                    $(".ui-edit-div").css("margin-top", "5px");
                    $(".weixinpay-erweima").css("margin", "5px 0");
                }else{
                    $("#ui-big-div").css("margin-top", "-" + (document.getElementById("ui-big-div").offsetHeight / 2) + "px");
                }
                setTimeout(function(){
                    $("#ui-h5-share").css("margin-top", "-" + (document.getElementById("ui-h5-share").offsetHeight / 2) + "px");
                }, 1000);

                //背景音乐
                audio.play();
            },
            bindEvent: function(f){
                var _t = this;
                if(!f){
                    //下一步
                    $(document).on("touchend", ".ui-next-step", function(event){
                        event.preventDefault();
                        _t.swiper.slideNext();
                    });
                    //完成h5制作
                    $(document).on("touchend", ".ui-all-wc", function(event){
                        event.preventDefault();
                        _t.h5Created();
                    });
                    //点击编辑按钮
                    $(document).on("touchend", ".ui-tap-edit, .ui-edit-area", function(event){
                        event.preventDefault();
                        if(_t.sTP !== _t.eTP){
                            return;
                        }
                        $(".ui-tap-edit").css("display", "none"); 
                        $(".ui-edit-area").css("display", "block"); 
                        $(".ui-desc-shuru").css("display", "block"); 
                        
                    });
                    
                    //输出描述完成按钮
                    $(document).on("touchend", ".ui-desc-shuru .ui-shuru-wc", function(event){
                        event.preventDefault();
                        var text = $(".ui-desc-shuru input").val().trim();
                        if(text === ""){
                            alert("请输入描述");
                            return;
                        }
                        if($(".ui-first-sreen").siblings().length === 1){
                            $(".ui-first-sreen .ui-next-step").css("display", "block");
                        }
                        sessionStorage.desc = text;
                        _t.descInit(text);
                        
                    });
                    //添加按钮
                    $(document).on("tap", ".ui-add-button", function(){
                        if(_t.sTP !== _t.eTP){
                            return;
                        }
                        sessionStorage.avtivityFlag = "h5";
                        sessionStorage.goodsListLength = (JSON.parse(sessionStorage.goodsInfo || "[]")).length + 1;
                        location.href = "/admin/activity/xuanzhehuodongsp.html";
                    });
                }
                
                //分享按钮
                $(document).on("tap", ".ui-share-button", function(){
                    $(".fixed").css("display", "block");
                });
                
                $(document).on("tap", ".fixed", function(){
                    $(".fixed").css("display", "none");
                });
                
                $(document).on("tap", ".ui-music", function(){
                    if(audio.paused){
                        audio.play();
                    }else{
                        audio.pause();
                    }
                });
            },
            descInit: function(text){
                $(".ui-desc-shuru").css("display", "none");
                var textL = text.length;
                $(".ui-edit-area input").val("");
                if(textL >= 16){
                    $(".ui-edit-area input:eq(0)").val(text.substring(0, 4));
                    $(".ui-edit-area input:eq(1)").val(text.substring(4, 10));
                    $(".ui-edit-area input:eq(2)").val(text.substring(10, 16));
                    $(".ui-edit-area input:eq(3)").val(text.substring(16, 20));
                }else if(textL >= 10){
                    $(".ui-edit-area input:eq(0)").val(text.substring(0, 4));
                    $(".ui-edit-area input:eq(1)").val(text.substring(4, 10));
                    $(".ui-edit-area input:eq(2)").val(text.substring(10));
                }else if(textL >= 4){
                    $(".ui-edit-area input:eq(0)").val(text.substring(0, 4));
                    $(".ui-edit-area input:eq(1)").val(text.substring(4));
                }else{
                    $(".ui-edit-area input:eq(0)").val(text.substring(0, 4));
                }
            },
            getShopInfo: function(){
                var _t = this;
                if(!_t.flag){
                    return;
                }
                _t.flag = false;
                common.js.ajx(reqUrl.ser + "/member/getMemberStoreInfo.action", {}, function(data){
                    if(data.infocode === '0'){
                        sessionStorage.shopName = data.info.mallName;
                        $(".ui-shop-name").text(sessionStorage.shopName);
                        sessionStorage.picture = reqUrl.imgPath + data.info.memberPicture;
                    }else if(data.infocode === '2'){
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                    
                },function(){
                   alert("请求失败，请刷新页面重试"); 
                   _t.flag = true;
                });
                
                common.js.ajx(reqUrl.ser + "member/getSellerIndexInfo.action", {}, function(data){
                   if(data.infocode === "0"){
                       sessionStorage.erweima = reqUrl.imgPath + data.info.mallQRCode;
                       $('.weixinpay-erweima').html("<img style='width:45%;margin: 0 auto;' src='" + sessionStorage.erweima +  "'/>");
                    }
                }, function(){
                    console.log("数据请求失败");
                    _t.flag = true;
                });
            },
            h5Created: function(){//完成h5制作
                var _t = this;
                if(!sessionStorage.desc || sessionStorage.desc === ""){
                    alert("请输入店铺描述");
                    _t.swiper.slideTo(0, 0, false);
                    return;
                }
                common.js.ajx(reqUrl.ser + 'goodsHtml/addGoodsHtmlByGoodsIds.action', {titleWords: sessionStorage.desc,goodsIds:_t.goodsIdList.join(",")}, function(data){
                    if(data.infocode === "0"){
                        $(".ui-shop-link p").text(location.protocol + "//" + location.host + "/share/h5.html?mId=" + $.cookie("member_memberId") + "&acId=" + data.info.h5Id);
                        if(!lib.checkWeiXin()){
                            $(".ui-shop-link").css("display", "block");
                            $(".ui-share-button").css("display", "none");
                        }
                        $(".swiper-container").css("visibility", "hidden");
                        $(".ui-h5-share").css("visibility", "visible");
                        if(parseInt(_t._h) < 360){
                            $(".weixinpay-erweima").css("margin", "5px 0");
                        }
                        $("#ui-h5-share").css("margin-top", "-" + (document.getElementById("ui-h5-share").offsetHeight / 2) + "px");
                        _t.shareToWX(sessionStorage.shopName, sessionStorage.desc, $(".ui-shop-link p").text(), sessionStorage.picture);
                        $.each(_t.removeItem, function(k, v) {
                            sessionStorage.removeItem(v);
                        });
                    }else{
                        alert(data.info);
                        if(data.infocode === "2") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, function(){
                    alert("操作失败");
                });
                    
            },
            shareToWX: function(t, desc, link, imgUrl){
                window.dataForWeixin.title = t;
                window.dataForWeixin.desc = desc;
                window.dataForWeixin.link = link;
                window.dataForWeixin.imgUrl = imgUrl;
                wxshare();
            },
            getH5Info: function(h5Id){
                var _t = this;
                common.js.ajx(reqUrl.ser+"goodsHtml/selectGoodsHtmlById.action",{h5Id:h5Id,memberId:common.tools.getUrlParam("mId")}, function(data){
                    if(data.infocode === "0"){
                        sessionStorage.desc = data.info.titleWords;
                        sessionStorage.erweima = reqUrl.imgPath + data.info.twoDimensionsCode;
                        sessionStorage.shopName = data.info.mallName;
                        sessionStorage.goodsInfo = JSON.stringify(data.info.list_goodsHtml);
                        $(".ui-first-sreen").after('<div class="swiper-slide" style="background-image:url(/images/h5_6.png)">'+ $(".ui-h5-share").html() +'</div>');
                        $(".ui-shop-link p").text(location.href);
                        $("title").text(sessionStorage.shopName);
                        $("nav").html('<a href="/share/shouye.html" class="back " ></a>' + sessionStorage.shopName);
                        $(".main").hide();
                        $(".ui-music").css({top: "15px"});
                        if(!lib.checkWeiXin()){
                            $(".ui-shop-link").css("display", "block");
                            $(".ui-share-button").css("display", "none");
                        }
                        _t.initPage(true);
                        $(".ui-buy-button").css("display", "block");
                        _t.shareToWX(sessionStorage.shopName, sessionStorage.desc, location.href, reqUrl.imgPath + data.info.memberPicture);
                        $.each(_t.removeItem, function(k, v) {
                            sessionStorage.removeItem(v);
                        });
                    }else if(data.infocode === '2'){
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                }, function(){
                    alert("数据加载失败");
                });
            }
        });
        h5.init();
        window.onresize = function(){
            setTimeout(function(){
                console.log(window.orientation + "  " +orientation);
                if(window.orientation !== orientation){
                    location.reload();
                }
            }, 300);
                
        };
        document.addEventListener('touchstart', function(){ 
            if(firstTouch){
                if(window.isApp === 0){
                    audio.play();
                }
                firstTouch = false;
            }
        }, false);
    });
});
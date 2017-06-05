define(function (require) {
    var $ = require("zepto");
    var libC = require("lib");
    var lib = new libC();
    var swiper = require("swiper.min");
    var reqUrl = lib.getReq();
    var myswiper="";

    function guesslike(str) {//参数为当前空白页面说明
        importCss();
        var pageSize = 10,
            memberId = lib.getUrlParam('mId') === '' ? '0' : lib.getUrlParam('mId');
        $(".guess_like").remove();
        lib.ajx(reqUrl.ser + "/goodsBase/goodsBaseListInfoByLove.action", {pageSize: pageSize, infoId: 33}, function (data) {
            if (data.infocode === "0") {
                var h = "";
                var outer="";
                if(data.info.list_goodsBase.length==="0") return;
                $.each(data.info.list_goodsBase, function (k, v) {
                    if(v.mainPictureJPG.indexOf("img")>-1){
                        v.mainPictureJPG=v.mainPictureJPG+"_C";
                    }
                    h += '<div class="swiper-slide"><div class="img_wrapper" style="width:50%"><a href="/g?gId=' + v.goodsId + '&mId=' + memberId + '" class="img_wrapper_link"><img src="' + reqUrl.imgPath + v.mainPictureJPG + '"></a></div><h3><a href="/g?gId=' + v.goodsId + '&mId=' + memberId + '">' + v.chName + '</a></h3><p class="price"><span class="now_price"><a href="/g?gId=' + v.goodsId + '&mId=' + memberId + '">￥' + v.sellingPrice + '</a></span><span class="marketing_price"><a href="/g?gId=' + v.goodsId + '&mId=' + memberId + '">市场价：' + v.marketPrice + '</a></span></p></div>';
                });
                outer+='<div class="guess_like"><div class="ui_nothing_find" id="noneList" style="display:block"><div><dl><dd></dd><dt id="noneList_dsc">'+str+'</dt></dl></div></div><div class="guess_like_wrapper clearfix"><div class="side_bar"></div><p class="guess_like_title" >猜你喜欢</p></div><div class="swiper-container"><div class="swiper-wrapper clearfix">'+h+'</div></div></div>';
                $(".main_bg").append(outer);
                $(".img_wrapper img").css({"height": (document.documentElement.clientWidth-3)/2*0.5 + "px","max-height": "254.8px"});
                $(".img_wrapper").css({"height": (document.documentElement.clientWidth-3)/2*0.5  + "px","max-height": "254.8px"});
                $(document).ready(function () {
                    myswiper = new Swiper(".swiper-container", {
                        autoplay: 2000,
                        direction: "horizontal",
                        loop: true,
                        slidesPerView: 2,
                        spaceBetween: 3,
                        autoplayDisableOnInteraction:false
                    });
                });
            } else if (data.infocode === "1") {
                alert("系统错误");
            } else if (data.infocode === "2") {
                alert("无对应商品列表");
            }
        }, errFn);
        function importCss(){
            $("head").prepend("<link rel='stylesheet' href='/css/swiper.min.css'><link rel='stylesheet' href='/css/buy/cainixihuan.css'>");
        }
        function errFn() {
            alert("请求失败");
        }
    }
    return guesslike;
});

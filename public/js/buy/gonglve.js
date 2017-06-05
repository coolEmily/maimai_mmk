require.config({baseUrl:"/js/lib",paths:{swiper: "swiper.min"}});
require(["zepto","lib","swiper"],function ($, lib) {
    var lib=new lib();
    var reqUrl=lib.getReq(),gonglve={};
    $.extend(gonglve,{
        init:function () {
            var _t=this;
            _t.sliderFn();
            //_t.bindEvent()
        },
        sliderFn:function () {
            var _t=this;
            var mySwiper=new Swiper(".v-banner",{
                direction: 'horizontal',
                autoplay: 3000,
                autoplayDisableOnInteraction : false,
                autoHeight: true,
                loop:true,
                // onSlideChangeEnd: function(swiper){
                //     $("#serial_number span").eq($("#slider_Img .swiper-slide.swiper-slide-active").attr('data-swiper-slide-index')).addClass('selected').siblings().removeClass('selected');
                // },
            })
        },
        bindEvent:function () {
            $(".v-title li").on("tap",function () {
                var ind=$(this).index();
                $(this).addClass("cur").siblings().removeClass("cur");
                $(".v-content>div").eq(ind).show().siblings().hide();
            })
        }

    });
    gonglve.init();
});

require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1", paths:{swiper: "swiper.min"}});
require(['zepto', 'lib','visitor-logs'], function($, lib, vl){
    lib = new lib();
    $(function(){
        vl.setLog(window.location.href, 2);//会员访问日志
        $(document).on("touchstart", ".gh", function(){
            $(".ganhong").hide();
            $(".ganbai").hide();
            $(".qipao").hide();
            $(".ganhong").show();
        });
        $(document).on("touchstart", ".gb", function(){
            $(".ganbai").hide();
            $(".ganhong").hide();
            $(".qipao").hide();
            $(".ganbai").show();
        });
        $(document).on("touchstart", ".th", function(){
            $(".qipao").hide();
            $(".ganbai").hide();
            $(".ganhong").hide();
            $(".qipao").show();
        });
    });
});

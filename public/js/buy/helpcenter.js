require.config({baseUrl:'/js/lib'});
require(['zepto','lib'],function ($,lib) {
    var lib=new lib();
    $(function () {
        $(document).on("tap",".help-tab li",function () {
            var ind=$(this).index();
            if(!$(this).hasClass("active")){
                $(this).addClass("active").siblings().removeClass("active");
                $(".help-cont>div").eq(ind).addClass("cur").siblings().removeClass("cur");
            }
        })
    })
});

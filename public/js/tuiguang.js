require.config({baseUrl: "/js/lib"});
require(['zepto', 'lib'], function ($, lib) {
    lib = new lib();
    var reqUrl = lib.getReq();

    $(function () {
        bindEvent();
        function bindEvent() {
            //搜索框事件
            $(document).on("tap", ".ind_search_r", function () {
                if ($(".ind_search_cen input").val().trim() === "") {
                    alert("请输入搜索关键字");
                    return;
                }
                location.href = "/buyer/liebiao.html?goodsKeywords=" + $(".ind_search_cen input").val().trim();
            });
            //导航栏事件
            $(document).on("click", ".nav_li:not(.cur)", function () {
                var index = $(this).index();
                $(this).addClass("cur").siblings().removeClass("cur");
                $(".shangp_list > div").eq(index).addClass("shangp_list_cur").siblings().removeClass("shangp_list_cur");
            });
            //添加购物车
            $(document).on("tap", ".ind_sx_cart i", function () {
                lib.ajx(reqUrl.ser + "shoppingCart/addToCart.action", {
                    goodsNum: 1,
                    goodsId: $(this).attr("data-goodsId")
                }, function (data) {
                    if (data.infocode === "0") {
                        alert("成功添加购物车");
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("添加购物车失败");
                });
            });
            //移动端点击跳转到首页
            $(".shangp_list").on("tap",function (e) {
                e = e || window.event;
                e.target = e.target || e.srcElement;
                if(lib.checkMobile()){
                    if(e.target.className!="ind_sx_cart_i"){
                        var gId=$(e.target).closest(".ind_sx_list").find(".ind_sx_cart_i").attr("data-goodsId");
                        location.href="/g?mId=914&gId="+gId;
                    }
                }
            });
            //二维码
            $(document).on("mouseover mouseout", ".ind_sx_list", function (e) {
                e = e || window.event;
                e.target = e.target || e.srcElement;
                if (!lib.checkMobile()){
                    if (!$(e.target).hasClass("ind_sx_list")) {
                        $(e.target).closest(".ind_sx_list").children(".erweima").toggle();
                    }
                    $(e.target).children(".erweima").toggle();
                }
            });
        }
    });
});

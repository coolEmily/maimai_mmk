requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib','hhSwipe','visitor-logs','wxReg'], function ($,lib,hhswiper,vl,wxReg) {
        lib = new lib();
        var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    $(function(){
        var detail = {};
        $.extend(detail, {
            init: function () {
                var _t = this;
                var mId=objGid.mId===''?'1':objGid.mId;
                _t.igoods=objGid.gId;
                _t.igoods = _t.igoods ? _t.igoods : 10042;
                _t.detailAjax();//详情页数据
                _t.collectAjax();//点击收藏
                _t.contextShow();//内容收缩展开
                wxReg.reg(mId,_t.igoods);
                common.tools.gotopFun();
                common.js.getCartNum();//购物车数量

                if (window.sessionStorage) {//本地存储商品id
                    sessionStorage.igoods = _t.igoods;
                }

                vl.setLog(window.location.href, '1');//会员访问日志
                sessionStorage.mm_mId = common.tools.getUrlParam('mId')===''?'1':common.tools.getUrlParam('mId');
            },
            contextShow: function () {
                $(".ui-transd-999").on("click", function () {
                    var thisdiv = $(this).next("div");
                    if (!thisdiv.is(":visible")) {
                        thisdiv.show();
                        $(this).addClass("show_transd");
                    } else {
                        thisdiv.hide();
                        $(this).removeClass("show_transd");
                    }

                });
            },
            //飞入购物车and立即购买
            flyFun: function () {
                var _t = this;
                $("#cart_bind").on("tap", function (event) {
                    $("#flyImg").show();
                    var action = $(this).attr("action");
                    var goodsNum = isNaN(Number($("#num").val())) ? 1 : Number($("#num").val());
                    common.js.ajx(reqUrl.ser+"shoppingCart/addToCart.action",{goodsId:_t.igoods,isBind:0,goodsNum: goodsNum},function(data){
                        if(data.infocode == "0"){
                            $("#flyImg").show();
                            var r = setInterval(function () {//动画结束时执行定时器
                                $("#flyImg").hide();
                                common.js.getCartNum();
                                clearInterval(r);
                                if (action == "goCart") {
                                    window.location.href = "/gowuche.html";
                                }
                            }, 2000);
                        }else{
                            alert(data.info);
                        }
                    },function(d){
                       alert('加入购物车失败！');
                    });
                });
                //立即购买
                $(document).on("tap", "#ui-buy-now:not(.ui-ing)", function(){
                    if($.cookie("member_loginName")) {
                        if (lib.checkWeiXin() && $.cookie("member_loginName").length !== 11) {
                            location = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                            return;
                        }
                    }
                    $(this).addClass("ui-ing");
                    var goodsNum = isNaN(Number($("#num").val())) ? 1 : Number($("#num").val());
                    lib.onLoading();
                    common.js.ajx(reqUrl.ser+"shoppingCart/atOnceBuy.action", {goodsId: _t.igoods,goodsNum: goodsNum}, function(data){
                        if(data.infocode === "0"){
                            location.href = "/buyer/order/dingdanqr.html";
                        }else{
                            alert(data.info);
                            $(this).removeClass("ui-ing");
                            if(data.infocode === "1"){
                                location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                            }
                        }
                    }, function(){
                        $(this).removeClass("ui-ing");
                        alert("请求失败");
                    });
                });
            },
            //阻止默认touchmove事件
            preventFun: function () {
                document.body.addEventListener('touchmove', function (event) {
                    if ($("#slider_big").html() !=="") {
                        event.preventDefault();
                    }
                }, false);
            },
            //点开大图显示
            showBigpic: function () {
                var _t = this;
                var imgLI = $("#slider_Img li");//小轮播
                _t.preventFun();

                imgLI.on("click", function () {
                    var thisli = $(this).index();
                    $("#slider_big").html(_t.photoStrbig);

                    var slider_Img_big = $("#slider_Img_big");//大轮播
                    _t.imgbigLI = $("#slider_Img_big li");
                    _t.imgbigLI.eq(thisli).prependTo(slider_Img_big.find("ul"));//将当前li调整到大图轮播的第一个
                    slider_Img_big.show();
                    $("body").scrollTop(0);

                    _t.sliderBig();
                });
            },
            //轮播图滚动
            slider: function () {
                var _t = this;
                var slider = Swipe(document.getElementById('slider_Img'), {
                    auto: 5000,
                    continuous: true,
                    callback: function (pos) {
                        $("#serial_number span").eq(pos).addClass('selected').siblings().removeClass('selected');
                    }
                });

                //捆绑页面(单个商品轮播)
                var slider_kun = Swipe(document.getElementById('goods_list'), {
                    auto: 0,
                    continuous: true
                });
            },
            //大图轮播
            sliderBig: function () {
                var _t = this;
                //大轮播图点击事件
                _t.imgbigLI.on("click", function () {
                    $("#slider_Img_big").remove();
                });
                var sliderBig = Swipe(document.getElementById('slider_Img_big'), {
                    auto: 0,
                    continuous: true
                });
            },
            //收藏
            collectAjax: function () {
                var _t = this;
                var collectUrl = reqUrl.ser + "goodsCollect/saveGoodsCollect.action";//点击收藏
                var deleteCollectUrl = reqUrl.ser + "goodsCollect/updateGoodsCollect.action";//取消收藏
                var ifCollectUrl = reqUrl.ser + "goodsCollect/selectGoodsCollect.action";//是否收藏

                //是否收藏
                common.js.ajx(ifCollectUrl, {goodsId: _t.igoods}, function (data) {
                    if (data.infocode == 2) {
                        $("#collect").removeClass("cur");
                    } else {
                        $("#collect").addClass("cur");
                    }
                }, function () {
                    alert("收藏fail");
                });

                //点击收藏或取消收藏
                $("#collect").click(function () {
                    var hasClass = $(this).hasClass("cur");
                    var collectEle = $("#collect");
                    if (!hasClass) {
                        //添加收藏
                        common.js.ajx(collectUrl, {goodsId: _t.igoods}, function (data) {
                            if (data.infocode === "0") {
                                collectEle.addClass("cur");
                            } else if (data.infocode == 2) {
                                alert(data.info);
                                location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                            } else {
                                alert(data.info);
                            }
                        }, function () {
                            alert("点击收藏fail");
                        });
                    } else {
                        //取消收藏
                        common.js.ajx(deleteCollectUrl, {goodsId: _t.igoods}, function (data) {
                            if (data.infocode === "0") {
                                collectEle.removeClass("cur");
                            } else if (data.infocode == 2) {
                                alert(data.info);
                                location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                            } else {
                                alert(data.info);
                            }
                        }, function () {
                            alert("取消收藏fail");
                        });
                    }
                });
            },
            detailAjax: function () {
                var _t = this,
                    detailUrl = reqUrl.ser + "/goodsBase/goodsBaseBindInfo.action?goodsId=" + _t.igoods;
                $.ajax({
                    type: "get",
                    async: false,
                    url: detailUrl,
                    dataType: "jsonp",
                    jsonp: "jsonpCallback",
                    success: function (data) {
                        $("#container").show();
                        _t.detailData(data);
                    },
                    error: function () {
                        alert("fail");
                    }
                });

            },
            //生成结构html
            detailData: function (data) {
                var _t = this;
                _t.sliderEle = $("#slider_Img ul");

                if (data.infocode == "0") {
                    var dataInfo = data.info;
                    var slogan=dataInfo.slogan;//商品广告语
                    //相册数据
                    var goodsPics = dataInfo.list_photo,
                        photoStr = '<li><img src="' + reqUrl.imgPath + lib.getImgSize(dataInfo.mainPictureJPG,"E")+'"/></li>',
                        dotStr = '<span class="point selected"></span>';

                    _t.photoStrbig = '<div id="slider_Img_big" class="slider_Img_big"><ul>';
                    _t.photoStrbig += '<li><img src="' + reqUrl.imgPath + dataInfo.mainPictureJPG + '"/></li>';
                    $.each(goodsPics, function (index, item) {
                        photoStr += '<li><img src="' + reqUrl.imgPath + item.albumURL + '"/></li>';
                        dotStr += '<span class="point"></span>';
                        _t.photoStrbig += '<li><img src="' + reqUrl.imgPath + item.albumURL + '"/></li>'; //放大图片
                    });
                    _t.photoStrbig += "</ul></div>";
                    _t.sliderEle.html(photoStr);

                    $("#serial_number").html(dotStr);
                    $("#slider_Img img").each(function(i,v){//不规则图片控制
                        $(this).height($(this).width());
                    });
                    //是否下架
                    if(dataInfo.addToCart==="0"){
                        $("#cart_bind").css("background","#999");
                        $("#ui-buy-now").css("background","#666");
                        $("#cart_bind, #ui-buy-now").tap(function(){
                            alert("商品已下架或库存不足！");
                        });
                    }else {
                        //飞入购物车图片
                        $("#flyImg").attr("src", reqUrl.imgPath + dataInfo.mainPictureJPG);
                        _t.flyFun();
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem("orderImgs", reqUrl.imgPath + dataInfo.mainPictureJPG);//结算页用到的酒图片
                        }
                    }

                    //是否售罄
                    if(dataInfo.goodsBaseMax ==="0"){
                        $("#sale_out").show();
                    }

                    //商品信息
                    var textBox = '';
                    $("#goods_name").html('<span>' + dataInfo.chName + '</span><span class="red_text">￥' + dataInfo.sellingPrice + '</span>');
                    $("#goods_ename").html('<span>' + dataInfo.enName + '</span><span class="through">市场价:￥' + dataInfo.marketPrice + '</span>');
                    $("#infobox").html('<p>信息</p><span>已售: ' + dataInfo.sellShowNumber + '</span><span>库存: ' + dataInfo.goodsBaseMax + '</span><span>收藏: ' + dataInfo.goodsCollection + '</span>');

                    //单个商品列表
                    var goodsListStr = "";
                    var len = dataInfo.bind_goods.length;

                    $.each(dataInfo.bind_goods, function (index, item) {
                        if (index % 2 === 0) {
                            goodsListStr += '<li><dl id="' + item.bind_goodsId + '"><dt><a href="javascript:void(0)"><img' +
                                ' src="' + reqUrl.imgPath + item.bind_mainPictureJPG + '" alt=""></a></dt><dd><a href="javascript:void(0)">' + item.bind_chName + '</a><span>X' + item.goodsNum + '</span></dd></dl>';
                            if ((index + 1) <= len) {
                                 item = dataInfo.bind_goods[index + 1];
                                goodsListStr += '<dl id="' + item.bind_goodsId + '"><dt><a href="javascript:void(0)"><img' +
                                    ' src="' + reqUrl.imgPath + item.bind_mainPictureJPG + '" alt=""></a></dt><dd><a href="javascript:void(0)">' + item.bind_chName + '</a><span>X' + item.goodsNum + '</span></dd></dl></li>';
                            } else {
                                goodsListStr += '</li>';
                            }
                        }

                    });
                    $("#goods_list ul").html(goodsListStr);

                    _t.slider();
                    _t.showBigpic();

                    _t.singleGoods(dataInfo.bind_goods[0].bind_goodsId);//首次加载、默认加载第一个商品
                    $("#goods_list dl").on("click", function () {
                        _t.singleGoods($(this).attr("id"));
                    });

                    //tdk信息
                    $("#title").html(dataInfo.title);
                    $("#keywords").attr("content",dataInfo.keyWords);
                    $("#description").attr("content",dataInfo.description);
                }
            },
            //调取单个商品信息
            singleGoods: function (singleId) {
                var singleUrl = reqUrl.ser + "goodsBase/goodsBaseInfo.action";

                common.js.ajx(singleUrl, {goodsId: singleId}, function (data) {
                    if (data.infocode === "0") {
                        singleInfo(data.info);
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("单个商品信息调取失败！");
                });

                function singleInfo(dataInfo) {
                    //图文详情
                    var imgInfo = "";
                    $.each(dataInfo.list_goodsRich, function (index, item) {
                        imgInfo += '<img src="' + reqUrl.imgPath + item.pictureUrl + '"/>';
                    });
                    $("#img_info").html(imgInfo);

                    //规格参数
                    var specificationStr = "";
                    $.each(dataInfo.list_goodsParameters, function (index, item) {
                        specificationStr += '<li><span>' + item.parametersName + '</span><span>' + item.parametersValue + '</span></li>';
                    });

                    specificationStr===""?specificationStr="---暂无信息---":"";
                    $("#specification").html(specificationStr);

                    //售后服务
                    dataInfo.classService?$("#service_img").attr("src", reqUrl.imgPath + dataInfo.classService):"";
                }

            }
            //finshed
        });

        detail.init();
        window.onunload = function(){
            sessionStorage.removeItem("mm_cp20160824");
        }
    });
});
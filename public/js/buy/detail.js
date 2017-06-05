requirejs.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
requirejs(['zepto','lib','hhSwipe','visitor-logs','wxReg'], function ($,lib,hhswiper,vl,wxReg) {
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    $(function(){
        var detail={};
        $.extend(detail,{
            redp: lib.getUrlParam("redp"),
            init:function(){
                var _t=this;
                if(objGid.mId){//获取mId,从链接拿
                    _t.mId=objGid.mId;
                }else if($.cookie("maimaicn_s_id")){//从cookie拿mId
                    _t.mId=$.cookie("maimaicn_s_id");
                }else{//默认等于mId=1
                    _t.mId="1";
                }
                _t.igoods=objGid.gId;
                _t.igoods=_t.igoods?_t.igoods:10035;
                _t.detailAjax();//详情页数据
                _t.collectAjax();//点击收藏
                _t.comparePrice();//比价
                _t.guesslike();//猜你喜欢
                _t.advertisement();//广告
                _t.popShow();//服务规格选择弹窗
                wxReg.reg(_t.mId,_t.igoods);
                common.tools.gotopFun();
                _t.tabFun();
                _t.countsFun(99);//商品数量
                common.js.getCartNum();//购物车数量

                if(window.sessionStorage){//本地存储商品id
                    sessionStorage.igoods=_t.igoods;
                }

                vl.setLog(window.location.href, '1');//会员访问日志
                sessionStorage.mm_mId = $.cookie("maimaicn_f_id");

                $("#upBtn").on("click",function(e){//返回顶部
                    $("body").scrollTop(0);
                });

                if(_t.redp){
                  _t.takeRedPacket();
                }
            },
            takeRedPacket: function(){
              var _t = this;
              lib.ajx(lib.getReq().ser + "/redPacket/takeRedPacket.action",{redPacketTypeId: _t.redp,issueMemberId: (lib.getUrlParam("mId") || 1)},function(data){
                console.log(data.infocode);
              });
            },
            goldCoinFun:function(){
                var _t=this;
                if(objGid.gcoin && objGid.gcoin==="1"){//金豆详情页(无猜你喜欢+页脚改变+价格部分改变)
                    var aprice=$("#goods_ename .price").attr("p");
                    if(aprice){
                        $(".price_reduce").css("color","#999").html("参考价：￥"+aprice).show();
                    }
                    $("#footer .coinbox").show();
                    $("#selectItem").unbind("click");//商品规格不点开
                    $("#ads .adver a").attr('href','javascript:void(0)');//广告位点不进去

                    common.js.ajx(reqUrl.ser+"virtualMoneyGoods/getVirtualMoneyprice.action", {goodsId:_t.igoods}, function(data){//金豆价格
                        var virtualMoneyprice="0";
                        if(data.infocode === "0"){
                            virtualMoneyprice=data.info.virtualMoneyprice;
                        }
                        $(".price_gcoin").html('<em>售价： </em>'+virtualMoneyprice+'<em>金豆</em>').show();
                    });

                }else{//正常详情页
                    $("#ads_guess .guess").show();//猜你
                    $("#footer ul").show();//页脚

                    //价格区域
                    $("#price_reduce").show();
                    $("#goods_ename .price").show();
                }
            },
            getImgH: function(h){
                h = h || 180;
                var w = document.documentElement.clientWidth || document.body.clientWidth;
                w = w > 750 ? 750 : (w < 320 ? 320 : w);
                if(w % 2 != 0){
                    w = w - 1;
                }
                return Math.floor(w / 750 * h) + "px";
            },
            advertisement:function(){//广告位
                 var _t=this;
                common.js.ajx(reqUrl.ser+"/goodsBase/getAdInGoodsPgae.action",{memberId:_t.mId},function(data){
                    if(data.infocode==="0"){
                        adverFun(data.info);
                    }
                }, function(){
                   // alert("广告位失败");
                });

                function adverFun(df){
                    var mainPageSourceId=df.mainPageSourceId;
                    var readNum=df.readNum;

                    switch(df.showType){
                        case 1://左上角标题，广告图片占据整屏
                            var h = '';
                            var imgHt = _t.getImgH(328);
                            h += '<a href="'+df.linkUrl+'" class="adver" data-id="'+mainPageSourceId+'">'+
                                '<div class="title">'+df.title+'</div>'+
                                '<div><img src="'+ reqUrl.imgPath +df.imgAUrl+'" style="height:'+ imgHt +';max-height:'+ imgHt +'" /></div>'+
                                '<div class="con clearfix"><span>'+df.adName+'</span><span class="ll">'+readNum+'次浏览</span></div>'+
                                '</a>';
                            break;
                        case 2://左边是标题+文字描述 右边是图片
                            var h = '';
                            var imgHt = _t.getImgH(212);
                            h += '<a href="'+df.linkUrl+'" class="adver clearfix"  data-id="'+mainPageSourceId+'">'+
                                '<div>'+
                                '<div class="adver_l"><img src="'+ reqUrl.imgPath +df.imgAUrl+'" style="height:'+ imgHt +';max-height:'+ _t.maxImgHt +'" /></div>'+
                                '<div class="adver_r">'+
                                '<div class="title">'+df.title+'</div>'+
                                '<div class="con con1 clearfix">'+
                                '<span>'+df.adName+'</span><span class="ll">'+readNum+'次浏览</span>'+
                                '</div> '+
                                '</div> '+
                                '</div>'+
                                '</a>'+
                                '</div>';
                            break;
                        case 3://左上是标题 2个图片在下
                            var h = '';
                            var imgHt = _t.getImgH(212);
                            h += '<a href="'+df.linkUrl+'" class="adver"  data-id="'+mainPageSourceId+'">'+
                                '<div class="title">'+df.title+'</div>'+
                                '<div class="img_2"><img src="'+ reqUrl.imgPath +df.imgAUrl+'" style="height:'+ imgHt +';max-height:'+ _t.maxImgHt +'" /><img src="'+ reqUrl.imgPath +df.imgBUrl+'" style="height:'+ imgHt +';max-height:'+ _t.maxImgHt +'" /></div>'+
                                '<div class="con clearfix"><span>'+df.adName+'</span><span class="ll">'+readNum+'次浏览</span></div>'+
                                '</a>';
                            break;
                        case 4://左上是标题 3个图片在下
                            var h = '';
                            var imgHt = _t.getImgH(136);
                            h += '<a href="'+df.linkUrl+'" class="adver"  data-id="'+mainPageSourceId+'">'+
                                '<div class="title">'+df.title+'</div>'+
                                '<div class="img_3"><img src="'+ reqUrl.imgPath +df.imgAUrl+'" style="height:'+ imgHt +';max-height:'+ _t.maxImgHt +'" /><img src="'+ reqUrl.imgPath +df.imgBUrl+'" style="height:'+ imgHt +';max-height:'+ _t.maxImgHt +'" /><img src="'+ reqUrl.imgPath +df.imgCUrl+'" style="height:'+ imgHt +';max-height:'+ _t.maxImgHt +'" /></div>'+
                                '<div class="con clearfix"><span>'+df.adName+'</span><span class="ll">'+readNum+'次浏览</span></div>'+
                                '</a>';

                            break;
                    }

                    $("#ads").append(h);
                    addSourceNum();
                    if(df.adName == "广告"){//如果是'广告'两个字加上圈；
                        $('.con span:first-child').attr('class', 'gg');
                    }

                    function addSourceNum(){ //调取 广告浏览次数
                        $("#ads .adver").off().on('tap',function(){
                            var dId=$(this).attr("data-id");
                            common.js.ajx(reqUrl.ser+"/mainPage/addSourceNum.action", {mainPageSourceId:dId}, function(data){
                                if(data.infocode === 0){
                                   // console.log("更新成功");
                                }

                            });
                        });
                    }

                }
            },
            guesslike:function(){
                common.js.ajx(reqUrl.ser+"/goodsBase/goodsBaseListInfoByLove.action",{infoId:33},function(data){
                    if(data.infocode==="0"){
                        var like_str='';
                        $.each(data.info.list_goodsBase,function(i,v){
                            var limitcoupon=v.limitcoupon?'红包立减'+v.limitcoupon+'元':"";

                            like_str+='<li><a href="/g?'+lib.getMid()+'&gId='+v.goodsId+'";><img src="'+reqUrl.imgPath+v.mainPictureJPG+'_C" alt=""/><span class="gname">'+v.chName+'</span><p><span>￥'+v.sellingPrice+'</span><span>'+limitcoupon+'</span></p></a></li>';

                        });
                        $("#guess_container").html(like_str);
                    }else{
                        alert(data.info);
                    }
                }, function(){
                    //alert("猜你喜欢请求失败");
                });
            },
            locationUrl:function(){
                var _t=this;

                $("#con_list .contains1").on("tap",function(){
                    var pId=$(this).parent("li").attr("id"),
                        pvId=$(this).attr("id");
                    $(this).addClass("select").siblings().removeClass("select");
                    common.js.ajx(reqUrl.ser+"goodsBase/getGoodsIdByPerIds.action",{goodsId:_t.igoods,parametersId:pId,parametersValueId:pvId},function(data){
                        if(data.infocode==="0"){
                            var df=data.info;
                               _t.igoods=df.goodsId;//替换商品I
                            var walletSubtract_change="";

                            if(df.limitcoupon && df.limitcoupon>0 && df.goodsLookType != 3){//红包立减
                                walletSubtract_change='红包立减'+df.limitcoupon+'元';
                            }

                            //替换商品信息
                            $("#infomation .goodsImg img").attr('src',reqUrl.imgPath+df.mainPictureJPG);
                            $("#infomation .price").html('<span>￥'+df.sellingPrice+'</span><br/><span>'+walletSubtract_change+'</span>');

                            //是否下架
                            if(df.addToCart==="0"){
                                $("#cart_bind").css("background","#999");
                                $("#ui-buy-now").css("background","#666");
                                $("#cart_bind, #ui-buy-now").tap(function(){
                                    alert("商品已下架或库存不足！");
                                });
                            }else{
                                _t.atOnceType=df.goodsLookType;//区分 1--普通商品、2--新客开单、3--零元购、4-新加活动。
                                _t.buyAtOnce();//立即购买

                                if(_t.atOnceType==="3" || _t.atOnceType==="4"){
                                    $("#cart_bind").css("background","#999");
                                }else{
                                    _t.addCart();//加入购物车
                                }
                            }

                        }else{
                            alert(data.info);
                        }

                    }, function(){
                        alert("请求失败");
                    });
                });
            },
            countsFun:function(maxNum) {
                maxNum=maxNum>99?99:maxNum;
                maxNumNext=maxNum-1;
                $("#num").val(1);
                $("#num").on("blur",function(){
                    var v=$(this).val();
                    if(isNaN(v)){
                        $(this).val(1);
                    }else{
                        v>maxNum?v=maxNum:"";
                        v<1?v=1:"";
                    }
                    $(this).val(v);
                    $("#gnumber").html(v+"个");
                });
                $("#numprev").on("click",function(){
                    var thisInput=$("#num");
                    var v=thisInput.val();
                    v<=maxNumNext?v++:"";
                    thisInput.val(v);
                    $("#gnumber").html(v+"个");
                });
                $("#numnext").on("click",function(){
                    var thisInput=$("#num");
                    var v=thisInput.val()<=1?2:thisInput.val();
                    v>=1?v--:"";
                    thisInput.val(v);
                    $("#gnumber").html(v+"个");
                });
            },
            popShow:function(){
                var _t=this;
                $("#guarantee").click(function(){//服务说明
                    $("#serviceInstruction").show();
                });

                $("#selectItem").click(function(){//规格选择
                    $("#selectParameter").show();
                });
                $(".show_pop").click(function(){
                    $("#selectParameter").show();
                });

                $("#serviceInstruction .close_btn").click(function(){//关闭服务弹窗
                   $("#serviceInstruction").hide();
                });

                $("#selectParameter .close_btn").click(function(){//关闭规格选择弹窗并跳转
                    $("#selectParameter").hide();
                    if(_t.igoods!==objGid.gId)location="/g?"+lib.getMid()+"&gId="+_t.igoods;
                });


            },
            //加入购物车and立即购买
            addCart: function () {
                var _t = this;
                $("#cart_bind").unbind("click");
                $("#cart_bind").on("click", function (event) {
                    //添加cnzz事件统计  lichengyu 20170414
                    _czc.push(["_trackEvent","购物车","加入购物车",_t.chName,1,"addCartBtn"]);
                    var goodsNum = isNaN(Number($("#num").val())) ? 1 : Number($("#num").val());
                    common.js.ajx(reqUrl.ser + "shoppingCart/addToCart.action", {
                        goodsId: _t.igoods,
                        isBind: 0,
                        goodsNum: goodsNum
                    }, function (data) {
                        if (data.infocode === "0") {
                            $("#selectParameter").hide();
                            alert("加入购物车成功！");
                            common.js.getCartNum();//购物车数量
                            if(_t.igoods!==objGid.gId)location="/g?"+lib.getMid()+"&gId="+_t.igoods;
                        } else {
                            alert(data.info);
                        }
                    }, function (d) {
                        alert('加入购物车失败！');
                    });
                });
            },
            buyAtOnce:function(){
                var _t = this;
                //立即购买
                $(document).on("tap", "#ui-buy-now:not(.ui-ing)", function(){
                    if($.cookie("member_loginName")){
                        if (lib.checkWeiXin() && $.cookie("member_loginName").length !== 11) {
                            //添加cnzz自定义访客统计  lichengyu 20170420
                            _czc.push(["_setCustomVar",'是否登录','未登录',1]);
                            location = "/login/bangding.html?backUrl=" + common.tools.getBackUrl();
                            return;
                        }else{
                            _czc.push(["_setCustomVar",'是否登录','已登录',1]);
                        }
                    }

                    $(this).addClass("ui-ing");
                    var goodsNum = isNaN(Number($("#num").val())) ? 1 : Number($("#num").val());
                    lib.onLoading();
                    //添加cnzz事件统计  lichengyu 20170414
                    _czc.push(["_trackEvent","购买","立即购买",_t.chName,1,"buyBtn"]);
                    //1--普通商品、2--新客开单、3--零元购、4--新活动
                    if(_t.atOnceType==="3"){
                        location.href = "/buyer/order/dingdanqr_n.html?gId="+_t.igoods+"&gN="+goodsNum;
//                    }else if(_t.atOnceType==="2"){
//                        location.href = "/buyer/order/dingdanqr_new.html?gId="+_t.igoods;
                    }else if(_t.atOnceType==="4"){
                        var acIdN=lib.getUrlParam("acIdN")?lib.getUrlParam("acIdN"):"";//从上个页面传来的活动Id
                        location.href = "/buyer/order/dingdanqr_n.html?gId="+_t.igoods+"&gN="+goodsNum+"&acIdN="+acIdN;
                    }else{
                        common.js.ajx(reqUrl.ser+"shoppingCart/atOnceBuy.action", {goodsId: _t.igoods,goodsNum: goodsNum}, function(data){
                            if(data.infocode === "0"){
                                location.href = "/buyer/order/dingdanqr.html";
                            }else{
                                $(this).removeClass("ui-ing");
                                alert(data.info);
                                if(data.infocode === "1"){
                                    location = "/buyer/login/dlzc.html?backUrl=" + common.tools.getBackUrl();
                                }
                            }
                        }, function(){
                            alert("请求失败");
                            $(this).removeClass("ui-ing");
                        });
                    }

                });

            },
            //tab切换
            tabFun:function(){
                var _t=this;
                _t.pageNoBtc=5;//接口前20条已经加载，所以从第五页开始，每页五条
                $("#tabContent .item:eq(0)").show();
                $("#tabCon li").click(function(){
                    var ind=$(this).index();
                    $(this).addClass("cur").siblings().removeClass("cur");
                    $("#tabContent .item:eq("+ind+")").show().siblings("div").hide();

                    if($("#tabCon .cur").index()==2){
                        $(window).scroll(function (){
                            if($(window).scrollTop() > $(document).height() - $(window).height() - 10){
                                var curIndex=$("#commentTitle .cur").index();
                                _t.pageNoBtc++;
                                _t.commentAjax(curIndex);
                            }
                        });
                    }
                });
            },
            //阻止默认touchmove事件
            preventFun:function(){
                document.body.addEventListener('touchmove', function (event) {
                    if( $("#slider_big").html()!==""){
                        event.preventDefault();
                    }
                }, false);
            },
            //点开大图显示
            showBigpic:function(){
                var _t=this;
                var imgLI=$("#slider_Img li");//小轮播

                _t.preventFun();

                imgLI.on("click",function(){
                    var thisli=$(this).index();
                    $("#slider_big").html(_t.photoStrbig);

                    var slider_Img_big=$("#slider_Img_big");//大轮播
                    _t.imgbigLI=$("#slider_Img_big li");
                    _t.imgbigLI.eq(thisli).prependTo(slider_Img_big.find("ul"));//将当前li调整到大图轮播的第一个
                    slider_Img_big.show();
                    $("body").scrollTop(0);

                    _t.sliderBig();
                });
            },
            //轮播图滚动
            slider:function(){
                var _t=this;
                var slider = Swipe(document.getElementById('slider_Img'),{
                    auto: 5000,
                    continuous: true,
                    callback: function(pos){
                        $("#serial_number span").eq(pos).addClass('selected').siblings().removeClass('selected');
                    }
                });
            },
            //大图轮播
            sliderBig:function(){
                var _t=this;

                //大轮播图点击事件
                _t.imgbigLI.on("click",function(){
                    $("#slider_Img_big").remove();
                    //document.body.removeEventListener('touchmove', function (event) {event.preventDefault();}, false);
                });

                var sliderBig = Swipe(document.getElementById('slider_Img_big'),{
                    auto:0,
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
                   // alert("收藏fail");
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
            //闪购倒计时
            repeatFun:function(timeNum,_this){
                var _t=this;
                var futureDate  = new Date( timeNum),
                    currentDate = new Date();
                var diff =(futureDate-currentDate) / 1000;

                if(diff < 0) {
                    diff = 0;
                    clearInterval(_t.repeat);
                }
                function formatDate(now) {
                    function zero(n){
                        return n=n<10?"0"+n:n;
                    }
                    var   date=0;
                    var   hour=zero(Math.floor((now-(date*24*60*60))/(60*60)));
                    var   minute=zero(Math.floor((now-(date*24*60*60)-(hour*60*60))/60));
                    var   second=zero(Math.floor(now-(date*24*60*60)-(hour*60*60)-(minute*60)));

                    _this.html(hour+":"+minute+":"+second);
                }
                formatDate(diff);
            },
            detailAjax:function(){
                var _t=this,
                    detailUrl=reqUrl.ser+"goodsBase/goodsBaseInfo.action?goodsId="+_t.igoods;
                $.ajax({
                    type : "get",
                    async:false,
                    url :detailUrl,
                    dataType : "jsonp",
                    jsonp: "jsonpCallback",
                    success : function(data){
                        $("#container").show();
                        _t.detailData(data);
                    },
                    error:function(){
                        //alert("网络不给力，请稍后重试！");
                    }
                });

            },
            comparePrice:function(){
                var _t=this;
                getComparePrice(_t.igoods);
                //从后台获取商品比价信息  gid:详情页商品id
                function getComparePrice(gId) {
                    lib.ajx(lib.getReq().ser + 'comparePrice/getComparePrice.action', {goodsId: gId}, function (data) {
                        if (data.infocode === '0') {
                            //data = {"infocode":"0","info":{"jdId":1016412724,"suNingId":"","jdPrice":198,"suNingPrice":0,"firstId":"53944722","firstPrice":0}};
                            $('#comparePrice').show();//比较按钮显示
                            var i = data.info;
                            equalStr(i.jdId, 'jingdong', '#jingdong');
                            equalStr(i.suNingId, 'suning', '#suning');
                            equalStr(i.firstId, 'yihaodian','#yihaodian');
                        } else {
                            $('#comparePrice').hide();//比较按钮隐藏
                        }
                    });
                }
                //判断是否有比价信息  price:价格  gId:第三方商品id  type:第三方店铺类别  obj:html元素对象
                function equalStr(gId, type, obj){
                    if(gId){//存在第三方Id,获取价格
                        getThirdpartyPrice(type, gId, obj);
                    }else{//不存在对应第三方价格信息
                        $(obj).parent().hide();//隐藏对应第三方比较信息
                    }
                }
                //从第三方商家获取价格信息  type:第三方店铺类别  gId:第三方商品ID  obj:html元素对象
                function getThirdpartyPrice(type, gId, obj) {
                    var scpUrl = lib.getReq().ser+"comparePrice/setComparePrice.action";
                    switch (type) {
                        case 'jingdong':
                            $.ajax({
                                type: "get",
                                url: 'http://p.3.cn/prices/get?type=1&area=1_72_2799&pdtk=&pduid=585371343&pdpin=&pdbp=0&skuid=J_' + gId,
                                dataType: "jsonp",
                                jsonpCallback: "cnp",
                                success: function (data) {
                                    equalPrice(data[0].p, obj);
                                    lib.ajx(scpUrl,{goodsId:_t.igoods,jdPrice:data[0].p},function(){},function(){});
                                },
                                error: function (data) {
                                    console.log('get jingdong price error.');
                                }
                            });
                            break;
                        case 'suning':
                            $.ajax({
                                type: "get",
                                url: 'http://icps.suning.com/icps-web/getAllPriceFourPage/000000000' + gId + '__010_0100101_1_pc_showSaleStatus.vhtm',
                                dataType: "jsonp",
                                jsonpCallback: "showSaleStatus",
                                success: function (data) {
                                    equalPrice(data.saleInfo[0].promotionPrice, obj);
                                    lib.ajx(scpUrl,{goodsId:_t.igoods,suNingPrice:data.saleInfo[0].promotionPrice},function(){},function(){});
                                },
                                error: function (data) {
                                    console.log('get suning price error.');
                                }
                            });
                            break;
                        case 'yihaodian':
                            $.ajax({
                                type: "get",
                                url: 'http://gps.yhd.com/restful/detail',
                                dataType: "jsonp",
                                data: {mcsite: 1, provinceId: 2, pmId: gId},
                                jsonp:'callback',
                                success: function (data) {
                                    equalPrice(data.yhdPrice, obj);
                                    lib.ajx(scpUrl,{goodsId:_t.igoods,firstPrice:data.yhdPrice},function(){},function(){});
                                },
                                error: function (data) {
                                    console.log('get yihaodian price error.');
                                }
                            });
                            break;
                    }
                }
                //判断价格是否有效  price:第三方商品价格  obj:html元素对象
                function equalPrice(price,obj){
                    if(price && price > 0){
                        $(obj).html(price);//直接赋值使用
                    }else{
                        $(obj).parent().hide();//隐藏对应第三方比较信息
                    }
                }
            },
            //生成结构html
            detailData:function(data){
                var _t=this;
                _t.sliderEle=$("#slider_Img ul");

                if(data.infocode=="0"){
                    var dataInfo=data.info;
                    var slogan=dataInfo.slogan;//商品广告语
                    //相册数据
                    var goodsPics=dataInfo.list_photo,
                        photoStr='<li><img src="'+reqUrl.imgPath+dataInfo.mainPictureJPG+'"/></li>',
                        dotStr='<span class="point selected"></span>';

                    _t.photoStrbig='<div id="slider_Img_big" class="slider_Img_big"><ul>';
                    _t.photoStrbig+='<li><img src="'+reqUrl.imgPath+dataInfo.mainPictureJPG+'"/></li>';
                    $.each(goodsPics,function(index,item){
                        photoStr+='<li><img src="'+reqUrl.imgPath+item.albumURL+'"/></li>';
                        dotStr+='<span class="point"></span>';
                        _t.photoStrbig+='<li><img src="'+reqUrl.imgPath+item.albumURL+'"/></li>'; //放大图片
                    });
                    _t.photoStrbig+="</ul></div>";
                    _t.sliderEle.html(photoStr);

                    $("#serial_number").html(dotStr);
                    _t.slider();
                    _t.showBigpic();

                    $("#slider_Img img").each(function(i,v){//不规则图片控制
                        $(this).height($(this).width());
                    });

                    //是否下架
                    if(dataInfo.addToCart==="0"){
                        $(".cart_bind").css("background","#999");
                        $(".ui-buy-now").css("background","#666");
                        $(".cart_bind, .ui-buy-now").tap(function(){
                            alert("商品已下架或库存不足！");
                        });
                    }else{
                        _t.atOnceType=dataInfo.goodsLookType;//区分 2--新客开单、3--零元购、普通商品--1、4--新加活动。
                        _t.buyAtOnce();//立即购买

                        if(_t.atOnceType==="3" || _t.atOnceType==="4" ){
                            $(".cart_bind").css("background","#999");
                        }else{
                            _t.addCart();//加入购物车
                        }
                    }
                    //是否售罄
                    if(dataInfo.goodsBaseMax ==="0"){
                        $("#sale_out").show();
                    }
                    //商品活动
                    if(dataInfo.activeSignImg!=="") $("#flash_buy img").attr("src","/images/buy/detail/list_"+dataInfo.activeSignImg+".png");//活动标识图片

                    var timeNum=dataInfo.acticeTypeValue;

                    if(dataInfo.activeSignImg==="" || dataInfo.activeSignImg==="8"){
                        $("#activity").remove();
                    }else if(dataInfo.activeSignImg==="0"){//闪购

                        $("#flash_buy").show();
                        _t.repeatFun(timeNum,$("#flash_buy span"));//时间倒计时
                        _t.repeat=setInterval(function(){
                            _t.repeatFun(timeNum,$("#flash_buy span"));
                        },1000);

                    }else{
                        $("#activity_list").html(dataInfo.acticeTypeValue);//活动内容
                    }

                    //商品信息
                    var walletSubtract="",//红包立减字符串
                        actualPriceStr='';//实付金额字符串

                    if(dataInfo.limitcoupon && dataInfo.limitcoupon>0 && dataInfo.goodsLookType != 3){//红包立减
                        walletSubtract='红包立减'+dataInfo.limitcoupon+'元';
                       var actualPrice=Number(dataInfo.sellingPrice)-Number(dataInfo.limitcoupon);//实付金额=价格-红包立减
                           actualPriceStr='实付金额'+actualPrice.toFixed(2)+'元';
                        $("#price_reduce").html('<span>'+walletSubtract+'</span><span>'+actualPriceStr+'</span>');//实付金额+红包立减
                    }

                    var surePic=dataInfo.warrantor==1?'<img src="/images/buy/detail/promise.png"  alt="">':"";//“保”字
                    _t.chName = dataInfo.chName;
                    $("#goods_name").html(surePic+'<span class="sign">'+dataInfo.source +'</span>'+dataInfo.chName+'</li>');
                    $("#goods_ename").html('<span class="price price_gcoin" p="'+dataInfo.sellingPrice+'">￥'+dataInfo.sellingPrice+'</span><span class="gray">已售'+dataInfo.sellShowNumber+'笔</span>');

                    $(".shippers").html(dataInfo.shippers+'发货&售后');//发货商
                    dataInfo.sevenDayFlag==1?'':$("#guarantee .seven").addClass('seven2');

                    //规格选择弹窗里面的商品信息
                    $("#infomation .goodsImg img").attr('src',reqUrl.imgPath+dataInfo.mainPictureJPG);
                    $("#infomation .price").html('<span>￥'+dataInfo.sellingPrice+'</span><br/><span>'+walletSubtract+'</span>');

                    //选择条件
                    var mapPart=dataInfo.list_map_part;
                    var liStr="";
                    $.each(mapPart,function(i,v){
                        liStr+='<li id="'+v.parametersId+'"><p>'+v.parametersName+'</p>';
                        $.each(v.list_name_value,function(i,v){
                            if(v.selete=="selete"){
                                liStr+='<span class="select contains'+v.contains+'" id="'+ v.parametersValueId+'">'+ v.parametersValue+'</span>';
                            }else{
                                liStr+='<span class="contains'+v.contains+'" id="'+ v.parametersValueId+'">'+ v.parametersValue+'</span>';
                            }
                        });
                        liStr+='</li>';
                    });
                    liStr!==""?$("#con_list").html(liStr):$('#con_list').css("border",'none');
                    _t.locationUrl();

                    //图文详情
                    var imgInfo='';
                    $.each(dataInfo.list_goodsRich,function(index,item){
                        imgInfo+='<img src="'+reqUrl.imgPath+item.pictureUrl+'"/>';
                    });
                    $("#img_info").html(imgInfo);


                    //tdk信息
                    $("#title").html(dataInfo.title);
                    $("#keywords").attr("content",dataInfo.keyWords);
                    $("#description").attr("content",dataInfo.description);

                    //金豆详情
                    _t.goldCoinFun();
                }
            }
            //finshed
        });

        detail.init();
        window.onunload = function(){
            sessionStorage.setItem("mm_cp20160824", "mm_detail_20160824");
        }
    });
});
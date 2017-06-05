/**
 * Created by yaoyao on 2016/4/13.
 */
requirejs.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
requirejs(['zepto','lib','wxshare','wapshare'], function ($,lib, wxshare,wapshare) {
    lib = new lib();
    wapshare = new wapshare();
    var isEmpty = true, loading = false;
        common = {"js": lib, "tools": lib};
        reqUrl = lib.getReq();
    var dPath="/g?"+lib.getMid();
    $(function(){
        //模拟下拉菜单
        function selectFun(titbox,dialogwrap,itemcon,text,tri,tried,n){
            titbox.unbind("click");
            titbox.on("click",function(){
                if(dialogwrap.is(":visible") === true){
                    dialogwrap.hide();
                    tried.hide();
                    tri.show();
                }else{
                    //初始化
                    $("#select_box").hide();
                    $("#select_sort").hide();
                    $("#select_sort2").hide();
                    $("#select_sort3").hide();
                    $("#triangle").show();
                    $("#tri_sort").show();
                    $("#tri_sort2").show();
                    $("#tri_sort3").show();
                    $("#trianglred").hide();
                    $("#tri_sorted").hide();
                    $("#tri_sorted2").hide();
                    $("#tri_sorted3").hide();

                    dialogwrap.show();
                    tried.show();
                    tri.hide();
                }
            });
            itemcon.find("li").unbind("click");
            itemcon.find("li").on("click",function(){
                sessionStorage.keyWords="";
                var con=$(this).html();
                $(this).addClass("cur").siblings().removeClass("cur");
                $(this).append('<span class="radioimg"></span>').siblings().find("span").remove();

                dialogwrap.hide();
                text.html(con);
                tried.hide();
                tri.show();

                //改变状态，重新调
                var indexList=["推荐商品","已推商品"].indexOf(con);
                price=0;//0：表示返利降序 1：表示返利升序
                pageNo=1;//第几页
                var classId1=$(this).attr("id");
                if(n === 1){//商品分类
                    if(classId1 === ""){//全部
                        $("#sort_box2").hide();
                        $("#sort_box3").hide();
                        classId="";
                        showGoodsFun();
                    }else if(classId1 == '2'){//捆绑
                        $("#sort_box2").hide();
                        $("#sort_box3").hide();
                        classId=2;
                        showGoodsFun();
                    }else{//一级类别
                        $("#sort_box2").show();
                        $("#sort_box3").hide();
                        sortList(2,classId1);
                    }
                }else if(n === 2){//商品分类2
                      $("#sort_box3").show();
                      sortList(4,classId1);
                }else if(n === 4){
                    classId=$(this).attr("id");
                    showGoodsFun();//商品展示
                }else if(n === 3){/*推荐、已推切换，初始化分类下拉*/
                    var classFirstEle=$("#itemcon_sort li:first");
                    $("#sort_text").html("全部");
                    classFirstEle.addClass("cur").siblings().removeClass("cur");
                    classFirstEle.append('<span class="radioimg"></span>').siblings().find("span").remove();

                    isNot=indexList;
                    classId="";
                    showGoodsFun();//商品展示
                    //推荐或取消按钮
                    con === "推荐商品" ? $("#button").html("推荐到首页") : $("#button").html("取消推荐商品");
                }
            });
        }

        //返利筛选
        $("#back_benefit").on("tap",function(){
            var firstSpan=$(this).find("span:first");
            if(!firstSpan.is(":visible")){
                firstSpan.show().siblings().hide();
                price=0;
            }else{
                firstSpan.hide().siblings().css("display","inline-block");
                price=1;
            }
            showGoodsFun();//商品展示
        });
        //点击事件
        function clickFun() {
            //二维码
            var qrcodeBox = $("#ui-seller_qr_code");
            $("#goods_wrap .ui-show-qr").unbind();
            $("#goods_wrap .ui-show-qr").on("tap", function () {
                clickFun();
                var qrImg = reqUrl.imgPath + $(this).html(),
                    goodsImg = reqUrl.imgPath + $(this).attr("imglink");

                $("#qrImg").attr("src", qrImg);
                $("#goodsImg").attr("src", goodsImg);
                qrcodeBox.show();
            });
            qrcodeBox.unbind("tap");
            qrcodeBox.on("click", function () {
                qrcodeBox.hide();
            });

            //单选按钮
            $("#goods_wrap .orderunit").unbind("tap");
            $("#goods_wrap .orderunit").on("tap", function () {
                $(this).find("dt").addClass("on");
                $(this).siblings().find("dt").removeClass("on");
                isEmpty = false;
                initWXShare(this);
            });

            //推荐到首页*取消推荐商品
            $("#button").unbind("tap");
            $("#button").on("tap", function () {
                if(isEmpty){
                    alert("无商品可分享");
                    return;
                }
                $(".fixed").css('display','block');
            });
            $(".fixed").on("tap", function (e) {
                if(lib.checkWeiXin())
                    $(".fixed").css('display','none');
                else{
                    var target = e.srcElement ? e.srcElement : e.target;
                    if(target.className.indexOf("fixed") != -1){
                        $(".fixed").hide();
                    }
                }
            });
        }
        //数据调取
        var rows=10;//每页条数
        var allPages=2;//总页数
        var pageNo=1;//页数
        var isNot=0;//0：表示推荐 1：表示已经推荐
        var price=0;//0：表示返利降序 1：表示返利升序
        var classId="";//分类id
        var sortListUrl=reqUrl.ser+"goodsClass/getGoodsClassInfo.action",//商品分类
            showGoodsUrl=reqUrl.ser+"goodsBase/proprietaryGoodsBaseBymember.action",//商品列表
            addGoodsUrl=reqUrl.ser+"goodsBase/rGoodsBaseListAdd.action",//推荐到首页
            cancelGoodsUrl=reqUrl.ser+"goodsBase/rGoodsBaseListdelete.action";//取消推荐

        /*页面一进来加载*/
        selectFun($("#titword"),$("#select_box"),$("#itemcon"),$("#titword_text"),$("#triangle"),$("#trianglered"),3);////推荐商品*已推商品
        sessionStorage.keyWords="";//页面初始化进来，清空session
        sortList(1,"");//商品类别
        showGoodsFun();//商品展示
        roll();//下滑
        preventFun();//阻止默认touchmove事件

        //搜索框搜索
        $("#search").on("click",function(){
            $("#search_wrap").show();
            $("#search_wrap input").focus();
        });
        $("#search_wrap").on("click",function(){
            $("#search_wrap").hide();
        });

        $(".ind_search_left").on("click",function(e){//阻止冒泡
            e.stopPropagation();
        });

        $(".ind_search_r").on("click", function(){
            searchFun();
        });
        $("#searchForm").on("submit",function(){//手机键盘搜索
            searchFun();
        });
        function searchFun(){
            var k = $('.ind_search_cen input').val().trim();
            sessionStorage.keyWords=k;
            if(k === ""){
                alert("请输入关键字");
                return;
            }
            pageNo=1;
            classId="";
            showGoodsFun();//加载
            $("#search_wrap").hide();
            $("#search_wrap input").blur();
            //初始化
            $("#select_sort").hide();
            $("#tri_sorted").hide();
            $("#tri_sort").show();
            $("#select_sort2").hide();
            $("#select_sort3").hide();
            $("#tri_sorted2").hide();
            $("#tri_sorted3").hide();
            $("#tri_sort2").show();
            $("#tri_sort3").show();
            $("#select_box").hide();
            $("#trianglered").hide();
            $("#triangle").show();
            $("#sort_text").html("全部");
            $("#sort_box2").hide();
            $("#sort_box3").hide();
        }
        //阻止默认touchmove事件
        function preventFun(){
            document.body.addEventListener('touchmove', function (event) {//遮罩层出现的情况下，禁止页面滚动
                if( $("#search_wrap").is(":visible") || $(".select_box").is(":visible") || $("#select_sort").is(":visible") ||$("#select_sort2").is(":visible")){
                    event.preventDefault();
                }
            }, false);
        }

        //下滑自动加载
        function roll(){
            $(window).scroll(function (){
                if(!loading && (pageNo<allPages) && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    ++pageNo;
                    showGoodsFun();//商品展示
                    $(window).scrollTop($(document).height()-$(window).height()-50);
                }
            });
        }
        function sortList(n,cId){
            loading = true;
           var obj=cId?{classId:cId}:{};
            obj.memberId = $.cookie("member_memberId");
            common.js.ajx(sortListUrl,obj,function(data){
                if(data.infocode === '0'){
                    var itemStr='';
                    if(n === 1){
                        itemStr='<li id="">全部<span class="radioimg"></span></li>';
                        $.each(data.info.list_goodsClass,function(i,v){
                            itemStr+='<li id="'+v.classId+'">'+v.className+'</li>';
                        });
                        $("#itemcon_sort ul").html(itemStr);
                        selectFun($("#sort_box"),$("#select_sort"),$("#itemcon_sort"),$("#sort_text"),$("#tri_sort"),$("#tri_sorted"),n);//商品分类
                    }else if(n === 2){

                        $.each(data.info.list_goodsClass,function(i,v){
                            itemStr += (i===0) ? '<li id="'+v.classId+'">'+v.className+'<span class="radioimg"></span></li>' : '<li id="'+v.classId+'">'+v.className+'</li>';
                        });
                        $("#sort_text2").html(data.info.list_goodsClass[0].className);
                        classId=data.info.list_goodsClass[0].classId;
                        $("#itemcon_sort2 ul").html(itemStr);
                        showGoodsFun();//商品展示
                        selectFun($("#sort_box2"),$("#select_sort2"),$("#itemcon_sort2"),$("#sort_text2"),$("#tri_sort2"),$("#tri_sorted2"),n);//商品分类2
                    }else if(n === 4){//三级分类

                        $.each(data.info.list_goodsClass,function(i,v){
                            itemStr += (i===0) ? '<li id="'+v.classId+'">'+v.className+'<span class="radioimg"></span></li>' : '<li id="'+v.classId+'">'+v.className+'</li>';
                        });
                        $("#sort_text3").html(data.info.list_goodsClass[0].className);
                        classId=data.info.list_goodsClass[0].classId;
                        $("#itemcon_sort3 ul").html(itemStr);
                        showGoodsFun();//商品展示
                        selectFun($("#sort_box3"),$("#select_sort3"),$("#itemcon_sort3"),$("#sort_text3"),$("#tri_sort3"),$("#tri_sorted3"),n);//商品分类3
                    }

                }else if(data.infocode === '2'){
                    alert(data.info);
                }else{
                    alert(data.info);
                }
                loading = false;
            },function(){
                //alert("商品分类加载失败");
                loading = false;
            });
        }
        function showGoodsFun(){
            var keyWords=sessionStorage.keyWords;
            var obj={goodsKeywords:keyWords,statusUpDown:1,price:price,classId:classId,page:pageNo,rows:rows};

            $("#noneList").hide();
            //$("#back_benefit").show();
            common.js.ajx(showGoodsUrl,obj,function(data){
                if(data.infocode === '0'){
                    var dataList=data.info.list_goodsBase,
                        listStr="";
                    allPages=Math.ceil(data.info.count/rows);
                    $.each(dataList,function(i,v){
                        listStr+='<div class="orderunit" id="'+v.goodsId+'"><div class="goodslist"><dl><dt><a href="javascript:;"><img src="'+reqUrl.imgPath+v.mainPictureJPG+'" gSlogan="'+v.slogan+'"></a></dt><dd><ul><li><a href="'+dPath+'&gId='+v.goodsId+'" class="ui-goods-name">'+v.chName+'</a></li><li><a' +
                        ' href="'+dPath+'&gId='+v.goodsId+'"></a></li><li class="ui-goods-p">￥'+v.sellingPrice+'<span>返利￥'+v.price+'</span></li></ul></dd></dl></div></div>';
                    });
                    pageNo === 1 ? $("#goods_wrap").html(listStr) : $("#goods_wrap").append(listStr);//获取数据追加到列表
                    if(pageNo === 1){
                        $(".orderunit").eq(0).find("dt").addClass("on");
                        isEmpty = false;
                        initWXShare($(".orderunit").eq(0));
                    }
                }else if(data.infocode === '2'){
                    location="/login/denglu.html?backUrl="+common.tools.getBackUrl();
                }else if(data.infocode === '3'){
                    if(pageNo === 1){
                        $("#goods_wrap").html("");
                        $("#noneList").show();
                        $("#back_benefit").hide();
                        isEmpty = true;
                    }
                }else{
                    alert(data.info);
                }
                clickFun();//点击事件
            },function(){
                //alert("商品加载失败");
            });
        }

        function initWXShare(obj){
            var goodsSlogan = $(obj).find("img").attr("gSlogan");
            if(lib.checkWeiXin()){
                dataForWeixin.imgUrl = $(obj).find("img").attr("src");
                dataForWeixin.title = $(obj).find(".ui-goods-name").text();
                dataForWeixin.desc = goodsSlogan == "" ? "这款商品不错，快去看看" : goodsSlogan;
                dataForWeixin.link = location.protocol + "//" + location.host + "/g?mId=" + $.cookie("member_memberId") + "&gId=" + $(obj).attr("id");

                wxshare();
            }
            else{
                wapshare.setting.pic = $(obj).find("img").attr("src");
                wapshare.setting.title = $(obj).find(".ui-goods-name").text();
                wapshare.setting.summary = goodsSlogan == "" ? "这款商品不错，快去看看" : goodsSlogan;
                wapshare.setting.url = location.protocol + "//" + location.host + "/g?mId=" + $.cookie("member_memberId") + "&gId=" + $(obj).attr("id");
                wapshare.loadScript();
            }
        }
    });
});
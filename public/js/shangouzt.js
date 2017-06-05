/**
 * Created by liuhh on 2016/4/27.
 */
require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "visitor-logs"], function($, libjs ,vl){
    var lib = new libjs(),
        reqUrl = lib.getReq().ser,
        imgUrl = lib.getReq().imgPath;

    $(function(){
        var cntLimit = 5,
            page = 1,
            isAll = false,
            isAdding = true,
            dat = {"page":page,"rows":cntLimit,"flashSaleId":sessionStorage.flashSaleId,"sign":sessionStorage.sign};

        getFlashGoodsList();
        initEvent();

        function initButton(typeName){
            if(sessionStorage.sign && sessionStorage.sign == "1"){
                $(".fixed-bottom").text(typeName);
                if(typeName != "添加商品")
                    isAdding = false;
                else
                    isAdding = true;
            }
        }
        function initEvent(){
            //筛选订单
            $("#titword").on("tap",function(){
                if($("#select_box").is(":visible")===true){
                    $("#select_box").hide();
                    $("#trianglered").hide();
                    $("#triangle").show();
                }else{
                    $("#select_box").show();
                    $("#trianglered").show();
                    $("#triangle").hide();
                }
            });

            $("#itemcon li").on("tap",function(){
                var con=$(this).html();
                if(!$(this).hasClass("cur")){  //条件变更 则清空列表 获取响应数据
                    if($(this).index() !== 0){
                        dat.auditStatus = 3 - $(this).index();
                    }
                    else{
                        dat = {"page":page,"rows":cntLimit,"flashSaleId":sessionStorage.flashSaleId,"sign":sessionStorage.sign};
                    }
                    $("#orderunit").empty();
                    getFlashGoodsList();
                }
                $(this).addClass("cur").siblings().removeClass("cur");

                $(this).siblings().find("span").remove();
                $('<span class="radioimg"></span>').appendTo($(this));

                $("#select_box").hide();
                $("#titword_text").html(con);
                $("#trianglered").hide();
                $("#triangle").show();
            });

            $(document).on('tap','.wd_btn',function(){
                if(isAdding)
                    location = "/admin/activity/shangoutj.html";
            });

            $(document).on('tap','.sg_list a',function(){
                location = "/admin/activity/shangouwtg.html?flashSaleGoodsId="+$(this).parent().attr("flgoodsid")+'&flashSaleId='+
                    sessionStorage.flashSaleId+'&sign='+sessionStorage.sign;
            });
            roll();
        }

        function getFlashGoodsList() {
            lib.ajx(reqUrl + "/flashSale/getFlashGoodsList.action", dat,
                function (data) {
                    if (data.infocode == "0") {
                        var appendHtml = "",
                            dataList = data.info.flashGoodsList;

                        if(dataList.length < cntLimit)
                            isAll = true;
                        else
                            isAll = false;

                        if(dat.auditStatus === undefined &&dat.page == 1&& dataList.length === 0){ //没有闪购商品
                            $(".ui-nothing-find").show();
                            return;
                        }

                        for (var i = 0; i < dataList.length; i++) {
                            var showHtml =dataList[i].auditStatus == "审核未通过"?'<a href="javascript:;">查看</a>':'',
                                tmpHtml = '<div class="goodslist"><dl>'+
                                    '<dt><a href="#"><img src='+imgUrl+dataList[i].mainPictureJPG+'></a></dt>'+
                                    '<dd><ul>'+
                                    '<li><a href="#">'+dataList[i].chName+'</a></li>'+
                                    '<li><a href="#">'+dataList[i].enName+'</a></li>'+
                                    '<li><a href="#">市场价：￥'+dataList[i].sellingPrice+'</a></li>'+
                                    '<li class="ui-goods-p">闪购价：￥'+dataList[i].flashPrice+'<span>数量：'+dataList[i].flashSaleNum+'件</span></li></ul></dd>'+
                                    '</dl>'+
                                    '<div class="sg_list" flgoodsid='+dataList[i].flashSaleGoodsId+'><span>'+dataList[i].auditStatus+'</span>'+showHtml+
                                    '</div></div>';
                            appendHtml += tmpHtml;
                        }
                        $("#orderunit").append(appendHtml);
                        if(dat.page == 1 &&dataList[0])
                            initButton(dataList[0].showStr);

                    } else if (data.infocode == "2") {
                        alert(data.info);
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("获取闪购商品的详情失败");
                });
        }

        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    dat.page = ++page;
                    getFlashGoodsList();
                }
            });
        }
    });
});
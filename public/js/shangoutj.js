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
            isAll = false;
        var datArgs ={"page": page,"rows": cntLimit,"goodsName":"","flashSaleId":sessionStorage.flashSaleId?parseInt(sessionStorage.flashSaleId):1};
        getGoodsByMemberId();
        roll();
        initEvent();

        function initEvent(){
            $(document).on("tap",".select_btn",function(){
                $(this).hasClass("cur")?$(this).removeClass("cur"):$(this).addClass("cur");
            });

            $(document).on("tap",".search1_btn",function(){
                datArgs.goodsName = $(this).next().children(".txt").val().trim();
                datArgs.page = 1;
                $("#sg-goods-list").empty();
                getGoodsByMemberId();
            });

            $(document).on("tap",".wd_btn:not(.grey)",function(){
                var datSave = {"flashSaleGoodsId":"","flashSaleId":"","goodsIds":[],"flashSaleNums":[],"flashPrices":[]};
                datSave.flashSaleId = sessionStorage.flashSaleId?parseInt(sessionStorage.flashSaleId):1;
                $('.goodslist .select_btn:not(.cur)').each(function(){
                    var datObj = $(this).siblings("dd").find(".ui-goods-p");
                    datSave.goodsIds.push(parseInt(datObj.attr("goodsid")));
                    datSave.flashPrices.push(parseInt(datObj.children("input").val()));
                    datSave.flashSaleNums.push(parseInt(datObj.children("span").children("input").val()));
                });
                if($('.goodslist .select_btn:not(.cur)').length > 0)
                    saveAllFlashGoods(datSave);
                else{
                    alert("请至少选择一件商品");
                }
            });
        }
        function getGoodsByMemberId() {
            lib.ajx(reqUrl + "/flashSale/getGoodsByMemberId.action", datArgs,
                function (data) {
                    if (data.infocode == "0") {
                        var appendHtml = "",
                            dataList = data.info.goodsList;

                        if(datArgs.page == 1){
                            if(dataList.length === 0){
                                $(".login_error").show();
                                $(".wd_btn").addClass("grey");
                            }
                            else{
                                $(".wd_btn").removeClass("grey");
                            }
                        }

                        if(dataList.length < cntLimit)
                            isAll = true;
                        else
                            isAll = false;

                        for (var i = 0; i < dataList.length; i++) {
                            var tmpHtml = '<div class="goodslist"><dl><span class="select_btn cur"></span>'+
                                    '<dt><a href="javascript:;">'+'<img src="'+imgUrl+dataList[i].mainPictureJPG+'"></a></dt>'+
                                    '<dd><ul><li><a href="javascript:;">'+dataList[i].chName+'</a></li>'+
                                    '<li><a href="javascript:;">'+dataList[i].enName+'</a></li>'+
                                    '<li class="ui-goods-c">售&nbsp;&nbsp;&nbsp;&nbsp;价 ￥'+dataList[i].sellingPrice+
                                        '<span>&nbsp;&nbsp;&nbsp;库存：'+dataList[i].inventoryNum+'件</span></li>'+
                                    '<li class="ui-goods-p" goodsid='+dataList[i].goodsId+'>闪购价<input type="text" value='+dataList[i].sellingPrice+' class="txt" initval='+dataList[i].sellingPrice+'/>'+
                                        '<span>数量<input type="text" value='+dataList[i].inventoryNum+' class="txt" initval='+dataList[i].inventoryNum+'/></span></li>'+
                                    '</ul></dd></dl></div>';
                            appendHtml+=tmpHtml;
                        }
                        $("#sg-goods-list").append(appendHtml);

                    } else if (data.infocode == "2") {
                        alert(data.info);
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("查询商家商品列表失败");
                });
        }

        function saveAllFlashGoods(data) {
            $.ajax({
                type: "get",
                async:false,
                url: reqUrl + "/flashSale/saveAllFlashGoods.action",
                data:data,
                traditional:true,
                dataType : "jsonp",
                jsonp: "jsonpCallback",
                success: function(data){
                    if(data.infocode == "0" ||data.infocode == "4"){
                        location = "/admin/activity/shangouzt.html";
                    }
                    else if(data.infocode == "2"){
                        alert(data.info);
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    }
                    else{
                        alert(data.info);
                    }
                },
                error: function(e){
                    alert("保存或修改商品信息失败");
                }
            });
        }

        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    datArgs.page = ++page;
                    getGoodsByMemberId();
                }
            });
        }
    });
});
/**
 * Created by liuhh on 2016/4/27.
 */
require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "visitor-logs"], function($, libjs ,vl){
    var lib = new libjs(),
        reqUrl = lib.getReq().ser,
        imgUrl = lib.getReq().imgPath;

    $(function(){
        var datArgs = {"page":1,"rows":5};
        initPage();

        function initPage(){

            if(lib.getUrlParam("flashSaleGoodsId")){
                datArgs.flashSaleGoodsId = parseInt(lib.getUrlParam("flashSaleGoodsId").trim());
                datArgs.flashSaleId = parseInt(lib.getUrlParam("flashSaleId").trim());
                datArgs.sign = parseInt(lib.getUrlParam("sign").trim());
            }

            $(document).on('tap','.wd_btn',function(){
                var datSave = {"flashSaleGoodsId":"","flashSaleId":"","goodsIds":[],"flashSaleNums":[],"flashPrices":[]};
                datSave.flashSaleId = sessionStorage.flashSaleId?parseInt(sessionStorage.flashSaleId):0;
                datSave.flashSaleGoodsId = parseInt((datArgs.flashSaleGoodsId));
                $('.ui-goods-p').each(function(){
                    datSave.goodsIds.push(parseInt($(this).attr("goodsid")));
                    datSave.flashPrices.push(parseInt($(this).children("input").val()));
                    datSave.flashSaleNums.push(parseInt($(this).children("span").children("input").val()));
                });
                saveAllFlashGoods(datSave);
            });

            $(document).on("keyup","input.txt",function(){
                $(this).val($(this).val().replace(/\D/gi,''));
            });
            $(document).on("blur","input.txt",function(){
                var num = parseInt($(this).val());
                if(!num ||num > parseInt($(this).attr("initval"))){
                    $(this).val($(this).attr("initval"));
                }
                else{
                    $(this).val(num);
                }
            });

            getFlashGoodsList();
        }

        function getFlashGoodsList() {
            lib.ajx(reqUrl + "/flashSale/getFlashGoodsList.action", datArgs,
                function (data) {
                    if (data.infocode == "0") {
                        var appendHtml = "",
                            dataList = data.info.flashGoodsList;

                        for (var i = 0; i < dataList.length; i++) {
                            var tmpHtml = '<div class="goodslist">'+
                                '<dl><dt><a href="#"><img src='+imgUrl+dataList[i].mainPictureJPG+'</a></dt>'+
                                '<dd><ul>'+
                                '<li><a href="#">'+dataList[i].chName+'</a></li>'+
                                '<li><a href="#">'+dataList[i].enName+'</a></li>'+
                                '<li class="ui-goods-p" goodsid='+dataList[i].goodsId+'>闪购价<input type="text" value='+dataList[i].flashPrice+' class="txt" initval='+dataList[i].sellingPrice+' />'+
                                '<span>数量<input type="text" value='+dataList[i].flashSaleNum+' class="txt" initval='+dataList[i].flashSaleNum+' /></span></li>'+
                                '</ul></dd></dl></div>';
                            appendHtml += tmpHtml;
                        }
                        $("#orderunit").append(appendHtml);

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
    });
});
/**
 * Created by liuhh on 2016/4/28.
 */
require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "visitor-logs"], function($, libjs ,vl){
    var lib = new libjs(),
        reqUrl = lib.getReq().ser;
    $(function(){
        var cntLimit = 8,
            page = 1,
            isAll = false;
        getAllPriceModel(page,cntLimit);
        roll();
        $(document).on("tap",".yfei_2 a",function(){
            var typeid = $(this).parents(".yfei_1").attr("typeid");
            if(typeid && confirm("是否删除改运费模板")){
                deletePriceModel(typeid);
            }
        });
        $(document).on("tap",".yfei_3 a",function(){
            var typeid = $(this).parents(".yfei_1").attr("typeid"),
                typename = $(this).parent().prev(".yfei_2").children("span").text();
            location = '/admin/yunfeimb.html?typeid='+typeid+'&&typename='+typename;
        });

        $(document).on("tap",".add_goods_img",function(){
            location = '/admin/yunfeimb.html';
        });
        function getAllPriceModel(page,rows) {
            lib.ajx(reqUrl + "/price/getAllPriceModel.action", {"page":page,"rows":rows},
                function (data) {
                    if (data.infocode == "0") {
                        var appendHtml = "",
                            dataList = data.info;

                        if(page == 1){
                            $("#yfei-list").empty();
                        }

                        if(dataList.length < cntLimit)
                            isAll = true;
                        else
                            isAll = false;

                        for (var i = 0; i < dataList.length; i++) {
                            var del = i=== 0?"":"删除"; //后台已经过排序，第一条记录为缺省，不可删
                            var tmpHtml = '<div class="yfei_1" typeid='+dataList[i].deliveryPriceTypeId+'>'+
                                '<div class="yfei_2"><span>'+dataList[i].deliveryPriceTypeName+'</span><a href="javascript:;">'+del+'</a></div>'+
                                '<div class="yfei_3"><a href="javascript:;">修改</a></div></div>';
                            appendHtml+=tmpHtml;
                        }
                        $("#yfei-list").append(appendHtml);
                    } else if (data.infocode == "2") {
                        alert(data.info);
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("查询运费模板列表失败");
                });
        }
        function deletePriceModel(typeid) {
            lib.ajx(reqUrl + "/price/deletePriceModel.action", {"deliveryPriceTypeId":typeid},
                function (data) {
                    if (data.infocode == "0") {
                        page = 1;
                        getAllPriceModel(page,cntLimit);
                    } else if (data.infocode == "2") {
                        alert(data.info);
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("查询运费模板列表失败");
                });
        }
        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    getAllPriceModel(++page, cntLimit);
                }
            });
        }
    });
});
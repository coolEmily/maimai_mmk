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
        getFlashActivityList(page,cntLimit);
        roll();
        $(document).on('tap','.sg_list2 p:not(.jzhi)',function(){ //响应"已参加","我要报名"
            sessionStorage.sign = $(this).attr("sign");
            sessionStorage.flashSaleId =$(this).attr("flashsaleid");
            location = "/admin/activity/shangouzt.html";
        });
        function getFlashActivityList(page,rows) {
            lib.ajx(reqUrl + "/flashSale/getFlashActivityList.action", {"page": page,"rows": rows},
                function (data) {
                    if (data.infocode == "0") {
                        var appendHtml = "",
                            statusArr = ["","jzhi","bmimg"],
                            dataList = data.info.flashSaleList;

                        if(dataList.length < cntLimit)
                            isAll = true;
                        else
                            isAll = false;

                        for (var i = 0; i < dataList.length; i++) {
                            var index = parseInt(dataList[i].sign) -1;
                            var temp =  '<div class="sg_list1"><div><img src="'+imgUrl+dataList[i].descImg+'" style="max-height: 150px"/></div>'+
                                '<p class="'+statusArr[index]+'" flashsaleid='+dataList[i].flashSaleId+' sign='+dataList[i].sign+'>'+dataList[i].returnStr+'</p></div>';
                            appendHtml += temp;
                        }
                        $("#sg-list").append(appendHtml);

                    } else if (data.infocode == "2") {
                        alert(data.info);
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("闪购活动列表获取失败");
                });
        }

        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    getFlashActivityList(++page, cntLimit);
                }
            });
        }
    });
});
/**
 * Created by liuhh on 2016/4/20.
 */
requirejs.config({baseUrl:"/js/lib"});
requirejs(['zepto','lib','visitor-logs'], function ($,libjs,vl) {
    var lib = new libjs(),
        reqUrl = lib.getReq().ser;

    $(function () {
        var cntLimit = 20,
            page = 1,
            isAll = false;
        getComplaintList(page,cntLimit);
        roll();
        $(document).on("tap",".check_detail",function(){
            sessionStorage.memberComplaintId = $(this).attr("complId");
            location = "/admin/tousuxq.html";
        });

        function getComplaintList(page,rows) {
            lib.ajx(reqUrl + "/memberComplaint/getComplaintListBySellerId.action", {"page": page,"rows": rows},
                function (data) {
                if (data.infocode == "0") {
                    var appendHtml = "",
                        dataList = data.info.seller_complaint_list;
                    if(dataList.length < cntLimit)
                        isAll = true;
                    else
                        isAll = false;
                    for (var i = 0; i < dataList.length; i++) {
                        var temp = '<div class="sue_list"><ul>' +
                            '<li>投诉订单编号:<span>' + dataList[i].orderNo + '</span></li>' +
                            '<li>商品名称:<span>' + dataList[i].goodsName + '</span></li>' +
                            '<li><span>订单时间:<span>' + dataList[i].orderTime + '</span></li>' +
                            '<li>状态:<span>' + dataList[i].status + '</span><span class="check_detail" complId ='+dataList[i].memberComplaintId+'>查看投诉</span></li></ul></div>';
                        appendHtml += temp;
                    }
                    $('#container').prepend(appendHtml);

                } else if (data.infocode == "3") {
                    location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                } else {
                    //alert(data.info)
                }
            }, function () {
                alert("投诉列表获取失败");
            });
        }

        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    getComplaintList(++page, cntLimit);
                }
            });
        }
    });
});
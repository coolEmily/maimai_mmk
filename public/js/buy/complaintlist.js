/**
 * Created by liuhh on 2016/4/19.
 */
requirejs.config({baseUrl:"/js/lib"});
requirejs(['zepto','lib','visitor-logs'], function ($,libjs,vl) {
    var lib = new libjs(),
        reqUrl = lib.getReq().ser;

    $(function () {
        var cntLimit = 20,
            page = 1,
            isAll = false,
            isEmpty = false;
        getComplaintList(page,cntLimit);
        roll();
        $(document).on('tap ','a.ord-detail',function(){
            sessionStorage.memberComplaintId = $(this).attr("complId");
            location = "/buyer/home/complaint/chakan.html";
        });

        $('.show-cpln').on('tap',function(){
            if($(this).hasClass('down')){
                $(this).removeClass('down');
            }else{
                $(this).addClass('down');
            }
            if(isEmpty){
                $('#noneList').toggle();
            }else{
                $('#complaint-wrap').toggle();
            }
        });

        function getComplaintList(page,rows) {
            lib.ajx(reqUrl + "/memberComplaint/getComplaintListByBuyId.action", {"page": page,"rows": rows}, function (data){
                if (data.infocode == "0") {
                    var appendHtml = "",
                        dataList = data.info.buy_complaint_list;
                    if(dataList.length < cntLimit)
                        isAll = true;
                    else
                        isAll = false;
                    for (var i = 0; i < dataList.length; i++) {
                        var temp = '<div class="complaint">'+
                                '<div class="cmpln-row">'+
                                '<span style="float:left">订单编号</span>'+
                                '<span class="ord-no">'+dataList[i].orderNo+'</span>'+
                                '<span class="ord-day">'+dataList[i].orderTime+'</span>'+
                                '</div>'+
                                '<div class="cmpln-row">'+
                                '<span style="float:left">订单状态</span>'+
                                '<span class="ord-status">'+dataList[i].status+'</span>'+
                                '<a class="ord-detail" href="javascript:;" complId ='+dataList[i].memberComplaintId+'>查看订单</a>'+
                                '</div></div>';
                        appendHtml += temp;
                    }
                    $('#complaint-wrap').append(appendHtml);
                }
                else if(data.infocode == "2"){
                    isEmpty = true;
                    //$(".ui_nothing_find").css("display","block");
                }
                else if (data.infocode == "3") {
                    location = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                } else {
                    alert(data.info);
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
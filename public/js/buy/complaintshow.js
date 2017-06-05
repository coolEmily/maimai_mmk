/**
 * Created by liuhh on 2016/4/19.
 */
requirejs.config({baseUrl:"/js/lib"});
requirejs(['zepto','lib','visitor-logs'], function ($,libjs,vl) {
    var lib = new libjs(),
        reqUrl = lib.getReq().ser;

    $(function () {
        var datReply={};
        getDetail();
        $(".refund_apply").on('tap',function(){
            if(checkField()){
                datReply.replyContent = $("#buyer-reply textarea").val().trim();
                addReply();
            }
        });

        $(document).on('tap',".img-wrap > a",function(){
            $(".big-img > img").attr("src",$(this).prev("img").attr("src"));
            $(".big-img").css("display","block");
        });

        $(document).on('tap',".big-img",function(){
            $(".big-img > img").attr("src","");
            $(this).css("display","none");
        });

        function checkField(){
            if($("#buyer-reply textarea").val().trim() ===""){
                alert("回复不能为空");
                return false;
            }
            return true;
        }

        function addReply() {
            lib.ajx(reqUrl + "/memberComplaint/addReply.action", datReply, function (data) {
                if (data.infocode == "0") {
                    location = "/buyer/home/complaint/chenggong.html";

                } else if (data.infocode == 3) {
                    location = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                } else {
                    alert(data.info);
                }
            }, function () {
                alert("投诉回复失败");
            });
        }

        function getDetail() {
                lib.ajx(reqUrl + "/memberComplaint/getSelfComplaintInfoById.action", {
                    "memberComplaintId":sessionStorage.memberComplaintId
                }, function (data) {
                if (data.infocode == "0") {
                    var isEmptyArr = [],
                        count = 0,
                        tmpPic,
                     dataList = data.info.reply_list;
                    datReply.sellerMemberId = data.info.sellerMemberId;
                    //datReply.orderNo = data.info.orderNo;
                    datReply.memberComplaintId = data.info.memberComplaintId;

                    //判断图片是否存在：都不存在则不予显示
                    if(data.info.pictureA !== ""){
                        count++;
                        isEmptyArr[0]= data.info.pictureA;
                    }
                    if(data.info.pictureB !== ""){
                        count++;
                        isEmptyArr[1]= data.info.pictureB;
                    }

                    if(count === 0){
                        tmpPic ='';
                    }
                    else{
                        tmpPic ='<div class="refund_ex clearfix"><span>上传图片:</span>' + '<div class="img-container">';
                        for(var i = 0;i < 2;i++){
                            tmpPic += '<div class="img-wrap"><img src='+ isEmptyArr[i]+' alt=""><a>点击查看大图</a></div>';
                        }
                        tmpPic +='</div></div>';
                    }
                    var appendHtml = '<div class="refund m10b">'+
                        '<div class="refund_mold"><span>投诉订单编号:</span>' + '<div class="">'+data.info.orderNo+'</div></div>'+
                        '<div class="refund_mold"><span>订单时间:</span>' + '<div class="">'+data.info.orderTime+'</div></div>'+
                        '<div class="refund_ex clearfix"><span>退货原因:</span>' + '<div class="">'+data.info.content+'</div></div>'+
                            tmpPic+
                        '</div>';
                    //回复
                        for (var i = 0; i < dataList.length; i++) {
                            var tmp ='<div class="refund m10b"><div class="refund_ex clearfix"><span>'+(dataList[i].replyType == 1?"店家答复:":"买家答复:")+'</span>'+
                                    '<div>'+dataList[i].replyContent+'</div></div><div class="refund_mold"><span>答复时间:</span><div class="">'+dataList[i].replyDate +
                                '</div></div></div>';
                            appendHtml += tmp;
                        }
                    console.log(appendHtml);
                        $('#buyer-reply').before(appendHtml);

                    } else if (data.infocode == 3) {
                        location = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                    } else {
                        alert(data.info);
                    }
                }, function () {
                    alert("投诉详情获取失败");
                });
        }

    });
});
/**
 * Created by liuhh on 2016/4/18.
 */
requirejs.config({baseUrl:"/js/lib"});
requirejs(['zepto','lib',"uploadImg",'visitor-logs'], function ($,libjs,uploadImg,vl) {
    var upImg = new uploadImg(),
        lib = new libjs(),
        reqUrl = lib.getReq().ser;
    $(function(){

        getOrderList();
        function getOrderList(){
            lib.ajx(reqUrl+"/memberComplaint/toSaveComplaint.action",{},function(data){
                if (data.infocode == "0") {
                    var appendHtml = '<option>--选择投诉订单--</option>',
                        dataList = data.info.order_list;
                    for (var i = 0; i < dataList.length; i++) {
                        var temp = '<option orderId='+dataList[i].orderId+' sellMemId='+dataList[i].sellerMemberId+' >'+dataList[i].orderNo+'</option>' ;
                        appendHtml += temp;
                    }
                    $('#compl-order').empty().append(appendHtml);

                } else if (data.infocode == "3") {
                    location = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                } else {
                    alert(data.info);
                }
            },function(){alert("获取可投诉订单列表失败");});
        }

        function getOrderGoods(id){
            lib.ajx(reqUrl+"/memberComplaint/getOrderGoodsByOrderId.action",{"orderId":id},function(data){
                if (data.infocode == "0") {
                    var appendHtml = '<option>--选择投诉商品--</option>',
                        dataList = data.info.order_goods_list;
                    for (var i = 0; i < dataList.length; i++) {
                        var temp = '<option goodsId='+dataList[i].goodsId+'>'+dataList[i].chName+'</option>' ;
                        appendHtml += temp;
                    }
                    $('#compl-goods').empty().append(appendHtml);

                }else {
                    alert(data.info);
                }
            },function(){alert("获取订单关联商品失败");});
        }

        function saveComplaint(args){
            lib.ajx(reqUrl+"/memberComplaint/saveComplaint.action",args,function(data){
                if (data.infocode == "0") {
                    location = "/buyer/home/complaint/chenggong.html";
                } else if (data.infocode == "3") {
                    location = "/buyer/login/dlzc.html?backUrl=" + lib.getBackUrl();
                } else {
                    alert(data.info);
                }
            },function(){alert("获取订单关联商品失败");});
        }

        function checkField(){
            if($('#compl-order').val() == "--选择投诉订单--"){
                alert("选择具体投诉订单");
                return false;
            }
            if($('#compl-goods').val() == "--选择投诉商品--"){
                alert("选择具体投诉订单");
                return false;
            }
            if($('#compl-reply').val().trim() === ""){
                alert("留言为空");
                return false;
            }
            return true;
        }

        $("#compl-order").change(function (){
            getOrderGoods($(this).children("option:selected").attr("orderId"));
        });

        $(".refund_apply").on('tap',function(){
            if(checkField()){
                var data = {};
                data.orderId = $('#compl-order').children("option:selected").attr("orderId");
                data.sellerMemberId = $('#compl-order').children("option:selected").attr("sellMemId");
                data.goodsId = $('#compl-goods').children("option:selected").attr("goodsId");
                data.content = $('#compl-reply').val();
                data.pictureA = $('#playPicture1 > img').attr("src");
                data.pictureB = $('#playPicture2 > img').attr("src");
                saveComplaint(data);
            }
        });
    });

});
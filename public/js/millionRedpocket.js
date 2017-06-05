requirejs.config({baseUrl:'/js/lib'});
require(['zepto','lib'],function ($,lib) {
    lib=new lib() ;
    var takeRedPacket= lib.getReq().ser + "/redPacket/takeRedPacket.action";
    var data={redPacketTypeId:64,issueMemberId:1};
    $(function () {
        $(".m-btn").on("click",function () {
            lib.ajx(takeRedPacket,data,function (data) {
                if(data.infocode==="0"){
                    $(".congrats").show();
                }else if(data.infocode=== "3"){
                    alert("请先登录");
                    location.href="/buyer/login/dlzc.html?backUrl="+lib.getBackUrl();
                }else{
                    alert(data.info)
                }
            },function () {
                alert("获取数据错误")
            })
        })
    })
});
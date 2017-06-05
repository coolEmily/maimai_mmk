require.config({baseUrl:"/js/lib"});
require(['zepto','lib'],function ($,lib) {
    lib= new lib();
    var startVoteActive= lib.getReq().ser + "/vote/startVoteActive.action";
    var activeVoteTypeId=lib.getUrlParam("activeVoteTypeId");

    (function () {
        $(".start-btn").on("click",function () {
            var self=this;
            if($(self).hasClass("tp_done")) return;
            lib.ajx(startVoteActive,{activeVoteTypeId:activeVoteTypeId},function (data) {
                if(data.infocode === "1"){
                    $(self).addClass("tp_done");
                }else{
                    alert(data.info)
                }
            },function () {
                alert("连接失败")
            })
        })
    })()
});

/**
 * Created by liuhh on 2016/4/19.
 */
requirejs.config({baseUrl:"/js/lib"});
requirejs(['zepto','lib','visitor-logs'], function ($,libjs,vl) {
    var lib = new libjs(),
        reqUrl = lib.getReq().ser;

    $(function () {
        $(document).on("tap",".button", function(){
            if(checkField()){
                var data ={};
                data.buyMemberId = sessionStorage.buyMemberId;
                data.memberComplaintId = sessionStorage.memberComplaintId;
                data.replyContent = $("#reply").val().trim();
                addReply(data);
            }
        });

        function checkField(){
            if($("#reply").val().trim() ===""){
                alert("回复不能为空");
                return false;
            }
            return true;
        }

        function addReply(args) {
            lib.ajx(reqUrl + "/memberComplaint/addReply.action",args, function (data) {
                if (data.infocode == "0") {
                    //
                    location = "/admin/tousuxq.html";
                } else if (data.infocode == "3") {
                    location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                } else {
                    alert(data.info);
                }
            }, function () {
                alert("投诉列表获取失败");
            });
        }
    });
});
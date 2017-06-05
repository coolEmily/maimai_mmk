require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "uploadImg"], function($, lib ,uploadImg){
    uploadImg();
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    common.js.ajx(reqUrl.ser + "seller/toTrademarkVerify.action", {},function(data){
        if(data.infocode === "0"){
            if(data.info.length === 0){
                $(".complaint_list").hide();
                $(".button.ui-add-button").css({'position':'absolute','width':'90%','bottom':'20px'});
                $(".ui-nothing-find").show();
            }else{
                $.each(data.info, function(k,v){
                    $(".complaint_list").append('<div class="complaint">' +
                        '<div class="complaint_1"><span>品牌名称:</span><p>' + v.name + '</p></div>' +
                        '<div class="complaint_1"><span>审核状态:</span><p>' + v.auditStatus + '</p></div>' +
                        '<div class="complaint_1"><span>授权状态:</span><p>'+ v.verifyStatus +'</p></div>' +
                        '<div class="complaint_1"><span>到期日:</span><p>'+ v.effectiveDate +'</p></div>' +
                        '<div class="complaint_2"><a class="' + (v.auditStatus === '审核中' ? "ui-unEdit" : "") + '" href="' + (v.auditStatus === '审核中' ? "javascript:;" : "shouquan.html?id=" + v.id + "&et=1") + '">修改</a><a href="shouquan.html?id=' + v.id + '&et=0">查看</a></div></div>');
                });
            }
        }else if(data.infocode === "1"){
            alert(data.info);
            location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
        }else{
            alert(data.info);
        }
    },function(){
        alert("数据请求失败");
    });
});
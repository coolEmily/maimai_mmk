require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var infoId = common.tools.getUrlParam('id');
    var xiaoxi = {};
    $(function(){
        $.extend(xiaoxi,{
            init:function(){
                var _t = this;
                _t.getPromotion();
            },
            getPromotion:function(){
                lib.ajx(lib.getReq().ser + "/information/getInformation.action",{'infoId':infoId},function(data){
                    var list = data.info.map_list;
                    if(data.infocode === '0'){
                        $("#titleName").html(list.titleName);
                        $("#richContent").html(list.richContent);
                    }
                },function(){
                    alert("系统错误");
                });
            }
        });
    });
    xiaoxi.init();
});
require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var xiaoxi = {};
    $(function(){
        $.extend(xiaoxi,{
            init:function(){
                var _t = this;
                _t.getPromotion();
            },
            getPromotion:function(){
                lib.ajx(lib.getReq().ser + "/information/getInformationWap.action",{},function(data){
                    var list = data.info.map_list;
                    if(data.infocode === '0'){
                        var htmlStr = "";
                            htmlStr = '<div class="index_c clearfix">'+
                                            '<a href="/buyer/message/youhui.html" data="'+list[1].infoId+'">'+
                                                '<div class="index_l">'+
                                                    '<img src="/images/buy/xiaox_icon1.png" />'+
                                                '</div>'+
                                                '<div class="index_r">'+
                                                    '<span>'+list[0].auditTime+'</span>'+
                                                    '<h2>'+list[0].titleName+'</h2>'+
                                                    '<p>'+list[0].textContent+'</p>'+
                                                '</div>'+
                                            '</a>'+
                                        '</div>'+
                                        '<div class="index_c clearfix">'+
                                            '<a href="/buyer/message/gonggao.html" data="'+list[0].infoId+'">'+
                                                '<div class="index_l">'+
                                                    '<img src="/images/buy/xiaox_icon2.png" />'+
                                                '</div>'+
                                                '<div class="index_r">'+
                                                    '<span>'+list[1].auditTime+'</span>'+
                                                    '<h2>'+list[1].titleName+'</h2>'+
                                                    '<p>'+list[1].textContent+'</p>'+
                                                '</div>'+
                                            '</a>'+
                                        '</div>';
                            $(".index_x").append(htmlStr);
                    }
                },function(){
                    alert("系统错误");
                });
            }
        });
    });
    xiaoxi.init();
});
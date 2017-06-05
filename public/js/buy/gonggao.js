require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var noMore = true;
    var rows = 6,
        page = 1;
    var gonggao = {};
    $(function(){
        $.extend(gonggao,{
            init:function(){
                var _t = this;
                _t.getPromotion(rows,page);
                _t.roll();
            },
            getPromotion:function(){
                lib.ajx(lib.getReq().ser + "/information/getInformationWapList.action",{'page':page,'rows':rows,infoId:0},function(data){
                    var list = data.info.map_list;                    
                    if(data.infocode === '0'){
                        
                        var htmlStr = "";
                        for(var i=0; i<list.length; i++){
                            htmlStr = '<div class="gonggao_c">'+
                                            '<div class="gonggao_time">'+list[i].auditTime+'</div>'+
                                            '<div class="gonggao_con">'+
                                                '<a href="gonggao_detail.html?id='+list[i].infoId+'">'+
                                                    '<span><img src="/images/buy/xiaox_icon3.png" /></span>'+
                                                    '<h2>'+list[i].infoName+'</h2>'+
                                                    '<p>'+list[i].textContent+'</p>'+
                                                '</a>'+
                                            '</div>'+
                                        '</div>';
                                        $(".gonggao").append(htmlStr);
                        }                            
                        if(list.length<rows){
                            noMore = false;
                        }   
                    }
                },function(){
                    alert("系统错误");
                });
            },
            roll:function(){
                var _t = this;
                $(window).scroll(function (){
                    if(noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        page++;
                        _t.getPromotion();
                    }
                });
            }
        });
    });
    gonggao.init();
});